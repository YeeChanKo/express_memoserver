var formidable = require('formidable');
var http = require('http');
var util = require('util');
var fileSystem = require('fs');
var path = require('path');

var imagedir = "./image/"

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/memo';

exports.upload = function(req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = imagedir;
    form.keepExtensions = true;
    form.multiples = true;

    form.on('file', function(name, file) {
        // console.log("lalala: " + name); // name is form name
        // console.log("lululu: " + file.name); // file's original name
        // console.log("lilili: " + file.path); // file's destination path+name

        var nameOnClient = file.name;
        var nameOnServer = file.path.split('/').pop();

        var image = {
            'client': nameOnClient,
            'server': nameOnServer
        };

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;

            db.collection('images').insert(image, function(err, inserted) {
                if (err) throw err;

                console.log("Successfully inserted: " + JSON.stringify(image));

                db.close();
            });
        });
    });

    form.parse(req, function(err, fields, files) {
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('received upload!\n\n');
        res.end(util.inspect({
            fields: fields,
            files: files
        }));
    });

    return;
};

exports.download = function(req, res) {
    var where = req.query;

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        db.collection('images').findOne(where, function(err, result) {
            if (err) throw err;
            db.close();

            var filePath = path.resolve(imagedir + result['server']); // image path

            res.writeHead(200, {
                'content-type': 'image/jpeg'
            });

            fileSystem.readFile(filePath, function(err, data) {
                if (err) throw err;

                res.write(data);
                res.end();
            });
        });
    });
};