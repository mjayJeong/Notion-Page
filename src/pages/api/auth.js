import { hash, compare } from 'bcryptjs';
import db from '../../db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { action, email, password, username } = req.body;

    if (action === 'signup') {
      try {
        const existingUser = await db.user.findFirst({
          where: {
            OR: [{ email }, { username }],
          },
        });

        if (existingUser) {
          if (existingUser.email === email) {
            return res.status(400).json({ error: 'Email already in use' });
          }
          if (existingUser.username === username) {
            return res.status(400).json({ error: 'Username already in use' });
          }
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;
        if (!passwordRegex.test(password)) {
          return res.status(400).json({
            error: 'Password must include at least one uppercase letter and one special character',
          });
        }

        const hashedPassword = await hash(password, 12);
        const newUser = await db.user.create({
          data: {
            email,
            username,
            password: hashedPassword,
          },
        });

        const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({
          token,
          user: { id: newUser.id, email: newUser.email, username: newUser.username },
        });
      } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ error: 'Failed to sign up' });
      }
    } else if (action === 'login') {
      try {
        const user = await db.user.findUnique({ where: { email } });
        if (!user) {
          return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
          token,
          user: { id: user.id, email: user.email, username: user.username },
        });
      } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Failed to log in' });
      }
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
