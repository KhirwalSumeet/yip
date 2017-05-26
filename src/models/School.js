module.exports = function(sequelize, Sequelize) {
	var School = sequelize.define('School', {
		id        : { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
		name      : { type: Sequelize.STRING, allowNull: false, unique: false },
		email     : { type: Sequelize.STRING, allowNull: true, unique: false },
		principal : { type: Sequelize.STRING, allowNull: true, unique: false },
		principalPhone : { type: Sequelize.STRING, allowNull: true, unique: false },
		address   : { type: Sequelize.STRING(1000), allowNull: true, unique: false },
		phone     : { type: Sequelize.STRING, allowNull: true, unique: false },
	}, {
		tableName   : 'schools',
		paranoid	: true,
	});

	return School;
};