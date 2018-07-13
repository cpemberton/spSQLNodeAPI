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

module.exports = app;

var mssqlConnect = 'mssql://Administrator:4fgp-iz%25vfa@52.56.239.197:1433/Cirdan?encrypt=true'

/*
// Load the single view file (angular will handle the page changes on the front-end)
app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
});
*/

// Start server and listen on http://localhost:8081/
var server = app.listen(10555, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("app listening at http://%s:%s", host, port)
});

app.get('/sql/:command', function (req, res) {
    sql.connect(mssqlConnect, function(err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.input('command', req.params.command);
        request.query(command, function(err, recordset) {
            if(err) console.log(err);
            // Result in JSON format
            res.send(JSON.stringify(recordset));
        });
    });
})

app.get('/tables', function (req, res) {
    sql.connect(mssqlConnect, function(err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE'", function(err, recordset) {
            if(err) console.log(err);
            // Result in JSON format
            res.end(JSON.stringify(recordset));
        });
    });
})

app.get('/quote', function (req, res) {
    sql.connect(mssqlConnect, function(err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('SELECT * FROM dbo.Quote', function(err, recordset) {
            if(err) console.log(err);
            // Result in JSON format
            res.end(JSON.stringify(recordset));
        });
    });
})

app.get('/trade', function (req, res) {
    sql.connect(mssqlConnect, function(err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('SELECT * FROM dbo.Trade', function(err, recordset) {
            if(err) console.log(err);
            // Result in JSON format
            res.end(JSON.stringify(recordset));
        });
    });
})
