import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { map } from 'rxjs/operators';
import {Observable} from 'rxjs';
import { CoinInterface } from '../interfaces/coin.interface';

@Injectable({providedIn: 'root'})
class ChartService {
  constructor(private http: HttpClient) {}

  public getCoins(ids: string, period: string): Observable<CoinInterface[]> {
      return this.http.get(`https://api.coinranking.com/v1/public/coins?ids=${ids}&period=${period}`)
      .pipe(map((item) => {
        console.log('item!!!', item);
        const data = item['data'].coins;
        return data.map(itemCoin => ({
          color: itemCoin.color,
          history: itemCoin.history.map(itemPrice => Math.ceil(itemPrice * 100) / 100),
          name: itemCoin.name
        }));
      }));
  }
}

export {ChartService}