import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_KEY = 'BUKWDD20O0HRIQAI';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notificationSymbol: string;
  higherLower: string;
  notificationAmount: null | number;
  listNotifications: string;

  constructor(private http: HttpClient) {
    this.notificationSymbol = '';
    this.higherLower = '';
    this.notificationAmount = 0;
    this.listNotifications = '';
  }

  ngOnInit(): void {
    this.buildList();
  }

  setLocalstorageData(newData: any) {
    const existingData = this.getLocalstorageData();
    localStorage.setItem('notes', JSON.stringify([newData, ...existingData]));
    this.buildList();
  }

  getLocalstorageData() {
    const data = JSON.parse(localStorage.getItem('notes') || "[]");
    if (data && Array.isArray(data)) {
      return data;
    }
    return [];
  }

  buildList() {
    let table = '<table><thead><tr><th>Symbol</th><th>Direction</th><th>Amount</th></tr></thead>';
    const data = this.getLocalstorageData();
    data.forEach((d) => {
      table += `<tr><td>${d.symbol}</td><td>${d.direction}</td><td>${d.amount}</td></tr>`;
    });
    table += '</table>';
    this.listNotifications = table;
    this.buildNotifications(data);
  }

  getSymbolData(symbol: string) {
    return this.http.get(`//www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`);
  }

  buildNotifications(data: any) {
    data.forEach((n: any) => {
      setInterval(() => {
          this.getSymbolData(n.symbol).subscribe((innerResp: any) => {
          const dates = innerResp[Object.keys(innerResp)[1]];
          const datesKeys = Object.keys(dates);
          const latest = dates[datesKeys[datesKeys.length - 1]];
          const val = parseFloat(latest['4. close']).toFixed(2);
          console.log('this is the val', val);
          console.log(n.amount);
          if (n.direction === "Lower" ? (n.amount > val) : (n.amount < val)) {
            Notification.requestPermission(() => {
              const notification = new Notification(`${n.symbol}`,{body: `${n.direction} than ${n.amount}`,icon:'http://i.stack.imgur.com/Jzjhz.png?s=48&g=1', dir:'auto'});
              setTimeout(function(){
                  notification.close();
              }, 5000); // close notification after 5 seconds
            });
          }
        });
      }, 240000); //poll for data every 4 minutes (due to free acount limitations));
    });
  }

  addNotification() {
    this.setLocalstorageData({symbol: this.notificationSymbol, direction: this.higherLower, amount: this.notificationAmount});
  }

  clearNotifications() {
    localStorage.setItem('notes', JSON.stringify([]));
    this.buildList();
  }
}
