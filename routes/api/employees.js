const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/employees');
const ROLES_LIST = require('../../config/rolesList');
const verifyRoles = require('../../middleware/verifyRoles');


router.route('/')
    .get(employeeController.getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeeController.createNewEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeeController.updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin), employeeController.deleteEmployee);

router.route('/:id')
    .get(employeeController.getEmployee);

module.exports = router;