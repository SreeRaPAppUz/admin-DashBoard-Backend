const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  const users = await pool.query('SELECT * FROM users ORDER BY id DESC');
  res.json(users.rows);
});

router.post('/', async (req, res) => {
  const { username, email, password, phone, is_admin } = req.body;
  const newUser = await pool.query(
    'INSERT INTO users (username,email,password,phone,is_admin) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [username, email, password, phone, is_admin]
  );
  res.json(newUser.rows[0]);
});

router.put('/:id', async (req, res) => {
  const { username, email, phone, is_admin } = req.body;
  const updatedUser = await pool.query(
    'UPDATE users SET username=$1, email=$2, phone=$3, is_admin=$4 WHERE id=$5 RETURNING *',
    [username, email, phone, is_admin, req.params.id]
  );
  res.json(updatedUser.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM users WHERE id=$1', [req.params.id]);
  res.json({ message: 'User deleted' });
});

module.exports = router;