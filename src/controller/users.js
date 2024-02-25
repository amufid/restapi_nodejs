const { json } = require('express')
const UserModel = require('../models/users.js')

const getAllUsers = async (req, res) => {
   const data = await UserModel.getAllUsers()
   res.json({
      message: 'GET all success',
      data: data
   })
}

const createNewUser = async (req, res) => {
   console.log(req.body)
   const { body } = req

   if (!body.email || !body.name || !body.address) {
      return res.status(400).json({
         message: 'Data belum lengkap!',
         data: null
      })
   }

   try {
      await UserModel.createNewUser(body)
      res.status(201).json({
         message: 'CREATE new user success',
         data: body
      })
   } catch (error) {
      console.log('Create user error')
      res.status(500).json({
         message: 'Server error',
         serverMessage: error,
      })
   }
}

const updateUser = async (req, res) => {
   const { idUser } = req.params
   const { body } = req

   if (!body.email || !body.name || !body.address) {
      return res.status(400).json({
         message: 'Data belum lengkap!',
         data: null
      })
   }

   try {
      await UserModel.updateUser(body, idUser)
      res.json({
         message: 'UPDATE user success',
         data: {
            id: idUser,
            ...body
         },
      })
   } catch (error) {
      console.log('UPDATE user error')
      res.status(500).json({
         message: 'Server error',
         serverMessage: error,
      })
   }
}

const deleteUser = async (req, res) => {
   const { idUser } = req.params

   try {
      await UserModel.deleteUser(idUser)
      res.json({
         message: 'Delete user success',
         data: null
      })
   } catch (error) {
      console.log('DELETE user error')
      res.status(500).json({
         message: 'Server error',
         serverMessage: error,
      })
   }
}

const getUserId = async (req, res) => {
   const { idUser } = req.params
   const data = await UserModel.getUserId(idUser)

   if (data == "") {
      res.json({
         message: 'ID user tidak ada!',
         data: null
      })
   } else {
      res.json({
         message: 'ID user ditemukan',
         data: data
      })
   }
}

module.exports = {
   getAllUsers,
   createNewUser,
   updateUser,
   deleteUser,
   getUserId,
}