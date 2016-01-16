const express = require('express');
const multer = require('multer');
const uuid = require('node-uuid');

const app = express();

const acceptedMIMETypes = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif"
};

function fileFilter(req, file, cb) {
    cb(null, acceptedMIMETypes.indexOf(file.mimetype.keys()) !== -1);
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
    res.json(req.body);
});

app.use(express.static('static'));
app.use(express.static('uploads'));

app.get('*', function (req, res) {
    res.sendFile(__dirname + '/static/index.html');
});

app.listen(3000, function() {
  console.log('Listening on port 3000!');
});
