const fs = require("fs");
const db = require("../models");
const { Op } = require("sequelize");
const { Post } = db.sequelize.models;
const { Comment } = db.sequelize.models;
const auth = require("../middleware/auth");
const user = require("../controllers/user");

// Création d'un post
exports.createPost = async (req, res, next) => {
  req.body.userId = auth.getTokenUserId(req);
  req.body.imageUrl = req.file
    ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    : null;
  try {
    let post = await Post.create(req.body);
    post = await Post.findOne({
      where: { id: post.id },
      include: [
        { model: db.User, attributes: ["id", "name", "admin", "imageUrl"] },
        { model: db.Likes, attributes: ["Userid"] },
        { model: db.Reports, attributes: ["Userid"] },
      ],
    });

    res.status(201).json({ post });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.findPosts = async (req, res, next) => {
  const options = {
    include: [
      { model: db.User, attributes: ["id", "name", "email", "imageUrl"] },
      { model: db.Likes, attributes: ["Userid"] },
      { model: db.Reports, attributes: ["Userid"] },
    ],
    //limit,
    //offset: limit * (page - 1),
    order: [["createdAt", "DESC"]],
  };
  options.where = {
    content: { [Op.substring]: req.params.content },
  };
  Post.findAll(options)
    .then((posts) => res.status(200).json(posts))
    .catch((error) => res.status(400).json({ error }));
};

// Obtenir tous les posts
exports.getAllPosts = async (req, res, next) => {
  //const limit = parseInt(req.query.limit) || 4;
  //const page = parseInt(req.query.page) || 1;
  //const countPosts = ((await Post.count()) - (limit * page)) / limt + 1;

  const options = {
    include: [
      { model: db.User, attributes: ["id", "name", "email", "imageUrl"] },
      { model: db.Likes, attributes: ["UserId"] },
      { model: db.Reports, attributes: ["UserId"] },
    ],
    //limit,
    //offset: limit * (page - 1),
    order: [["createdAt", "DESC"]],
  };

  Post.findAll(options)
    .then((posts) => res.status(200).json(posts))
    .catch((error) => res.status(400).json({ error }));
};

// Obtenir tous les posts aimés par un user.id
exports.getLikedPosts = async (req, res, next) => {
  //const limit = parseInt(req.query.limit) || 4;
  //const page = parseInt(req.query.page) || 1;
  //const countPosts = ((await Post.count()) - (limit * page)) / limt + 1;

  const options = {
      include: [
      { model: db.User, attributes: ["id", "name", "email", "imageUrl"] },
      {
        model: db.Likes,
        attributes: ["UserId"],
        where: { userId: parseInt(req.params.userid) },
      },
      {
        model: db.Likes,
        attributes: ["UserId"],
      },
      { model: db.Reports, attributes: ["UserId"] },
    ],
    order: [["createdAt", "DESC"]],
  };
  Post.findAll(options)
    .then((posts) => res.status(200).json(posts))
    .catch((error) => res.status(400).json({ error }));
};

// Obtenir tous les posts signalés pour l'admin
exports.getReportedPosts = async (req, res, next) => {
  //const limit = parseInt(req.query.limit) || 4;
  //const page = parseInt(req.query.page) || 1;
  //const countPosts = ((await Post.count()) - (limit * page)) / limt + 1;

  const options = {
    include: [
      { model: db.User, attributes: ["id", "name", "email", "imageUrl"] },
      {
        model: db.Likes,
        attributes: ["UserId"],
      },
      {
        model: db.Reports,
        attributes: ["UserId"],
        where: { PostId: { [Op.ne]: null } },
      },
    ],
    order: [["createdAt", "DESC"]],
  };
  if (req.query.userId) {
    options.where = {
      userId: parseInt(req.query.userId),
    };
  }
  Post.findAll(options)
    .then((posts) => res.status(200).json(posts))
    .catch((error) => res.status(400).json({ error }));
};

// Mise à jour du post uniquement par son propriétaire.
exports.updatePost = (req, res, next) => {
  //req.body.imageUrl = !req.body.imageUrl && req.file ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}` : null
  //if (!req.body.imageUrl && req.file) { req.body.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}` }
  if (req.file) {
    req.body.imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
  }
  Post.findOne({
    where: { id: req.params.id, userId: auth.getTokenUserId(req) },

    include: [
      { model: db.User, attributes: ["id", "name", "admin", "imageUrl"] },
      { model: db.Likes, attributes: ["Userid"] },
      { model: db.Reports, attributes: ["Userid"] },
    ],
  }).then((post) => {
    if (!post) {
      res.status(400).json({ error: "Vous n'avez pas l'autorisation" });
    } else {
      post.update(req.body, { individualHooks: true }).then((post) => {
        res.status(200).json({ post, message: "Le post a été mis à jour" });
      });
    }
  });
};

// suppression d'un post par son propriétaire ou l'administrateur
exports.deletePost = async (req, res, next) => {
  const where = {
    id: req.params.id,
  };
  // vérification que le user est le propriétaire du post s'il n'est pas admin
  if (!(await user.isAdmin(auth.getTokenUserId(req)))) {
    where.userId = auth.getTokenUserId(req);
  }

  Post.findOne({ where })
    .then((post) => {
      if (!post) {
        res.status(400).json({ error: "Vous n'avez pas l'autorisation" });
      }
      post
        .destroy()
        .then(() =>
          res
            .status(200)
            .json({ id: req.params.id, message: "Publication supprimée !" })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};

// signaler un post
exports.reportPost = async (req, res, next) => {
  try {
    const userId = auth.getTokenUserId(req);
    const postId = req.params.id;
    const user = await db.Reports.findOne({
      where: { UserId: userId, PostId: postId },
    });
    if (user) {
      await db.Reports.destroy(
        { where: { UserId: userId, PostId: postId } },
        { truncate: true, restartIdentity: true }
      );
      await Post.decrement(['reportsCount'], { where: { id: postId } });
      res.status(200).json({ message: "Vous ne signalez plus ce post" });
    } else {
      await db.Reports.create({
        UserId: userId,
        PostId: postId,
      });
      await Post.increment(['reportsCount'], { where: { id: postId } });
      res.status(201).json({ message: "Vous signalez ce post" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

// aimer un post
exports.likePost = async (req, res, next) => {
  try {
    const userId = auth.getTokenUserId(req);
    const postId = req.params.id;
    const user = await db.Likes.findOne({
      where: { UserId: userId, PostId: postId },
    });
    
    if (user) {
      await db.Likes.destroy(
        { where: { UserId: userId, PostId: postId } },
        { truncate: true, restartIdentity: true }
      );
      await Post.decrement(['likesCount'], { where: { id: postId } });
      res.status(200).json({ message: "Vous n'aimez plus ce post" });
    } else {
      await db.Likes.create({
        UserId: userId,
        PostId: postId,
      });
      await Post.increment(['likesCount'], { where: { id: postId } });
      res.status(201).json({ message: "Vous aimez post" });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

// créer un commentaire
exports.createComment = async (req, res) => {
  req.body.UserId = auth.getTokenUserId(req);
  id = req.params.PostId;
  req.body.PostId = id;
  try {
    let post = await Comment.create(req.body);
    post = await Post.findOne({
      where: { id: id },
      order: [[{ model: Comment }, "createdAt", "desc"]],
      include: [
        { model: db.User, attributes: ["id", "name", "admin", "imageUrl"] },
        { model: db.Likes, attributes: ["Userid"] },
        { model: db.Reports, attributes: ["Userid"] },
        {
          model: db.Comment,
          attributes: ["id", "Userid", "message", "createdAt"],
          include: [{ model: db.User, attributes: ["name"] }],
        },
      ],
    });
    res.status(201).json({ post });
  } catch (error) {
    return res.status(501).send({ error: error });
  }
};

// récupérer tous les commentaires d'un post
exports.getComments = async (req, res) => {
  try {
    id = parseInt(req.params.PostId);
    post = await Post.findOne({
      where: { id: id },
      order: [[{ model: Comment }, "createdAt", "desc"]],
      include: [
        { model: db.User, attributes: ["id", "name", "admin", "imageUrl"] },
        { model: db.Likes, attributes: ["Userid"] },
        { model: db.Reports, attributes: ["Userid"] },
        {
          model: db.Comment,
          attributes: ["id", "Userid", "message", "createdAt"],
          include: [{ model: db.User, attributes: ["name"] }],
        },
      ],
    });
    res.status(200).json({ post });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// supprimer un commentaire
exports.deleteComment = async (req, res) => {
  try {
    const where = {
      id: parseInt(req.params.id),
    };

    // vérification que le user est le propriétaire du post s'il n'est pas admin
    if (!(await user.isAdmin(auth.getTokenUserId(req)))) {
      where.userId = auth.getTokenUserId(req);
    }

    let comment = await Comment.findOne({
      where,
      attributes: ["id", "PostId"],
    });

    if (!comment) {
      throw "Vous n'avez pas l'autorisation";
    }

    const postId = comment.dataValues.PostId;
    // efface le commentaire
    await comment.destroy();
    
    // retourne le post entier avec ses commentaires
    let post = await Post.findOne({
      where: { id: postId },
      order: [[{ model: Comment }, "createdAt", "desc"]],
      include: [
        { model: db.User, attributes: ["id", "name", "admin", "imageUrl"] },
        { model: db.Likes, attributes: ["Userid"] },
        { model: db.Reports, attributes: ["Userid"] },
        {
          model: db.Comment,
          attributes: ["id", "Userid", "message", "createdAt"],
          include: [{ model: db.User, attributes: ["name"] }],
        },
      ],
    });

    res.status(201).json({ post: post, message: "Le commentaire a été supprimé." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
