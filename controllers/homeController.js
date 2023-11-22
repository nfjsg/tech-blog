
const express = require('express');
const router = express.Router();
const { Post, User, Comment } = require('../models');

router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          include: [User],
        },
      ],
    });

    res.render('home', { posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
