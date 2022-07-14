import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_KEY = 'BUKWDD20O0HRIQAI';

@Component({
  selector: 'app-event-source-test',
  templateUrl: './event-source-test.component.html',
  styleUrls: ['./event-source-test.component.css']
})
export class EventSourceTestComponent implements OnInit {
  setSymbolName: string;
  setSymbolInput: number;
  rebuildInput: string;

  constructor(private http: HttpClient) {
    this.setSymbolName = '';
    this.setSymbolInput = 0;
    this.rebuildInput = '';
  }

  ngOnInit(): void {
  }

  setSymbol() {
    if (this.setSymbolInput < 1 || !this.setSymbolName.length) return;
    this.http.post(
      `//localhost:3080/api/setValue`,
      {
        symbol: this.setSymbolName.toUpperCase(),
        amount: this.setSymbolInput
      }
    ).subscribe((resp: any) => {
      console.log('Symbol value set', resp);
    });
  }

  rebuildSymbol() {
    if (!this.rebuildInput.length) return;
    this.http.post(
      `//localhost:3080/api/rebuild`,
      {
        symbol: this.rebuildInput.toUpperCase()
      }
    ).subscribe((resp: any) => {
      console.log('Symbol rebuilt', resp);
    });
  }

  clear() {
    this.setSymbolName = '';
    this.setSymbolInput = 0;
    this.rebuildInput = '';
  }
}
