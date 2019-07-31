import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { IClient } from './interfaces/client';
import { ISelectors } from './interfaces/selectors';
import { IQuery } from './interfaces/query';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://<apiRoot>/';
  private managersApi = 'user/';
  private companyApi = 'company/';
  private clStatusApi = 'client_statuses/';
  private selStatusApi = 'selection_status/';
  private clientsApi = 'clients/object/<object_id: number>/?';

  constructor(private http: HttpClient) { }

  getSelectorsOptions(): Promise<ISelectors> {
    console.log('GET: ' + this.apiUrl + this.companyApi);
    console.log('GET: ' + this.apiUrl + this.managersApi);
    console.log('GET: ' + this.apiUrl + this.selStatusApi);
    console.log('GET: ' + this.apiUrl + this.clStatusApi);
    // в данном случае лучше использовать Promise.all, а не async await чтобы запросы уходили не дожидаясь ответа предыдущего
    // такой вариант быстрее. кроме того, обработка ошибок происходит в компоненте, чтобы проще вызывать компонент error
    return Promise.all([this.getPromise('assets/data/company.json'), 
                        this.getPromise('assets/data/managers.json'), 
                        this.getPromise('assets/data/selection-status.json'),
                        this.getPromise('assets/data/client-status.json')
                      ])
      .then(data => this.sortSelectiosOptions(data));   
    // так как остается только Promise.all вопрос декомпозиции не актуален  
  }

  getPromise(url: string): Promise<any> {
    return this.http.get(url).toPromise();
  }

  getClients(options: IQuery | null): Observable<IClient[]> {
    const query = options instanceof Object ? this.generateQuery(options) : '';
    console.log('GET: ' + this.apiUrl + this.clientsApi + query);
    return this.http.get('assets/data/clients.json')
      .pipe(
        switchMap((data: Array<any>) => {
        if (!data.length) return null;
        return of(data.map((client) => ({
          status: client.status,
          contact: client.contact,
          company: client.description.author.company,
          manager: client.description.author.username,
          text: client.description.text,
          format: client.format,
          selection_item: client.selection_item
        })));
      }));
  }

  generateQuery(options: IQuery): string{
    let query = '';
    Object.keys(options).forEach(key => {
      options[key] ? query += `${key}=${encodeURIComponent(options[key])}&` : query += '';
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
