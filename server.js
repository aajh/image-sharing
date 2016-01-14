var express = require('express')
var app = express();

app.use(express.static('static'));
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/static/index.html');
});

app.listen(3000);
