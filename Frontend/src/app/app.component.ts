import { Component ,OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  seats: any[][] = [];
  numOfSeats: number=0;
  reservedSeats: string[] = [];
  remainingSeats: number=0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getSeats();
  }

  getSeats() {
    this.http.get<any[][]>('http://localhost:5000/seats').subscribe(
      (response) => {
        this.seats = response;
      },
      (error) => {
        console.error('Error retrieving seats', error);
      }
    );
  }

  reserveSeats() {
    if(this.numOfSeats>7){
      alert("please select number of seats less than 7");
    }
    else if(this.numOfSeats<=0){
        alert("please select number of seats greater than 0");
    }
    else{
      this.http
      .post<any>('http://localhost:5000/reserve', { numOfSeats: this.numOfSeats })
      .subscribe(
        (response) => {
          this.reservedSeats = response.seats;
          this.remainingSeats = response.remainingSeats;
          this.getSeats(); // Refresh seat availability
        },
        (error) => {
          console.error('Error reserving seats', error);
        }
      );
    }
  }

}
