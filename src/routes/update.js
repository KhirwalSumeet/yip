var async = require('async');
var update = {};
var db = {};
var Promise = require('bluebird');

update.teachers = function(req, res, next) {
	Promise.resolve(req.body).then(validateTeacherData).then(function(teacher) {
		return db.User.findOne({ where: { email: req.email }}).then(function(teacherObj) {
			Object.keys(teacher).forEach(function(key) {
				teacherObj[key] = teacher[key];
			})
			return teacherObj.save();
		});
	}).then(function() {
		res.sendStatus(200);
	}).catch(function(err) {
		next(err);
	})
}

update.schools = function(req, res, next) {
	Promise.resolve(req.body).then(validateSchoolData).then(function(school) {
		return db.User.findOne({ where: { email: req.email }}).then(function(teacherObj){
			return db.School.findOne({ where: { id: teacherObj.schoolId }}).then(function(schoolObj) {
				Object.keys(school).forEach(function(key) {
					schoolObj[key] = school[key];
				})
				return schoolObj.save();
			});
		})
	}).then(function() {
		res.sendStatus(200);
	}).catch(function(err) {
		next(err);
	})
}

update.teams = function(req, res, next) {
	// [ teams ]
	var teams = req.body;
	db.User.findOne({ where: { email: req.email }}).then(function(userObj) {
		var tasks = [];
		teams.forEach(function(team) {
			var task = (function(team) {
				return function(cb) {
					if(!team.id) {
						var teamObj = {
							name: team.name,
							students: JSON.stringify(team.students),
							schoolId: userObj.schoolId
						}
						db.Team.create(teamObj).then(function() {
							cb();
						}).catch(function(err) {
							cb(err);
						})
					} else {
						db.Team.findOne({ where: { schoolId: userObj.schoolId, id: team.id }}).then(function(teamObj){
							teamObj.name = team.name;
							teamObj.students = JSON.stringify(team.students);
							return teamObj.save().then(function() {
								cb();
							})
						}).catch(function(err) {
							cb(err);
						})
					}
				}
			})(team);
			tasks.push(task);
		})
		async.parallel(tasks, function(err) {
			if(err)
				next(err);
			else
				res.sendStatus(200);
		})
	}).catch(function(err) {
		next(err);
	})
}

function validateTeacherData(details) {
	// If something is wrong
	// throw new Error('error message');
	var teacherObj = {};
	if(details.email || details.name)
		throw new Error('Cannot be edited');
	if(details.phone && !(details.phone.length == 10 && !isNaN(details.phone)))
		throw new Error('Improper phone number');
	if(details.emergency && !(details.emergency.length == 10 && !isNaN(details.emergency)))
		throw new Error('Improper phone number');
	teacherObj = details;
	return teacherObj;
}

function validateSchoolData(details) {
	var schoolObj = {};
	var keys = ['address', 'phone'];
	schoolObj.principal = details.principal.name;
	schoolObj.principalPhone = details.principal.phone;

	if(details.phone && !(details.phone.length == 10 && !isNaN(details.phone)))
		throw new Error('Improper phone number');

	if(schoolObj.principalNumber && !(schoolObj.principalNumber.length == 10 && !isNaN(schoolObj.principalNumber)))
		throw new Error('Improper phone number');
	
	keys.forEach(function(key) {
		schoolObj[key] = details[key];
	})

	return schoolObj;
}

module.exports = function(sequelize) {
	db = sequelize;
	return update;
}