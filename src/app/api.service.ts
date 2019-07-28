import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://<apiRoot>/';
  private managersApi = 'user/';
  private companyApi = 'company/';
  private clStatusApi = 'client_statuses/';
  private selStatusApi = 'selection_status/';
  private clientsApi = 'clients/object/<object_id: number>/?'

  constructor(private http: HttpClient) { }

  public getSelectorsOptions(): Promise<any> {
    console.log('GET: ' + this.apiUrl + this.companyApi);
    console.log('GET: ' + this.apiUrl + this.managersApi);
    console.log('GET: ' + this.apiUrl + this.selStatusApi);
    console.log('GET: ' + this.apiUrl + this.clStatusApi);
    return Promise.all([this.getPromise('assets/data/company.json'), 
                        this.getPromise('assets/data/managers.json'), 
                        this.getPromise('assets/data/selection-status.json'),
                        this.getPromise('assets/data/client-status.json')
                      ])
      .then(data => this.sortSelectiosOptions(data));    
  }

  private getPromise(url: string): Promise<any> {
    return this.http.get(url).toPromise();
  }

  public getClients(options: Object | null): Observable<any> {
    const query = options instanceof Object ? this.generateQuery(options) : '';
    console.log('GET: ' + this.apiUrl + this.clientsApi + query);
    return this.http.get('assets/data/clients.json')
      .pipe(
        switchMap((data: Array<any>) => {
        if (!data.length) return null;
        return of(data.map((client: any) => ({
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

  private generateQuery(options: Object): string{
    let query = '';
    Object.keys(options).forEach(key => {
      options[key] ? query += `${key}=${encodeURIComponent(options[key])}&` : query += '';
    });
    return query;
  }

  private sortSelectiosOptions(data: Array<any>): Object {
    const sortData = {}
    sortData['company'] = data[0].results.map(item => ({ id: item.id, title: item.title }));
    sortData['managers'] = data[1].map(item => ({ id: item.id, username: item.username, company: item.company }));
    sortData['statuses'] = data[2];
    sortData['client_statuses'] = data[3].results.map(item => ({ id: item.id, title: item.title, color: item.color }));
    return sortData;
  }

}
