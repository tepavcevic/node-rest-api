const User = require('../model/User');

const handleLogout = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(204); //No content
    }

    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
        res.clearCookie(
            'jwt',
            refreshToken,
            {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
            }
        );
        return res.sendStatus(204); //No content
    }

    foundUser.refreshToken = '';
    const loggedOutUser = await foundUser.save();

    console.log(loggedOutUser);

    res.clearCookie(
        'jwt',
        refreshToken,
        {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        }
    );
    res.sendStatus(204);
}

module.exports = { handleLogout };