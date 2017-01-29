var config = require('config.json');
var express = require('express');
var router = express.Router();
var parkingService = require('services/parking.service');

// routes
router.put('/add', addParking);
router.get('/search', searchParking);
router.put('/:_id', updateParking);
router.delete('/:_id', deleteParking);

module.exports = router;


function addParking(req, res) {
    parkingService.create(req.body)
        .then(function (doc) {
			if( doc )
				res.send(doc);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function searchParking(req, res) {
	res.addHeader("Access-Control-Allow-Origin", "*");
	//check if searching by id
	var _pid = req.query._id;
	//console.log( _pid );
	if( _pid )
	{
		parkingService.getById(_pid)
			.then(function (parking) {
				if (parking) {
					res.send(parking);
				} else {
					res.sendStatus(404);
				}
			})
			.catch(function (err) {
				res.status(400).send(err);
			});
	}
	else//else do a search by query string
	{
		var search_q = req.query.uid ? {
			//create search query using parameters passed through req.query
			uid: req.query.uid
		} : {};
		
		parkingService.searchParking( search_q )
			.then(function (parking) {
				if (parking) {
					res.send(parking);
				} else {
					res.sendStatus(404);
				}
			})
			.catch(function (err) {
				res.status(400).send(err);
			});
	}
}

function updateParking(req, res) {
    
	/* Need to create a function to check if the correct user is modifying their own parking spot (to prevent hackers)
	
	var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only update own account
        return res.status(401).send('You can only update your own parking spots');
    }
	*/

    parkingService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function deleteParking(req, res) {
	/* Need to create a function to check if the correct user is modifying their own parking spot (to prevent hackers)
	
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only delete own account
        return res.status(401).send('You can only delete your own parking spots');
    }
	*/

    parkingService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}