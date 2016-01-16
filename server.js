const express = require('express');
const multer = require('multer');

const app = express();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, 'image');
    }
});
const upload = multer({ dest: 'uploads/' });

app.use(express.static('static'));

app.post('/rest/images', upload.single('image'), function(req, res) {
    res.json(req.body);
});

app.get('*', function (req, res) {
    res.sendFile(__dirname + '/static/index.html');
});

app.listen(3000, function() {
  console.log('Listening on port 3000!');
});
