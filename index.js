"use strict";
const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = "mongodb://roieonn:romer10@ds147821.mlab.com:47821/gameonv1";
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

//////////////////////////////////////////////////////////////////////////////////////

function updateUser(id, lon, lat){
	MongoClient.connect(MONGO_URL, (err, db) => {
    if (err) {
        console.error(err);
        return;
    }
   let collection = db.collection('users');
   collection.insertMany([
      {username: id, longitude:lon, latitude:lat}
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


app.get("/updateUser", function(req, res){
	// console.log(req.body, res);
	console.log(req.query.id);
	updateUser(req.query.id, req.query.lon, req.query.lat);
	res.send("updated");
	res.end();
});

app.listen(port);