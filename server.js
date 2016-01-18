const express = require('express');
const multer = require('multer');
const uuid = require('node-uuid');
const sqlite3 = require('sqlite3');
const Promise = require('bluebird');

const db = Promise.promisifyAll(new sqlite3.Database('dev.db'));
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
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        const extension = acceptedMIMETypes[file.mimetype];
        const id = uuid.v1();
        req.body.id = id;
        cb(null, id + extension);
    }
});

const upload = multer({ storage, fileFilter });

app.post('/rest/images', upload.single('image'), (req, res) => {
    db.runAsync(`INSERT INTO images (id, title, description)
           VALUES ($id, $title, $description)`, {
               $id: req.body.id,
               $title: req.body.title,
               $description: req.body.description
           })
      .then(db.getAsync('SELECT * FROM images WHERE id = ?', req.body.id))
      .then(image => {
          if (image === undefined) {
              req.status(500).end();
          }
          Object.assign(image, { src: `/${image.id}.jpg` });
          res.json(image);
      })
      .catch(err => {
          res.status(500).end();
      });
});

app.get('/rest/images', (req, res) => {
    db.allAsync('SELECT * FROM images', req.params.id)
      .then(images => images.map(i => Object.assign(i, { src: `/${i.id}.jpg` })))
      .then(images => res.json(images))
      .catch(err => {
          return res.status(500).end();
      });
});

app.get('/rest/images/:id', (req, res) => {
    Promise.join(db.getAsync('SELECT * FROM images WHERE id = ?', req.params.id),
                 db.allAsync('SELECT * FROM comments WHERE image_id = ?', req.params.id),
                 (image, comments) => {
                     if (image === undefined) {
                         return res.status(404).end();
                     }
                     Object.assign(image, { src: `/${image.id}.jpg`, comments });
                     res.json(image);
                 })
           .catch(err => {
               res.status(500).end();
           });
});


app.post('/rest/images/:image_id/comments', (req, res) => {
    db.run(`INSERT INTO comments (image_id, username, comment)
            VALUES ($image_id, $username, $comment)`, {
                $image_id: req.params.image_id,
                $username: req.query.username,
                $comment: req.query.comment
            }, err => {
                if (err !== null) {
                    return res.status(500).end();
                }
                res.send('OK');
            });
});

app.get('/rest/images/:image_id/comments', (req, res) => {
    db.all('SELECT * FROM comments WHERE image_id = ?', req.params.image_id, (err, rows) => {
        if (err !== null) {
            return res.status(500).end();
        }
        res.json(rows);
    });
});

app.use(express.static('static'));
app.use(express.static('uploads'));
app.get('*', (req, res) => res.sendFile(__dirname + '/static/index.html'));

app.listen(3000, () => console.log('Listening on port 3000!'));
