"use strict";
const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = "mongodb://roieonn:romer10@ds147821.mlab.com:47821/gameonv1";
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8080;
app.use(bodyParser.json());

//////////////////////////////////////////////////////////////////////////////////////
	
function saveUser(id, sport, lvl, lon, lat){
	MongoClient.connect(MONGO_URL, (err, db) => {
    if (err) {
        console.error(err);
        return;
    }
   let collection = db.collection('users');
   collection.insertMany([
      {username: id, sport: sport, level: lvl, longitude:lon, latitude:lat}
   ], (err, results) => {
   			console.log(err, results);
          db.close();
          if (err) {
              console.error(err);
              return;
            }
          console.log(`Completed successfully, inserted ${results.insertedCount} documents`);
      });
});
}
function findOpponent(sport, lvl, clock, cb){
	MongoClient.connect(MONGO_URL, (err, db) => {
	    if (err) {
	        console.error(err);

	        return;
	   }

	   let collection = db.collection('users');
	   collection.find({sport: sport, lvl: parseInt(lvl)}).toArray((err, result) => {
	   		if (err) {
	   			console.error(err);
	   		}
	   		cb(null, result)
	   }); 

   	});
}

function ready(sport, lvl, clock){
	MongoClient.connect(MONGO_URL, (err, db) => {
    if (err) {
        console.error(err);

        return;
    }
   let collection = db.collection('users');
   collection.insertMany([
      {sport:type, level:lvl, time:clock}
   ], (err, results) => {
          db.close();
          if (err) {
              console.error(err);
              return;
            }
          console.log(`Completed successfully, inserted ${results.insertedCount} documents`);
      });
	});
}

/////////////////////////////////////////////////////////////////////////////////////

app.get("/", function(req, res){
	console.log(req, res);
	res.send("Hello");
	res.end();
});

app.get("/findOpponent", function(req, res){
	findOpponent(req.query.sport, req.query.lvl, req.query.clock, (err, result) => {
		if (err) return res.status(500).json({err: err.message});
        return res.json(result);
    });	
});


app.post("/findOpponent", function(req, res){
	console.log(req.query);
	userMatch(req.query.sport, req.query.lvl, req.query.clock);
	res.send("Ready");
	res.end();
});

app.get("/updateUser", function(req, res){
	console.log(req.query);
	saveUser(req.query.id, req.query.sport, req.query.lvl, req.query.lon, req.query.lat);
	res.send("updated");
	res.end();
});

app.post('/updateUser', (req, res) => {
    let username = req.body.username || DEFAULT_USERNAME;
    let sport = req.body.sport || DEFAULY_SPORT;
    let level = req.body.level || DEFAULT_LEVEL;
    let longitude = req.body.longitude || DEFAULT_LONGITUDE;
    let latitude = req.body.latitude || DEFAULT_LATITUDE;
	
	saveUser(username, sport, level, longitude, latitude);

	res.send(JSON.stringify(req.body));
	res.end();
});

console.log(port);
app.listen(port);