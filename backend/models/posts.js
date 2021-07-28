'use strict'
const { Model } = require('sequelize')
const moment = require('moment')
const { deleteImage } = require('../services/deleteFile')

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Post.belongsTo(models.User, { foreignKey: 'userId' })
      //Post.hasMany(models.Comments)
      //Post.hasMany(models.Likes)
    }
    readableCreatedAt () {
      return moment(this.createdAt)
        .locale('fr')
        .format('LL')
    }
  }
  Post.init(
    {
      userId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      imageUrl: DataTypes.STRING,
      likesCount: DataTypes.INTEGER
    },
    {
      sequelize,
      validate: {
        eitherContentOrImageUrl () {
          if (!this.content && !this.imageUrl) {
            throw new Error('Vous ne pouvez pas créer de publication vide !')
          }
        }
      },
      modelName: 'Post'
    }
  )

  Post.afterDestroy(async post => {
    if (post.imageUrl) {
      await deleteImage(post.imageUrl)
    }
  })

  Post.afterUpdate(async post => {
    if (post.dataValues.imageUrl !== post._previousDataValues.imageUrl) {
      await deleteImage(post._previousDataValues.imageUrl)
    }
  })

  return Post
}
