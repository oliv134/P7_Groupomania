const bcrypt = require("bcrypt"); // chiffrement du password
const db = require("../models");
const { User } = db.sequelize.models;
//const Sequelize = db.s;

const auth = require("../middleware/auth");

exports.signup = (req, res, next) => {
  /*const imageUrl = req.file ? `${req.protocol}://${req.get("host")}/images/${
      req.file.filename}` : null */
admin = req.body.name == "admin"
if (checkPassword(req.body.password)) {
  throw "Le mot de passe doit contenir au moins 8 caractères (dont au moins une majuscule, une minuscule, un chiffre, un caractère spécial)";
}
  User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    admin: admin 
    //imageUrl: imageUrl
  })

    .then((user) => {
      const token = auth.setToken(user);
      user.password = undefined;
      res.status(201).send({
        user: user,
        token: token,

        message: `Votre compte est bien créé ${user.name} !`,
      });
    })
    .catch((error) => res.status(401).json({ error: error }));
};

exports.login = async (req, res, next) => {
  try {
console.log(req.body)
    const user = await User.findOne(
      {
        where: { email: req.body.email },
        attributes: [
          "id",
          "name",
          "email",
          "imageUrl",
          "deleted",
          "admin",
          "createdAt",
          "updatedAt",
          "password"
        ],
      }
    );

    if (!user) {
      return res.status(401).json({ error: "Mot de passe incorrect !" });
    } else {
      const hash = await bcrypt.compare(req.body.password, user.password); // on compare les mots de passes
      if (!hash) {
        return res.status(401).json({ error: "Mot de passe incorrect !" });
      } else {
        const token = auth.setToken(user);
        //delete user.datavalues.password
        console.log(user.dataValues)
        res.status(201).json({
          user: user,
          token: token,
          message: `Bonjour ${user.name} !`,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    //const checkAdmin =
    // Verification si id est renseigné
console.log(req.params)
console.log(req.body)
    userId = req.params.id;
    console.log("UPDATEeUser")
    console.log(userId)
    //throw("stop");
    // Verification si admin ou proprio du compte
    tokenUserId = await auth.getTokenUserId(req);
    admin = await this.isAdmin(tokenUserId);

    if (userId != req.params.id || admin) {
      throw "NO Admin";
    }
    if (checkPassword(req.body.password)) {
      throw "Le mot de passe doit contenir au moins 8 caractères (dont au moins une majuscule, une minuscule, un chiffre, un caractère spécial)";
    }
    req.body.imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
      : null;
    // if (req.body.password === undefined) {req.body.password = 'null'}

    User.findOne(
      
      {
        where: { id: userId },
        attributes: [
          "id",
          "name",
          "email",
          "imageUrl",
          "deleted",
          "admin",
          "createdAt",
          "updatedAt",
        ],
      }
    )
      .then((user) => {
        user.update(req.body, { individualHooks: true }).then((user) => {
          const token = auth.getToken(req);

          res
            .status(200)
            .json({
              user: user,
              token: token,
              message: "Votre profil a bien été mis à jour",
            }); 
        });
      })
      .catch((error) => res.status(400).json({ error }));
    //});
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getOneUser = (req, res, next) => {
  User.findOne({
    where: { id: req.params.id },
    attributes: [
      "id",
      "name",
      "email",
      "imageUrl",
      "deleted",
      "admin",
      "createdAt",
      "updatedAt",
    ],
  })
    .then((user) => res.status(200).json({ user })) 
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllUsers = (req, res, next) => {
  const options = {
    where: Sequelize.where(Sequelize.fn("concat", Sequelize.col("name")), {
      [Sequelize.Op.like]: `%${req.query.search}%`,
    }),
    attributes: [
      "id",
      "name",
      "email",
      "imageUrl",
      "deleted",
      "admin",
      "createdAt",
      "updatedAt",
    ],
    limit: 10,
  };
  User.findAll(options)
    .then((users) => {
      res.status(200).json({ users }); // *********** Données renvoyées à revoir ALERT SECU - Admin ou Pas
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteUserAccount = async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw "userId missing";
    }
    // On n'efface pas le compte mais on l'anonymise
    req.body.deleted = true;
    req.body.email = `deleted-user${req.params.id}@groupomania.com`;
    req.body.imageUrl = null;
    req.body.name = "Utilisateur Supprimé";
    req.body.password = "Deleted1234!";
    res = await this.updateUser(req, res, next);
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.isAdmin = async (id) => {
  const response = await db.User.findOne({
    where: { id: id },
    attributes: ["admin"],
  });

  return response.admin;
};

const checkPassword = ((password) => {
  let test = new RegExp('/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z0-9\d@$!%*?&]{8,}$/');
  return test.test(password);
});