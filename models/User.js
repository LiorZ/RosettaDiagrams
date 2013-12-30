
module.exports = function(mongoose) {
	var findOrCreate = require('mongoose-findorcreate')

	var UserSchema = new mongoose.Schema({
		date_created: {type:Date, 'default':Date.now},
		email: {type:String},
		birthdate: {type:Date},
		logins: [{type:Date}],
		open_id: {type:String},
		name: {
			first: {type:String},
			last: {type: String}
		}
	});
	
	UserSchema.plugin(findOrCreate);
	
	var User = mongoose.model('User',UserSchema);
	
	return User;
}