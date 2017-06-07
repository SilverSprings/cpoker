import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { RankerService } from './ranker.service';

@Injectable()
export class CardService {

	constructor(private http: Http, private rankerService:RankerService) { }

	// Shuffle a new deck
	newDeck(room) {
		return this.http.post('/api/newdeck', room).map(r => r.json());
	}
	
	botSorting(cards) {
	/* botSorting will return 3 hands
	{
	 hF:{hand:[...], type:'One Pair', value:1, subvalue:1141404},
	 hM:{hand:[...], type:'Straight', value:4, subvalue:40908070605},	
	 hL:{hand:[...], type:'Straight Flush',	value:8, subvalue:40908070605}	
	}
	*/
		//Sorting the 13 cards to get the highest rank for 'hL' : the last hand
		var hL = this.rankerService.bestHand(cards);
		/* tempCardsM holds the remaining cards after removing the cards already used in hL
              - 'filter' returns a new array, iterating through all items of the array
			  - 'filter' contains a callback : if the callback returns true, the item is added to the new array 
		      - 'indexOf' returns the position of a item in an array (0,7,10, etc.)
              - 'indexOf' returns -1 if the item is not found   			  
		   basically :
			  - we iterate over each card of the 'cards' array using 'filter'
			  - we check if this card is a card of 'hL' using 'indexOf'
			  - if the card is not found in 'hL', 'indexOf' returns -1, so we return true (using a comparison). 
			     --> The card is added to the new array
			  - if the card is found in 'hL', 'indexOf' returns something else than -1, so we return false
			     --> The card is dismissed 
		*/   
		var tempCardsM = cards.filter(card => hL.hand.indexOf(card) === -1);		
		//Sorting the 8 remaining cards to get the highest rank for 'hM' : the middle hand  
		var hM = this.rankerService.bestHand(tempCardsM);
		//tempCardsF holds the remaining cards after removing the cards already used in hM 
		var tempCardsF = cards.filter(card => hM.hand.indexOf(card) === -1);				
		//Resolving what is the type, value and subvalue of the 3 remaining cards for 'hF' : the first hand  
		var hF = this.rankerService.bestHand(tempCardsF);
		return {hF:hF, hM:hM, hL:hL};
	}
		
	imageCards(cards) {
		const url = 'assets/';
		var tempCards = cards.map( c => {
			c.img = url + c.v + c.s.toUpperCase() + '.png';
			return c;
		});
		return tempCards;
	}
	
	resultsCompute(allHands) {
	}
}

