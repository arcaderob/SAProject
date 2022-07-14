import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.css']
})
export class GenerateReportComponent implements OnInit {
  reportSymbol: string;  

  constructor(private http: HttpClient) {
    this.reportSymbol = '';
  }

  ngOnInit(): void {
  }

  generateReport() {
    if (!this.reportSymbol.length) return;
    this.http.get(
      `//localhost:3080/api/report?symbol=${this.reportSymbol}`
    ).subscribe((resp) => {
      console.log('Report data', resp);
    });
  }
}
