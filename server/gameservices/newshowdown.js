/*{ sHands: [{	hPlayerId:'PLAYER_HUMAN'
				hPlayerName:'Brandon'
				hF:{hand:[...], type:'One Pair', value:1, subvalue:1141404},
				hM:{hand:[...], type:'Straight', value:4, subvalue:40908070605},	
				hL:{hand:[...], type:'Straight Flush',	value:8, subvalue:80908070605}	
			},
		   {	hPlayerId:'PLAYER_BOTLEFT'
				hPlayerName:'left bot'
				hF:{hand:[...], type:'One Pair', value:1, subvalue:1141404},
				hM:{hand:[...], type:'Two Pairs', value:2, subvalue:21010090905},	
				hL:{hand:[...], type:'Full House',	value:6, subvalue:60808080606}	
		   },...],
  sRoom: 'ROOM_BOTROOM',
  sWinnerF:{winners:[],topsv:0},
  sWinnerM:{winners:[],topsv:0},
  sWinnerL:{winners:[],topsv:0},
  sScooper:''  
}*/

var blankshowdown = function showdownTemplate(room) {
	// return a blank object showdown with some initialisation
    return {
		 sHands: [{	hPlayerId:room.rPlayers[0],
					hPlayerName:'',
					hF:{},
					hM:{},	
					hL:{}	
					},
				   {hPlayerId:room.rPlayers[1],
					hPlayerName:'',
					hF:{},
					hM:{},	
					hL:{}	
				   },
				   {hPlayerId:room.rPlayers[2],
					hPlayerName:'',
					hF:{},
					hM:{},	
					hL:{}	
				   },
				   {hPlayerId:room.rPlayers[3],
					hPlayerName:'',
					hF:{},
					hM:{},	
					hL:{}	
				   }				   
				 ],
		  sRoom: room.rId,
		  sWinnerF:{winners:[],topsv:0},
		  sWinnerM:{winners:[],topsv:0},
		  sWinnerL:{winners:[],topsv:0},
		  sScooper:'' 
	};
}

module.exports = blankshowdown;