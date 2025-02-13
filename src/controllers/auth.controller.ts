import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { UserRecord } from '../types/database';
import { ResultSetHeader } from 'mysql2';

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const connection = await pool.getConnection();

    try {
      // Check if user exists
      const [existingUsers] = await connection.execute<UserRecord[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const userId = uuidv4();
      const [result] = await connection.execute<ResultSetHeader>(
        'INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)',
        [userId, username, email, hashedPassword]
      );

      // Generate token
      const token = jwt.sign(
        { id: userId, email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );

      res.status(201).json({ token });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const connection = await pool.getConnection();

    try {
      const [users] = await connection.execute<UserRecord[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      const user = users[0];

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );

      res.json({ token });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};