//this client side js file use the socket.io js file
const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')


//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true }) /// takes the query string by default browser provided location.search 


//adding autoscrolling feature
const autoscroll = () => {
    //new messge
    const $newMessage = $messages.lastElementChild


    //height of new message
    const newMessageStyles = getComputedStyle($newMessage) // margin bottom etc spaces calculation
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight = $messages.offsetHeight

    //height of messages constainer
    const containerHeight = $messages.scrollHeight

    //how far have i scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}



socket.on('message', (message) => {
    console.log(message);

    // this is going to store final data going to be rendered to web-page
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,/// mustache will render that message to the end of div tag
        createdAt: moment(message.createdAt).format('MMMM Do YYYY, h:mm:ss A')
    })

    $messages.insertAdjacentHTML('beforeend', html) // the newer message will be situated before the div tag ends 
    autoscroll()

})


socket.on('roomData', ({ room, users }) => {

    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault() //to prevent defult full page refresh

    //disabling the button till the result is sent
    $messageFormButton.setAttribute('disabled', 'disabled')


    // const message = document.querySelector('input').value // another alternative and safe way is....
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {

        //enabling the button after the message is sent
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''  //clear input after message been sent to server
        $messageFormInput.focus() // refocusing the cursor in the input box

        if (error) {
            return console.log(error);
        }

        console.log(`The message was delivered.`)
    })


})


socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})