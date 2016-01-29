"use strict";
var express = require('express');
var multer = require('multer');
var uuid = require('node-uuid');
var sqlite3 = require('sqlite3');
var Promise = require('bluebird');
var glob = Promise.promisify(require('glob'));
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');

var db = Promise.promisifyAll(new sqlite3.Database('dev.db'));
var app = express();



var acceptedMIMETypes = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif"
};

function fileFilter(req, file, cb) {
    cb(null, Object.keys(acceptedMIMETypes).indexOf(file.mimetype) !== -1);
}

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        fs.mkdirAsync(path.join(__dirname + '/uploads/')) // Create dir
          .catch(Error, function(err) {
              if (err.code === 'EEXIST') return;
              else throw err;
          }).then(function() { cb(null, 'uploads/'); });
    },
    filename: function(req, file, cb) {
        var extension = acceptedMIMETypes[file.mimetype];
        var id = uuid.v1();
        req.body.id = id;
        cb(null, id + extension);
    }
});

var upload = multer({ storage: storage, fileFilter: fileFilter });


function NotFoundError(message)  {
    this.name = "NotFoundError";
    this.message = message || "";
}
NotFoundError.prototype = Error.prototype;

function fixTimestamp(timestamp) {
    return timestamp.split(' ').join('T');
}

function getImageWithSrc(image) {
    return glob(__dirname + '/uploads/' + image.id + '.*')
        .then(function(paths) {
            if (paths.length === 0) {
                throw new NotFoundError('Image file for image_id '+ image.id +'not found.');
            }
            var ext = path.extname(paths[0]);
            var uploaded = fixTimestamp(image.uploaded);
            return Object.assign({}, image, { src: '/' + image.id + ext, uploaded });
        });
}

function checkIfFound(a) {
    return new Promise(function(resolve, reject)  {
        if (a === undefined) {
            reject(new NotFoundError('Row wasn\'t found.'));
        } else {
            resolve(a);
        }
    })
}

function getComments(image_id) {
    return db.allAsync('SELECT * FROM comments WHERE image_id = ?', image_id)
        .map(function(c) {
            return Object.assign({}, c, { timestamp: fixTimestamp(c.timestamp)});
        });
}




app.post('/rest/images', upload.single('image'), function(req, res) {
    db.runAsync(`INSERT INTO images (id, title, description)
           VALUES ($id, $title, $description)`, {
               $id: req.body.id,
               $title: req.body.title,
               $description: req.body.description
           })
      .then(function() { return db.getAsync('SELECT * FROM images WHERE id = ?', req.body.id); })
      .then(checkIfFound)
      .then(getImageWithSrc)
      .then(function(image) { return res.json(image); })
      .catch(function(err) { res.status(500).end() });
});

app.get('/rest/images', function(req, res) {
    db.allAsync('SELECT * FROM images', req.params.id)
      .map(getImageWithSrc)
      .then(function(images) { return res.json(images); })
      .catch(function(err) { return res.status(500).end(); });
});

app.get('/rest/images/:id', function(req, res) {
    Promise.join(db.getAsync('SELECT * FROM images WHERE id = ?', req.params.id)
                   .then(checkIfFound)
                   .then(getImageWithSrc),
                 getComments(req.params.id),
                 function(image, comments) {
                     Object.assign(image, { comments });
                     res.json(image);
                 })
           .catch(NotFoundError, function(err) { res.status(404).end(); })
           .catch(function(err) { res.status(500).end(); });
});



app.post('/rest/images/:image_id/comments', function(req, res) {
    if (req.query.username === '' || req.query.comment === '') {
        return res.status(400).end();
    }
    db.runAsync(`INSERT INTO comments (image_id, username, comment)
            VALUES ($image_id, $username, $comment)`, {
                $image_id: req.params.image_id,
                $username: req.query.username,
                $comment: req.query.comment
            })
      .then(function() { return getComments(req.params.image_id); })
      .then(function(comments) { return res.json(comments); })
      .catch(function(err) { res.status(500).end(); });
});

app.get('/rest/images/:image_id/comments', function(req, res) {
    getComments(req.params.image_id)
        .then(function(comments) { return res.json(comments); })
        .catch(function(err) { res.status(500).end(); });
});



app.use(express.static('static'));
app.use(express.static('uploads'));
app.get('*', function(req, res) { res.sendFile(`${__dirname}/static/index.html`) });

app.listen(3000, function() { console.log('Listening on port 3000!'); });
