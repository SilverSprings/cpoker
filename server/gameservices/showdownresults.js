/*{ sHands: [{	hPlayerId:'PLAYER_HUMAN'
				hPlayerName:'Brandon'
				hF:{hand:[...], type:'One Pair', value:1, subvalue:11414040000},
				hM:{hand:[...], type:'Straight', value:4, subvalue:40908070605},	
				hL:{hand:[...], type:'Straight Flush',	value:8, subvalue:80908070605}	
			},
		   {	hPlayerId:'PLAYER_BOTLEFT'
				hPlayerName:'left bot'
				hF:{hand:[...], type:'One Pair', value:1, subvalue:11414040000},
				hM:{hand:[...], type:'Two Pairs', value:2, subvalue:21010090905},	
				hL:{hand:[...], type:'Full House',	value:6, subvalue:60808080606}	
		   },...],
  sRoom: 'ROOM_BOTROOM',
  sWinnerF:{winners:['PLAYER_adada'],topsv:6141404},
  sWinnerM:{},
  sWinnerL:{},
  sScooper:''  
}*/

var showdownresult = function showdownCompute(showdown, players) {
	var sd = showdown;
	

	// check for any mis-set players
	for (let _p = 0; _p < 4; _p++) {
		sd.sHands[_p].hPlayerName = players.find( player => player.pId == sd.sHands[_p].hPlayerId).pName;
		
		if ( checkBustedHand(sd.sHands[_p]) ) {
			sd.sHands[_p].hF.type = 'mis-set';
			sd.sHands[_p].hM.type = 'mis-set';
			sd.sHands[_p].hL.type = 'mis-set';
			sd.sHands[_p].hF.value = -1;
			sd.sHands[_p].hM.value = -1;
			sd.sHands[_p].hL.value = -1;
			sd.sHands[_p].hF.subvalue = -1;
			sd.sHands[_p].hM.subvalue = -1;
			sd.sHands[_p].hL.subvalue = -1;			
		}
	}

	var hFsubvalue = calculateTopSubvalue(sd.sHands.map(hand => hand.hF.subvalue));
	var hMsubvalue = calculateTopSubvalue(sd.sHands.map(hand => hand.hM.subvalue));
	var hLsubvalue = calculateTopSubvalue(sd.sHands.map(hand => hand.hL.subvalue));
	
	sd.sWinnerF.topsv = hFsubvalue;
	sd.sWinnerM.topsv = hMsubvalue;
	sd.sWinnerL.topsv = hLsubvalue;	
	
	sd.sHands.forEach( hand => {
		if (hand.hF.subvalue == hFsubvalue) sd.sWinnerF.winners.push(hand.hPlayerId);
		if (hand.hM.subvalue == hMsubvalue) sd.sWinnerM.winners.push(hand.hPlayerId);
		if (hand.hL.subvalue == hLsubvalue) sd.sWinnerL.winners.push(hand.hPlayerId); 		
	});
	
	sd.sHands.forEach( hand => {
		var numHwin = 0;
		if (sd.sWinnerF.winners.length == 1 && hand.hPlayerId == sd.sWinnerF.winners[0]) numHwin++;
		if (sd.sWinnerM.winners.length == 1 && hand.hPlayerId == sd.sWinnerM.winners[0]) numHwin++;
		if (sd.sWinnerL.winners.length == 1 && hand.hPlayerId == sd.sWinnerL.winners[0]) numHwin++;
		if (numHwin >=2) sd.sScooper = hand.hPlayerId;
	});
	return sd;
}

function checkBustedHand(currentHand) {
	if (currentHand.hF.subvalue > currentHand.hM.subvalue) return true;
	if (currentHand.hM.subvalue > currentHand.hL.subvalue) return true;
	return false;
}

function calculateTopSubvalue (subvalueArray) {
	return Math.max(...subvalueArray);
}
module.exports = showdownresult;