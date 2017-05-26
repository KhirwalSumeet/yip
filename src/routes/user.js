const Promise = require('bluebird');
const express = require('express');
const crypt   = require(__dirname + '/../lib/encryption');
const email   = require(__dirname + '/../lib/email');

var user = {};
var db = {};

function validateUserData(data) {
	var userObj = {};
	userObj = {
		email: data.email,
		password: data.password,
		name: data.name,
		schoolId: data.schoolName 
	}
	return userObj;
}

user.createUser = function(req, res, next) {
	Promise.resolve(validateUserData(req.body)).then(function(userObj) {
		return db.School.create({ name: userObj.schoolId }).then(function(school) {
			userObj.schoolId = school.id;
			return userObj;
		})
	}).then(function(userObj) {
		userObj.password = crypt.encrypt(userObj.password);
		return db.User.create(userObj);
	}).then(function(user) {
		req.user = user;
		var uniqueUrl = 'http://www.barc.iitkgp.ac.in/yip/verification/' + crypt.encrypt(user.email);
		email.sendVerification(user.email, uniqueUrl, function(err) {});
		next();
	}).catch(function(err) {
		next(err);
	})
}

user.checkUser = function(req, res, next){
	Promise.resolve(req.body).then(function(userObj){
		return db.User.findOne({ where: {email : userObj.email} }).then(function(userData){
			if(req.body.password == crypt.decrypt(userData.password)){
				req.user = userData;
			}
			next();
		})
	}).catch(function(err){
		next(new Error('User not found. Check credentials.'));
	})
}

user.validateUserEmail = function(req, res, next) {
	var email = crypt.decrypt(req.email);
	db.User.findOne({ where: { email: email }}).then(function(user) {
		if(!user)
			throw new Error('Invalid url');
		user.isVerified = true;
		return user.save();
	}).then(function() {
		next();
	}).catch(function(err) {
		next(err);
	})
}

user.getAllData = function(req, res, next) {
	if(!req.email)
		next(new Error('User not found!'));
	var data = {};
	db.User.findOne({ where: { email: req.email }}).then(function(user) {
		if(!user)
			throw new Error('User not found!');
		data.user = {};
		data.user.email = user.email;
		data.user.name = user.name;
		data.user.phone = user.phone;
		data.user.address = user.address;
		data.user.emergency = user.emergency;
		data.user.isVerified = user.isVerified;
		return Promise.all([
			db.School.findOne({ where: { id: user.schoolId }}).then(function(school) {
				data.school = {};
				data.school.name = school.name;
				data.school.address = school.address;
				data.school.phone = school.phone;
				data.school.email = school.email;
				data.school.principal = {};
				data.school.principal.name = school.principal;
				data.school.principal.phone = school.principalPhone;
			}),
			db.Team.findAll({ where: { schoolId: user.schoolId }}).then(function(teams) {
				data.teams = [];
				teams.forEach(function(team) {
					data.teams.push({
						name: team.name,
						students: JSON.parse(team.students),
						id: team.id
					})
				})		
			})
		]);
	}).then(function(){
		res.json(data);
	}).catch(function(err) {
		next(err);
	})
}

// var data = {
// 	user: {
// 		email: 'mak1910@outlook.com',
// 		name: 'Mridul Kothari',
// 		phone: '0987654321',
// 		address: 'B6, Tube Nildih, Jamshedpur',
// 		emergency: '1561561564'
// 	},
// 	school: {
// 		name: 'Little Flower School',
// 		address: 'Telco Colony, Jamshedpur - 831003', 
// 		phone: '06576451506',
// 		email: 'lfsjsr@gmail.com',
// 		principal: {
// 			name: 'Sister Hilda',
// 			phone: '1234567890'
// 		}
// 	},
// 	teams : [
// 		{
// 			name: 'Mumbai Indians',
// 			students: [
// 				{
// 					name: 'Mridul Kothari', 
// 					standard: 9, 
// 					guardian: 'Ajit Kothari',
// 					phone: '9431953239'
// 				},
// 				{
// 					name: 'Mridul Kothari', 
// 					standard: 9, 
// 					guardian: 'Ajit Kothari',
// 					phone: '9431953239'
// 				},
// 				{
// 					name: 'Mridul Kothari', 
// 					standard: 9, 
// 					guardian: 'Ajit Kothari',
// 					phone: '9431953239'
// 				}
// 			]
// 		},
// 		{
// 			name: 'Mumbai Indians',
// 			students: [
// 				{
// 					name: 'Mridul Kothari', 
// 					standard: 9, 
// 					guardian: 'Ajit Kothari',
// 					phone: '9431953239'
// 				},
// 				{
// 					name: 'Mridul Kothari', 
// 					standard: 9, 
// 					guardian: 'Ajit Kothari',
// 					phone: '9431953239'
// 				}
// 			]
// 		}
// 	]
// }

module.exports = function(sequelize) {
	db = sequelize;
	return user;
}