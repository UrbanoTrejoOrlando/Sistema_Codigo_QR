// scripts/hashPassword.js
const bcrypt = require('bcryptjs');

async function gen() {
  const passAdmin = 'admin123';   // cámbialo
  const passUser = 'user123';     // cámbialo
  const saltRounds = 10;
  const hashAdmin = await bcrypt.hash(passAdmin, saltRounds);
  const hashUser = await bcrypt.hash(passUser, saltRounds);
  console.log('ADMIN HASH:', hashAdmin);
  console.log('USER HASH: ', hashUser);
}
gen();
