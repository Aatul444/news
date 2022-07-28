import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { WeatherService } from './service/weather.service';

@Component({
  selector: 'app-weather-forcast',
  templateUrl: './weather-forcast.component.html',
  styleUrls: ['./weather-forcast.component.scss']
})
export class WeatherForcastComponent implements OnInit {

  weather =
    {
      'Weatherforcast': 'sunshine',
      'Wind': '7km/h',
      'Ther': '21°C',
      'Hum': '82%',
    }

    loc$: Observable<string>;
    loc!: string;
    currentWeather: any = <any>{};
    msg!: string;

    constructor(
      private store: Store<any>,
      private weatherService: WeatherService
    ) {
      this.loc$ = store.pipe(select('loc'));
      this.loc$.subscribe(loc => {
        this.loc = loc;
        this.searchWeather(loc);
        console.log(this.searchWeather(loc))
      })
    }

    ngOnInit() {
    }

    searchWeather(loc: string) {
      this.msg = '';
      this.currentWeather = {};
      this.weatherService.getCurrentWeather(loc).subscribe((res)=>{
        this.currentWeather=res;
        console.log(this.currentWeather);
      })
      
  //     .subscribe(res => {
  //         this.currentWeather = res;
  //       }, err => {
  //         if (err.error && err.error.message) {
  //           alert(err.error.message);
  //           this.msg = err.error.message;
  //           return;
  //         }
  //         alert('Failed to get weather.');
  //       }, () => {
  // })
    }
    
    resultFound() {
      return Object.keys(this.currentWeather).length > 0;
    }
}