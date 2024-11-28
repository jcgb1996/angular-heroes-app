import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from 'src/environments/environments';
import { User } from '../interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl = environments.baseUrl
  private user?: User;

  public get currentUser(): User|undefined {
    if(!this.user) return undefined;
    return structuredClone( this.user );
  }

  constructor(private http: HttpClient) { }


  login(email: string, passwaor: string): Observable<User>{
   return this.http.get<User>(`${this.baseUrl}/users/1`)
    .pipe(
      tap((resp) =>this.user = resp ),
      tap( resp => localStorage.setItem('token', 'asdadasd.asdadasd.asdadad.adada' ) )
    )
    ;
  }

  checkAuthenticationStatus(): Observable<boolean>{
    if(!localStorage.getItem('token')) return of(false);

    const token = localStorage.getItem('token');

    return this.http.get<User>(`${this.baseUrl}/users/1`)
    .pipe(
      tap( user => {        this.user = user;      } ),
      map( user => {        return !!user;      } ),
      catchError( err => of(false))

    );
  }


  Logout() :void{
    this.user = undefined;
    localStorage.clear();
  }

}
