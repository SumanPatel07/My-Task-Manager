// ./models/user.model.js
const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// JWT Secret - should be stored in environment variables for security
const jwtSecret = process.env.JWT_SECRET || "51778657246321226641fsdklafjasdkljfsklfjd7148924065";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    sessions: [{
        token: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Number,
            required: true
        }
    }]
});

// *** Instance methods ***

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    // Return the document except the password and sessions (these shouldn't be made available)
    return _.omit(userObject, ['password', 'sessions']);
};

UserSchema.methods.generateAccessAuthToken = function () {
    const user = this;
    return new Promise((resolve, reject) => {
        // Create the JSON Web Token and return that
        jwt.sign({ _id: user._id.toHexString() }, jwtSecret, { expiresIn: "15m" }, (err, token) => {
            if (!err) {
                resolve(token);
            } else {
                console.error('JWT Generation Error:', err);
                reject('Failed to generate access token.');
            }
        });
    });
};

UserSchema.methods.generateRefreshAuthToken = function () {
    // Generates a 64-byte hex string without saving it to the database
    return new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (!err) {
                let token = buf.toString('hex');
                resolve(token);
            } else {
                console.error('Refresh Token Generation Error:', err);
                reject('Failed to generate refresh token.');
            }
        });
    });
};

UserSchema.methods.createSession = function () {
    let user = this;

    return user.generateRefreshAuthToken().then((refreshToken) => {
        return saveSessionToDatabase(user, refreshToken);
    }).then((refreshToken) => {
        // Saved to database successfully, return the refresh token
        return refreshToken;
    }).catch((e) => {
        console.error('Failed to save session to database:', e);
        return Promise.reject('Failed to save session to database.');
    });
};

/* MODEL METHODS (static methods) */

// Static method inside UserSchema
UserSchema.statics.getJWTSecret = function () {
    return jwtSecret; // Ensure jwtSecret is correctly defined in the scope of the model
};


UserSchema.statics.findByIdAndToken = function (_id, token) {
    // Finds user by id and token - used in auth middleware (verifySession)
    const User = this;
    return User.findOne({
        _id,
        'sessions.token': token
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    let User = this;
    return User.findOne({ email }).then((user) => {
        if (!user) return Promise.reject('Invalid email or password.');

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject('Invalid email or password.');
                }
            });
        });
    });
};

UserSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
    let secondsSinceEpoch = Date.now() / 1000;
    return expiresAt <= secondsSinceEpoch;
};

/* MIDDLEWARE */
// Before a user document is saved, this code runs
UserSchema.pre('save', function (next) {
    let user = this;
    let costFactor = 10;

    if (user.isModified('password')) {
        // If the password field has been edited/changed then run this code.
        // Generate salt and hash password
        bcrypt.genSalt(costFactor, (err, salt) => {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);
                
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

/* HELPER METHODS */
let saveSessionToDatabase = (user, refreshToken) => {
    // Save session to database
    return new Promise((resolve, reject) => {
        let expiresAt = generateRefreshTokenExpiryTime();

        user.sessions.push({ token: refreshToken, expiresAt });

        user.save()
            .then(() => resolve(refreshToken))
            .catch((e) => {
                console.error('Error saving session:', e);
                reject('Failed to save session.');
            });
    });
};

let generateRefreshTokenExpiryTime = () => {
    let daysUntilExpire = 10; // Refresh token expiry time in days
    let secondsUntilExpire = daysUntilExpire * 24 * 60 * 60;
    return Date.now() / 1000 + secondsUntilExpire;
};

const User = mongoose.model('User', UserSchema);

module.exports = { User };
