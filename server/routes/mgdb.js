//standard acces to mongoDB documents
/*
The database 'game' is composed of 4 collections
	db.collection('rooms');
	db.collection('players');
	db.collection('decks');
	db.collection('showdowns');
	
*/
var Rx = require('rx');

/* --------------------- */
/*         FIND          */
/* --------------------- */ 
//retrieveRoom
exports.retrieveRoom = (db, rId) => {
	return db.collection('rooms').findOne( 
		{rId : rId}, 
		null,
		(err, room) => {
			if (err) {
				console.log('MGDB : error occured when retrieving room ', err);
				return Rx.Observable.of(false);}
			else {
				console.log('MGDB : room retrieved :',  room);
				return Rx.Observable.of(room);}
		}
	);
}

exports.availableRooms = (db) => {
	return db.collection('rooms').find( 
		{ $and: [{rSeats: { $lt:4}},{rGameInProgress:false}] },
		(err, rooms) => {
			if (err) {
				console.log('MGDB : error occured when retrieving available rooms ', err);
				return Rx.Observable.of(false);
			}	
			else {
				console.log('MGDB : available rooms retrieved ');
				return Rx.Observable.of(rooms);
			}
		}
	);
}




/* --------------------- */
/*        INSERT         */
/* --------------------- */ 
//addPlayer
exports.addPlayer = (db, player) => {
	return db.collection('players').insertOne(
		player, 
		(err, result) => {
			if (err)  {
				console.log('MGDB : error occured when adding player :'+ err);
				return Rx.Observable.of(false);}
			else {
				console.log('MGDB : player added' + result);
				return Rx.Observable.of(true);}
		}
	);	
}

exports.addDeck = (db, deck) => {
	return db.collection('deck').insertOne(
		deck, 
		(err, result) => {
			if (err)  {
				console.log('MGDB : error occured when adding deck :'+ err);
				return Rx.Observable.of(false);}
			else {
				console.log('MGDB : deck added' + result);
				return Rx.Observable.of(true);}		
		}
	);
}

/* --------------------- */
/*        DELETE         */
/* --------------------- */ 
//removePlayer
exports.removePlayer = (db, pId) => {		
	return db.collection('players').deleteOne( 
		{pId : pId},
		(err, result) => {
			if (err)  {
				console.log('MGDB : error occured when deleting player :'+ err);
				return Rx.Observable.of(false);}
			else {
				console.log('MGDB : player deleted' + result);
				return Rx.Observable.of(true);}	
		}
	);
}





/* --------------------- */
/*        UPDATE         */
/* --------------------- */ 
//addPlayerInRoom
exports.addPlayerInRoom = (db, roomPlayer) => {		
	return db.collection('rooms').updateOne( 
		{rId : RoomPlayer.rId},
		{$push : {rPlayers : roomPlayer.pId }, $inc : { rSeats : 1}}, 
		(err, result) => { 
			if (err) {
				console.log('MGDB : error occured when adding a player in a room :'+ err);
				return Rx.Observable.of(false);}
			else {
				console.log('MGDB : player added to a room' + result);
				return Rx.Observable.of(true);}
		}
	);		
}

//addRoomInPlayer
exports.addRoomInPlayer = (db, roomPlayer) => {
	return db.collection('players').updateOne( 
		{pId : roomPlayer.pId},
		{$set : {pRoom : roomPlayer.rId}}, 
		(err, result) => { 
			if (err) {
				console.log('MGDB : error occured when adding a room in a player :'+ err);
				return Rx.Observable.of(false);}
			else {
				console.log('MGDB : room added to a player' + result);
				return Rx.Observable.of(true);}
		}		
	);
}

//removePlayerInRoom
exports.removePlayerInRoom = (db, roomPlayer) => {
	return db.collection('rooms').updateOne( 
		{rId : roomPlayer.rId},
		{$pull : {rPlayers : roomPlayer.pId }, $inc : { rSeats : -1}}, 
		(err, result) => { 
			if (err) {
				console.log('MGDB : error occured when removing a player in a room :'+ err);
				return Rx.Observable.of(false);}
			else {
				console.log('MGDB : player removed from a room' + result);
				return Rx.Observable.of(true);}
		}
	);
}

//removeRoomInPlayer
exports.removeRoomInPlayer = (db, roomPlayer) => {
	return db.collection('players').updateOne(	
		{pId : roomPlayer.pId},
		{$set : {pRoom : '', pSD:false, pHand : ''}}, 
		(err, result) => { 
			if (err) {
				console.log('MGDB : error occured when removing a room in a player :'+ err);
				return Rx.Observable.of(false);}
			else {
				console.log('MGDB : room removed from a player' + result);
				return Rx.Observable.of(true);}
		}
	);
}

//addDeckInRoom
exports.addDeckInRoom = (db, roomDeck) => {		
	return db.collection('rooms').updateOne( 
		{ rId : roomDeck.rId},
		{ $set : {rDeck:roomDeck.dId, rGameInProgress:true}}, 
		(err, result) => { 
			if (err) {
				console.log('MGDB : error occured when adding a deck in a room :'+ err);
				return Rx.Observable.of(false);}
			else {
				console.log('MGDB : deck added to a room' + result);
				return Rx.Observable.of(true);}
		}
	);		
}