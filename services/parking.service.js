var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('parking');

var parking_service = {};

parking_service.getById = getById;
parking_service.getAllParking = getAllParking;
parking_service.create = create;
//parking_service.update = update;
parking_service.delete = _delete;

module.exports = parking_service;

function getById(_id) {
    var deferred = Q.defer();

    db.parking.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getAllParking() {
	var deferred = Q.defer();
	
	db.parking.find({}, { _id: false }).toArray(function(err, collInfos) {
    // collInfos is an array of collection info objects that look like:
    // { name: 'test', options: {} }
		if (err) deferred.reject(err.name + ': ' + err.message);
		if (collInfos) {
			deferred.resolve(collInfos);
		}
		else {
            // user not found
            deferred.resolve();
        }
	});
	return deferred.promise;
}

function create(parkingParam) {
    var deferred = Q.defer();

    // validation (removed because we don't need to validate parking spots
    /*
	db.parking.findOne(
        { username: parkingParam.username },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // username already exists
                deferred.reject('Username "' + parkingParam.username + '" is already taken');
            } else {
                createUser();
            }
        });
	*/
	
	createParking();
	
    function createParking() {
        db.parking.insert(
            parkingParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve(doc);
            });
    }

    return deferred.promise;
}

/*
function update(_id, parkingParam) {
    var deferred = Q.defer();

    // validation
    db.parking.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== parkingParam.username) {
            // username has changed so check if the new username is already taken
            db.parking.findOne(
                { username: parkingParam.username },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: parkingParam.firstName,
            lastName: parkingParam.lastName,
            username: parkingParam.username,
        };

        // update password if it was entered
        if (parkingParam.password) {
            set.hash = bcrypt.hashSync(parkingParam.password, 10);
        }

        db.parking.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}
*/

function _delete(_id) {
    var deferred = Q.defer();

    db.parking.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}