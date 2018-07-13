/*
This Node JS app connects to a Structured Products MS SQL server database hosted on an Amazon EC2 instance and serves
a REST API to perform SQL queries on that database and returns the resultant recordset in JSON
@file: core.js
@modifiedBy: cmpemberton
@ref: https://medium.com/voobans-tech-stories/how-to-quickly-create-a-simple-rest-api-for-sql-server-database-7ddb595f751a
*/;
var express = require('express');
var app = express();
var sql = require('mssql');
var bodyParser = require('body-parser')
var qs = require('querystring');

module.exports = app;

var mssqlConnect = 'mssql://Administrator:4fgp-iz%25vfa@52.56.239.197:1433/Cirdan?encrypt=true'

/*
// Load the single view file (angular will handle the page changes on the front-end)
app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
});
*/

var sql = require('mssql'),
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

// Start server and listen on http://localhost:8081/
var server = app.listen(10555, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("app listening at http://%s:%s", host, port)
});


// Fetch data example
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

app.post('/sql', function (req, res) {
        var body = '';
        req.on('data', function (data) {
            body += data;
            /*
            Too much POST data, kill the connection!
            1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~ 1MB
            */
            if (body.length > 1e6)
                req.connection.destroy();
        });
        req.on('end', function () {
            var obj = JSON.parse(body);
            console.log(obj.sql);
            exports.query(obj.sql, function (err, recordsets) {
                if(err) console.log(err);
                res.send(JSON.stringify(recordsets));
        });
    });
})

app.get('/tables', function (req, res) {
    exports.query("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'", function (err, recordsets) {
        if(err) console.log(err);
        res.send(JSON.stringify(recordsets));
    });
})

app.get('/quote', function (req, res) {
    exports.query('SELECT * FROM dbo.Quote', function (err, recordsets) {
        if(err) console.log(err);
        res.send(JSON.stringify(recordsets));
    });
})

app.get('/trade', function (req, res) {
    exports.query('SELECT * FROM dbo.Trade', function (err, recordsets) {
        if(err) console.log(err);
        res.send(JSON.stringify(recordsets));
    });
})
