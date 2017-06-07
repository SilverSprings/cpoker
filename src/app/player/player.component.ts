import { Component, Input, OnInit, EventEmitter, Output  } from '@angular/core';
import { RankerService } from '../ranker.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  @Output() doneSorting = new EventEmitter<any>();
  
  @Input() player:any; /* what player looks like : 
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
  hand = {cards:[]};
  //handPlayed hold the reference of the cards that the player has placed.  
  firstHandPlayed = {cards:[],type:'',value:0,subvalue:0};
  middleHandPlayed = {cards:[],type:'',value:0,subvalue:0};
  lastHandPlayed = {cards:[],type:'',value:0,subvalue:0}; 


  //messages for each hand
  firstMessage:string;
  middleMessage:string;
  lastMessage:string;
  
  handFinal = {hF:{},hM:{},hL:{}};
  /*{
	 hF:{hand:[...], type:'One Pair', value:1, subvalue:1141404},
	 hM:{hand:[...], type:'Straight', value:4, subvalue:40908070605},	
	 hL:{hand:[...], type:'Straight Flush',	value:8, subvalue:40908070605}	
    } */  
  //disabled the evaluate button
  disableButton:boolean;

  constructor(private rankerService: RankerService) { }

  ngOnInit() {
	this.hand.cards = this.player.pCardsDealt;
	console.log('hand', this.hand);	
	this.firstMessage='';
	this.middleMessage='';
	this.lastMessage='';
	this.disableButton = true;	
  }

  checkHandFirst() {
	console.log ('chechHandFirst', this.firstHandPlayed.cards);
	//swap
	if (this.firstHandPlayed.cards.length == 4) {
		this.hand.cards.push(this.firstHandPlayed.cards[3]);		
		this.firstHandPlayed.cards.splice(3,1)
	}
	console.log ('chechHandFirst--', this.firstHandPlayed.cards);

	if (this.firstHandPlayed.cards.length == 3) {
		let handEvaluated = this.evaluateOnTheSpot(this.firstHandPlayed.cards);
		this.firstHandPlayed.type = handEvaluated.type; 
		this.firstHandPlayed.value = handEvaluated.val;
		this.firstHandPlayed.subvalue = handEvaluated.subval;
		this.firstMessage = '' + this.firstHandPlayed.type; 
	}
	if (this.firstHandPlayed.cards.length == 3 && this.middleHandPlayed.cards.length == 5) {
		if (this.firstHandPlayed.subvalue > this.middleHandPlayed.subvalue) {
			this.firstMessage = 'Careful ! Your first hand is better than your middle hand'
		} 
	}
	this.disableButton = this.evaluateAllSorted();
	this.evaluateMessage();
  }
  
  checkHandMiddle() {  
	console.log ('chechHandMiddle', this.middleHandPlayed.cards);
	//swap
	if (this.middleHandPlayed.cards.length == 6) {
		this.hand.cards.push(this.middleHandPlayed.cards[5]);
		this.middleHandPlayed.cards.splice(5,1)
	}
	console.log ('chechHandMiddle--', this.middleHandPlayed.cards);
	
	if (this.middleHandPlayed.cards.length == 5) {
		let handEvaluated = this.evaluateOnTheSpot(this.middleHandPlayed.cards);
		this.middleHandPlayed.type = handEvaluated.type; 
		this.middleHandPlayed.value = handEvaluated.val;
		this.middleHandPlayed.subvalue = handEvaluated.subval;
		this.middleMessage = '' + this.middleHandPlayed.type
	}
	if (this.middleHandPlayed.cards.length == 5 && this.lastHandPlayed.cards.length == 5) {
		if (this.middleHandPlayed.subvalue > this.lastHandPlayed.subvalue) {
			this.middleMessage = 'Careful ! Your middle hand is better than your last hand'
		}
	}
	this.disableButton = this.evaluateAllSorted();	
  }

  checkHandLast() {  
	console.log ('chechHandLast', this.lastHandPlayed.cards);
	//swap
	if (this.lastHandPlayed.cards.length == 6) {
		this.hand.cards.push(this.lastHandPlayed.cards[5]);
		this.lastHandPlayed.cards.splice(5,1)
	}
	console.log ('chechHandLast--', this.lastHandPlayed.cards);
	
	if (this.lastHandPlayed.cards.length == 5) {
		let handEvaluated = this.evaluateOnTheSpot(this.lastHandPlayed.cards);
		this.lastHandPlayed.type = handEvaluated.type; 
		this.lastHandPlayed.value = handEvaluated.val;
		this.lastHandPlayed.subvalue = handEvaluated.subval;
		this.lastMessage = '' + this.lastHandPlayed.type
	}
	
	if (this.middleHandPlayed.cards.length == 5 && this.lastHandPlayed.cards.length == 5) {
		if (this.middleHandPlayed.subvalue > this.lastHandPlayed.subvalue) {
			this.lastMessage = 'Careful ! Your middle hand is better than your last hand'
		}
	}
	this.disableButton = this.evaluateAllSorted();	
  }
  
  evaluate () {
	//firstHand
	console.log('Eval this.firstHandPlayed', this.firstHandPlayed);

    //evaluate middleHand	
	console.log('Eval this.middleHandPlayed', this.middleHandPlayed);

    //evaluate lastHand
	console.log('Eval this.lastHandPlayed', this.lastHandPlayed);
	
	// emit the event with the final hand
	this.handFinal.hF = this.firstHandPlayed;
	this.handFinal.hM = this.middleHandPlayed;
	this.handFinal.hL = this.lastHandPlayed;
	this.doneSorting.emit(this.handFinal);
  }

  evaluateOnTheSpot (currentHand) {
	var tempHandMini = currentHand.map( card => {return {s:card.s, v:card.v};}) ;
	var tempHand = this.rankerService.bestHand(tempHandMini);
	return { type:tempHand.type, val:tempHand.val, subval:tempHand.subval} 
  }

  evaluateAllSorted() {
	if (this.firstHandPlayed.cards.length == 3 && this.middleHandPlayed.cards.length == 5 && this.lastHandPlayed.cards.length == 5) {return false;} 
	else {return true;}
  }

  evaluateMessage() {
	console.log(this.firstMessage);
  	if (this.firstHandPlayed.cards.length < 3) {
		this.firstMessage = '';
	}
	console.log(this.firstMessage);
	console.log(this.lastMessage);	
	if (this.lastHandPlayed.cards.length < 5) {
		this.lastMessage = '';
	}
	console.log(this.lastMessage);	
	console.log(this.middleMessage);		
	if (this.middleHandPlayed.cards.length < 5) {
		this.middleMessage = '';
	}
	console.log(this.middleMessage);	
  }	
}
