
const express = require('express');
const router = express.Router();
const { Comment, User } = require('../models');

// Create a comment
router.post('/:postId', async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;

    // Check if the user is logged in
    if (!req.user) {
      return res.status(401).json({ message: 'You must be logged in to add a comment.' });
    }

    // Create a new comment
    const newComment = await Comment.create({
      text,
      postId,
      userId: req.user.id, // Assuming you have the user information in req.user after authentication
    });

    // Send the new comment as a response
    res.status(201).json({ comment: newComment, message: 'Comment added successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a comment
router.delete('/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;

    // Check if the user is logged in
    if (!req.user) {
      return res.status(401).json({ message: 'You must be logged in to delete a comment.' });
    }

    // Check if the user is the owner of the comment
    const commentToDelete = await Comment.findByPk(commentId);
    if (!commentToDelete || commentToDelete.userId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this comment.' });
    }

    // Delete the comment
    await commentToDelete.destroy();

    res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
