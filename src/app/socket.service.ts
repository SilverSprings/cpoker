import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SocketService {

  constructor(){}
	socket = io();

	joinRoom(player) {
		this.socket.emit('joinroom', player);
	}
	
	playersJoinUpdate() {
		let obs = new Observable(observer => {
			this.socket.on('playersjoinupdate', (playersNameId) => observer.next(playersNameId));
		});
		return obs;
	}
	
	cardsDealt() {
		let obs = new Observable(observer => {
			this.socket.on('cardsdealt', (cards) => observer.next(cards));
		});
		return obs;
	}
	
	showResults() {
		let obs = new Observable(observer => {
			this.socket.on('showresults', (sdComplete) => observer.next(sdComplete));
		});
		return obs;
	}
	
	leaveRoom(player) {
	}
	
	playerSD(player) {
		this.socket.emit('playerSD', player);
	}	

}
