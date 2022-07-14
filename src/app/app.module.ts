import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StockDisplayComponent } from './stock-display/stock-display.component';
import { BuySellComponent } from './buy-sell/buy-sell.component';
import { EventSourceTestComponent } from './event-source-test/event-source-test.component';
import { GenerateReportComponent } from './generate-report/generate-report.component';

@NgModule({
  declarations: [
    AppComponent,
    StockDisplayComponent,
    BuySellComponent,
    EventSourceTestComponent,
    GenerateReportComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
