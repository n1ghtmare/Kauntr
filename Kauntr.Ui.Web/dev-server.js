var path = require('path');
var express = require('express');
var webpack = require('webpack');
var request = require("request");
var config = require('./webpack.config.dev');
var s = require("object-assign");

var app = express();
var compiler = webpack(config);

var baseUrl = "http://localhost:15295/";

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));


// This is going to proxy all the request to http://localhost:3000 to http://localhost:15295
// however for this to work NTLM authentication needs to be disabled (since the proxy can't handle the NTLM handshake)
app.get('/', function (req, res) {
    request(baseUrl).pipe(res);
});

var forwardRequestFunc = function (req, res) {
    var url = baseUrl + req.url;
    var r = req.method === "POST" ? request.post({ uri: url, json: req.body }) : request(url);
    req.pipe(r).pipe(res);
};

// HTTP GET
app.get("/Home/*", forwardRequestFunc);
app.get("/SharedContext/*", forwardRequestFunc);
app.get("/Account/*", forwardRequestFunc);
app.get("/Countdown/*", forwardRequestFunc);
app.get("/Comment/*", forwardRequestFunc);
app.get("/Vote/*", forwardRequestFunc);
app.get("/Notification/*", forwardRequestFunc);
app.get("/signalr/*", forwardRequestFunc);

// HTTP POST
app.post("/Account/*", forwardRequestFunc);
app.post("/Countdown/*", forwardRequestFunc);
app.post("/Comment/*", forwardRequestFunc);
app.post("/Vote/*", forwardRequestFunc);
app.post("/Notification/*", forwardRequestFunc);
app.post("/signalr/*", forwardRequestFunc);

app.use("/Content", express.static(__dirname + "/Content"));
app.use("/fonts", express.static(__dirname + "/fonts"));
app.use("/Scripts", express.static(__dirname + "/Scripts"));

//app.get('*', function(req, res) {
//  res.sendFile(path.join(__dirname, 'index.html'));
//});

app.listen(3000, 'localhost', function (err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Listening at http://localhost:3000');
});