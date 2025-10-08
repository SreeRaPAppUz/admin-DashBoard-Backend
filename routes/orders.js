const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  const orders = await pool.query(`
    SELECT o.*, u.username, p.name as product_name
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN products p ON o.product_id = p.id
    ORDER BY o.id DESC
  `);
  res.json(orders.rows);
});

router.put('/:id', async (req, res) => {
  const { status } = req.body;
  const updatedOrder = await pool.query(
    'UPDATE orders SET status=$1 WHERE id=$2 RETURNING *',
    [status, req.params.id]
  );
  res.json(updatedOrder.rows[0]);
});


module.exports = router;
