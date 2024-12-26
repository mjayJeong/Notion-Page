import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'User is not authenticated' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId;
      const notes = await prisma.note.findMany({
        where: { userId },
        include: { contents: true },
      });

      const formattedNotes = notes.map((note) => ({
        id: note.id,
        title: note.title,
        contents: note.contents.map((content) => ({
          id: content.id,
          type: content.type,
          value: content.value,
          noteId: content.noteId,
        })),
      }));

      res.status(200).json(formattedNotes);
    } catch (error) {
      console.error('Error in GET:', error);
      res.status(500).json({ error: 'Failed to fetch notes' });
    }
  } else if (req.method === 'POST') {
    const { title, content } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'User is not authenticated' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId;

      const newNote = await prisma.note.create({
        data: { title, userId },
      });

      const newContent = await prisma.content.create({
        data: {
          id: newNote.id,
          type: 'p',
          value: content,
          noteId: newNote.id,
        },
      });

      res.status(201).json({ ...newNote, contents: [newContent] });
    } catch (error) {
      console.error('Error in POST:', error);
      res.status(500).json({ error: 'Failed to create note' });
    }
  } else if (req.method === 'PUT') {
    const { id, title, content } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'User is not authenticated' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId;

      const updatedNote = await prisma.note.update({
        where: { id },
        data: { title },
      });

      const contentToUpdate = await prisma.content.findFirst({
        where: { noteId: id },
      });

      let updatedContent;
      if (contentToUpdate) {
        updatedContent = await prisma.content.update({
          where: { id: contentToUpdate.id },
          data: { value: content },
        });
      } else {
        updatedContent = await prisma.content.create({
          data: {
            id,
            noteId: id,
            type: 'p',
            value: content,
          },
        });
      }
      res.status(200).json({ ...updatedNote, contents: [updatedContent] });
    } catch (error) {
      console.error('Error in PUT:', error);
      res.status(500).json({ error: 'Failed to update note' });
    }
  }  else if (req.method === 'DELETE') {
    const { id } = req.query;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'User is not authenticated' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId;

      await prisma.content.deleteMany({
        where: { noteId: parseInt(id), note: { userId } },
      });

      await prisma.note.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
      console.error('Error in DELETE:', error);
      res.status(500).json({ error: 'Failed to delete note' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}