const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all orders
router.get('/', async (req, res) => {
  try {
    const orders = await pool.query(`
      SELECT o.*, u.username, p.name as product_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN products p ON o.product_id = p.id
      ORDER BY o.id DESC
    `);
    res.json(orders.rows);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// UPDATE order status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await pool.query(
      'UPDATE orders SET status=$1 WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );

    if (updatedOrder.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(updatedOrder.rows[0]);
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

module.exports = router;
