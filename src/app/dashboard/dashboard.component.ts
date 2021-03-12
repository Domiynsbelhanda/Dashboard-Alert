import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ServicesService } from 'app/services.service';
import * as Chartist from 'chartist';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  item$: Observable<any[]>;
  items$: Observable<any[]>;

  lundi: number =0;
  mardi: number =0;
  mercredi: number =0;
  jeudi: number =0;
  vendredi: number =0;
  samedi: number =0;
  dimanche: number =0

  constructor(firestore: AngularFirestore) {
    this.item$ = firestore.collection('Alerts',ref=>ref.orderBy('time', 'desc')).valueChanges();
    this.items$ = firestore.collection('Trajets',ref=>ref.orderBy('trajetTime', 'desc')).valueChanges();
  }
  startAnimationForLineChart(chart){
      let seq: any, delays: any, durations: any;
      seq = 0;
      delays = 80;
      durations = 500;

      chart.on('draw', function(data) {
        if(data.type === 'line' || data.type === 'area') {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint
            }
          });
        } else if(data.type === 'point') {
              seq++;
              data.element.animate({
                opacity: {
                  begin: seq * delays,
                  dur: durations,
                  from: 0,
                  to: 1,
                  easing: 'ease'
                }
              });
          }
      });

      seq = 0;
  };
  startAnimationForBarChart(chart){
      let seq2: any, delays2: any, durations2: any;

      seq2 = 0;
      delays2 = 80;
      durations2 = 500;
      chart.on('draw', function(data) {
        if(data.type === 'bar'){
            seq2++;
            data.element.animate({
              opacity: {
                begin: seq2 * delays2,
                dur: durations2,
                from: 0,
                to: 1,
                easing: 'ease'
              }
            });
        }
      });

      seq2 = 0;
  };
  ngOnInit() {

      this.lundi =0;
      this.mardi =0;
      this.mercredi =0;
      this.jeudi =0;
      this.vendredi =0;
      this.samedi =0;
      this.dimanche =0


      /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

      this.item$.forEach((value) => {


        value.map((values)=> {

          var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          var d = new Date(values.time.toDate());
          var dayName = days[d.getDay()];

          if (d.getDay() == 0) {
            this.dimanche ++
          } else if (d.getDay() == 1) {
            this.lundi ++
          } else if (d.getDay() == 2) {
            this.mardi ++
          } else if (d.getDay() == 3) {
            this.mercredi ++
          } else if (d.getDay() == 4) {
            this.jeudi ++
          } else if (d.getDay() == 5) {
            this.vendredi ++
          } else if (d.getDay() == 6) {
            this.samedi ++
          }
        
        const dataDailySalesChart: any = {
          labels: ['DIMANCHE('+this.dimanche+')', 'LUNDI('+this.lundi+')', 'MARDI('+this.mardi+')', 'MERCREDI('+this.mercredi+')', 'JEUDI('+this.jeudi+')', 'VENDREDI('+this.vendredi+')', 'SAMEDI('+this.samedi+')'],
          series: [
              [this.dimanche, this.lundi, this.mardi, this.mercredi, this.jeudi, this.vendredi, this.samedi]
          ]
      };

     const optionsDailySalesChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
          }),
          low: 0,
          high: this.dimanche+ this.lundi+ this.mardi+ this.mercredi+ this.jeudi+ this.vendredi+ this.samedi, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
      }

      var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

      this.startAnimationForLineChart(dailySalesChart);
      })
  })}

}
