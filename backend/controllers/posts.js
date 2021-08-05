const fs = require("fs");
const db = require("../models");
const { Op } = require("sequelize")
const { Post } = db.sequelize.models;
const { Comment } = db.sequelize.models;
const auth = require("../middleware/auth");
const user = require("../controllers/user");

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

/*exports.getOnePost = (id, res, next) => {
  Post.findOne({
    where: { id: id },
    include: [
      { model: db.User, attributes: ["id", "name", "admin", "imageUrl"] },
      { model: db.Likes, attributes: ["Userid"] },
      { model: db.Reports, attributes: ["Userid"] },
    ],
  })
    .then((post) => res.status(200).json({ post }))
    .catch((error) => res.status(404).json({ error }));
};*/
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
    content : {[Op.substring]: req.params.content}
  };
  Post.findAll(options)
    .then((posts) => res.status(200).json(posts))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllPosts = async (req, res, next) => {
  //const limit = parseInt(req.query.limit) || 4;
  //const page = parseInt(req.query.page) || 1;
  //const countPosts = ((await Post.count()) - (limit * page)) / limt + 1;
  console.log("ici")
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

  if (req.query.userId) {
    options.where = {
      userId: parseInt(req.query.userId),
    };
  }
  const filter = req.baseUrl.substr(req.baseUrl.lastIndexOf('/') + 1) 
  console.log(filter)
switch (filter) {
  case 'liked':
    options.where = {
      likesCount: ">0",
    };
    options.order = [["likesCount", "DESC"]];
    break;
  case "reported":
    options.where = {
      reportsCount: ">0",
    };
    options.order = [["reportsCount", "DESC"]];
    break;
  }


  Post.findAll(options)
    .then((posts) => res.status(200).json(posts))
    .catch((error) => res.status(400).json({ error }));
};

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
        res.status(200).json({ post });
      });
    }
  });
};

exports.deletePost = async (req, res, next) => {
  // on vérifie que le user est le propriétaire du token ou qu'il est admin
  const where = {
    id: req.params.id,
  };

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
      res.status(200).send({ messageRetour: "vous ne signalez plus ce post" });
    } else {
      await db.Reports.create({
        UserId: userId,
        PostId: postId,
      });
      res.status(201).json({ messageRetour: "vous avez signalez ce post" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};

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
      res.status(200).send({ messageRetour: "vous aimez post" });
    } else {
      await db.Likes.create({
        UserId: userId,
        PostId: postId,
      });
      res.status(201).json({ messageRetour: "vous n'aimez plus ce post" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};

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
exports.deleteComment = async (req, res) => {
  // on vérifie que le user est le propriétaire du token ou qu'il est admin
  try {
    const where = {
      id: parseInt(req.params.id),
    };

    if (!(await user.isAdmin(auth.getTokenUserId(req)))) {
      where.userId = auth.getTokenUserId(req);
    }

    let comment = await Comment.findOne({
      where,
      attributes: ["id", "PostId"],
    });

    if (!comment) {
      throw "userId missing";
      ("Vous n'avez pas l'autorisation");
    }

    //req.params.PostId = comment.dataValues.PostId;

    await comment.destroy();
    const postId = (req.params.PostId = comment.dataValues.PostId);
    //post = await this.getComments(req);
    let post = await Post.findOne({
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
    res.status(500).json({ error: error.message });
  }
};
