
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var dbHelper = require("./database-helper.js");

app.use(express.static('static_files'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/challenges/3', function (req, res, next) {
    res.sendFile(__dirname + '/static_files/challenge3.html');
});

app.post('/challenges/3', function (req, res, next) {
    if (!req.body['email'] && !req.body['password']) {
        res.write("The POST parameters are incorrect!");
        res.end();
        return;
    }

    var queryString = 'SELECT password FROM basic_ctf_sqli_challenge where email ="' + req.body['email'] + '" and password = "' + req.body['password']+ '"';
    dbHelper.query(queryString, function (err, results, fields) {
        if (err) {
            res.write('<b> Nahh! Try harder! </b><br><p>var queryString = \'SELECT password FROM basic_ctf_sqli_challenge where email ="\' + req.query[\'email\'] + \'" and password = "\' + req.query[\'password\']+ \'"\';</p>');
        } else {
            if(results != null && results.length == 1) {
                res.write('<b>Good Job!</b><br>Some treats for you!<p>cs101-ctf{5404242C4D65C6EE1C6E3808B7CC2EB8}</p>');
            } else {
                res.write('<b>Authentication Fail!</b><br>Click <a href="/challenges/3/">here</a> to return!');
            }
        }
        res.end();
        
    })
});

app.get('/challenges/4', function (req, res, next) {

    if (!req.query['email']) {
        res.write("email parameter is missing!");
        res.end();
        return;
    }

    // select id, email, password, role from basic_ctf_sqli_challenge
    var queryString = 'SELECT email, role FROM basic_ctf_sqli_challenge where email ="' + req.query['email'] + '"';
    dbHelper.query(queryString, function (err, results, fields) {
        if (err) {
            next(new Error("Database Query Error! You are on the right track! Just a little bit more!"));
        } else {
            if(results != null && results.length > 0) {
                res.write('<table><tr><th>Email</th><th>Role</th></tr>');
                results.forEach(row => {
                    res.write('<tr><td>' + row.email + '</td><td>' + row.role + '</td></tr>');
                });
                res.write('</table>');
            } else {
                res.write('<b>No Results</b>');
            }
            res.end();
        }
    })
});

app.get('/challenges/7', function (req, res, next) {

    if (!req.query['email']) {
        res.write("email parameter is missing!");
        res.end();
        return;
    }

    if (!req.query['email'].includes("@supersecurity.cf") ) {
        res.write("Only @supersecurity.cf emails are allowed!");
        res.end();
        return;
    }

    if (req.query['email'].includes("union") ) {
        res.write("'union' is a keyword which is not allowed! Seems malicious!");
        res.end();
        return;
    }

    if (req.query['email'].includes("UNION") ) {
        res.write("'UNION' is a keyword which is not allowed! Seems malicious!");
        res.end();
        return;
    }

    if (req.query['email'].includes("--") ) {
        res.write("'--' is a keyword which is not allowed! Seems malicious!");
        res.end();
        return;
    }

    // select id, email, password, role from advanced_ctf_sqli_challenge
    var queryString = 'SELECT email, role FROM advanced_ctf_sqli_challenge where email ="' + req.query['email'] + '"';
    dbHelper.query(queryString, function (err, results, fields) {
        if (err) {
            next(new Error("Database Query Error! You are on the right track! Just a little bit more!"));
        } else {
            if(results != null && results.length > 0) {
                res.write('<table><tr><th>Email</th><th>Role</th></tr>');
                results.forEach(row => {
                    res.write('<tr><td>' + row.email + '</td><td>' + row.role + '</td></tr>');
                    });
                res.write('</table>');
            } else {
                res.write('<b>No Results</b>');
            }
            res.end();
        }
    })
});

app.use(require('express-stackman')());

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("CS101 CTF Web Application -- http://%s:%s", host, port)
})