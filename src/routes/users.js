const express = require('express')
const UserController = require('../controller/users.js')
const router = express.Router()

// read get 
router.get('/', UserController.getAllUsers)

// create post 
router.post('/', UserController.createNewUser)

// update path 
router.patch('/:idUser', UserController.updateUser)

// delete path 
router.delete('/:idUser', UserController.deleteUser)

// get user by id 
router.get('/:idUser', UserController.getUserId)

module.exports = router