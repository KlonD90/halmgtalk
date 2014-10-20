
var socket = io();
angular
	.module('halmgtalk', [])
	.controller('ListController', ['$scope', function($scope){
		$scope.items = [];
		socket.on('init', function(users){
			$scope.items = users;
			$scope.$apply();
		});
		socket.on('update', function(users){
			$scope.items = users;
			$scope.$apply();
		});
	}]);


$(document).on('change', '.user', function(){
	$.ajax({
		url: '/update',
		type: 'post',
		data: {
			fio: $('input[name="fio"]').val(),
			skype: $('input[name="skype"]').val(),
			online: $('input[name="online"]').prop('checked')?1:0
		},
		success: function(){
			console.log('updates');
		}
	});
});
