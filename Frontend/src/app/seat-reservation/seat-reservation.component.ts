import { Component ,Input} from '@angular/core';

interface Seat {
  number: number;
  booked: boolean;
}

@Component({
  selector: 'app-seat-reservation',
  templateUrl: './seat-reservation.component.html',
  styleUrls: ['./seat-reservation.component.css']
})
export class SeatReservationComponent {
  @Input() data:any;
  rows: Seat[][] = [];
  numberOfSeats: any;
  selectedSeats: Seat[] = [];
  currentSeats:Seat[]=[];
  constructor() {
    this.initializeSeats();
    this.reserveSeats();
  }

  initializeSeats() {
    const totalSeats = 80;
    const seatsPerRow = 7;
    const lastRowSeats = 3;

    let seatNumber = 1;
    let rowNumber = 1;

    while (seatNumber <= totalSeats) {
      const row: Seat[] = [];

      if (rowNumber === Math.ceil(totalSeats / seatsPerRow)) {
        // Last row with fewer seats
        for (let i = 0; i < lastRowSeats; i++) {
          row.push({ number: seatNumber, booked: false });
          seatNumber++;
        }
      } else {
        // Full row
        for (let i = 0; i < seatsPerRow; i++) {
          row.push({ number: seatNumber, booked: false });
          seatNumber++;
        }
      }

      this.rows.push(row);
      rowNumber++;
    }
  }

  reserveSeats() {
    if (this.data > 7) {
      alert("You can reserve up to 7 seats at a time.");
      return;
    }

    const availableSeats: Seat[] = [];
    for (const row of this.rows) {
      for (const seat of row) {
        if (!seat.booked) {
          availableSeats.push(seat);
        }
      }
    }

    if (availableSeats.length < this.data) {
      alert("Insufficient seats available.");
      return;
    }

    for (let i = 0; i < this.data; i++) {
      const seatToBook = availableSeats[i];
      seatToBook.booked = true;
      this.selectedSeats.push(seatToBook);
      this.currentSeats.push(seatToBook);
    }
    this.currentSeats=[];
  }
  
}
