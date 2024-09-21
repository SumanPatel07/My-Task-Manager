const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
// const { mongoose } = require('./db/mongoose');
const { dbSERVER } = require('./db/mongoose');
const { List, Task, User } = require('./db/models');
const jwt = require('jsonwebtoken');
const authRouter = require('./db/routes/auth');

const PORT = process.env.PORT

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRouter); // Setup routes for authentication

// Middleware for handling CORS headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");
    res.header('Access-Control-Expose-Headers', 'x-access-token, x-refresh-token');
    next();
});

// Middleware to check for valid JWT access token
let authenticate = (req, res, next) => {
    let token = req.header('x-access-token');
    if (!token) {
        console.log("No token provided.");
        return res.status(401).send({ error: 'Access token is required.' });
    }

    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
        if (err) {
            console.log("Token verification failed:", err);
            return res.status(401).send({ error: 'Invalid access token.' });
        }
        req.user_id = decoded._id;
        next();
    });
};

// Middleware to verify refresh token session
let verifySession = (req, res, next) => {
    let refreshToken = req.header('x-refresh-token');
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            return Promise.reject({ 'error': 'User not found. Make sure that the refresh token and user id are correct' });
        }

        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            next();
        } else {
            return Promise.reject({ 'error': 'Refresh token has expired or the session is invalid' });
        }

    }).catch((e) => {
        res.status(401).send(e);
    });
};

/* ROUTE HANDLERS */

/* LIST ROUTES */
app.get('/lists', authenticate, (req, res) => {
    List.find({ _userId: req.user_id }).then((lists) => {
        res.send(lists);
    }).catch((e) => {
        res.send(e);
    });
});

app.get('/lists/:listId', authenticate, (req, res) => {
    const { listId } = req.params;
    if (!dbSERVER.isValidObjectId(listId)) {
        return res.status(400).send({ error: 'Invalid list ID format' });
    }
    List.findOne({ _id: listId, _userId: req.user_id })
        .then(list => {
            if (!list) {
                console.error(`List with ID ${listId} not found for user ${req.user_id}`);
                return res.status(404).send({ error: 'List not found' });
            }
            res.send(list);
        })
        .catch(error => {
            console.error(`Error fetching list with ID ${listId}:`, error);
            res.status(400).send({ error: 'Error fetching list' });
        });
});

app.post("/lists", authenticate, (req, res) => {
    let title = req.body.title;
    let newList = new List({
        title,
        _userId: req.user_id
    });
    newList.save().then((listDoc) => {
        res.send(listDoc);
    });
});

app.patch('/lists/:id', authenticate, (req, res) => {
    List.findOneAndUpdate({ _id: req.params.id, _userId: req.user_id }, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'updated successfully' });
    });
});

app.delete('/lists/:id', authenticate, (req, res) => {
    console.log("Attempting to delete list with ID:", req.params.id);
    List.findByIdAndDelete({ _id: req.params.id, _userId: req.user_id }).then((removedListDoc) => {
        console.log("Removed document:", removedListDoc);
        if (!removedListDoc) {
            return res.status(404).send({ error: 'List not found' });
        }
        res.send(removedListDoc);
        deleteTasksFromList(removedListDoc._id);
    }).catch((e) => {
        console.error("Error deleting list:", e);
        if (!res.headersSent) {
            res.status(400).send(e);
        }
    });
});

app.get("/lists/:listId/tasks", authenticate, (req, res) => {
    Task.find({ _listId: req.params.listId }).then((tasks) => {
        res.send(tasks);
    });
});

app.get('/lists/:listId/tasks/:taskId', authenticate, (req, res) => {
    Task.findOne({ _id: req.params.taskId, _listId: req.params.listId })
        .then((task) => {
            res.send(task);
        });
});

app.post('/lists/:listId/tasks', authenticate, (req, res) => {
    List.findOne({ _id: req.params.listId, _userId: req.user_id })
        .then((list) => {
            if (list) {
                let newTask = new Task({
                    title: req.body.title,
                    _listId: req.params.listId
                });
                newTask.save().then((newTaskDoc) => {
                    res.send(newTaskDoc);
                });
            } else {
                res.sendStatus(404);
            }
        });
});

app.patch('/lists/:listId/tasks/:taskId', authenticate, (req, res) => {
    List.findOne({ _id: req.params.listId, _userId: req.user_id })
        .then((list) => {
            if (list) {
                return Task.findOneAndUpdate(
                    { _id: req.params.taskId, _listId: req.params.listId },
                    { $set: req.body }
                ).then(() => {
                    res.send({ message: 'Updated successfully.' });
                }).catch((error) => {
                    console.error('Error updating task:', error);
                    res.sendStatus(500);
                });
            } else {
                res.sendStatus(404);
            }
        }).catch((error) => {
            console.error('Error finding list:', error);
            res.sendStatus(500);
        });
});

app.delete('/lists/:listId/tasks/:taskId', authenticate, (req, res) => {
    List.findOne({ _id: req.params.listId, _userId: req.user_id })
        .then((list) => {
            if (list) {
                Task.findOneAndDelete({ _id: req.params.taskId, _listId: req.params.listId })
                    .then((removedTaskDoc) => {
                        res.send(removedTaskDoc);
                    });
            } else {
                res.sendStatus(404);
            }
        });
});

/* USER ROUTES */
app.post('/users', (req, res) => {
    let body = req.body;
    User.findOne({ email: body.email }).then((existingUser) => {
        if (existingUser) {
            return res.status(400).send({ error: 'This email is already in use.' });
        }
        let newUser = new User(body);
        return newUser.save().then(() => {
            return newUser.createSession();
        }).then((refreshToken) => {
            return newUser.generateAccessAuthToken().then((accessToken) => {
                return { accessToken, refreshToken };
            });
        }).then((authTokens) => {
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(newUser);
        });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.post('/users/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            return user.generateAccessAuthToken().then((accessToken) => {
                return { accessToken, refreshToken };
            });
        }).then((authTokens) => {
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/users/me/access-token', verifySession, (req, res) => {
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

// Helper function to delete all tasks in a list
let deleteTasksFromList = (_listId) => {
    Task.deleteMany({ _listId }).then(() => {
        console.log("Tasks from " + _listId + " were deleted!");
    });
};

// app.listen(3000, () => {
//     console.log("Server is listening on port 3000");
// });

const server = () => {
    dbSERVER()
    app.listen(PORT, () => {
        console.log('listening to port',PORT);
        
    })
}
server()
