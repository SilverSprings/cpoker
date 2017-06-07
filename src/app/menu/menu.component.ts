import { Component, OnInit } from '@angular/core';
import { RoomService } from '../room.service';
import { Player} from '../model/player' ;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private roomService: RoomService) { }
  
  playerNamesCPU:{humanPlayer:string, cpuLeft:string, cpuMiddle:string, cpuRight:string} ;
  player:Player;
  gameCPUInProgress:boolean;
  gameInProgress:boolean;
  rulesHidden:boolean;
  registeredPlayer:boolean;
  chooseAnotherRoom:boolean;
  nameNotEntered:boolean;
  rooms=[];
  roomSelected;
  room;
  
  ngOnInit() {
	this.gameCPUInProgress = false;
    this.gameInProgress = false;
	this.registeredPlayer = false;
	this.nameNotEntered = true;
	this.rulesHidden = true;
	this.chooseAnotherRoom = false;
	this.roomService.availableRooms().subscribe(rooms => this.rooms = rooms);
    this.player = {	pId:'',
					pRoom:'',
					pName:'',
					pReady:false,
					pSD:false,
					pHand:''
	};	  
  }
  
  registerPlayer(inputPlayerName : string) {
	this.player.pName = inputPlayerName; 
	this.roomService.availableRooms().subscribe(rooms => this.rooms = rooms);	
	this.registeredPlayer = true;
  }
  
  checkName(inputPlayerName : string) {
	var stringInspect = inputPlayerName.trim();
	if (stringInspect != '') this.nameNotEntered = false;
	if (stringInspect == '') this.nameNotEntered = true;	
  }
  
  startGameCPU() {
	this.gameCPUInProgress = true;
  }

  startGame() {
	this.roomService.retrieveRoom(this.roomSelected.rId).subscribe( room => {
		if (room.rSeats < 4 ) {
			this.roomService.addPlayer(this.player).subscribe( player => {
				this.player = player;
				this.roomService.addPlayerInRoom(this.player).subscribe(room => {
					this.room = room;
					this.player.pRoom = room.rId;
					this.gameInProgress = true;
				});
			});
		} else {
			this.chooseAnotherRoom = true;
			this.roomService.availableRooms().subscribe(rooms => this.rooms = rooms);			
		}
	});
  }
  
  endGameCPU() {	
	this.playerNamesCPU.humanPlayer = '';
	this.gameCPUInProgress = false;	
  }
  
  endGame() {
	this.roomService.removePlayerInRoom(this.player).subscribe(room => console.log('Player '+this.player.pName +'left the room'+room.rId));	
	this.roomService.availableRooms().subscribe(rooms => this.rooms = rooms);
	this.gameCPUInProgress = false;	
  }
  
  showRules() {
	this.rulesHidden = false;
  }
  
  hideRules() {
	this.rulesHidden = true;
  }  
  
}
