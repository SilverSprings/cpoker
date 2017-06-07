//gameservices - homebrew modules
var deck = require('../gameservices/deck');
var newshowdown = require('../gameservices/newshowdown');
var computeshowdown = require('../gameservices/showdownresults');

//router
var mgdb = require('./mgdb');


var socketPlayerArray = [];

var roomconnect = (db, io) => {

	io.on('connection', (socket) => {
		console.log('somebody is connected - socket.id:'+socket.id);

		// LISTEN : a player has entered a room
		socket.on('joinroom', (player) => {	
			socket.join(player.rId);
			socketPlayerArray.push({skId:socket.id, pId:player.pId});
			mgdb.retrieveRoom(db, player.rId).subscribe( room => {
				console.log('joinroom :'+room);
				// if all seats are taken in the room, and a game is not in progress, a new deck is required				
				if (room.rSeats == 4 && room.rGameInProgress == false) {
					// initilialize the showdown record
					var tempshowdown = showdowninit(room);
					mgdb.addShowdown(db, tempshowdown).subscribe(done => {
						console.log('showdown added : ', done);
					});
					// change GameInProgress to true 
					mgdb.gameInProgressRoomChange(db, player.rId, true).subscribe(done => {
						console.log('GameInProgress : ', done);
						//a new deck is delivered, every hand are dedicated to a player
						var tempDeck = deck(room);
						for(var _p = 0; _p < 4; _p--) {
							var socketPlayer =  socketPlayerArray.find( sp => sp.pId === tempDeck.dHands[_p].hPlayer);
							//EMIT : give to each player their assigned cards
							io.to(socketPlayer.skId).emit('cardsdealt',tempDeck.dHands[_p].hCards );						
						}						
					});					
				}
				else {
					// retrieve the players names and ID only
					mgdb.retrievePlayerNamesFromRoom(db, player.rId).subscribe( cursor => {
						cursor.toArray((err, players) => {
							if (err) console.log('an error occured while toArray '+err);
							console.log('find all players in a room ok');
							// EMIT : tell the room a player is coming in
							io.to(player.rId).emit('playersupdate', players);						
						});
					});	
				}
			});
		});
		
	
		// LISTEN : a player is ready to showdown
		socket.on('playerSD', (player) => { 
			// add the hand of the player to the showdown record
			mgdb.addHandShowdown(db, player).subscribe(done => { 
				console.log('addHandShowdown : ', done);
			});
			// change the player boolean SD in the mongoDB 
			mgdb.playerShowdown(db, true).subscribe(done => {
				console.log('playerShowdown : ', done);
			});
			// retrieve all the players
			mgdb.retrievePlayerNamesFromRoom(db, player.rId).subscribe( cursor => {
				cursor.toArray((err, players) => {
					if (err) console.log('an error occured while toArray '+err);
					console.log('find all players in a room ok');
					// if everybody is ready to showdown, we compute the results
					if (players.every( p => p.pSD === true)) {
						// calculate the results of the showdown
						mgdb.retrieveShowdown(db, player).subscribe( sd => {
							var sdComplete = computeshowdown(sd, players);
							// EMIT : tell the room results are ready
							io.to(player.rId).emit('showresults',sdComplete);
						});
					} 
					else {
						// EMIT : tell the room the players ready to showdown
						io.to(player.rId).emit('playersupdate', players);						
					}
				});
			});											
		});

		
		
		
		
		
		
		
		// LISTEN : a player has left a room
		socket.on('leaveroom', (player) => {socket.leave(player.rId);
											roomsColl.updateOne({rId : player.rId},	{$pull : {rPlayers : player.pId }, $inc : { rSeats : -1}}, 
											(err, result) => { if (err) throw err;
																console.log('-disconnect- update of room has been done :' + result);}
											);		
											// EMIT : tell the room somebody has left
											io.to(player.rId).emit('playerleft', player);													
		});
		
		// LISTEN : a player disconnection
		socket.on('disconnect', () => {
			console.log('somebody is disconnected - socket.id:'+socket.id);
		   //brutal disconnection : check if the player was in a room
		   var playerDC = socketPlayer.find( sp => sp.pSocketId === socket.id);
		   if (playerDC !== undefined) { 
				console.log(playerDC.pId+' whose socket.id is'+ playerDC.pSocketId +'was in :'+playerDC.pRoom);
				roomsColl.updateOne({rId : playerDC.pRoom},	{$pull : {rPlayers : playerDC.pId }, $inc : { rSeats : -1}}, 
									(err, result) => { if (err) throw err;
													   console.log('-disconnect- update of room has been done :' + result);}
				);
				playersColl.deleteOne( {pId : playerDC.pId}, 
									   (err, result) => { if (err) throw err;
														  console.log('-disconnect- : player removed' + result)}
				);				
		   }
		});		
	});
}
module.exports = roomconnect;