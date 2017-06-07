import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DndModule } from 'ng2-dnd';
// Components
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { BotroomComponent } from './botroom/botroom.component';
import { CityroomComponent } from './cityroom/cityroom.component';
import { PlayerComponent } from './player/player.component';

// Services
import { RoomService } from './room.service';
import { CardService } from './card.service';
import { RankerService } from './ranker.service';
import { SocketService } from './socket.service';

// Define the routes
const ROUTES = [
/*  {
    path: '',
    redirectTo: 'menu',
    pathMatch: 'full'
  },
  {
    path: 'menu',
    component: MenuComponent
  } */
];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    BotroomComponent,
    CityroomComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
	RouterModule.forRoot(ROUTES), // Add routes to the app
	DndModule.forRoot()
  ],
  providers: [RoomService, CardService, SocketService, RankerService],
  bootstrap: [MenuComponent]
})
export class AppModule { }
