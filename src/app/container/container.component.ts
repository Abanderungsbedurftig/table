import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { IClient } from '../interfaces/client';
import { ISelectors } from '../interfaces/selectors';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {
  selectorOptions: ISelectors;
  clientStatuses: Array<any>;
  clients: Array<IClient> | null;
  error: Error;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getSelectorsOptions().then(data => {
      let selectorOptions = {
        company: data.company,
        managers: data.managers,
        statuses: data.statuses
      }
      this.selectorOptions = selectorOptions;
      this.clientStatuses = data.client_statuses;
      this.getClientsFromService({});
    })
    .catch(err => this.handleError(err));
  }

  getClientsFromService(option) {
    this.apiService.getClients(option).subscribe(clients => {
      console.log('Перезагрузка данных...');
      this.clients = clients.map(client => this.getCompanyAndStatus(client));
    },
    err => this.handleError(err)
    );
  }

  handleError(err: Error) {
    console.error(err);
    this.error = err;
  }

  getCompanyAndStatus(client: IClient): IClient {
    let company = this.selectorOptions.company.find(comp => client.company === comp.id);
    let status = this.clientStatuses.find(st => client.status === st.id); 
    return { ...client, company: company.title, status: status };
  }

}
