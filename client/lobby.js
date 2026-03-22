const hostRoom = document.getElementById("hostRoom")
const normalGwent = document.getElementById("normalGwent")
const reworkGwent = document.getElementById("reworkGwent")
const roomCodeDisplay = document.getElementById("roomCodeDisplay")
const joinRoom = document.getElementById("joinRoom")

const SERVER_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'ws://127.0.0.1:3000'
    : 'wss://your-render-app.onrender.com';

const socket = new WebSocket(SERVER_URL);

hostRoom.onclick = function() {
    socket.send(JSON.stringify({ type: 'host' }));
}

joinRoom.onclick = function() {

    const code = document.getElementById("roomID").value;
    socket.send(JSON.stringify({ type: 'join', code: code }));
}

socket.onmessage = function(event) {
        const message = JSON.parse(event.data)
        if (message.type === 'roomCreated')
        {
            roomCodeDisplay.style.display = "block";
            document.getElementById("roomCodeText").textContent = message.code;
        }

        if (message.type === 'guestJoined')
        {
            document.getElementById("lobbyHostMessage").textContent = message.message;

            if (normalGwent.checked)
                window.location = "game.html?role=host&code=" + message.code;
            else if(reworkGwent.checked)
                window.location = "game.html?role=host&code=" + message.code;
            else
            {
                alert("Default mode: Normal Gwent")
                window.location = "game.html?role=host&code=" + message.code;
            }
            
        }

        if (message.type === 'joinSuccess')
        {
            document.getElementById("lobbyGuestMessage").textContent = `${message.message} Waiting for host...`;
            
        }

        if (message.type === 'startGame')
        {
            window.location = "game.html?role=guest&code=" + message.code;
        }

        if (message.type === 'error')
            document.getElementById("lobbyGuestMessage").textContent = `${message.message}`

    }