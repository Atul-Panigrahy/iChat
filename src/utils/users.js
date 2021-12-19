const users = []

//add user
const addUser = ({ id, username, room}) => {

    if(users.length == 2){
        return {
            error: 'Room is already occupied!!!\nCreate or join another room.'
        }
    }

    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if(!username || !room ){
        return {
            error: 'Username and room are required!!!'
        }
    }


    ///check for existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    //validate username
    if(existingUser) {
        return {
            error: 'Username is in use'
        }
    }

    //store the user
    const user = {id, username, room}
    users.push(user)
    return {user}
}


//remove user
const removeUser = (id) => {
    
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if(index != -1){
        return users.splice(index, 1)[0] // remove the item from the array by proviving the index
    }

}


//get User
const getUser = (id) => {

    return users.find((user)=>{
        return user.id === id
    })
}



//get users in room
const getusersInRoom = (room) => {

    room = room.trim().toLowerCase()

    return users.filter((user) => {
        return user.room === room
    })

}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getusersInRoom
}