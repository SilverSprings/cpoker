import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import 'rxjs/add/operator/map';

import { Player } from './model/player';
//import { Room } from './model/room';

@Injectable()
export class RoomService {

	// We don't set the content-type in Headers.
	// We let Angular detect content-type from what is passed in the body
	// It's usually an object, so content-type:application/json
	constructor(private http: Http) { }
	
	availableRooms() {
		return this.http.get('/api/availablerooms').map(r => r.json());
	}
	
	addPlayer(player:Player) {
		return this.http.post('api/addplayer',player).map(r => r.json());
	}
	
	addPlayerInRoom(player:Player) {
		return this.http.post('/api/addplayerinroom',player).map(r => r.json());
	}
	
	retrieveRoom(roomId:string) {
		var tempRoom = { rId:roomId};
		return this.http.post('/api/retrieveroom', tempRoom).map(r => r.json());
	}

	removePlayer(player:Player) {
		return this.http.post('/api/removeplayer',player).map(r => r.json());
	}
	
	removePlayerInRoom(player:Player) {
		return this.http.post('/api/removeplayerinroom',player).map(r => r.json());
	}
}
