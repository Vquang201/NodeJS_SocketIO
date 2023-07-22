const express = require('express')
const app = express()


//tạo 1 máy chủ độc lập
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server)


app.use(express.static('public'))
app.set('view engine', 'ejs');
app.set('views', './views')



const arrayUsers = []
// lắng nghe socket 
io.on('connection', (socket) => {
    console.log('user connect : ' + socket.id)

    socket.on('client-send-username', (data) => {
        console.log(data);
        if (arrayUsers.indexOf(data) >= 0) {
            console.log(arrayUsers)
            //fail 
            socket.emit('server-send-register-fail')

        } else {
            // success
            arrayUsers.push(data)
            socket.username = data
            socket.emit('server-send-register-success', data)
            io.sockets.emit('server-send-list-user', arrayUsers)
        }
    })

    socket.on('client-logout', () => {
        arrayUsers.splice(
            arrayUsers.indexOf(socket.username),
            1
        )
        socket.broadcast.emit('server-send-list-user', arrayUsers)
    })

    socket.on('user-send-mess', (data) => {
        io.sockets.emit('server-send-mess', {
            username: socket.username,
            mess: data
        })
    })

    socket.on('user-focusin', () => {
        socket.broadcast.emit('someone-focusin', socket.username)
    })

    socket.on('user-focusout', () => {
        socket.broadcast.emit('someone-focusout')

    })
})



app.get('/', (req, res) => {
    res.render('home')
})

server.listen(8000, () => {
    console.log('Sever is running ...')
})
