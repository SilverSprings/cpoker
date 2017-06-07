/*
{ dRoom :'BOT_ROOM',
  dHands:{hPlayer:'PLAYER_afazrA51',
		  hCards:[
		  {s:"d",v:1,img:"assets/1D.png"},
		  {s:"s",v:6,img:"assets/6S.png"},
		  {s:"d",v:8,img:"assets/8D.png"},
 		  ...
		  {s:"d",v:7,img:"assets/7D.png"}]} 
}
*/

var newdeckshuffled = function newDeckShuffled(room) {
	var cards = cardsShuffled();
	console.log('', room);
	// return the deck with 4 hands of 13 cards shuffled 
	var hand1 = {
		hCards:cards.slice(0,13),
		hPlayer:room.rPlayers[0]
	}
	var hand2 = {
		hCards:cards.slice(13,26),	
		hPlayer:room.rPlayers[1]
	}
	var hand3 = {
		hCards:cards.slice(26,39),
		hPlayer:room.rPlayers[2]	
	}	
	var hand4 = {
		hCards:cards.slice(39,52),
		hPlayer:room.rPlayers[3]		
	}
    var tempArray = [];
    tempArray.push(hand1,hand2, hand3, hand4);	
	var deck = {dRoom:room.rId, dHands:tempArray};		
    return deck;
}

function cardsShuffled() {
	var values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
	//heart"&#9829" - diamond"&#9830" - spade"&#9824" - club"&#9827"
	var cardsHeart   = values.map( (r) => {return {v:r, s:"h"}} ); 
	var cardsDiamond = values.map( (r) => {return {v:r, s:"d"}} ); 
	var cardsSpade   = values.map( (r) => {return {v:r, s:"s"}} ); 
	var cardsClub    = values.map( (r) => {return {v:r, s:"c"}} ); 
    var cards = cardsHeart.concat(cardsDiamond,cardsSpade,cardsClub);
	/*cards = [
		{v:1, s:"h"},...,{v:13, s:"h"}	
		{v:1, s:"d"},...,{v:13, s:"d"}
		{v:1, s:"s"},...,{v:13, s:"s"}
		{v:1, s:"c"},...,{v:13, s:"c"}		
	]*/
	//Shuffle
	for(var i = 51; i >= 1; i--) {
		var j = randomInt(i);
		var tmpCard = cards[j];
		cards[j] = cards[i];
		cards[i] = tmpCard;
	}	
	return cards;
} 

function randomInt(rnd){
    return Math.floor(Math.random() * rnd);
}

module.exports = newdeckshuffled;



