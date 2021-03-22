'use strict';

// Render the cinema (7x15 with middle path)
// Popup should contain seat price (for now 4$ to all) and allow booking the seat
// Uplift your model - each seat should have its own price... 
// Book the seat

// ITP: More...
// TODO: in seat details, show how many available seats around 
// TODO: Price is kept only for 10 seconds 


var gElSelectedSeat = null;
var gCinema = createCinema();
renderSeats();



function createCinema() {
    var cinema = [];
    for (var i = 0; i < 7; i++) {
        cinema[i] = [];
        for (var j = 0; j < 15; j++) {
            var cell = {
                type: 'SEAT',
                price: 10 + i,
                isBooked: false
            }
            if (j === 7) cell.type = 'EMPTY'
            cinema[i][j] = cell;
        }
    }
    return cinema;
}

function renderSeats() {
    var strHTML = '';
    for (var i = 0; i < gCinema.length; i++) {
        strHTML += `<tr class="cinema-row" >\n`
        for (var j = 0; j < gCinema[0].length; j++) {
            var cell = gCinema[i][j];
            // for cell of type SEAT add seat class
            var className = (cell.type === 'SEAT') ? 'seat' : ''
            if (cell.isBooked) className += ' booked'
            // TODO: for cell that is booked add booked class
            strHTML += `\t<td class="cell ${className}" 
                            onclick="seatClick(this, ${i}, ${j})" >
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }
    // console.log(strHTML)

    var elSeats = document.querySelector('.cinema-seats');
    elSeats.innerHTML = strHTML;
}



function seatClick(elSeat, i, j) {

    var cell = gCinema[i][j];
    if (cell.type != 'SEAT' || cell.isBooked) return;

    // Support selecting a seat
    elSeat.classList.add('selected');

    // Only a single seat should be selected
    if (gElSelectedSeat) {
        gElSelectedSeat.classList.remove('selected')
    }

    // Support Unselecting a seat
    console.log('Seat', elSeat, i, j);
    gElSelectedSeat = (elSeat === gElSelectedSeat) ? null : elSeat;

    // When seat is selected a popup is shown
    if (gElSelectedSeat) {
        var pos = { i: i, j: j };
        showSeatDetails(pos)
    } else {
        hideSeatDetails()
    }
}


function showSeatDetails(pos) {
    var elPopup = document.querySelector('.popup');
    var seat = gCinema[pos.i][pos.j];

    var availableAroundCount = countAvailable(pos);

    // Popup shows the seat identier - e.g.: 3-5 or 7-15
    elPopup.querySelector('h2 span').innerText = `${pos.i + 1}-${pos.j + 1}`
    elPopup.querySelector('h3 span').innerText = `$${seat.price}`
    elPopup.querySelector('h4 span').innerText = availableAroundCount;

    elPopup.querySelector('button').dataset.i = pos.i;
    elPopup.querySelector('button').dataset.j = pos.j;

    elPopup.hidden = false;
}
function hideSeatDetails() {
    document.querySelector('.popup').hidden = true;
}


function bookSeat(elBtn) {
    var i = +elBtn.dataset.i;
    var j = +elBtn.dataset.j;

    var seat = gCinema[i][j];
    seat.isBooked = true;

    renderSeats();

    hideSeatDetails()
}

function countAvailable(pos) {
    var count = 0
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gCinema.length) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gCinema[0].length) continue;
            if (i === pos.i && j === pos.j) continue;

            var cell = gCinema[i][j]
            if (cell.type === 'SEAT' && !cell.isBooked) count++;
        }
    }
    return count;
}



