import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule }   from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';
import { ContainerComponent } from './container/container.component';
import { SearchPannelComponent } from './search-pannel/search-pannel.component';
import { TableComponent } from './table/table.component';
import { TableRowComponent } from './table-row/table-row.component';
import { SelectorComponent } from './selector/selector.component';
import { SelectorWidthDirective } from './selector-width.directive';
import { ApiService } from './api.service';
import { PhonePipe } from './phone.pipe';
import { ErrorComponent } from './error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    ContainerComponent,
    SearchPannelComponent,
    TableComponent,
    TableRowComponent,
    SelectorComponent,
    SelectorWidthDirective,
    PhonePipe,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
