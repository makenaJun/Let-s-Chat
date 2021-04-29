const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


const rooms = new Map();

app.get('/rooms/:id', (request, response) => {
    const { id: roomId } = request.params;
    const obj = rooms.has(roomId) ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()]
    } : { users: [], messages: [] };
    response.json(obj);
});

app.post('/rooms', (request, response) => {
    const { roomId } = request.body;

    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map([
            ['users', new Map()],
            ['messages', []]
        ]))
    };
    response.json({ resultCode: 0 });
});

io.on('connection', (ws) => {
    ws.on('ROOM:JOIN', ({ roomId, userName }) => {
        ws.join(roomId);
        rooms.get(roomId).get('users').set(ws.id, userName);
        const users = [...rooms.get(roomId).get('users').values()];
        ws.broadcast.to(roomId).emit('ROOM:SET_USERS', users);
    });

    ws.on('ROOM:NEW_MESSAGE', ({ roomId, userName, text }) => {
        const obj = {
            userName,
            text
        }
        rooms.get(roomId).get('messages').push(obj);
        ws.to(roomId).emit('ROOM:NEW_MESSAGE', obj);
    });

    ws.on('disconnect', () => {
        rooms.forEach((values, roomId) => {
            if (values.get('users').delete(ws.id)) {
                const users = [...rooms.get(roomId).get('users').values()];
                ws.broadcast.to(roomId).emit('ROOM:SET_USERS', users);
            }
        });
    });
});

server.listen('8080', (error) => {
    if (error) {
        throw Error(error)
    }
    console.log('The server is running')
});

