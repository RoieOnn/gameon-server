"use strict";
const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = "mongodb://roieonn:romer10@ds147821.mlab.com:47821/gameonv1";
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

//////////////////////////////////////////////////////////////////////////////////////

app.get("/updateUser", function(req, res){
	// console.log(req.body, res);
	console.log(req.query.id);
	// saveUser(req.query.id, req.query.lon, req.query.lat);
	res.send("updated");
	res.end();
});

app.listen(port);