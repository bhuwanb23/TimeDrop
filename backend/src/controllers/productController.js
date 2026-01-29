const { Op } = require('sequelize');
const Product = require('../models/Product');
const Category = require('../models/Category');

const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
    
    // Build where clause for filtering
    let whereClause = { status: 'active' };
    
    if (category) {
      whereClause.category_id = category;
    }
    
    if (search) {
      whereClause.name = { [Op.iLike]: `%${search}%` }; // Using iLike for case-insensitive search
    }
    
    // Define sort order
    const order = [[sortBy, sortOrder]];
    
    // Fetch products with pagination
    const products = await Product.findAndCountAll({
      where: whereClause,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order
    });
    
    const totalPages = Math.ceil(products.count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    res.status(200).json({
      message: 'Products retrieved successfully',
      data: {
        products: products.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProducts: products.count,
          hasNextPage,
          hasPrevPage,
          pageSize: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }]
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.status(200).json({
      message: 'Product retrieved successfully',
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category_id, image_url, stock_quantity, weight, dimensions } = req.body;
    
    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      category_id,
      image_url,
      stock_quantity,
      weight,
      dimensions
    });
    
    res.status(201).json({
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category_id, image_url, stock_quantity, weight, dimensions, status } = req.body;
    
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Update product
    await product.update({
      name,
      description,
      price,
      category_id,
      image_url,
      stock_quantity,
      weight,
      dimensions,
      status
    });
    
    res.status(200).json({
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Instead of deleting, we'll set status to 'discontinued'
    await product.update({ status: 'discontinued' });
    
    res.status(200).json({
      message: 'Product marked as discontinued successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};