const express = require('express');
const multer = require('multer');
const uuid = require('node-uuid');
const sqlite3 = require('sqlite3');

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
    const db = new sqlite3.Database('database.sqlite3');

    const today = new Date();
    const todayISO = today.toISOString().slice(0, 10);

    db.run(`INSERT INTO images (id, title, description, uploaded)
           VALUES ($id, $title, $description, $uploaded)`, {
               $id: req.body.id,
               $title: req.body.title,
               $description: req.body.description,
               $uploaded: todayISO
           });

    db.close(function() {
        res.json({
            id: req.body.id,
            title: req.body.title,
            description: req.body.description,
            uploadsed: todayISO
        });
    });
});

app.get('/rest/images/:id', function(req, res) {
    const db = new sqlite3.Database('database.sqlite3');

    db.get('SELECT * FROM images WHERE id = ?', req.params.id, function(err, row) {
        Object.assign(row, { url: `/${row.id}.jpg` });
        res.json(row);
    });
});

app.get('/rest/images', function(req, res) {
    const db = new sqlite3.Database('database.sqlite3');

    db.all('SELECT * FROM images', req.params.id, function(err, rows) {
        res.json(rows.map(row => Object.assign(row, { url: `/${row.id}.jpg` })));
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
