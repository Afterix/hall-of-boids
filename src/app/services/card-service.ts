import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CardService {

  cards: any[] = [];
  fetched: boolean = false;
  url: string = 'http://localhost:3333/api/cards';

  constructor(private _http: Http) {}

  _fetchCards(): Promise<any> {
    return this._http.get(this.url)
      .toPromise()
      .then((res)=> {
        const body = res.json();
        this.fetched = true;
        this.cards = body._data;
        return body._data;
      })
  }

  _fetchCard(id: number): Promise<any> {
    return this._http.get(`${this.url}/${id}`)
      .toPromise()
      .then((res)=> {
        const body = res.json();
        this.fetched = true;
        this.cards.push(body._data);
        return body._data[0];
      })
  }

  _getFetched(id: number): Promise<any> {
    return Promise.resolve(this.cards.filter( (c): boolean => { return parseInt(c.id) == id } )[0]);
  }

  list(): Promise<any>  {
    return this._fetchCards()
  }

  get(id: number): Promise<any> {
    if(this.cards && this.cards.length) {
      return this._getFetched(id)
    }
    return this._fetchCard(id);
  }

  next(id: number): boolean {
    return this.cards && id+1 <= this.cards.length
  }

  prev(id: number): boolean {
    return this.cards && id-1 > 0
  }
}
