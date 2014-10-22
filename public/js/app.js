
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
socket.on('chatstart', function(chat){
	var $chat = $('.chat .feed');
	chat.map(function(msg){
		return $('<p>').addClass('message')
			.append($('<span class="nick">').text(msg.nick+': '))
			.append($('<span class="text">').text(msg.text));
	}).forEach(function($el){
		$chat.append($el);
	});
});

socket.on('chat', function(msg){
	var $msg = $('<p>').addClass('message')
		.append($('<span class="nick">').text(msg.nick+': '))
		.append($('<span class="text">').text(msg.text));
	$('.chat .feed').append($msg);
});

$(document).on('click', '.chat button', function(){
	var msg = $('.chat input').val();
	if (!msg)
		return;
	socket.emit('chat', msg);
});

$(document).on('change', '.user', function(){
	var data = {
		fio: $('input[name="fio"]').val(),
		skype: $('input[name="skype"]').val(),
		online: $('input[name="online"]').prop('checked')?1:0
	};
	if (!data.fio || !data.skype)
		return;
	$.ajax({
		url: '/update',
		type: 'post',
		data: data,
		success: function(){
			console.log('updates');
		}
	});
});
