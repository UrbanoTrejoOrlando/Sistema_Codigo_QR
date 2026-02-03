const express = require('express');
const router = express.Router();
const {
    getAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin
 } = require ("../controller/controller");

 router.get('/administradores', getAdmins);
 router.get('/administrador/:id', getAdminById);
 router.post('/createadmin', createAdmin);
 router.put('/updaeadmin/:id', updateAdmin);
 router.delete('/deleteadmin/:id', deleteAdmin);

 module.exports = router;
