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
parking_service.searchParking = searchParking;
parking_service.create = create;
parking_service.update = update;
parking_service.delete = _delete;

module.exports = parking_service;

function getById(_id) {
    var deferred = Q.defer();

    db.parking.findById(_id, function (err, parking) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (parking) {
            // return user (without hashed password)
            deferred.resolve(parking);
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function searchParking(q) {
	var deferred = Q.defer();
	
	db.parking.find(q).toArray(function(err, collInfos) {
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


function update(_id, parkingParam) {
    var deferred = Q.defer();

    // validation
    db.parking.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);
		
        updateParking();
    });
	
	parkingParam = _.omit(parkingParam, '_id');
	
    function updateParking() {
        db.parking.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: parkingParam },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}


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