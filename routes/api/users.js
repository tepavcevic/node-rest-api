const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/users');
const ROLES_LIST = require('../../config/rolesList');
const verifyRoles = require('../../middleware/verifyRoles');


router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
    .put(verifyRoles(ROLES_LIST.Admin), usersController.updateUser)
    .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

module.exports = router;