const Employee = require('../model/Employee');

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find();

    if (!employees) {
        return res.sendStatus(204);
    }

    res.json(employees);
}

const createNewEmployee = async (req, res) => {
    if (!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({ 'message': "First and last name are required." });
    }

    try {
        const newEmployee = await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });

        console.log(newEmployee);

        res.status(201).json(newEmployee);
    } catch (error) {
        console.error(error);
    }

}

const updateEmployee = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': "ID parameter for the employee is required." });
    }

    const employee = await Employee.findById(req.body.id);

    if (!employee) {
        return res.status(204).json({ "message": `No employee with matching id for ${req.body.id}.` });
    }

    if (req.body?.firstname) {
        employee.firstname = req.body.firstname;
    }
    if (req.body?.lastname) {
        employee.lastname = req.body.lastname;
    }

    const updatedEmployee = await employee.save();

    res.json(updatedEmployee);
}

const deleteEmployee = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': "ID parameter for the employee is required." });
    }

    const employee = await Employee.findById(req.body.id);

    if (!employee) {
        return res.status(204).json({ "message": `No employee with matching id for ${req.body.id}.` });
    }

    const result = await employee.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getEmployee = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ 'message': "ID parameter for the employee is required." });
    }

    const employee = await Employee.findById(req.params.id);

    if (!employee) {
        return res.status(204).json({ "message": `No employee with matching id for ${req.params.id}.` });
    }

    res.json(employee);
}

module.exports = { getAllEmployees, createNewEmployee, updateEmployee, deleteEmployee, getEmployee }