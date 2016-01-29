var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var http = require('http');
var https = require('https');


var imageUrls = {
    '26f1d2ea-bd12-11e5-9912-ba0be0483c18':'http://payload336.cargocollective.com/1/17/574234/9036846/prt_500x500_1418362221_2x.jpg',
    '26f1d718-bd12-11e5-9912-ba0be0483c18': 'http://payload93.cargocollective.com/1/8/282864/4164282/IMG_0813_o.jpg',
    '26f1d81c-bd12-11e5-9912-ba0be0483c18': 'https://dl.dropboxusercontent.com/u/4512385/AbosUr/IMG_11_ROLL_4.jpg',
    '26f1d98e-bd12-11e5-9912-ba0be0483c18': 'http://c2.staticflickr.com/4/3901/14663175778_b333082efb_b.jpg',
    '26f1dc2c-bd12-11e5-9912-ba0be0483c18': 'http://wallpapertvs.com/wp-content/uploads/2014/12/Vineyard_in_Winter_Wallpaper.jpg'
};

var uploadsPath = '../../uploads/';

function imgPath(id) {
    return path.join(__dirname + '/' + uploadsPath + id + '.jpg');
}


exports.up = function(db, callback) {
  var filePath = path.join(__dirname + '/sqls/20160117114616-test-images-up.sql');
  fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data) {
    if (err) return callback(err);
      console.log('received data: ' + data);

    db.runSql(data, function(err) {
      if (err) return callback(err);

        fs.mkdirAsync(path.join(__dirname + '/' + uploadsPath + '/')) // Create dir
          .catch(Error, function(err) {
              if (err.code === 'EEXIST') return;
              else throw err;
          })
          .then(
              Promise.each(Object.keys(imageUrls), function(id) {
                  return new Promise(function(resolve, reject) {
                      var file = fs.createWriteStream(imgPath(id));
                      var url = imageUrls[id];

                      function handleError(err) {
                          console.log(err);
                          fs.unlink(imgPath(id)); // Declare the file (don't wait for it)
                          reject(err.message);
                      }

                      console.log('Downloading ' + url + '...');

                      (url.substr(0, 8) === 'https://' ? https : http)
                          .get(url, function(res) {
                              res.pipe(file);
                              console.log('writing to ' + id);
                              file.on('finish', function() { file.close(resolve); });
                              file.on('error', handleError);
                          }).on('error', handleError);
                  });
              })
          )
          .then(function() { callback(); }).catch(function(err) { callback(err); });
    });
  });
};

exports.down = function(db, callback) {
  var filePath = path.join(__dirname + '/sqls/20160117114616-test-images-down.sql');
  fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
    if (err) return callback(err);
      console.log('received data: ' + data);

    db.runSql(data, function(err) {
      if (err) return callback(err);

        // Remove test image files
      Promise.each(Object.keys(imageUrls), function(id) {
          var img = imgPath(id);
          return fs.statAsync(img).then(function(stats) {
              return stats.isFile();
          })
              .catch(Error, function(err) {
                  if (err.code === 'ENOENT') return false; // File doesn't exists
                  else throw err;
              })
              .then(function(exists) { return exists ? fs.unlinkAsync(img) : null });
      }
      )
         .then(function() { callback(); }).catch(function(err) { callback(err); });
    });
  });
};
