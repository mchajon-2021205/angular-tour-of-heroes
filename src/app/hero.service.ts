import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs'
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes'

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`)
  }

  private handleError<T>(operation = 'operacion', result?: T) {
    return (error: any): Observable<T> => {
      this.log(`${operation} failed: ${error.message}`)
      return of(result as T)
    }
  }

  //Obtener todos los heroes
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetcjed heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  //Obbtener un herue

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this.log(`Fetched hero id=${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      )
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  //Modificar un heroe 

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`Updated hero id${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    )
  }

  //Agregar un nuevo heroe
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    )
  }

  //Eliminar un heroe
  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }


  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([])
    }
    return this.http.get<Hero[]>(`${this.heroesUrl} /? name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`Found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`),
        catchError(this.handleError<Hero[]>('searhHeros', []))
      )
    )
  }
}
