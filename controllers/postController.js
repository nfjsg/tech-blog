
const express = require('express');
const router = express.Router();
const { Post, User, Comment } = require('../models');

// Get all posts
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

    res.status(200).json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get a single post by ID
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByPk(postId, {
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

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    res.status(200).json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Create a new post
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;

    // Check if the user is logged in
    if (!req.user) {
      return res.status(401).json({ message: 'You must be logged in to create a post.' });
    }

    // Create a new post
    const newPost = await Post.create({
      title,
      content,
      userId: req.user.id, // Assuming you have the user information in req.user after authentication
    });

    res.status(201).json({ post: newPost, message: 'Post created successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update a post by ID
router.put('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;

    // Check if the user is logged in
    if (!req.user) {
      return res.status(401).json({ message: 'You must be logged in to update a post.' });
    }

    // Check if the post exists
    const postToUpdate = await Post.findByPk(postId);
    if (!postToUpdate) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Check if the user is the owner of the post
    if (postToUpdate.userId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to update this post.' });
    }

    // Update the post
    await postToUpdate.update({ title, content });

    res.status(200).json({ post: postToUpdate, message: 'Post updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a post by ID
router.delete('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if the user is logged in
    if (!req.user) {
      return res.status(401).json({ message: 'You must be logged in to delete a post.' });
    }

    // Check if the post exists
    const postToDelete = await Post.findByPk(postId);
    if (!postToDelete) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Check if the user is the owner of the post
    if (postToDelete.userId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this post.' });
    }

    // Delete the post
    await postToDelete.destroy();

    res.status(200).json({ message: 'Post deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
