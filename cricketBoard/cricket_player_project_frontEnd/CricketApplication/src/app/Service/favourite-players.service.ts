import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlayerData } from '../util/constant';
import { PlayerInfo } from '../../model/PlayerInfo';
import { baseServerUrl } from '../common/constants';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class FavouritePlayersService {

  constructor(private client :HttpClient,private serviceAuth : AuthenticationService) { }

  public addToFavorite(player : PlayerInfo): Observable<PlayerData>{
    let userName = this.serviceAuth.getUsername();
    const favoritedPlayer={userName, ...player};
    console.log(favoritedPlayer);
    const url=baseServerUrl +"/favouritePlayers/add";
    let observable :Observable<PlayerData>  = this.client.post<PlayerData>(url,favoritedPlayer);
    return observable;
  }
  
  public removeFavorite(id :string): Observable<void>{
   let userName = this.serviceAuth.getUsername(); 
    const requestData = {userName:userName,externalServerId : id};
    const url=baseServerUrl + "/favouritePlayers/delete";
    const options ={body : requestData};
    let observable :Observable<void>  = this.client.delete<void>(url,options);
    return observable;
  }
  
  public listofFavorite(userName: string): Observable<PlayerInfo[]>{
    const url=baseServerUrl +"/favouritePlayers/allFavoritedPlayer/"+userName;
    let observable :Observable<PlayerInfo[]>  = this.client.get<PlayerInfo[]>(url);
    return observable;
  }
  
}
