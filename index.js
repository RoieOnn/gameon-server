"use strict";
const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = "mongodb://roieonn:romer10@ds147821.mlab.com:47821/gameonv1";
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

//////////////////////////////////////////////////////////////////////////////////////

function saveUser(id, lon, lat){
	MongoClient.connect(MONGO_URL, (err, db) => {
    if (err) {
        console.error(err);
        return;
    }
   let collection = db.collection('users');
   collection.insertMany([
      {username: id, longitude:lon, latitude:lat}
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
function userMatch(sport, lvl, clock){
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

app.get("/userMatch", function(req, res){
	console.log(req.query);
	userMatch(req.query.sport, req.query.lvl, req.query.clock);
	res.send("looking for match");
	res.end();
});

app.get("/updateUser", function(req, res){
	// console.log(req.body, res);
	console.log(req.query);
	saveUser(req.query.id, req.query.lon, req.query.lat);
	res.send("updated");
	res.end();
});

app.post('/updateUser', (req, res) => {
    console.dir(req.body);
    let username = req.body.username || DEFAULT_USERNAME;
    let longitude = req.body.longitude || DEFAULT_LONGITUDE;
    let latitude = req.body.latitude || DEFAULT_LATITUDE;
    console.log("Got POST request to /updateUser, using username=" + username + 
    										   ", longitude=" + longitude + 
    										   ", latitude=" + latitude);
});

app.listen(port);