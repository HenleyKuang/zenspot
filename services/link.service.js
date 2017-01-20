var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('link');

var service = {};

service.setLink = setLink;

module.exports = service;

function setLink(_uid, _pid) {
    var deferred = Q.defer();

        var linkset = {
				_uid: _uid,
				_pid: _pid
		};
		
        db.link.insert(
            linkset,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });

    return deferred.promise;
}

function getLinks(_uid) {
    var deferred = Q.defer();

        db.parking.find( {_uid: _uid} ).toArray(function(err, collInfos) {
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