import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_KEY = 'BUKWDD20O0HRIQAI';

@Component({
  selector: 'app-stock-display',
  templateUrl: './stock-display.component.html',
  styleUrls: ['./stock-display.component.css']
})
export class StockDisplayComponent implements OnInit {
  tableData: any;
  symbols: any;
  isLoading!: boolean;

  constructor(private http: HttpClient) {
    this.isLoading = true;
    this.symbols = {};
  }

  ngOnInit(): void {
    this.getTableData()
      .subscribe((resp: any) => {
        this.tableData = resp.data;
        this.isLoading = false;
        this.tableData.forEach((data: any) => {
          this.getSymbolData(data.symbol)
            .subscribe((innerResp: any) => {
              const dates = innerResp[Object.keys(innerResp)[1]];
              const datesKeys = Object.keys(dates);
              const latest = dates[datesKeys[datesKeys.length - 1]];
              this.symbols[data.symbol] = parseFloat(latest['4. close']).toFixed(2);
            })
        });
      });
  }

  getTableData() {
    return this.http.get('//localhost:3080/api/all');
  }

  getSymbolData(symbol: string) {
    return this.http.get(`//www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`);
  }
}
