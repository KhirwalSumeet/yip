module.exports = function(sequelize, Sequelize) {
	var Team = sequelize.define('Team', {
		id        : { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
		name      : { type: Sequelize.STRING, allowNull: false, unique: false },
		schoolId  : { type: Sequelize.UUID, allowNull: false, unique: false },
		students  : { type: Sequelize.TEXT('tiny'), allowNull: true }
	}, {
		tableName   : 'teams',
		paranoid	: true,
	});

	return Team;
};