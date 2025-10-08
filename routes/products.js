const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadFolder = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ------------------------------------
// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await pool.query('SELECT * FROM products ORDER BY id DESC');
    res.json(products.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ------------------------------------
// CREATE product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const image = req.file ? req.file.filename : null; // store filename only

    const newProduct = await pool.query(
      'INSERT INTO products (name, description, price, stock, image) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [name, description, price, stock, image]
    );

    res.json(newProduct.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error uploading product' });
  }
});

// ------------------------------------
// UPDATE product
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const image = req.file ? req.file.filename : null;

    let query, params;
    if (image) {
      query =
        'UPDATE products SET name=$1, description=$2, price=$3, stock=$4, image=$5 WHERE id=$6 RETURNING *';
      params = [name, description, price, stock, image, req.params.id];
    } else {
      query =
        'UPDATE products SET name=$1, description=$2, price=$3, stock=$4 WHERE id=$5 RETURNING *';
      params = [name, description, price, stock, req.params.id];
    }

    const updatedProduct = await pool.query(query, params);
    res.json(updatedProduct.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating product' });
  }
});

// ------------------------------------
// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const product = await pool.query('SELECT * FROM products WHERE id=$1', [req.params.id]);
    if (product.rows[0] && product.rows[0].image) {
      const imagePath = path.join(uploadFolder, product.rows[0].image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await pool.query('DELETE FROM products WHERE id=$1', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting product' });
  }
});

module.exports = router;
