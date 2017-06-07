var newplayer = function newPlayer(name) {
    var player = {	
		pId:'PLAYER_'+randomString(8),
		pRoom:'',
		pName:name,
		pSD:false,
		pCardsDealt:''
	}
	
	return player;
}  

function randomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(randomInt(62));
    }
    return text;
}

function randomInt(rnd){
    return Math.floor(Math.random() * rnd);
}
 
module.exports = newplayer;