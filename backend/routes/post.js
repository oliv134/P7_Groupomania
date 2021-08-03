const express = require('express');
const router = express.Router();
const postsCtrl = require('../controllers/posts');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/add', auth.checkToken, multer, postsCtrl.createPost);
router.get('/', auth.checkToken, postsCtrl.getAllPosts);
router.get('/:content', auth.checkToken, postsCtrl.findPosts);
router.put('/:id', auth.checkToken, multer, postsCtrl.updatePost);
router.delete('/:id', auth.checkToken, postsCtrl.deletePost);
router.post("/:id/report", auth.checkToken, postsCtrl.reportPost);
router.post("/:id/like", auth.checkToken, postsCtrl.likePost);

router.post('/:PostId/comments', auth.checkToken, multer, postsCtrl.createComment);
//router.get('/:postId/comments/:id', auth, postsCtrl.getOneComment)
router.get('/:PostId/comments/', auth.checkToken, postsCtrl.getComments)
//router.put('/:postId/comments/:id', auth, postsCtrl.modifyComment)
router.delete('/comments/:id', auth.checkToken,  postsCtrl.deleteComment);



module.exports = router
