import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.css']
})
export class GenerateReportComponent implements OnInit {
  reportSymbol: string;  
  tableHtml: null | string;
  reportData: any;
  hasReportData: boolean;

  constructor(private http: HttpClient) {
    this.reportSymbol = '';
    this.tableHtml = null;
    this.reportData = null;
    this.hasReportData = false;
  }

  ngOnInit(): void {}

  insertDataIntoTable(data: any[]) {
    this.tableHtml = '<table><thead><tr><th>Symbol</th><th>Action</th><th>Amount</th><th>Price</th></tr></thead>';
    data.forEach(element => {
      this.tableHtml += `<tr><td>${element.symbol}</td><td>${element.action}</td><td>${element.amount}</td><td>${element.price}</td></tr>`;
    });
    this.tableHtml += '</table>';
  }

  saveReport() {
    let data = 'symbol,action,amount,price\n';
    this.reportData.forEach((d: any) => {
      data += `${d.symbol},${d.action},${d.amount},${d.price}`
    });
    const blob = new Blob([data], {type: "text/plain;charset=utf-8"});
    saveAs(blob, `${this.reportData[0].symbol}.csv`);
  }

  generateReport() {
    this.hasReportData = false;
    if (!this.reportSymbol.length) return;
    this.http.get(
      `//localhost:3080/api/report?symbol=${this.reportSymbol}`
    ).subscribe((resp: any) => {
      if (resp.data.length) {
        this.hasReportData = true;
        this.reportData = resp.data;
        this.insertDataIntoTable(resp.data);
      }
    });
  }
}
