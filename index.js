"use strict";
const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = "mongodb://roieonn:romer10@ds147821.mlab.com:47821/gameonv1";

MongoClient.connect(MONGO_URL, (err, db) => {
    if (err) {
        console.error(err);
        return;
    }
   let collection = db.collection('users');
   collection.insertMany([
      {username: "Barak"},
      {username: "Dan"},
      {username: "Tom"}
   ], (err, results) => {
          db.close();
          if (err) {
              console.error(err);
              return;
            }
          console.log(`Completed successfully, inserted ${results.insertedCount} documents`);
      });
});

const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

app.get("/", function(req, res){
	res.send("Hello");
	res.end();
});

app.listen(port);