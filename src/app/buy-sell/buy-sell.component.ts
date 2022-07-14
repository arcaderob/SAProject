import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_KEY = 'BUKWDD20O0HRIQAI';

@Component({
  selector: 'app-buy-sell',
  templateUrl: './buy-sell.component.html',
  styleUrls: ['./buy-sell.component.css']
})
export class BuySellComponent implements OnInit {
  symbolPrice: string;
  symbolInput: string;
  amountInput: number;

  constructor(private http: HttpClient) {
    this.symbolPrice = '';
    this.symbolInput = '';
    this.amountInput = 0;
  }

  ngOnInit(): void {}

  getPrice() {
    if (!this.symbolInput.length) return;
    this.getSymbolData(this.symbolInput)
      .subscribe((innerResp: any) => {
        const dates = innerResp[Object.keys(innerResp)[1]];
        const datesKeys = Object.keys(dates);
        const latest = dates[datesKeys[datesKeys.length - 1]];
        this.symbolPrice = `$${parseFloat(latest['4. close']).toFixed(2)}`;
      });
  }

  getSymbolData(symbol: string) {
    return this.http.get(`//www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`);
  }

  transaction(action: string) {
    if (!this.symbolInput.length || (!this.amountInput || this.amountInput < 1) || !this.symbolPrice.length) return;
    this.http.post(
      `//localhost:3080/api/symbol`,
      {
        "action": "buy",
        "symbol": this.symbolInput.toUpperCase(),
        "amount": this.amountInput,
        "price": parseFloat(this.symbolPrice.replace('$', '')).toFixed(2)
      }
    ).subscribe((resp: any) => {
      console.log('Subscribed and done', resp);
    });
  }

  clearFields() {
    this.symbolPrice = '';
    this.symbolInput = '';
    this.amountInput = 0;
  }
}
