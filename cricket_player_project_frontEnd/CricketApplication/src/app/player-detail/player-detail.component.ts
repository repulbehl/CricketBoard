import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ViewEncapsulation } from '@angular/core';
import { PlayerUtil } from '../util/player.util';
import { PlayerInfo } from 'src/model/PlayerInfo';
import { favoritePlayers, PlayerData, playersResult, result1 } from '../util/constant';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LogInComponent } from '../log-in/log-in.component';
import { PlayerdetailServiceService } from '../Service/playerdetail-service.service';
import { Observable } from 'rxjs';
import { FavouritePlayersService } from '../Service/favourite-players.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./player-detail.component.css']
})
export class PlayerDetailComponent implements OnInit {

  playerUtil: PlayerUtil = new PlayerUtil();
  playerInfo: PlayerInfo | undefined;
  playerData : PlayerData | undefined;
  errMsg: string | undefined;
  

  nameCtrl: FormControl;
  searchform: FormGroup;
  constructor(builder: FormBuilder, private titleService: Title ,private servicePlayerDetail  : PlayerdetailServiceService , private serviceFavorite : FavouritePlayersService ,private router:Router) {
    this.nameCtrl = builder.control('',[Validators.required, Validators.minLength(2)]);
    const mapping = { searchTerm: this.nameCtrl };
    this.searchform = builder.group(mapping);
  }

  fetchPlayer() {
    if (!this.searchform.valid) {
      this.searchform.markAllAsTouched();
      return;
    }
    this.errMsg=undefined;
    let searchTerm: string = this.nameCtrl.value;
    searchTerm = searchTerm.trim();
    searchTerm = searchTerm.toLowerCase();
    if (searchTerm && searchTerm.length > 0) {
      let values :string[] = searchTerm.split(" ");
      let observable : Observable<PlayerData>  = this.servicePlayerDetail.getIdFromPlayerName(values[0],values[1]); 
      
      const observer={
        next:(result:any)=>{
         let id :string=JSON.stringify(result.data[0].id);
          this.fetchDetails(id);
        },
        error:(e:Error)=>{
          this.errMsg = e.message;
        }    
      } 
      observable.subscribe(observer);
    }
  }

  // fetching player details from id
  fetchDetails(id :any ){
    
    let observable : Observable<PlayerData>  = this.servicePlayerDetail.getDetailsFromPlayerId(id);
    const observer={
      next:(result:any)=>{
        this.playerInfo = this.playerUtil.convertToPlayer(result.data);
      },
      error:(e:Error)=>{
        console.log('error received', e.message);
      }    
    } 
       observable.subscribe(observer);
  }



  ngOnInit(): void {
    this.titleService.setTitle("Player Detail");
    document.body.className = "selector1";
  }
  ngOnDestroy() {
    this.titleService.setTitle("CricketApplication");
    document.body.className = "";
  }

  movePage(pageName : string ){  }
  
  addTofavourite(plays :any){
    let observable : Observable<PlayerData> = this.serviceFavorite.addToFavorite(plays);
    const observer={
      next:(result:any)=>{
        this.router.navigate([`${"players-list"}`]);
        console.log("Player Added " + result);
      },
      error:(e:Error)=>{
        console.log('error received', e.message);
        let errorAlreadyExsist : string = "Http failure response for http://localhost:8580/favouritePlayers/add: 400 OK";
        if(errorAlreadyExsist === e.message.trim()){
          this.errMsg=e.message;
        }
        let errorWithoutLogin:string="Http failure response for http://localhost:8580/favouritePlayers/add: 401 OK";
        if(errorWithoutLogin === e.message.trim()){
          this.router.navigate([`${"log-in"}`]);
        }
      }    
    } 
    observable.subscribe(observer);
  }


  isControlTouchedOrDirty(control: FormControl) {
    return (control.touched || control.dirty);
  }

  isControlRequireValid(control: FormControl) {
    const touchedOrDirty = this.isControlTouchedOrDirty(control);
    if (!touchedOrDirty) {
      return true;
    }
    return !control.errors?.['required'];
  }

  isSearchCtrlRequireValid() {
    const valid = this.isControlRequireValid(this.nameCtrl);
    return valid;
  }

  isSearchCtrlMinLengthValid() {
    const touchedOrDirty = this.isControlTouchedOrDirty(this.nameCtrl);
    if (!touchedOrDirty) {
      return true;
    }
    return !this.nameCtrl.errors?.['minlength'];
  }
}
