import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { IClient } from './interfaces/client';
import { ISelectors } from './interfaces/selectors';

export interface IQuery {
  deal_type?: string;
  status?: number;
  client_manager?: number;
  company?: number;
  search?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiPath = {
    managers: 'user/',
    company:'company/',
    clientStatuses: 'client_statuses/',
    selectionStatuses: 'selection_status/',
    clients: 'clients/object/<object_id: number>/?',
    fakeManagers: 'assets/data/managers.json',
    fakeCompany: 'assets/data/company.json',
    fakeClientStatuses: 'assets/data/client-status.json',
    fakeSelectionStatuses: 'assets/data/selection-status.json',
    fakeClients: 'assets/data/clients.json'
  }

  constructor(private http: HttpClient) { }

  generateUrl(path: string): string {
    return 'https://<apiRoot>/' + path;
  }

  getSelectorsOptions(): Promise<ISelectors> {
    console.log('GET: ' + this.generateUrl(this.apiPath.company));
    console.log('GET: ' + this.generateUrl(this.apiPath.managers));
    console.log('GET: ' + this.generateUrl(this.apiPath.selectionStatuses));
    console.log('GET: ' + this.generateUrl(this.apiPath.clientStatuses));
    return Promise.all([this.getPromise(this.apiPath.fakeCompany), 
                        this.getPromise(this.apiPath.fakeManagers), 
                        this.getPromise(this.apiPath.fakeSelectionStatuses),
                        this.getPromise(this.apiPath.fakeClientStatuses)
                      ])
      .then(data => this.sortSelectiosOptions(data)); 
      // если произойдет ошибка хотя бы в одном запросе, то компонент container отобразит компонент error с данными об ошибке
      // если необходимо эти запросы использовать по отдельности, то хорошо бы подкорректировать задачу
      // просто в моем понимании мы сначала должны получить все эти данные, без которых таблица функционировать не должна
      // но, если использование async await критично, могу переделать функции 
  }

  getPromise(url: string): Promise<any> {
    return this.http.get(url).toPromise();
  }

  getClients(options: IQuery | null): Observable<IClient[]> {
    const query = options instanceof Object ? this.generateQuery(options) : '';
    console.log('GET: ' + this.generateUrl(this.apiPath.clients + query));
    return this.http.get(this.apiPath.fakeClients)
      .pipe(
        switchMap(data => {
        return of((data instanceof Array) ? data.map((client) => ({
          status: client.status,
          contact: client.contact,
          company: client.description.author.company,
          manager: client.description.author.username,
          text: client.description.text,
          format: client.format,
          selection_item: client.selection_item
        })) : []);
      }));
  }

  generateQuery(options: IQuery): string{
    let query = '';
    Object.keys(options).forEach(key => {
      (options[key] !== null && options[key] !== '') ? query += `${key}=${encodeURIComponent(options[key])}&` : query += '';
    });
    return query;
  }

  sortSelectiosOptions(data: Array<any>): ISelectors {
    return {
      company: data[0].results.map(item => ({ id: item.id, title: item.title })),
      managers: data[1].map(item => ({ id: item.id, username: item.username, company: item.company })),
      statuses: data[2],
      client_statuses: data[3].results.map(item => ({ id: item.id, title: item.title, color: item.color }))
    }
  }

}
