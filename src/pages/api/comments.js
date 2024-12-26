import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'User is not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    switch (req.method) {
      case 'GET': {
        const { noteId } = req.query;

        if (!noteId || isNaN(noteId)) {
          return res.status(400).json({ error: 'Invalid noteId' });
        }

        try {
          const comments = await prisma.comment.findMany({
            where: { noteId: parseInt(noteId) },
            orderBy: { createdAt: 'asc' },
          });

          res.status(200).json(comments);
        } catch (error) {
          console.error('Error in GET comments:', error);
          res.status(500).json({ error: 'Failed to fetch comments' });
        }
        break;
      }
      case 'POST': {
        const { content, noteId } = req.body;

        if (!content || !noteId || isNaN(noteId)) {
          return res.status(400).json({ error: 'Invalid request data' });
        }

        try {
          const newComment = await prisma.comment.create({
            data: {
              content,
              noteId: parseInt(noteId),
              createdAt: new Date(),
            },
          });

          res.status(201).json(newComment);
        } catch (error) {
          console.error('Error in POST comment:', error);
          res.status(500).json({ error: 'Failed to create comment' });
        }
        break;
      }
      case 'PUT': {
        const { id, content } = req.body;

        if (!id || isNaN(id) || !content) {
          return res.status(400).json({ error: 'Invalid request data' });
        }

        try {
          const updatedComment = await prisma.comment.update({
            where: { id: parseInt(id) },
            data: { content },
          });

          res.status(200).json(updatedComment);
        } catch (error) {
          console.error('Error in PUT comment:', error);
          res.status(500).json({ error: 'Failed to update comment' });
        }
        break;
      }
      case 'DELETE': {
        const { id } = req.query;

        if (!id || isNaN(id)) {
          return res.status(400).json({ error: 'Invalid comment id' });
        }

        try {
          await prisma.comment.delete({
            where: { id: parseInt(id) },
          });

          res.status(200).json({ message: 'Comment deleted successfully' });
        } catch (error) {
          console.error('Error in DELETE comment:', error);
          res.status(500).json({ error: 'Failed to delete comment' });
        }
        break;
      }
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in authentication:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}
