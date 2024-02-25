
const dPool = require('../database/db.js')

// Mendapatkan semua data dari tabel users
const getAllUsers = async () => {
   try {
      console.log('GET all users success')
      const result = await dPool.query('SELECT * FROM users');
      return result.rows;
   } catch (error) {
      console.error('Kesalahan menjalankan kueri:', error);
      throw new Error('Terjadi kesalahan saat mendapatkan data pengguna');
   }
};

const createNewUser = async (body) => {
   try {
      console.log('Create new user success')
      const result = await dPool.query(
         `INSERT INTO users (id, name, email, address) 
         VALUES (${body.id}, '${body.name}', '${body.email}', '${body.address}')`
      )
      return result.rows;
   } catch (error) {
      console.error('Kesalahan menjalankan query create user:', error);
      throw new Error('Terjadi kesalahan saat mendapatkan data pengguna');
   }
}

const updateUser = async (body, idUser) => {
   try {
      const result = await dPool.query(
         `UPDATE users 
         SET name='${body.name}', email='${body.email}', address='${body.address}'
         WHERE id=${idUser}`
      );
      console.log('UPDATE user success');
      return result.rows;
   } catch (error) {
      console.error('Kesalahan menjalankan query update user:', error);
      throw new Error('Terjadi kesalahan');
   }
};

const deleteUser = (idUser) => {
   const result = dPool.query(
      `DELETE FROM users WHERE id=${idUser}`
   )
   return dPool.rows
}

const getUserId = async (idUser) => {
   try{
      const result = await dPool.query(
         `SELECT * FROM users WHERE id=${idUser}`
      )
      return result.rows
   }catch (error) {
      console.log('GET id error')
   }
}

module.exports = {
   getAllUsers,
   createNewUser,
   updateUser,
   deleteUser,
   getUserId,
};