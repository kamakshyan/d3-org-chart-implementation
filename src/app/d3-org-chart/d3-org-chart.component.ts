import {
  OnChanges,
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { OrgChart } from 'd3-org-chart';
@Component({
  selector: 'app-d3-org-chart',
  templateUrl: './d3-org-chart.component.html',
  styleUrls: ['./d3-org-chart.component.css'],
})
export class D3OrgChartComponent implements OnInit, OnChanges {
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @Input() data!: any[];
  chart: any;
  
  constructor() {}
  
  ngOnInit() {
    console.log('PRINT LINE NO 18::::::::',this.data);
  }

  ngAfterViewInit() {
    if (!this.chart) {
      this.chart = new OrgChart();
    }
    this.updateChart();
  }

  ngOnChanges() {
    this.updateChart();
  }
  updateChart() {

    const nodeMap = new Map();
    
    this.data.forEach((node: any) => {
      console.log('PRINT LINE NO 37:::::;;;',this.data);
        console.log('PRINT LINE NO 38:::::;;;',node);
      node.children = [];
      nodeMap.set(node.id, node);
    });
    // console.log(nodeMap)
    this.data.forEach((node: any) => {
      console.log('PRINT node LINE NO 42:::::;;;',node);
        console.log('PRINT this.data LINE NO 45:::::;;;',this.data);
      const parentId = node.parentId;
      if (parentId && nodeMap.has(parentId)) {
        const parent = nodeMap.get(parentId);
        parent.children.push(node);
      }
    });
    

    const sumChildTotAmt = (node: any) => {
      if (!node.children || node.children.length === 0) {
        return Number(node.tot_amt || 0);
      }

      let totalAmt = 0;

      node.children.forEach((child: any) => {
        totalAmt += sumChildTotAmt(child);
      });

      node.tot_amt = totalAmt.toString();
      return totalAmt;
    };

    let rootNode: any;

    this.data.forEach((node: any) => {
      console.log("PRINT LINE NO 71:::::::",node);
      if (!node.parentId) {
        rootNode = node;
      }
    });

    sumChildTotAmt(rootNode);

    let ultimateAmt = 0;
    // console.log(typeof(ultimateAmt))
    this.data.forEach((node: any) => {
      ultimateAmt += Number(node.self_amt);
      // console.log(node.self_amt)
    });

    if (!this.data) {
      return;
    }
    if (!this.chart) {
      return;
    }
    this.chart
      .container(this.chartContainer.nativeElement)
      .data(this.data)
      .nodeWidth((d: any) => 200)
      .nodeHeight((d: any) => 120)
      .nodeContent( (d: any) => {
        console.log('PRINT LINE NO 98:::::::::::::::',d);
          console.log('PRINT LINE NO 99:::::::::::::::',this.data);
        const color = '#fff';

        if (d.data.parentId === '') {
          return `
          <div style="font-family: 'Inter', sans-serif;background-color:${color}; position:absolute;margin-top:-1px; margin-left:-1px;width:${d.width}px;height:${d.height}px;border-radius:10px;border: 1px solid #E4E2E9">
          <div style="color:#08011E;position:absolute;right:20px;top:17px;font-size:10px;"><i class="fas fa-ellipsis-h"></i></div>
          <div style="font-size:15px;color:#08011E;margin-left:20px;margin-top:32px"> ${d.data.id} </div>
          <div style="color:#716E7B;margin-left:20px;margin-top:3px;font-size:10px;"> Children: ${d.data._directSubordinates} </div>
          <div style="color:#716E7B;margin-left:20px;margin-top:3px;font-size:10px;"> Total Cost: ${ultimateAmt} </div>
          </div>
          `;
        } else if (d.data._directSubordinates > 0) {
          return `
        <div style="font-family: 'Inter', sans-serif;background-color:${color}; position:absolute;margin-top:-1px; margin-left:-1px;width:${d.width}px;height:${d.height}px;border-radius:10px;border: 1px solid #E4E2E9">
          <div style="color:#08011E;position:absolute;right:20px;top:17px;font-size:10px;"><i class="fas fa-ellipsis-h"></i></div>
          <div style="font-size:15px;color:#08011E;margin-left:20px;margin-top:32px"> ${d.data.id} </div>
          <div style="color:#716E7B;margin-left:20px;margin-top:3px;font-size:10px;"> Children: ${d.data._directSubordinates} </div>
          <div style="color:#716E7B;margin-left:20px;margin-top:3px;font-size:10px;"> Own Amount: ${d.data.self_amt} </div>
          <div style="color:#716E7B;margin-left:20px;margin-top:3px;font-size:10px;"> Sum of Childrem Amount: ${d.data.tot_amt} </div>
      </div>
        `;
        } 
        else{
          return `
        <div style="font-family: 'Inter', sans-serif;background-color:${color}; position:absolute;margin-top:-1px; margin-left:-1px;width:${d.width}px;height:${d.height}px;border-radius:10px;border: 1px solid #E4E2E9">
          <div style="color:#08011E;position:absolute;right:20px;top:17px;font-size:10px;"><i class="fas fa-ellipsis-h"></i></div>
          <div style="font-size:15px;color:#08011E;margin-left:20px;margin-top:32px"> ${d.data.id} </div>
          <div style="color:#716E7B;margin-left:20px;margin-top:3px;font-size:10px;"> Children: ${d.data._directSubordinates} </div>
          <div style="color:#716E7B;margin-left:20px;margin-top:3px;font-size:10px;"> Own Amount: ${d.data.self_amt} </div>

      </div>
        `;
        }
      })
      .render();
  }
}
