
//gửi lên server 
var socket = io('http://localhost:8000/')


socket.on('server-send-register-fail', () => {
    alert('username tồn tại')
})

socket.on('server-send-register-success', (data) => {
    $('#userCurrent').html(data)
    $('#login-form').hide(2000)
    $('#chat-form').show(1000)
})

socket.on('server-send-list-user', (data) => {
    $('#content').html("")
    data.forEach(element => {
        $('#content').append("<div class='userOnline'> " + element + "<div>")
    })
})


socket.on('server-send-mess', (data) => {
    $('#listChat').append("<div class='list-mess'>" + data.username + ':' + data.mess + "</div>")

})

socket.on('someone-focusin', (data) => {
    $('#user-focus').html(data + " typing ... ")
})

socket.on('someone-focusout', () => {
    $('#user-focus').html('')
})


$(document).ready(() => {
    $('#login-form').show()
    $('#chat-form').hide()

    $('#btnRegister').click(() => {
        socket.emit('client-send-username', $('#txtUsername').val())
    })

    $('#btnLogout').click(() => {
        socket.emit('client-logout')
        $('#chat-form').hide(2000)
        $('#login-form').show(1000)
    })

    $('#btnChat').click(() => {
        socket.emit('user-send-mess', $('#txtChat').val())
    })

    $('#txtChat').focusin(() => {
        socket.emit('user-focusin')
    })

    $('#txtChat').focusout(() => {
        socket.emit('user-focusout')
    })
})