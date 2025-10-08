const express = require('express');
const router = express.Router();
const pool = require('../db');

// -------------------- GET all users --------------------
router.get('/', async (req, res) => {
  try {
    const users = await pool.query('SELECT * FROM users ORDER BY id DESC');
    res.json(users.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// -------------------- CREATE new user --------------------
router.post('/', async (req, res) => {
  const { username, email, password, phone, is_admin } = req.body;
  try {
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password, phone, is_admin) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [username, email, password, phone, is_admin]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// -------------------- UPDATE user --------------------
router.put('/:id', async (req, res) => {
  const { username, email, phone, is_admin } = req.body;
  try {
    const updatedUser = await pool.query(
      'UPDATE users SET username=$1, email=$2, phone=$3, is_admin=$4 WHERE id=$5 RETURNING *',
      [username, email, phone, is_admin, req.params.id]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser.rows[0]);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// -------------------- DELETE user --------------------
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM users WHERE id=$1 RETURNING *', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
