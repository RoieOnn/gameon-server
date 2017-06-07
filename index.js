"use strict";
const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = "mongodb://roieonn:romer10@ds147821.mlab.com:47821/gameonv1";
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8080;
app.use(bodyParser.json());

//////////////////////////////////////////////////////////////////////////////////////

// Save users in DB
	
function saveUser(id, sport, level, lon, lat, opp, ready){
	MongoClient.connect(MONGO_URL, (err, db) => {
    if (err) {
        console.error(err);
        return;
    }
   let collection = db.collection('users');
   collection.insertMany([
      {username: id, sport: sport, level: level, longitude: lon, latitude: lat, opponent: opp, readyToPlay: ready}
   ], (err, results) => {
   			console.log(err, results);
          db.close();
          if (err) {
              console.error(err);
              return;          }
      });
});
}

app.get("/updateUser", function(req, res){
	console.log(req.query);
	saveUser(req.query.id, req.query.sport, req.query.level, req.query.lon, req.query.lat, req.query.opp, req.query.ready);
	res.send("updated");
	res.end();
});

app.post('/updateUser', (req, res) => {
    let username = req.body.username || DEFAULT_USERNAME;
    let sport = req.body.sport || DEFAULY_SPORT;
    let level = req.body.level || DEFAULT_LEVEL;
    let longitude = req.body.longitude || DEFAULT_LONGITUDE;
    let latitude = req.body.latitude || DEFAULT_LATITUDE;
    let opponent = req.body.opponent || DEFAULT_OPPONENT;
    let readyToPlay = req.body.readyToPlay || DEFAULT_READYTOPLAY;
	
	saveUser(username, sport, level, longitude, latitude, opponent, readyToPlay);

	res.send(JSON.stringify(req.body));
	res.end();
});


/////////////////////////////////////////////////////////////////////////////////////

// Find opponent based on DB

function findOpponent(sport, level, clock, cb){
	MongoClient.connect(MONGO_URL, (err, db) => {
	    if (err) {
	        console.error(err);

	        return;
	   }

	   let collection = db.collection('games');
	   collection.find({sport: sport}).toArray((err, result) => { // , level: parseInt(level)
	   		if (err) {
	   			console.error(err);
	   		}
	   		cb(null, result)
	   }); 

   	});
}

function ready(sport, level, clock){
	MongoClient.connect(MONGO_URL, (err, db) => {
    if (err) {
        console.error(err);

        return;
    }
   let collection = db.collection('users');
   collection.insertMany([
      {sport:type, level:level, time:clock}
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

app.get("/findOpponent", function(req, res){
	findOpponent(req.query.sport, req.query.level, req.query.clock, (err, result) => {
		if (err) return res.status(500).json({err: err.message});
        //return res.json(result);
        const jsonStr = '{ "opponent" : ' + JSON.stringify(result) + '}';
        const obj = JSON.parse(jsonStr);
        //return obj;
        res.send(obj).end();
    });	
});

app.post("/findOpponent", function(req, res){
	console.log(req.query);
	// userMatch(req.query.sport, req.query.level, req.query.clock);
	const username = req.body.username;
  const sport = req.body.sport;
  // const level = req.body.level;
 
  //const longitude = req.body.longitude;
  //const latitude = req.body.latitude;
  //const opponent = req.body.opponent;
  //const readyToPlay = req.body.readyToPlay;
  
  const toInsert = {
    "username": username,
    "sport": sport,
    //"level": level//,
    //"longitude": longitude,
    //"latitude": latitude,
    //"opponent": opponent,
    //"readyToPlay": readyToPlay
  };

  MongoClient.connect(MONGO_URL, (err, db) =>{
    if(err){
      console.error(err);
      return;
    }
    const collection = db.collection('games');
    collection.insertOne(toInsert, (e ,results) => {
      db.close();
      if (e) {
        console.error(e);
        return;
      }
      const jsonStr = `{ "id" :  ${results.insertedId} }`;
      res.send(jsonStr).end();
    });
  })

  res.send("Ready");
	res.end();
});

/////////////////////////////////////////////////////////////////////////////////////

app.get("/", function(req, res){
	console.log(req, res);
	res.send("Hello");
	res.end();
});

// Create new user
app.post('/users', function(req, res){
  //const username = req.body.username;
  const sport = req.body.sport;
  const level = req.body.level;
  //const longitude = req.body.longitude;
  //const latitude = req.body.latitude;
  //const opponent = req.body.opponent;
  //const readyToPlay = req.body.readyToPlay;
  
  const toInsert = {
    //"username": username,
    "sport": sport,
    "level": level//,
    //"longitude": longitude,
    //"latitude": latitude,
    //"opponent": opponent,
    //"readyToPlay": readyToPlay
  };

  MongoClient.connect(MONGO_URL, (err, db) =>{
    if(err){
      console.error(err);
      return;
    }
    const collection = db.collection('users');
    collection.insertOne(toInsert, (e ,results) => {
      db.close();
      if (e) {
        console.error(e);
        return;
      }
      const jsonStr = `{ "id" :  ${results.insertedId} }`;
      res.send(jsonStr).end();
    });
  })
});


// Get users for main view

app.get('/users' , function(req ,res){
  MongoClient.connect(MONGO_URL, (err, db) =>{
    if(err){
      console.error(err);
      return;
    }
    const collection = db.collection('users');
    collection.find({sport: sport, level: parseInt(level)}).toArray((err, result) =>{
      db.close();
      if(e){
        console.error(e);
        return;
      }
      console.log(`Found ${results.legth} records that match the query.`);
      results.forEach(doc => console.log(`Doc title found - ${doc.title}`));
      const jsonStr = '{ "vol" : ' + JSON.stringify(results) + '}';
      const obj = JSON.parse(jsonStr);
      res.send(obj).end();
    });
  })

});

console.log(port);
app.listen(port);