import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FetchDataService {
  loginurl = 'http://localhost:9047/apiv2/login';
  queryUrl = 'http://localhost:9047/api/v3/sql';

  queryBody = {
    sql: 'SELECT * FROM "@kamak".ReceivablesBIUpdated2',
  };

  body = {
    userName: 'kamak',
    password: 'Kamak@123',
  };

  constructor(private http: HttpClient) {}

  getLogin() {
    return this.http.post(this.loginurl, this.body);
  }
  query(headers: HttpHeaders) {
    return this.http.post(this.queryUrl, this.queryBody, { headers });
  }
  jobState(jobID: string, headers: HttpHeaders){
    return this.http.get(`http://localhost:9047/api/v3/job/${jobID}`, {
      headers,
    });
  }
  getResults(jobID: string, headers: HttpHeaders) {
    return this.http.get(`http://localhost:9047/api/v3/job/${jobID}/results`, {
      headers,
    });
  }
}
