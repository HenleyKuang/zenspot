﻿var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');
//var linkService = require('services/link.service');

// routes
router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.get('/current', getCurrentUser);
//router.get('/setlink', linkUserParking);
//router.get('/getlinks', getUserLinks);
router.put('/:_id', updateUser);
router.delete('/:_id', deleteUser);

module.exports = router;

function authenticateUser(req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function (token) {
            if (token) {
                // authentication successful
                res.send({ token: token });
            } else {
                // authentication failed
                res.status(401).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function registerUser(req, res) {
    userService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentUser(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
			delete req.session.token;
            res.status(400).send(err);
        });
}

function updateUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    }

	userService.update(userId, req.body)
	.then(function () {
		res.sendStatus(200);
	})
	.catch(function (err) {
		res.status(400).send(err);
	});
}

/*
function linkUserParking(req, res) {
    var userId = req.user.sub;
    if (req.query._uid !== userId) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    }

	linkService.setLink(userId, req.query._pid)
	.then(function () {
		res.sendStatus(200);
	})
	.catch(function (err) {
		res.status(400).send(err);
	});
}

function getUserLinks(req, res) {
    var userId = req.user.sub;
    if (req.query._uid !== userId) {
        // can only update own account
        return res.status(401).send('You can only get links for your own account');
    }

	linkService.getLinks(userId)
	.then(function (parking) {
		res.send(parking);
	})
	.catch(function (err) {
		res.status(400).send(err);
	});
}
*/

function deleteUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only delete own account
        return res.status(401).send('You can only delete your own account');
    }

    userService.delete(userId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}