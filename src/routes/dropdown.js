var data = {
	'Jamsehed' : [
		{
			name : 'jdshajkd',
			contact: 'dsauda',
			email : 'dasgjdag',
			address : 'jshjasdhjasdhj'
		},
		{
			name : 'jdshajkd',
			contact: 'dsauda',
			email : 'dasgjdag',
			address : 'jshjasdhjasdhj'
		},
		{
			name : 'jdshajkd',
			contact: 'dsauda',
			email : 'dasgjdag',
			address : 'jshjasdhjasdhj'
		}
	],
	'Name' : [

	]
}

var dropdown = {};

dropdown.getSchools = function(req, res, next) {
	var city = req.body.city;
	var schoolDetails = data[city];
	res.json(schoolDetails);
}

// dropdown.schools(req);

dropdown.getCity = function(req, res, next) {
	res.json(Object.keys(data));
}

module.exports = function() {
	return dropdown;
}