// var Datastore = require('nedb');
// var db = new Datastore({filename: './data/memo', autoload: true});

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/memo';

exports.create = function(req, res) {
    var body = req.body;

    _insertMemo(body, function(error, results) {
        res.json({
            error: error,
            results: results
        });
    });
};

exports.read = function(req, res) {
    _findMemo({}, function(error, results) {
        res.json({
            error: error,
            results: results
        });
    });
};

exports.update = function(req, res) {
    var where = req.query;
    var body = req.body;

    _updateMemo(where, body, function(error, results) {
        res.json({
            error: error,
            results: results
        });
    });
};

exports.remove = function(req, res) {
    var where = req.query;

    _removeMemo(where, function(error, results) {
        res.json({
            error: error,
            results: results
        });
    });
};

function _insertMemo(body, callback) {

    body = typeof body === 'string' ? JSON.parse(body) : body;

    var memo = {
        'author': body.author,
        'memo': body.memo,
        'date': new Date()
    };

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        db.collection('memoes').insert(memo, function(err, inserted) {
            if (err) throw err;

            console.log("Successfully inserted: " + JSON.stringify(memo));

            db.close();
            callback(null, inserted);
        });
    });
}

function _findMemo(where, callback) {
    where = where || {};

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        db.collection('memoes').find(where).toArray(function(err, docs) {
            if (err) throw err;

            db.close();
            callback(null, docs);
        });
    });
}

function _updateMemo(where, body, callback) {
    body = typeof body === 'string' ? JSON.parse(body) : body;

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        db.collection('memoes').update(where, {
            $set: body
        }, {
            multi: true
        }, function(err, updated) {
            if (err) throw err;

            console.log("Successfully updated: " + updated);

            db.close();
            callback(null, updated);
        });
    });
}

function _removeMemo(where, callback) {

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        db.collection('memoes').remove(where, {
            multi: true
        }, function(err, removed) {
            if (err) throw err;

            console.log("Successfully deleted: " + removed);

            db.close();
            callback(null, removed);
        });
    });
}

// function _insertMemo(body, callback){
//     body = typeof body === 'string' ? JSON.parse(body) : body;

//     var memo = {
//         author: body.author,
//         memo: body.memo,
//         date: new Date()
//     };

//     db.insert(memo, callback);
// }

// function _findMemo(where, callback){
//     where = where || {};
//     db.find(where, callback);
// }

// function _updateMemo(where, body, callback){
//     body = typeof body === 'string' ? JSON.parse(body) : body;

//     db.update(where, {$set: body}, {multi: true}, callback);
// }

// function _removeMemo(where, callback){
//     db.remove(where, {multi: true}, callback);
// }