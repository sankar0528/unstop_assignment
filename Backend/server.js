const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Reservation=require('./schema');
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
const url='mongodb+srv://sankar:sankar@cluster0.xg5jwpa.mongodb.net/';
async function connect(){
    try{
        await mongoose.connect(url);
        console.log("connected to database");
    }
    catch(error){
        console.log(error);
    }
}
connect();


// Initialize the seats array
const seats = [];
for (let i = 0; i < 11; i++) {
  seats.push(new Array(7).fill(false));
}
seats[11] = new Array(3).fill(false);

app.get('/seats', (req, res) => {
  res.json(seats);
});

app.post('/reserve', (req, res) => {
  const numOfSeats = parseInt(req.body.numOfSeats);

  if (isNaN(numOfSeats) || numOfSeats <= 0) {
    return res.status(400).json({ error: 'Invalid number of seats' });
  }

  const result = reserveSeats(numOfSeats);

  if (result === null) {
    return res.status(404).json({ error: 'No available seats' });
  }

  const reservation = new Reservation({ seatNumbers: result.seats });
  reservation.save();

  res.json(result);
});

function reserveSeats(numOfSeats) {
  let startRow = -1;
  let startCol = -1;
  let count = 0;

  for (let row = 0; row < seats.length; row++) {
    for (let col = 0; col < seats[row].length; col++) {
      if (!seats[row][col]) {
        if (startRow === -1) {
          startRow = row;
          startCol = col;
        }
        count++;
      } else {
        startRow = -1;
        startCol = -1;
        count = 0;
      }

      if (count === numOfSeats) {
        for (let i = 0; i < numOfSeats; i++) {
          seats[startRow][startCol + i] = true;
        }
        return {
          seats: getReservedSeats(startRow, startCol, numOfSeats),
          remainingSeats: getRemainingSeats(),
        };
      }
    }
  }

  return null;
}

function getReservedSeats(row, col, numOfSeats) {
  const reservedSeats = [];
  for (let i = 0; i < numOfSeats; i++) {
    reservedSeats.push(`Seat ${row * 7 + col + i + 1}`);
  }
  return reservedSeats;
}

function getRemainingSeats() {
  let remaining = 0;
  for (let row = 0; row < seats.length; row++) {
    for (let col = 0; col < seats[row].length; col++) {
      if (!seats[row][col]) {
        remaining++;
      }
    }
  }
  return remaining;
}

const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
