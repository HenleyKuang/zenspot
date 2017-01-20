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

function setLink(userId, pid) {
    var deferred = Q.defer();

        var linkset = {
				_uid: userId,
				_pid: pid
		};
		
        db.link.insert(
            linkset,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });

    return deferred.promise;
}