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

  generateUrl(path: string, queryObj: IQuery = {}): string {
    return 'https://<apiRoot>/' + path + this.generateQuery(queryObj);
  }

  async getSelectorsOptions(): Promise<ISelectors> {
    try {
      let company = await this.getCompanyInfo();
      let managers = await this.getManagersInfo();
      let selectionStatuses = await this.getSelectionStatuses();
      let clientStatuses = await this.getClientStatuses(); 
      let selectorsInfo = this.sortSelectiosOptions([company, managers, selectionStatuses, clientStatuses]);
      return Promise.resolve(selectorsInfo);
    } catch (err) {
      Promise.reject(err);
    }
  }

  async getCompanyInfo() {
    console.log('GET: ' + this.generateUrl(this.apiPath.company));
    return await this.getSelectorsDataFromApi(this.apiPath.fakeCompany);
  }

  async getManagersInfo() {
    console.log('GET: ' + this.generateUrl(this.apiPath.managers));
    return await this.getSelectorsDataFromApi(this.apiPath.fakeManagers);
  }

  async getSelectionStatuses() {
    console.log('GET: ' + this.generateUrl(this.apiPath.selectionStatuses));
    return await this.getSelectorsDataFromApi(this.apiPath.fakeSelectionStatuses);
  }

  async getClientStatuses() {
    console.log('GET: ' + this.generateUrl(this.apiPath.clientStatuses));
    return await this.getSelectorsDataFromApi(this.apiPath.fakeClientStatuses);
  }

  getSelectorsDataFromApi(url) {
    return this.http.get(url).toPromise();
  }

  getClients(queryObj: IQuery): Observable<IClient[]> {
    console.log('GET: ' + this.generateUrl(this.apiPath.clients, queryObj));
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

  generateQuery(queryObj: IQuery): string{
    return Object.keys(queryObj)
      .filter(key => queryObj[key] !== null)
      .map(key => `${key}=${encodeURIComponent(queryObj[key])}`)
      .join('&');
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
