const bcrypt = require('bcrypt');

const User = require('../model/User');

const handleNewUser = async (req, res) => {
    const { user, password } = req.body;

    if (!user || !password) {
        return res.status(400).json({ "message": "Username and password are required" })
    }

    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) {
        return res.sendStatus(409); //Conflict
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            "username": user,
            "password": hashedPassword
        });

        console.log(newUser);
        res.status(201).json({ "success": `New user ${user} created.` });
    } catch (error) {
        res.status(500).json({ "message": error.message });
    }
}

module.exports = { handleNewUser };