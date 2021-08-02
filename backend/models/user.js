"use strict";
const { Model } = require("sequelize");
const { deleteImage } = require("../services/deleteFile");
const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");
//const SimpleCrypto = require("simple-crypto-js").default;
//const simpleCrypto = new SimpleCrypto("linklv_ILHF_HISF-S6_ofdmfqzp");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, { foreignKey: "userId" });
      User.hasMany(models.Comment);
      User.hasMany(models.Likes);
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        msg: "Ce nom est déjà utilisé !",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hashEmail: {
        type: DataTypes.STRING,
        unique: true,
        msg: "Cette adresse est déjà utilisée !",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageUrl: DataTypes.STRING,
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await hashPassword(user.password);
          }
          if (user.email) {
            user.hashEmail = await encryptMail(user.email);
            console.log(user.email);
            user.email = maskEmail(user.email);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            user.password = await hashPassword(user.password);
          }
          if (user.changed("email")) {
            user.hashEmail = await encryptMail(user.email);
            user.email = maskEmail(user.email);
          }
        },
        beforeFind: async (user) => {
          console.log(user.where);
          if (user.where.email) {
            user.where.hashEmail = await encryptMail(user.where.email);
            delete user.where.email;
          }
        },
        /*afterCreate: async (result) => {
          if (result.constructor === Array) {
            var arrayLength = result.length;
            for (var i = 0; i < arrayLength; i++) {
              result[i].email = await decryptMail(result[i].email);
            }
          } else {
            result.email = await decryptMail(result.email);
          }
          return result;
        },*/
        // Effacement de la photo utilisateur si elle a changé
        afterUpdate: async (user) => {
          if (user.dataValues.imageUrl !== user._previousDataValues.imageUrl) {
            await deleteImage(user._previousDataValues.imageUrl);
          }
        },
        /*afterFind: async (result) => {
          console.log("oooooooooooooo");
          if (result) {
            if (result.constructor === Array) {
              const arrayLength = result.length;
              for (let i = 0; i < arrayLength; i++) {
                result[i].email = await decryptMail(result[i].email);
              }
            } else {
              result.email = await decryptMail(result.email);
            }
          }
          return result;
        },*/
      },
    }
  );
  const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10, "a");
    return await bcrypt.hash(password, salt);
  };
  const encryptMail = async (mail) => {
    //return simpleCrypto.encrypt(mail);
    //return await CryptoJS.AES.encrypt(mail, "My Secret Passphrase");
    return await CryptoJS.HmacSHA512(mail, "RANDOM_SECRET_EMAIL").toString();
  };
  /*const decryptMail = async (mail) => {
    return simpleCrypto.decrypt(mail);
    //return await CryptoJS.AES.decrypt(mail,"My Secret Passphrase").toString(CryptoJS.enc.Utf8);
  };*/
  const maskEmail = (email) => {
    function mask(str) {
      var strLen = str.length;
      if (strLen > 4) {
          return str.substr(0, 1) + str.substr(1, strLen - 1).replace(/\w/g, '*') + str.substr(-1,1);
      } 
      return str.replace(/\w/g, '*');
  }
  return email.replace(/([\w.]+)@([\w.]+)(\.[\w.]+)/g, function (m, p1, p2, p3) {      
      return mask(p1) + '@' + mask(p2) + p3;
  });
   
  
  };
  return User;
};
