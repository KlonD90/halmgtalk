
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


$(document).on('change', '.user', function(){
	$.ajax({
		url: '/update',
		data: {
			fio: $('input[name="fio"]').val(),
			skype: $('input[name="skype"]').val(),
			online: $('input[name="online"]').val()
		},
		success: function(){
			console.log('updates');
		}
	});
});
