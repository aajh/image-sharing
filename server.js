const express = require('express');
const multer = require('multer');
const uuid = require('node-uuid');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('dev.db');
const app = express();

const acceptedMIMETypes = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif"
};

function fileFilter(req, file, cb) {
    cb(null, Object.keys(acceptedMIMETypes).indexOf(file.mimetype) !== -1);
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        const extension = acceptedMIMETypes[file.mimetype];
        const id = uuid.v1();
        req.body.id = id;
        cb(null, id + extension);
    }
});

const upload = multer({ storage, fileFilter });

app.post('/rest/images', upload.single('image'), function(req, res) {
    db.run(`INSERT INTO images (id, title, description)
           VALUES ($id, $title, $description)`, {
               $id: req.body.id,
               $title: req.body.title,
               $description: req.body.description
           })
      .get('SELECT * FROM images WHERE id = ?', req.body.id, function(err, row) {
          Object.assign(row, { src: `/${row.id}.jpg` });
          res.json(row);
      });
});

app.get('/rest/images/:id', function(req, res) {
    db.get('SELECT * FROM images WHERE id = ?', req.params.id, function(err, row) {
        Object.assign(row, { src: `/${row.id}.jpg` });
        res.json(row);
    });
});

app.get('/rest/images', function(req, res) {
    db.all('SELECT * FROM images', req.params.id, function(err, rows) {
        res.json(rows.map(row => Object.assign(row, { src: `/${row.id}.jpg` })));
    });
});

app.use(express.static('static'));
app.use(express.static('uploads'));

app.get('*', function (req, res) {
    res.sendFile(__dirname + '/static/index.html');
});

app.listen(3000, function() {
  console.log('Listening on port 3000!');
});
