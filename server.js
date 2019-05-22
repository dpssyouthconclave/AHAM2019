var express = require('express');
var bodyParser = require('body-parser');
var mustacheExpress = require('mustache-express');
const fileUpload = require('express-fileupload');
var app = express();
var fs = require('fs');

var mammoth = require("mammoth");

const port = 80;

app.engine('html', mustacheExpress());

app.set('view engine', 'html');
app.set('views', __dirname);
app.use(express.static(__dirname + '/static'));
app.use('/form', express.static(__dirname + '/f.html'));
app.use(fileUpload());


app.get('/', function (req, res) {
    mammoth.extractRawText({ path: __dirname + '/content/' + "index.docx" })
       .then(function (result) {
           var text = result.value.replace(/[\u201C\u201D]/g, '"');
           var json = JSON.parse(text);
           res.render('index', json);
       }).catch(function (err) {
           console.log(err);
           res.redirect('/err');
       }).done();
});
app.get('/err', function (req, res) {
    res.render('err', {});
});

app.get('^/events/:event', function (req, res) {
    mammoth.extractRawText({ path: __dirname + '/content/' + req.params.event + ".docx" })
        .then(function (result) {
            var text = result.value.replace(/[\u201C\u201D]/g, '"');
            var json = JSON.parse(text);
            res.render('SPEAKER', json);
        }).catch(function (err) {
            console.log(err);
            res.redirect('/err');
        }).done();
});


app.post('/upload', function (req, res) {
    if (req.body.psswrd == "sanjana") {
        let sampleFile;
        let uploadPath;

        if (Object.keys(req.files).length == 0) {
            res.status(400).send('No files were uploaded.');
            return;
        }

        console.log('req.files >>>', req.files); // eslint-disable-line

        sampleFile = req.files.sampleFile;

        uploadPath = __dirname + '/content/' + sampleFile.name;

        sampleFile.mv(uploadPath, function (err) {
            if (err) {
                return res.status(500).send(err);
            }

            res.send('File Successfully uploaded');
        });
    }
    else
        res.send('INcorrect password');
});


app.get('*', function (req, res) {
    res.redirect('/err');
});

app.listen(port, function () {
    console.log("App Started on PORT " + port);
});
