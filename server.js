const express = require('express');
const multer = require('multer');
const uuid = require('node-uuid');
const sqlite3 = require('sqlite3');
const Promise = require('bluebird');
const glob = Promise.promisify(require('glob'));
const path = require('path');

const db = Promise.promisifyAll(new sqlite3.Database('dev.db'));
const app = express();



const acceptedMIMETypes = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif"
};

function fileFilter(req, file, cb) {
    cb(null, req.body.title !== undefined &&
       Object.keys(acceptedMIMETypes).indexOf(file.mimetype) !== -1);
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



class NotFoundError extends Error {
}

function fixTimestamp(timestamp) {
    return timestamp.split(' ').join('T');
}

function getImageWithSrc(image) {
    return glob(`${__dirname}/uploads/${image.id}.*`)
        .then(paths => {
            if (paths.length === 0) {
                throw new NotFoundError(`Image file for image_id ${image.id} not found.`);
            }
            const ext = path.extname(paths[0]);
            const uploaded = fixTimestamp(image.uploaded);
            return Object.assign({}, image, { src: `/${image.id}${ext}`, uploaded });
        });
}

function checkIfFound(a) {
    return new Promise((resolve, reject) => {
        if (a === undefined) {
            reject(new NotFoundError('Row wasn\'t found.'));
        } else {
            resolve(a);
        }
    })
}

function getComments(image_id) {
    return db.allAsync('SELECT * FROM comments WHERE image_id = ?', image_id)
        .map(c => Object.assign({}, c, { timestamp: fixTimestamp(c.timestamp)}));
}




app.post('/rest/images', (req, res) => {
    Promise
      .promisify(upload.single('image'))(req, res)
      .then(() =>
          db.runAsync(`INSERT INTO images (id, title, description)
           VALUES ($id, $title, $description)`, {
               $id: req.body.id,
               $title: req.body.title,
               $description: req.body.description
           }))
      .then(() => db.getAsync('SELECT * FROM images WHERE id = ?', req.body.id))
      .then(checkIfFound)
      .then(getImageWithSrc)
      .then(image => res.json(image))
      .catch(err => res.status(500).end());
});

app.get('/rest/images', (req, res) => {
    db.allAsync('SELECT * FROM images', req.params.id)
      .map(getImageWithSrc)
      .then(images => res.json(images))
      .catch(err => res.status(500).end());
});

app.get('/rest/images/:id', (req, res) => {
    Promise.join(db.getAsync('SELECT * FROM images WHERE id = ?', req.params.id)
                   .then(checkIfFound)
                   .then(getImageWithSrc),
                 getComments(req.params.id),
                 (image, comments) => {
                     Object.assign(image, { comments });
                     res.json(image);
                 })
           .catch(NotFoundError, err => res.status(404).end())
           .catch(err => res.status(500).end());
});



app.post('/rest/images/:image_id/comments', (req, res) => {
    if (req.query.username === '' || req.query.comment === '') {
        return res.status(400).end();
    }
    db.runAsync(`INSERT INTO comments (image_id, username, comment)
            VALUES ($image_id, $username, $comment)`, {
                $image_id: req.params.image_id,
                $username: req.query.username,
                $comment: req.query.comment
            })
      .then(() => getComments(req.params.image_id))
      .then(comments => res.json(comments))
      .catch(err => res.status(500).end());
});

app.get('/rest/images/:image_id/comments', (req, res) => {
    getComments(req.params.image_id)
        .then(comments => res.json(comments))
        .catch(err => res.status(500).end());
});



app.use(express.static('static'));
app.use(express.static('uploads'));
app.get('*', (req, res) => res.sendFile(`${__dirname}/static/index.html`));

app.listen(3000, () => console.log('Listening on port 3000!'));
