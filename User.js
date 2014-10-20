var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');
var User = new Schema({
	skype: String,
	fio: String,
	online: Boolean
});
User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);
