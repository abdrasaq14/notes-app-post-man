// import { Sequelize, DataTypes, Model } from "sequlize";

// // create an instance of the sequealise

// const sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage: 'path/to/database.sqlite',
//     force: 'alter'//'true'
//   });

// // export the instance you created to the app.ts file

// // model definition

// class User extends Model {}

// User.init({
//   // Model attributes are defined here
//   firstName: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   lastName: {
//     type: DataTypes.STRING
//     // allowNull defaults to true
//   }
// }, {
//   // Other model options go here
//   sequelize, // We need to pass the connection instance
//   modelName: 'User' // We need to choose the model name
// });

// // the defined model is the class itself
// console.log(User === sequelize.models.User); // true


