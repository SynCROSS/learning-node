const Sequelize = require('sequelize');

module.exports = class Good extends (
  Sequelize.Model
) {
  static init(sequelize) {
    return super.init(
      {
        bidPrice: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        message: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: 'Auction',
        tableName: 'auctions',
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    );
  }

  static associate(db) {
    db.Auction.belongsTo(db.User);
    db.Auction.belongsTo(db.Good);
  }
};
