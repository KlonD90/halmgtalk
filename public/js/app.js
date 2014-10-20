
var myApp = angular.module('myApp', ['btford.socket-io']);

var socket = io();
myApp.controller('ListController', ['$scope', function($scope){
	socket.emit('init', function(){
	});
	socket.on('init', function(){
	});
	socket.on('add', function(){
	});
}]);
