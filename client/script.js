// ═══════════════════════════════════════
// DOM REFERENCES
// ═══════════════════════════════════════

const p2Siege      = document.getElementById("board-2c");
const p2SiegeCount = document.getElementById("board-2c-count");
const p2Range      = document.getElementById("board-2b");
const p2RangeCount = document.getElementById("board-2b-count");
const p2Combat     = document.getElementById("board-2a");
const p2CombatCount= document.getElementById("board-2a-count");
const p2DiscardRow = document.getElementById("player2-discard");
const p2HandCount = document.getElementById('p2-card-count');
const p2TurnDisplay = document.getElementById("p2-turn-indicator");
const p2PassDisplay = document.getElementById("p2-passed-indicator")
let p2HandSize = 0;

const p1Combat     = document.getElementById("board-1a");
const p1CombatCount= document.getElementById("board-1a-count");
const p1Range      = document.getElementById("board-1b");
const p1RangeCount = document.getElementById("board-1b-count");
const p1Siege      = document.getElementById("board-1c");
const p1SiegeCount = document.getElementById("board-1c-count");
const p1DiscardRow = document.getElementById("player1-discard");
const p1TurnDisplay = document.getElementById("p1-turn-indicator");
const p1PassDisplay = document.getElementById("p1-passed-indicator")
const passBtn = document.getElementById("pass-btn");


const p1Hand = document.getElementById("player1-hand");
const p2Hand = document.getElementById("player2-hand");

// ═══════════════════════════════════════
// GAME STATE
// ═══════════════════════════════════════

const p1CombatRow = [];
const p1RangeRow  = [];
const p1SiegeRow  = [];
const p2CombatRow = [];
const p2RangeRow  = [];
const p2SiegeRow  = [];

const p1Discarded = [];
const p2Discarded = [];

let p1Total = 0;
let p2Total = 0;

let myCards     = [];
let pendingCard = null;
let gameStarted = false;
let hasPassed   = false;
let opponentHasPassed = false;

let p1RoundsWon = 0;
let p2RoundsWon = 0;
let previousWinner = null;
let currentRound = 1;

// ═══════════════════════════════════════
// MULTIPLAYER SETUP
// ═══════════════════════════════════════

const params = new URLSearchParams(window.location.search);
const myRole = params.get('role');
const myCode = params.get('code');

let myTurn = false;

const SERVER_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'ws://127.0.0.1:3000'
    : 'wss://gwent-server-dvo7.onrender.com/';

const socket = new WebSocket(SERVER_URL);

socket.onopen = function() {
    socket.send(JSON.stringify({ type: 'rejoin', code: myCode, role: myRole }));
};

socket.onmessage = function(event) {
    const message = JSON.parse(event.data);

   if (message.type === 'gameReady') {
    console.log('gameReady received:', message);
    console.log('myRole:', myRole);
    console.log('myTurn before:', myTurn);
    myTurn = message.turn;
    console.log('myTurn after:', myTurn);
    console.log('gameStarted:', gameStarted);
    startGame();
    }
    
    if (message.type === 'notification') {
        alert(message.text);
    }

    if (message.type === 'passed') {
        console.log("You passed your turn");
        hasPassed = message.hasPassed;
        myTurn = message.newTurn;
        p1PassDisplay.style.display = 'block';
        p1TurnDisplay.style.display = 'none';
        p2TurnDisplay.style.display = 'block';
    }

    if (message.type === 'opponentPassed') {
        console.log("Opponent has passed their turn");
        opponentHasPassed = message.opponentHasPassed;
        myTurn = message.newTurn;
        p2PassDisplay.style.display = 'block';
        p1TurnDisplay.style.display = 'block';
        p2TurnDisplay.style.display = 'none';

        if (hasPassed === true) 
             endRound();
        else if (myCards.length === 0) {
                passTurn();
}
    }

    if (message.type === 'endRound') {
        previousWinner = message.winner;
    if (message.winner === myRole) {
        p1RoundsWon++;
        gemDisplay();
        if (p1RoundsWon === 2 || p2RoundsWon === 2)
            endMatch();
        else
            showRoundResult('p1', startNextRound);
    }
    else if (message.winner === 'draw') {
        p1RoundsWon++;
        p2RoundsWon++;
        previousWinner = 'draw';
        gemDisplay();
        if (p1RoundsWon === 2 || p2RoundsWon === 2)
            endMatch();
        else
            showRoundResult('draw', startNextRound);
    }
    else {
        p2RoundsWon++;
        gemDisplay();
        if (p1RoundsWon === 2 || p2RoundsWon === 2)
            endMatch();
        else
            showRoundResult('p2', startNextRound);
    }
}

     if (message.type === 'roundReset') {
        myTurn = message.newTurn;
        hasPassed = false;
        opponentHasPassed = false;
        
    if (myTurn === true) {
        p1TurnDisplay.style.display = 'block';
        p2TurnDisplay.style.display = 'none';
        } 

    else {
        p2TurnDisplay.style.display = 'block';
        p1TurnDisplay.style.display = 'none';
        }
    }

    if (message.type === 'validPlace') {
        p1Hand.removeChild(pendingCard.element);
        myCards.splice(myCards.indexOf(pendingCard), 1);
        pendingCard = null;
        placeMyCard(message.card);
        myTurn = message.newTurn;
        if (myTurn === false) {
            p2TurnDisplay.style.display = 'block';
            p1TurnDisplay.style.display = 'none';
        }

        else if (myTurn === true) {
            p2TurnDisplay.style.display = 'none';
            p1TurnDisplay.style.display = 'block';
        }
       
    }

    if (message.type === 'opponentPlaced') {
        placeOpponentCard(message.card);
        p2HandSize--;
        p2HandCount.textContent = `${p2HandSize}`;
        myTurn = message.newTurn;
        if (myTurn === true) {
            p1TurnDisplay.style.display = 'block';
            p2TurnDisplay.style.display = 'none';
        }
        
        else if (myTurn === false) {
            p2TurnDisplay.style.display = 'block';
            p1TurnDisplay.style.display = 'none';
        }

        if (myCards.length === 0 && !hasPassed)
            passTurn();
    }

    if (message.type === 'invalidPlace') {
        pendingCard = null;
        alert('Not Your Turn!');
    }

    if (message.type === 'opponentLeft')
        alert('Your opponent has left the game.');

    if (message.type === 'handSize') {
        p2HandSize = message.size;
        p2HandCount.textContent = `${p2HandSize}`;
    }
        

};

function gemDisplay() {
    if (p1RoundsWon === 1)
            document.getElementById("p1-round-1").classList.add("won");
    if (p1RoundsWon === 2)
            document.getElementById("p1-round-2").classList.add("won");

    if (p2RoundsWon === 1)
            document.getElementById("p2-round-1").classList.add("won");
        if (p2RoundsWon === 2)
            document.getElementById("p2-round-2").classList.add("won");
}

// ═══════════════════════════════════════
// HELPER — attach right click + long press
// detail listeners to any card element.
//
// element — the DOM div for the card
// cardObj — the card data object
// ═══════════════════════════════════════

function attachDetailListeners(element, cardObj) {

    // Desktop: right click
    element.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        openCardDetail(cardObj);
    });

    // Mobile: long press
    let longPressTimer = null;

    element.addEventListener('touchstart', () => {
        longPressTimer = setTimeout(() => openCardDetail(cardObj), 500);
    });

    element.addEventListener('touchend', () => {
        clearTimeout(longPressTimer);
    });

    element.addEventListener('touchmove', () => {
        clearTimeout(longPressTimer);
    });
}

// ═══════════════════════════════════════
// CARD CONSTRUCTOR
// Creates a card object and its DOM element.
// ═══════════════════════════════════════

function Card(faction, title, type, power, ability, count) {
    this.faction = faction;
    this.title   = title;
    this.type    = type;
    this.power   = power;
    this.ability = ability;
    this.count   = count;

    this.element = document.createElement("div");
    this.element.textContent = `${title} \n \n -------(${power})-------`;
    this.element.className = "card";

    // Left click — play the card
    this.element.onclick = () => {
        pendingCard = this;
        socket.send(JSON.stringify({
            type: 'gameAction',
            myTurn: myTurn,
            actionType: 'placeCard',
            hasPassed: hasPassed , 
            opponentHasPassed: opponentHasPassed ,
            card: this
        }));
    };

    // Right click / long press — view card detail
    attachDetailListeners(this.element, this);
}

// ═══════════════════════════════════════
// createCard(title, playerDeck)
// Safe card factory — checks database
// and enforces maxCopies limit.
// ═══════════════════════════════════════

function createCard(title, playerDeck) {
    const data = cardDatabase[title];

    if (!data) {
        console.error(`Card "${title}" does not exist in the database`);
        return null;
    }

    const copiesInDeck = playerDeck.filter(card => card.title === title).length;
    if (copiesInDeck >= data.maxCopies) {
        console.error(`Cannot add another "${title}", limit of ${data.maxCopies} reached`);
        return null;
    }

    return new Card(data.faction, title, data.type, data.power, data.ability, data.maxCopies);
}

// ═══════════════════════════════════════
// placeMyCard(inputCard)
// Places a card on your side of the board.
// inputCard is raw JSON data returned from
// the server — no DOM element attached.
// ═══════════════════════════════════════

function placeMyCard(inputCard) {

    // Create a new element from the card data
    inputCard.element = document.createElement("div");
    inputCard.element.textContent = `${inputCard.title} \n \n -------(${inputCard.power})-------`;
    inputCard.element.className = "placedCard";

    // Attach detail listeners to the placed card
    attachDetailListeners(inputCard.element, inputCard);

    switch (inputCard.type) {
        case 'combat':
            p1Combat.appendChild(inputCard.element);
            p1CombatRow.push(inputCard);
            break;
        case 'range':
            p1Range.appendChild(inputCard.element);
            p1RangeRow.push(inputCard);
            break;
        case 'siege':
            p1Siege.appendChild(inputCard.element);
            p1SiegeRow.push(inputCard);
            break;
        case 'special':
            p1DiscardRow.appendChild(inputCard.element);
            p1Discarded.push(inputCard);
            break;
    }

    if (inputCard.ability === 'Scorch')
        activateScorch();

    Scores();
}

// ═══════════════════════════════════════
// placeOpponentCard(inputCard)
// Places a card on the opponent's side.
// ═══════════════════════════════════════

function placeOpponentCard(inputCard) {

    inputCard.element = document.createElement("div");
    inputCard.element.textContent = `${inputCard.title} \n \n -------(${inputCard.power})-------`;
    inputCard.element.className = "placedCard";

    // Attach detail listeners to the placed card
    attachDetailListeners(inputCard.element, inputCard);

    switch (inputCard.type) {
        case 'combat':
            p2Combat.appendChild(inputCard.element);
            p2CombatRow.push(inputCard);
            break;
        case 'range':
            p2Range.appendChild(inputCard.element);
            p2RangeRow.push(inputCard);
            break;
        case 'siege':
            p2Siege.appendChild(inputCard.element);
            p2SiegeRow.push(inputCard);
            break;
        case 'special':
            p2DiscardRow.appendChild(inputCard.element);
            p2Discarded.push(inputCard);
            break;
    }

    if (inputCard.ability === 'Scorch')
        activateScorch();

    Scores();
}

// ═══════════════════════════════════════
// activateScorch()
// Finds the highest power card across all
// rows on both sides and discards all cards
// matching that power value.
// ═══════════════════════════════════════

function activateScorch() {

    let max = 0;

    // Find the highest power value across all rows
    const allRows = [p1CombatRow, p1RangeRow, p1SiegeRow, p2CombatRow, p2RangeRow, p2SiegeRow];

    for (let r = 0; r < allRows.length; r++) {
        for (let i = 0; i < allRows[r].length; i++) {
            if (allRows[r][i].power > max)
                max = allRows[r][i].power;
        }
    }

    // Discard all cards matching that power
    for (let r = 0; r < allRows.length; r++) {
        for (let i = 0; i < allRows[r].length; i++) {
            if (allRows[r][i].power === max) {
                discard(allRows[r][i]);
                i--;
            }
        }
    }
}

// ═══════════════════════════════════════
// discard(inputCard)
// Moves a card from its row into the
// appropriate discard pile.
// ═══════════════════════════════════════

function discard(inputCard) {

    inputCard.element.onclick = null;
    inputCard.element.className = "placedCard";

    // Attach detail listeners to discarded card
    attachDetailListeners(inputCard.element, inputCard);

    const rowDiscardMap = [
        { row: p1CombatRow, discarded: p1Discarded, pile: p1DiscardRow },
        { row: p2CombatRow, discarded: p2Discarded, pile: p2DiscardRow },
        { row: p1RangeRow,  discarded: p1Discarded, pile: p1DiscardRow },
        { row: p2RangeRow,  discarded: p2Discarded, pile: p2DiscardRow },
        { row: p1SiegeRow,  discarded: p1Discarded, pile: p1DiscardRow },
        { row: p2SiegeRow,  discarded: p2Discarded, pile: p2DiscardRow },
    ];

    for (let i = 0; i < rowDiscardMap.length; i++) {
        const entry = rowDiscardMap[i];
        const index = entry.row.indexOf(inputCard);
        if (index !== -1) {
            entry.discarded.push(inputCard);
            entry.pile.appendChild(inputCard.element);
            entry.row.splice(index, 1);
            return; // card found and moved, stop looking
        }
    }
}

// ═══════════════════════════════════════
// Scores()
// Recalculates and displays all row scores
// and total scores for both players.
// ═══════════════════════════════════════

function Scores() {
    let p1CombatScore = 0;
    let p1RangeScore  = 0;
    let p1SiegeScore  = 0;
    let p2CombatScore = 0;
    let p2RangeScore  = 0;
    let p2SiegeScore  = 0;

    for (let i = 0; i < p1CombatRow.length; i++) p1CombatScore += p1CombatRow[i].power;
    for (let i = 0; i < p2CombatRow.length; i++) p2CombatScore += p2CombatRow[i].power;
    for (let i = 0; i < p1RangeRow.length;  i++) p1RangeScore  += p1RangeRow[i].power;
    for (let i = 0; i < p2RangeRow.length;  i++) p2RangeScore  += p2RangeRow[i].power;
    for (let i = 0; i < p1SiegeRow.length;  i++) p1SiegeScore  += p1SiegeRow[i].power;
    for (let i = 0; i < p2SiegeRow.length;  i++) p2SiegeScore  += p2SiegeRow[i].power;

    p1Total = p1CombatScore + p1RangeScore + p1SiegeScore;
    p2Total = p2CombatScore + p2RangeScore + p2SiegeScore;

    p1CombatCount.textContent = `Total: ${p1CombatScore}`;
    p1RangeCount.textContent  = `Total: ${p1RangeScore}`;
    p1SiegeCount.textContent  = `Total: ${p1SiegeScore}`;

    p2CombatCount.textContent = `Total: ${p2CombatScore}`;
    p2RangeCount.textContent  = `Total: ${p2RangeScore}`;
    p2SiegeCount.textContent  = `Total: ${p2SiegeScore}`;

    // Update total score in info panels
    const p1TotalEl = document.getElementById('p1-total-score');
    const p2TotalEl = document.getElementById('p2-total-score');
    if (p1TotalEl) p1TotalEl.textContent = p1Total;
    if (p2TotalEl) p2TotalEl.textContent = p2Total;

    // Update card count in info panels
    const p1CountEl = document.getElementById('p1-card-count');
    if (p1CountEl) p1CountEl.textContent = myCards.length;
}

// ═══════════════════════════════════════
// passTurn()
// Called when pass button is clicked.
// Works only if it's the current player's turn.
// ═══════════════════════════════════════

function passTurn() {

    if (myTurn === true) {
        socket.send(JSON.stringify({type: 'playerPass'}));
        console.log("You passed.");
    }

    else if (hasPassed === true) {
        console.log("You have already passed!");
    }

    else
        console.log("Not your Turn!");
}

function endRound() {

    let winner = '';
    if (p1Total > p2Total) winner = myRole;           // I won
    if (p1Total < p2Total) winner = myRole === 'host' ? 'guest' : 'host'; // opponent won
    if (p1Total === p2Total) winner = 'draw';

    socket.send(JSON.stringify({ type: 'endRound', winner: winner }));
}

function showRoundResult(resultText, callback) {
    const popup        = document.getElementById('round-popup');
    const titleEl      = document.getElementById('round-result-title');
    const p1ScoreEl    = document.getElementById('round-p1-score');
    const p2ScoreEl    = document.getElementById('round-p2-score');

    if (resultText === 'p1')
        titleEl.textContent   = "You Won the Round!";
    if (resultText === 'p2')
        titleEl.textContent   = "Opponent Won the Round!";
    if (resultText === 'draw')
        titleEl.textContent   = "Round ended in a Draw!";

    p1ScoreEl.textContent = p1Total;
    p2ScoreEl.textContent = p2Total;

    popup.classList.add('open');
    if (p1RoundsWon === 2 || p2RoundsWon === 2)
        endMatch(myRole)
    else {
        setTimeout(() => {
            popup.classList.remove('open');
            callback();
        }, 2000);
    }
    
}

function clearBoard() {
    const allRows = [p1CombatRow, p1RangeRow, p1SiegeRow, p2CombatRow, p2RangeRow, p2SiegeRow];

    for (let r = 0; r < allRows.length; r++) {
        while (allRows[r].length > 0) {
            discard(allRows[r][0]);
        }
    }
}

function startNextRound() {
    currentRound++;
    clearBoard();
    hasPassed = false;
    opponentHasPassed = false;
    p1PassDisplay.style.display = 'none';
    p2PassDisplay.style.display = 'none';
    Scores();

    // Only the winner triggers the reset — avoids double sending
    if (previousWinner === myRole || (previousWinner === 'draw' && myRole === 'host')) {
    socket.send(JSON.stringify({ type: 'roundReset', previousWinner: previousWinner }));
    }
}

function endMatch() {

    let matchResult = '';

    if (p1RoundsWon > p2RoundsWon)
        matchResult = 'YOU WIN THE MATCH!';
    else if (p2RoundsWon > p1RoundsWon)
        matchResult = 'OPPONENT WINS THE MATCH!';
    else
        matchResult = 'THE MATCH IS A DRAW!';

    const titleEl   = document.getElementById('round-result-title');
    const popup     = document.getElementById('round-popup');
    const p1ScoreEl = document.getElementById('round-p1-score');
    const p2ScoreEl = document.getElementById('round-p2-score');

    titleEl.textContent   = matchResult;
    p1ScoreEl.textContent = `${p1RoundsWon} rounds`;
    p2ScoreEl.textContent = `${p2RoundsWon} rounds`;

    popup.classList.add('open');

    // Reset all game state properly
    p1CombatRow.length = 0;
    p1RangeRow.length  = 0;
    p1SiegeRow.length  = 0;
    p2CombatRow.length = 0;
    p2RangeRow.length  = 0;
    p2SiegeRow.length  = 0;

    p1Discarded.length = 0;
    p2Discarded.length = 0;

    myCards.length = 0;

    p1Total         = 0;
    p2Total         = 0;
    pendingCard     = null;
    gameStarted     = false;
    hasPassed       = false;
    opponentHasPassed = false;
    p1RoundsWon     = 0;
    p2RoundsWon     = 0;
    previousWinner  = null;
    currentRound    = 1;
}


// ═══════════════════════════════════════
// startGame()
// Called when gameReady is received.
// Deals cards and sets up the board.
// ═══════════════════════════════════════

function startGame() {
    if (gameStarted) return;
    gameStarted = true;

       // Reset all display states
    p1PassDisplay.style.display = 'none';
    p2PassDisplay.style.display = 'none';
    p1TurnDisplay.style.display = 'none';
    p2TurnDisplay.style.display = 'none';

    // Reset round gems
    document.getElementById('p1-round-1').classList.remove('won');
    document.getElementById('p1-round-2').classList.remove('won');
    document.getElementById('p2-round-1').classList.remove('won');
    document.getElementById('p2-round-2').classList.remove('won');

    // Then set turn display correctly
    if (myTurn === true) {
        p1TurnDisplay.style.display = 'block';
        p2TurnDisplay.style.display = 'none';
    } else {
        p2TurnDisplay.style.display = 'block';
        p1TurnDisplay.style.display = 'none';
    }
    
    if (myRole === 'host') {
        myCards.push(createCard('Sheldon Skags', myCards));
        myCards.push(createCard('Geralt of Rivia', myCards));
        myCards.push(createCard('Scorch', myCards));
    }

    if (myRole === 'guest') {
        myCards.push(createCard('Keira Metz', myCards));
        myCards.push(createCard('Ciri', myCards));
        myCards.push(createCard('Scorch', myCards));
    }

    for (let i = 0; i < myCards.length; i++)
        p1Hand.appendChild(myCards[i].element);

    // Attach row popup listeners to all board rows
    attachRowPopups({
        'row-wrapper-1a': { array: p1CombatRow, label: 'YOUR COMBAT' },
        'row-wrapper-1b': { array: p1RangeRow,  label: 'YOUR RANGE'  },
        'row-wrapper-1c': { array: p1SiegeRow,  label: 'YOUR SIEGE'  },
        'row-wrapper-2a': { array: p2CombatRow, label: 'OPP COMBAT'  },
        'row-wrapper-2b': { array: p2RangeRow,  label: 'OPP RANGE'   },
        'row-wrapper-2c': { array: p2SiegeRow,  label: 'OPP SIEGE'   }
    });

    setTimeout(() => {
    socket.send(JSON.stringify({ type: 'handSize', size: myCards.length }));
    }, 500);

    passBtn.onclick = function() {
        passTurn();
    }

    Scores();
}