const express = require('express');
const router = express.Router();
const { User } = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Middleware to verify session - Define this before using it in routes
const verifySession = (req, res, next) => {
    const refreshToken = req.header('x-refresh-token');
    const _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken)
        .then((user) => {
            if (!user) {
                return Promise.reject({ error: 'User not found. Make sure that the refresh token and user id are correct' });
            }

            req.user_id = user._id;
            req.userObject = user;
            req.refreshToken = refreshToken;

            const isSessionValid = user.sessions.some(
                (session) => session.token === refreshToken && !User.hasRefreshTokenExpired(session.expiresAt)
            );

            if (isSessionValid) {
                next();
            } else {
                return Promise.reject({ error: 'Refresh token has expired or the session is invalid' });
            }
        })
        .catch((error) => {
            res.status(401).send(error);
        });
};

// Verify token route
router.get('/verify-token', (req, res) => {
    const token = req.header('x-access-token');

    if (!token) {
        return res.status(400).send({ error: 'Access token is required.' });
    }

    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
        if (err) {
            console.error("Token verification failed:", err);
            return res.status(401).send({ error: 'Invalid access token.' });
        }

        // If the token is valid, send a success response
        res.send({ message: 'Token is valid.', userId: decoded._id });
    });
});

// Register a new user
router.post('/register', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }).then((existingUser) => {
        if (existingUser) {
            return res.status(400).send({ error: 'This email is already in use.' });
        }
        const newUser = new User({ email, password });
        newUser.save()
            .then(() => newUser.createSession())
            .then((refreshToken) => newUser.generateAccessAuthToken().then((accessToken) => ({ accessToken, refreshToken })))
            .then((authTokens) => {
                res
                    .header('x-refresh-token', authTokens.refreshToken)
                    .header('x-access-token', authTokens.accessToken)
                    .send(newUser);
            })
            .catch((error) => res.status(400).send(error));
    });
});

// Login an existing user
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    User.findByCredentials(email, password)
        .then((user) => user.createSession())
        .then((refreshToken) => user.generateAccessAuthToken().then((accessToken) => ({ accessToken, refreshToken })))
        .then((authTokens) => {
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        })
        .catch((error) => res.status(400).send({ error: 'Invalid login credentials.' }));
});

// Get a new access token using a refresh token - using the verifySession middleware defined above
router.get('/me/access-token', verifySession, (req, res) => {
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

// Logout route
router.post('/logout', verifySession, (req, res) => {
    const { userObject, refreshToken } = req;

    userObject.removeSession(refreshToken)
        .then(() => {
            res.status(200).send({ message: 'Logged out successfully.' });
        })
        .catch((e) => {
            res.status(400).send({ error: 'Failed to log out.' });
        });
});


module.exports = router;
