const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port: PORT });

const rooms = {};

function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

wss.on('connection', (ws) => {
    console.log('New player connected');

    ws.on('message', (rawMessage) => {
        const message = JSON.parse(rawMessage);

        if (message.type === 'host') {
            let code = generateRoomCode();
            while (rooms[code]) {
                code = generateRoomCode();
            }
            rooms[code] = { host: ws, guest: null };
            ws.roomCode = code;
            ws.role = 'host';
            ws.send(JSON.stringify({ type: 'roomCreated', code: code }));
        }

        if (message.type === 'join') {
            const room = rooms[message.code];
            if (!room) {
                ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
                return;
            }
            if (room.guest) {
                ws.send(JSON.stringify({ type: 'error', message: 'Room is full' }));
                return;
            }
            room.guest = ws;
            ws.roomCode = message.code;
            ws.role = 'guest';
            ws.send(JSON.stringify({ type: 'joinSuccess', message: 'Joined room!' }));
            room.host.send(JSON.stringify({ type: 'guestJoined', message: 'Opponent connected!', code: message.code }));
            room.guest.send(JSON.stringify({ type: 'startGame', code: message.code }));
        }

        if (message.type === 'rejoin') {
    console.log('Rejoin attempt:', message.role, message.code);
    
    const room = rooms[message.code];

    if (!room) {
        console.log('Room not found for code:', message.code);
        ws.send(JSON.stringify({ type: 'error', message: 'Room expired' }));
        return;
    }

    console.log('Room found, assigning role:', message.role);
    
    if (message.role === 'host') {
        room.host = ws;
    }
    if (message.role === 'guest') {
        room.guest = ws;
    }

    ws.roomCode = message.code;
    ws.role = message.role;

    console.log('Room state - host:', !!room.host, 'guest:', !!room.guest);

    if (room.host && room.guest) {
    if (!room.hostReady && message.role === 'host') {
        room.hostReady = true;
    }
    if (!room.guestReady && message.role === 'guest') {
        room.guestReady = true;
    }

    if (room.hostReady && room.guestReady && !room.gameStarted) {
        room.gameStarted = true;

        let hostTurn = false;
        let guestTurn = false;
        let coinFlip = Math.floor(Math.random() * 2) + 1;

        if (coinFlip === 1) hostTurn = true;
        else guestTurn = true;

        console.log('Both players ready, sending gameReady');
        room.host.send(JSON.stringify({ type: 'gameReady', role: 'host', turn: hostTurn }));
        room.guest.send(JSON.stringify({ type: 'gameReady', role: 'guest', turn: guestTurn }));
    }
}
    else {
        console.log('Skipping gameReady — already sent or room incomplete');
        console.log('host:', !!room.host, 'guest:', !!room.guest, 'gameStarted:', room.gameStarted);
    }
}                       
        
        if (message.type === 'handSize') {

            const room = rooms[ws.roomCode];
            if (!room) return;

            if (ws.role === 'host')
                room.guest.send(JSON.stringify(message))

            if (ws.role === 'guest')
                room.host.send(JSON.stringify(message))

        }

        if (message.type === 'playerPass') {

            const room = rooms[ws.roomCode];
            if (!room) return;

            if (ws.role === 'host') {
                room.host.send(JSON.stringify({type: 'passed' , hasPassed: true , newTurn: false}))
                room.guest.send(JSON.stringify({type: 'opponentPassed' , opponentHasPassed: true, newTurn: true}))
            }

            if (ws.role === 'guest') {
                room.guest.send(JSON.stringify({type: 'passed' , hasPassed: true , newTurn: false}))
                room.host.send(JSON.stringify({type: 'opponentPassed' , opponentHasPassed: true , newTurn: true}))
            }
        }
        
        if (message.type === 'endRound') {
            const room = rooms[ws.roomCode];
            if (!room) return;

            if (ws.role === 'host') {
                room.host.send(JSON.stringify({type: 'endRound' , winner: message.winner}))
                room.guest.send(JSON.stringify({type: 'endRound' , winner: message.winner}))
            }

            if (ws.role === 'guest') {
                room.host.send(JSON.stringify({type: 'endRound' , winner: message.winner}))
                room.guest.send(JSON.stringify({type: 'endRound' , winner: message.winner}))
            }
        }

        if (message.type === 'roundReset') {
            const room = rooms[ws.roomCode];
            if (!room) return;

            let hostTurn = false;
            let guestTurn = false;

            if (message.previousWinner === 'host')
                hostTurn = true;

            else if (message.previousWinner === 'guest')
                guestTurn = true;

            else if (message.previousWinner === 'draw') {
                let coinFlip = Math.floor(Math.random() * 2) + 1;
                if (coinFlip === 1) hostTurn = true;
                else guestTurn = true;
            }

            room.host.send(JSON.stringify({ type: 'roundReset', newTurn: hostTurn }));
            room.guest.send(JSON.stringify({ type: 'roundReset', newTurn: guestTurn }));
        }

        if (message.type === 'gameAction') {
            const room = rooms[ws.roomCode];
            if (!room) return;
            if (ws.role === 'host') {
         
                if (message.actionType === 'placeCard') {
                    
                    if (message.hasPassed === true) {
                        room.host.send(JSON.stringify({type: 'notification' , text: 'You had passed your turn.'}))
                        return;
                    }
                    
                    else if (message.opponentHasPassed === true) {
                        room.host.send(JSON.stringify({type: 'validPlace' , card: message.card , newTurn: true}))
                        room.guest.send(JSON.stringify({type: 'opponentPlaced' , card: message.card , newTurn: false}))
                        return;
                    }

                    else if (message.myTurn === true) {
                        room.host.send(JSON.stringify({type: 'validPlace' , card: message.card , newTurn: false}))
                        room.guest.send(JSON.stringify({type: 'opponentPlaced' , card: message.card , newTurn: true}))
                    }
                        
                    else
                        room.host.send(JSON.stringify({type: 'invalidPlace' , card: message.card}))
                }

            }
            if (ws.role === 'guest') {
                
                if (message.actionType === 'placeCard') {

                    if (message.hasPassed === true) {
                        room.guest.send(JSON.stringify({type: 'notification' , text: 'You had passed your turn.'}))
                        return;
                    }
                    
                    else if (message.opponentHasPassed === true) {
                        room.guest.send(JSON.stringify({type: 'validPlace' , card: message.card , newTurn: true}))
                        room.host.send(JSON.stringify({type: 'opponentPlaced' , card: message.card , newTurn: false}))
                        return;
                    }
                    
                    if (message.myTurn === true) {
                        room.guest.send(JSON.stringify({type: 'validPlace' , card: message.card , newTurn: false}))
                        room.host.send(JSON.stringify({type: 'opponentPlaced' , card: message.card , newTurn: true}))
                    }
                        
                    else
                        room.guest.send(JSON.stringify({type: 'invalidPlace' , card: message.card}))
                }
            }

        }
    });

    ws.on('close', () => {
    const room = rooms[ws.roomCode];
    if (!room) return;

    if (ws.role === 'host') {
        if (room.guest) room.guest.send(JSON.stringify({ type: 'opponentLeft' }));
    }
    if (ws.role === 'guest') {
        if (room.host) room.host.send(JSON.stringify({ type: 'opponentLeft' }));
    }

    setTimeout(() => {
        const currentRoom = rooms[ws.roomCode];
        if (!currentRoom) return;
        if (!currentRoom.host || !currentRoom.guest) {
            delete rooms[ws.roomCode];
        }
    }, 5000);

   
});
});

console.log(`Server running on port ${PORT}`);