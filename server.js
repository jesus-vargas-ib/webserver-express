const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const hbs = require('hbs');
const fs = require('fs');
const { getBucket, CLOUD_BUCKET, CLOUD_BUCKET_SALIDA, getBucketSalida, getPublicUrl } = require('./google/google');
require('./hbs/helpers')
const port = process.env.PORT || 3000;

// default options
app.use(fileUpload());

app.use(express.static(__dirname + '/public'));

//Express HBS engine
hbs.registerPartials(__dirname + '/views/parciales');
app.set('view engine', 'hbs');

app.get('/', (req, res) => {

    res.render('home', {
        nombre: 'Guest ^_^'
    });

})

app.get('/list', (req, res) => {
    let bucket = getBucketSalida();
    bucket.getFiles((err, files) => {
        if (err) {
            console.log(err);
        } else {
            res.render('listFiles', {
                files: files
            });
        }
    });

})

app.get('/download', (req, res) => {
    let id = req.query.id;

    getBucketSalida().file(id).download((err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.writeHead(200, {
                'Content-Type': 'application/octet-stream',
                'Content-disposition': 'attachment;filename=' + id,
                'Content-Length': data.length
            });
            res.end(new Buffer(data, 'binary'));
        }
    })

})

app.get('/delete', (req, res) => {
    let id = req.query.id;

    getBucketSalida().file(id).delete((err, response) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/list');
        }
    });
})

app.get('/about', (req, res) => {
    res.render('about');
})

app.get('/uploadImage', (req, res) => {
    res.render('uploadImage');
});

app.post('/upload',
    function(req, res) {
        let sampleFile = req.files.sampleFile;
        // Use the mv() method to place the file somewhere on your server
        let filePath = __dirname + `/public/assets/img/${sampleFile.name}`;
        sampleFile.mv(filePath, function(err) {
            if (err) {
                return res.status(500).send(err);
            }
            let gcsname = Date.now() + sampleFile.name;
            let file = getBucket().file(gcsname);

            fs.createReadStream(filePath)
                .pipe(file.createWriteStream({
                    metadata: {
                        contentType: sampleFile.mimetype,
                    },
                    resumable: false,
                }))
                .on('error', err => console.log(err))
                .on('finish', () => {
                    fs.unlink(filePath, err => {});
                    file.makePublic().then(() => {
                        res.render('uploadCompleto', {
                            url: getPublicUrl(gcsname)
                        });
                    });
                    console.log('Archivo subido a GCloud');
                });
        });
    });

app.listen(port, () => {
    console.log(`Escuchando peticiones en el puerto ${port}`);
});