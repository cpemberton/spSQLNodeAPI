/*
Through a REST API, this runs generic SQL against a SQL server database such as our structured products database.
The resultant recordsets are returned in JSON
@author: cmpemberton
@ref: https://medium.com/voobans-tech-stories/how-to-quickly-create-a-simple-rest-api-for-sql-server-database-7ddb595f751a
*/

// Load requirements
var express = require('express');
var app = express();
var sql = require('mssql');
module.exports = app;

// Connection string: mssql://<username>:<password>@<host:port>/<database>?encrypt=true
const mssqlConnect = 'mssql://<username>:<password>@<host:port>/<database>?encrypt=true';

// Port number for REST API
const port = 10555;
const sqlTables = "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'";
const sqlTrades = 'SELECT * FROM dbo.Quote'
const sqlQuotes = 'SELECT * FROM dbo.Trade'

// Get pool connection promise
connPoolPromise = null;
function getConnPoolPromise() {
    if (connPoolPromise) return connPoolPromise;
    connPoolPromise = new Promise(function (resolve, reject) {
        var conn = new sql.ConnectionPool(mssqlConnect);
        conn.on('close', function () {
            connPoolPromise = null;
        });
        conn.connect().then(function (connPool) {
            return resolve(connPool);
        }).catch(function (err) {
            connPoolPromise = null;
            return reject(err);
        });
    });
    return connPoolPromise;
}

// Start server and listen on http://<host>:<port>/
var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    if(host !== null && host !== '') {host = 'localhost';}
    console.log("> Node JS app listening at: http://%s:%s", host, port)
    console.log("> For generic SQL: curl -d  " + "'" + '{"sql":"SELECT * ... "}' + "'" + ' -X POST http://%s:%s/sql', host, port)
    console.log("> For tables: curl -X GET  http://%s:%s/tables", host, port)
    console.log("> For trades: curl -X GET  http://%s:%s/trades", host, port)
    console.log("> For quotes: curl -X GET  http://%s:%s/quotes", host, port)
});

// Generic SQL function
exports.query = function(sqlQuery, callback) {
    getConnPoolPromise().then(function (connPool) {
        var sqlRequest = new sql.Request(connPool);
        return sqlRequest.query(sqlQuery);
    }).then(function (result) {
        callback(null, result);
    }).catch(function (err) {
        callback(err);
    });
};

// POST request: generic SQL in the payload i.e. {"sql":"SELECT .... "}
app.post('/sql', function (req, res) {
        var body = '';
        req.on('data', function (data) {
            body += data;
            if (body.length > 1e6)
                // 1e6 = 1000000 ~ 1MB
                req.connection.destroy();
        });
        req.on('end', function () {
            var obj = JSON.parse(body);
            console.log(obj.sql);
            exports.query(obj.sql, function (err, recordsets) {
                var d = new Date();
                var n = d.getTime();
                if(err) console.log('> Error: ' + err.name + ', ' + err.message,  +', line number:' + err.lineNumber);
                res.send(JSON.stringify(recordsets));
        })
    });
})

// GET request: get all tables
app.get('/tables', function (req, res) {
    exports.query(sqlTables, function (err, recordsets) {
        if(err) console.log('> Error: ' + err.name + ', ' + err.message,  +', line number:' + err.lineNumber);
        res.send(JSON.stringify(recordsets));
    });
})

// GET request: get all records from dbo.Quote table
app.get('/quotes', function (req, res) {
    exports.query(sqlQuotes, function (err, recordsets) {
        if(err) console.log('> Error: ' + err.name + ', ' + err.message,  +', line number:' + err.lineNumber);
        res.send(JSON.stringify(recordsets));
    });
})

// GET request: get all records from dbo.Trade table
app.get('/trades', function (req, res) {
    exports.query(sqlTrades, function (err, recordsets) {
        if(err) console.log('> Error: ' + err.name + ', ' + err.message,  +', line number:' + err.lineNumber);
        res.send(JSON.stringify(recordsets));
    });
})
