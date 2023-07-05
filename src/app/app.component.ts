import { Component } from '@angular/core';
import { FetchDataService } from './services/fetch-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'orgchart';
  data: any;

  constructor(private dremiodata: FetchDataService) {

    const handleData =async () => {
      try {
        const Logindata: any = await dremiodata.getLogin().pipe().toPromise();
        const token = Logindata.token;
        const headers: any = {
          'content-Type': 'application/json',
          authorization: '_dremio' + token,
        };
        const querydata: any = await dremiodata
          .query(headers)
          .pipe()
          .toPromise();
        const jobID = querydata.id;
        let results: any;

        const makeGraph = async () => {
          const jobstatedata: any = await dremiodata
            .jobState(jobID, headers)
            .pipe()
            .toPromise();
          const jobstate = jobstatedata.jobState;

          if (jobstate === 'COMPLETED') {
            const resultsdata: any = await dremiodata
              .getResults(jobID, headers)
              .pipe()
              .toPromise();
            results = resultsdata.rows;
            console.log(results)

            const selectedDataArray = [];
            for (const rowData of results) {
              const selectedData = {
                id: rowData.TRAN_ID.trim(),
                parentId: rowData.PARENT_ID.trim(),
                tran_ser: rowData.TRAN_SER.trim(),
                self_amt: rowData.TOT_AMT.trim(),
                tot_amt: rowData.TOT_AMT.trim(),
              };
              selectedDataArray.push(selectedData);
            }
            this.data = selectedDataArray;
            // console.log(selectedDataArray);
            console.log(this.data);
          } else {
            makeGraph();
          }
        }
        makeGraph();

      } catch (err) {
        console.log(err);
      }
    }

    handleData();

    
  }
}
