import { Component, OnInit, Input } from '@angular/core';
import { CardService } from '../card.service';

@Component({
  selector: 'app-botroom',
  templateUrl: './botroom.component.html',
  styleUrls: ['./botroom.component.css']
})
export class BotroomComponent implements OnInit {

  constructor(private cardService:CardService) { }
  
  @Input() playerName; 
  
  deck:any;   /* What a deck look like : 
{ dHands: [  { hCards: [{s:"h",v:4},{s:"c",v:11},{s:"s",v:2},{s:"h",v:12},{s:"d",v:4},{s:"c",v:13},
					   {s:"h",v:5},{s:"s",v:13},{s:"s",v:4},{s:"d",v:12},{s:"d",v:13},{s:"s",v:1},{s:"s",v:11}],
			  hName: "HAND_q89MEFC9",
			  hPlayer: "PLAYER_HUMAN"},  
			{ hCards: [{s:"c",v:4},{s:"c",v:5},{s:"s",v:9},{s:"h",v:10},{s:"h",v:6},{s:"d",v:1},
					   {s:"c",v:9},{s:"s",v:3},{s:"c",v:12},{s:"c",v:8},{s:"c",v:7},{s:"h",v:11},{s:"h",v:1}],
			  hName: "HAND_bVhisnfa",
			  hPlayer: "PLAYER_BOTLEFT"},
			{ hCards: [{s:"s",v:8},{s:"s",v:5},{s:"c",v:1},{s:"s",v:6},{s:"d",v:3},{s:"d",v:9},
					   {s:"s",v:10},{s:"h",v:3},{s:"d",v:6},{s:"c",v:2},{s:"c",v:6},{s:"h",v:9},{s:"d",v:11}],
			  hName: "HAND_GxcCMdAt",
			  hPlayer: "PLAYER_BOTMID"},
			{ hCards: [{s:"d",v:10},{s:"s",v:12},{s:"d",v:8},{s:"h",v:8},{s:"h",v:2},{s:"h",v:7},
					   {s:"c",v:3},{s:"s",v:7},{s:"d",v:2},{s:"h",v:13},{s:"c",v:10},{s:"d",v:5},{s:"d",v:7}],
			  hName: "HAND_L442ZrAD",
			  hPlayer: "PLAYER_BOTRIGHT"}],
  dId: "DECK_e54soH0X",
  dRoom: "ROOM_BOTROOM"
} */

  result:any;
  
  allHands = []; /* What allHands looks like :
[ {	hPlayerId:'PLAYER_HUMAN'
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
  },...
]
*/

  readyToPlay:boolean;
  showResults:boolean;
  player:any; /* what player looks like : 
  {
		pId:'PLAYER_HUMAN',
		pRoom:'BOTROOM',
		pName:'Brandon',
		pSD:false,
		pCardsDealt:[{s:"d",v:10,img:"assets/10D.png"},
					 {s:"s",v:12,img:"assets/12S.png"},
					 {s:"d",v:8,img:"assets/8D.png"},
					 {s:"h",v:8,img:"assets/8H.png"},
					 {s:"h",v:2,img:"assets/2H.png"},
					 ...
					 {s:"d",v:7,img:"assets/7D.png"}] 
  }  
  */  

  ngOnInit() {
	this.readyToPlay = false;
	this.showResults = false;	
	var botNames = ['human','left bot', 'mid bot', 'right bot'] ;	
	var botRoom = {
		rId:"ROOM_BOTROOM", 
		rName:'BOTROOM', 
		rSeats:4,
		rGameInProgress:true,
		rDeck:'',
		rPlayers:['PLAYER_HUMAN','PLAYER_BOTLEFT','PLAYER_BOTMID','PLAYER_BOTRIGHT'] }
	console.log(this.cardService.newDeck(botRoom));
	// Retrieve a new deck from the API
    this.cardService.newDeck(botRoom).subscribe( deck => {
		console.log(deck);
		this.deck=deck; 
		console.log(this.deck);
		// Sorting the cards for the bots
		for ( var _b=1; _b < 4; _b++) {
			console.log(_b);
			var tempFML = this.cardService.botSorting(this.deck.dHands[_b].hCards);
			/*{
				hF:{hand:[...], type:'One Pair', value:1, subvalue:1141404},
				hM:{hand:[...], type:'Straight', value:4, subvalue:40908070605},	
				hL:{hand:[...], type:'Straight Flush',	value:8, subvalue:80908070605}	
			}*/		
			this.allHands[_b]             = tempFML;
			this.allHands[_b].hPlayerId   = botRoom.rPlayers[_b];
			this.allHands[_b].hPlayerName = botNames[_b];
		}
		// taking care of the human player
		console.log('imagecard', this.cardService.imageCards(this.deck.dHands[0].hCards));
		this.player = {
			pId:'PLAYER_HUMAN',
			pRoom:'BOTROOM',
			pName: this.playerName,
			pSD:false,
			pCardsDealt:this.cardService.imageCards(this.deck.dHands[0].hCards)
		}
		this.readyToPlay = true;
	});
  }

  humanPlayerReady(humanHand) {
		this.allHands[0]             = humanHand;
		this.allHands[0].hPlayerId   = this.player.hPlayerId;
		this.allHands[0].hPlayerName = this.player.hPlayerName;
		this.readyToPlay = false;
		this.showResults = true;
  }

}
