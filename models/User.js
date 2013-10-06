
module.exports = function(mongoose) {
	
	var UserSchema = new mongoose.Schema({
		date_created: {type:Date, 'default':Date.now},
		email: {type:String},
		birthdate: {type:Date},
		last_login: {type:Date}
	});
	
	var User = mongoose.model('Link',UserSchema);
	
	return User;
}