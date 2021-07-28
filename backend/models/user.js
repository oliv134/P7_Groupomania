'use strict'
const { Model } = require('sequelize')
const { deleteImage } = require('../services/deleteFile')
const bcrypt = require('bcrypt')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.hasMany(models.Post, { foreignKey: 'userId' })
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
        msg: "Cette adresse est déjà utilisée !"
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z0-9\d@$!%*?&]{8,}$/
        },
        msg: "Le mot de passe doit contenir au moins 8 caractères (dont au moins une majuscule, une minuscule, un chiffre, un caractère spécial)."
      },
      imageUrl: DataTypes.STRING,
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'User',
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            
            user.password = await hashPassword(user.password);
          }
        },
        beforeUpdate: async (user) => {
          if (user.password) {
            
            user.password = await hashPassword(user.password);
          }
        },
        // Effacement de la photo utilisateur si elle a changé
        afterUpdate: async (user) => {
          console.log(user._previousDataValues.imageUrl)
          console.log(user.dataValues.imageUrl)
          if (user.dataValues.imageUrl !== user._previousDataValues.imageUrl) {
            await deleteImage(user._previousDataValues.imageUrl)
          }
        }
      },
    }
  )
  const hashPassword = async (password) => {
    
    
    const salt = await bcrypt.genSalt(10, "a");
    return await bcrypt.hash(password, salt);
  }
  return User
}
