const bcrypt = require('bcrypt');

const User = require('../model/User');

const getAllUsers = async (req, res) => {
    const users = await User.find();

    if (!users) {
        return res.sendStatus(204);
    }

    res.json(users);
}

const updateUser = async (req, res) => {
    try {
        if (!req?.body?.id) {
            return res.status(400).json({ 'message': "ID parameter for the user is required." });
        }

        const user = await User.findById(req.body.id);

        if (!user) {
            return res.status(204).json({ "message": `No user with matching id for ${req.body.id}.` });
        }
        if (req.body?.username) {
            user.username = req.body.username;
        }
        if (req.body?.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await user.save();

        console.log(updatedUser);
        res.status(201).json({ "success": `User ${user.username} password changed.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": error.message });
    }
}

const deleteUser = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': "ID parameter for the user is required." });
    }

    const user = await User.findById(req.body.id);

    if (!user) {
        return res.status(204).json({ "message": `No user with matching id for ${req.body.id}.` });
    }

    const result = await User.deleteOne({ _id: req.body.id });
    res.json(result);
}

module.exports = { getAllUsers, updateUser, deleteUser };