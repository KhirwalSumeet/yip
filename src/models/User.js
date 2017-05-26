module.exports = function(sequelize, Sequelize) {
	var User = sequelize.define('User', {
		id        : { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
		email     : { type: Sequelize.STRING, allowNull: false, unique: true },
		password  : { type: Sequelize.STRING, allowNull: false, unique: false },
		name      : { type: Sequelize.STRING, allowNull: false, unique: false },
		phone     : { type: Sequelize.STRING, allowNull: true, unique: false },
		address   : { type: Sequelize.STRING, allowNull: true, unique: false },
		emergency : { type: Sequelize.STRING, allowNull: true, unique: false },
		isVerified: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false, unique: false },
		schoolId  : { type: Sequelize.UUID, allowNull: false, unique: true }
	}, {
		tableName   : 'users',
		paranoid	: true,
	});

	return User;
};