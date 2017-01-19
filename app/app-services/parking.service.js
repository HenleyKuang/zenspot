(function () {
    'use strict';

    angular
        .module('app')
        .factory('ParkingService', Service);

    function Service($http, $q) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get('/api/parking').then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get('/api/parking/' + _id).then(handleSuccess, handleError);
        }

        function Create(parking) {
            return $http.post('/api/parking', parking).then(handleSuccess, handleError);
        }

        function Update(parking) {
            return $http.put('/api/parking/' + parking._id, parking).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/api/parking/' + _id).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
