"use strict";
let dbm = global.dbm || require('db-migrate');
let type = dbm.dataType;
let Promise = require('bluebird');
let fs = Promise.promisifyAll(require('fs'));
let path = require('path');
let http = require('http');
let https = require('https');


const imageUrls = {
    '26f1d2ea-bd12-11e5-9912-ba0be0483c18':'http://payload336.cargocollective.com/1/17/574234/9036846/prt_500x500_1418362221_2x.jpg',
    '26f1d718-bd12-11e5-9912-ba0be0483c18': 'http://payload93.cargocollective.com/1/8/282864/4164282/IMG_0813_o.jpg',
    '26f1d81c-bd12-11e5-9912-ba0be0483c18': 'https://dl.dropboxusercontent.com/u/4512385/AbosUr/IMG_11_ROLL_4.jpg',
    '26f1d98e-bd12-11e5-9912-ba0be0483c18': 'http://c2.staticflickr.com/4/3901/14663175778_b333082efb_b.jpg',
    '26f1dc2c-bd12-11e5-9912-ba0be0483c18': 'http://wallpapertvs.com/wp-content/uploads/2014/12/Vineyard_in_Winter_Wallpaper.jpg'
};

const uploadsPath = '../../uploads/';

function imgPath(id) {
    return path.join(`${__dirname}/${uploadsPath}/${id}.jpg`);
}


function getUrl(url) {
    return url.startsWith('https://') ? https.getAsync(url) : http.getAsync(url);
}


exports.up = function(db, callback) {
  const filePath = path.join(__dirname + '/sqls/20160117114616-test-images-up.sql');
  fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
    if (err) return callback(err);
      console.log('received data: ' + data);

    db.runSql(data, function(err) {
      if (err) return callback(err);

        Promise.each(Object.keys(imageUrls), id => {
            return new Promise((resolve, reject) => {
                let file = fs.createWriteStream(imgPath(id));
                const url = imageUrls[id];

                function handleError(err) {
                    console.log(err);
                    fs.unlink(imgPath(id)); // Delete the file (don't wait for it)
                    reject(err.message);
                }

                console.log(`Downloading ${url}...`);

                (url.startsWith('https://') ? https : http)
                    .get(url, res => {
                        res.pipe(file);
                        console.log('writing to ' + id);
                        file.on('finish', () => file.close(resolve));
                        file.on('error', handleError);
                }).on('error', handleError);
            });
        })
          .then(() => callback()).catch(err => callback(err));
    });
  });
};

exports.down = function(db, callback) {
  const filePath = path.join(__dirname + '/sqls/20160117114616-test-images-down.sql');
  fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
    if (err) return callback(err);
      console.log('received data: ' + data);

    db.runSql(data, function(err) {
      if (err) return callback(err);

        // Remove test image files
      Promise.each(Object.keys(imageUrls), id => {
          const img = imgPath(id);
          return fs.statAsync(img).then(stats => {
              return stats.isFile();
          })
              .catch(Error, err => {
                  if (err.code === 'ENOENT') return false; // File doesn't exists
                  else throw err;
              })
              .then(exists => exists ? fs.unlinkAsync(img) : null);
      }
      )
        .then(() => callback()).catch(err => callback(err));
    });
  });
};
