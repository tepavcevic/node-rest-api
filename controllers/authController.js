const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../model/User');
const { REFRESH_TOKEN_EXPIRATION } = require('../constants');

const handleLogin = async (req, res) => {
    const { user, password } = req.body;

    if (!user || !password) {
        return res.status(400).json({ "message": "Username and password are required" })
    }

    const foundUser = await User.findOne({ username: user }).exec();

    if (!foundUser) {
        return res.sendStatus(401); //Unauthorized
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) {
        return res.sendStatus(401);
    }

    const roles = Object.values(foundUser.roles);

    const accessToken = jwt.sign(
        {
            "userInfo": {
                "username": foundUser.username,
                "roles": roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1m' }
    );

    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    );

    foundUser.refreshToken = refreshToken;
    const loggedUser = await foundUser.save();

    console.log(loggedUser);

    res.cookie(
        'jwt',
        refreshToken,
        {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: REFRESH_TOKEN_EXPIRATION
        }
    );
    res.json({ accessToken });
}

module.exports = { handleLogin };