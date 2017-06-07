const express = require('express');
const router = express.Router();

//gameservices - homebrew modules
var deck = require('../gameservices/deck');
var newplayer = require('../gameservices/newplayer');
//router
var mgdb = require('./mgdb');

var routerExport = (db) => {

	// Add a player 
	router.post('/addplayer', (req, res) => {
			// TEST : the player name must be provided
			if (!req.body.pName) {console.log('/addplayer : no player name provided'+req.body); res.status(500);} 
			// SERVICE : create a new player
			var tempPlayer = newplayer(req.body.pName);
			// MONGODB : insert that new player 
			mgdb.addPlayer(db, tempPlayer).subscribe( result => { 
				// RESPONSE : the new player created
				console.log('addPlayer :'+result);
				if (result) res.status(200).send(tempPlayer);
			});
	});

	// Retrieve all available rooms, where the number of seats already taken is < 4
	router.get('/availablerooms', (req, res) => {
		console.log('a request has been made to retrieve all available rooms');
		mgdb.availableRooms(db).subscribe ( result => {
			result.toArray((err, rooms) => {
				if (err) console.log('an error occured while toArray '+err);
				console.log('find all rooms ok');
				res.status(200).send(rooms);
			});
		});
	});

	// Get a particular room
	router.post('/retrieveroom', (req, res) => {
		// TEST : the room id must be provided
		if ( !req.body.rId) {console.log('/retrieveroom : no room Id provided' + req.body); res.status(500);}
		// MONGODB : find the room
		mgdb.retrieveRoom(db, req.body.rId).subscribe( room => {
			//RESPONSE : room retrieved
			console.log('retrieveRoom :'+room);
			if (room) res.status(200).send(room);
		});	
	});

	// Add a the player in a room and update the player room
	router.post('/addplayerinroom', (req, res) => {
		// TEST : check if the room ID and Player ID are provided
		if ( !req.body.pRoom) {console.log('/addplayerinroom : no room Id provided'+req.body); res.status(500);}
		if ( !req.body.pId) {console.log('/addplayerinroom : no player Id provided'+req.body); res.status(500);}
		console.log('player '+req.body.pId+ ' wants to enter '+ req.body.pRoom);

		var roomPlayer = {rId:req.body.pRoom, pId:req.body.pId};
		// MONGODB : add +1 to the seats occupied in the room and add a player in the room 
		mgdb.addPlayerInRoom(db, roomPlayer).subscribe( result => {
			console.log('addPlayerInRoom :' + result);
		});
		
		// MONGODB : update the player room
		mgdb.addRoomInPlayer(db, roomPlayer).subscribe( result => {
			console.log('addRoomInPlayer :' + result);
		});
		
		// MONGODB : find the room
		mgdb.retrieveRoom(db, req.body.pRoom).subscribe( result => {
			//RESPONSE : room retrieved
			console.log('retrieveRoom :'+result);
			if (result) res.status(200).send(result);
		});			

	});

	// Remove a player from a room and update the player room
	router.post('/removeplayerinroom', (req, res) => {
		// TEST : check if the room ID and Player ID are provided
		if ( !req.body.pRoom) {console.log('/removeplayerinroom : no room Id provided'+req.body); res.status(500);}
		if ( !req.body.pId) {console.log('/removeplayerinroom : no player Id provided'+req.body); res.status(500);}
		console.log('player '+req.body.pId+ ' wants to leave '+ req.body.pRoom);

		var roomPlayer = {rId:req.body.pRoom, pId:req.body.pId};
		// MONGODB : subsract 1 to the seats occupied in the room and remove a player in the room 
		mgdb.removePlayerInRoom(db, roomPlayer).subscribe( result => {
			console.log('removePlayerInRoom :' + result);
		});
		
		mgdb.removeRoomInPlayer(db, roomPlayer).subscribe( result => {
			console.log('removeRoomInPlayer :' + result);
			res.status(200);
		});
	});

	// Get a new deck
	router.post('/newdeck', (req, res) => {
		console.log('a new desk has been asked', req.body);
		// SERVICE : a new deck required
		var tempDeck = deck(req.body);
		console.log('', tempDeck);	
		res.status(200).send(tempDeck);
	});

	return router;
}
module.exports = routerExport;