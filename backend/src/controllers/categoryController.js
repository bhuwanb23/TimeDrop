const Category = require('../models/Category');
const Product = require('../models/Product');

const getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'active', sortBy = 'sort_order', sortOrder = 'ASC' } = req.query;
    
    // Build where clause for filtering
    let whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    // Fetch categories with pagination
    const categories = await Category.findAndCountAll({
      where: whereClause,
      include: [{
        model: Product,
        as: 'products',
        attributes: ['id', 'name', 'price', 'image_url'],
        where: { status: 'active' },
        required: false
      }],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [[sortBy, sortOrder]]
    });
    
    const totalPages = Math.ceil(categories.count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    // Format categories to include product count
    const formattedCategories = categories.rows.map(category => ({
      ...category.toJSON(),
      productCount: category.products ? category.products.length : 0
    }));
    
    res.status(200).json({
      message: 'Categories retrieved successfully',
      data: {
        categories: formattedCategories,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCategories: categories.count,
          hasNextPage,
          hasPrevPage,
          pageSize: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to retrieve categories' });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByPk(id, {
      include: [{
        model: Product,
        as: 'products',
        where: { status: 'active' },
        required: false
      }]
    });
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.status(200).json({
      message: 'Category retrieved successfully',
      data: {
        ...category.toJSON(),
        productCount: category.products ? category.products.length : 0
      }
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Failed to retrieve category' });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
    
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const products = await Product.findAndCountAll({
      where: { 
        category_id: id,
        status: 'active'
      },
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [[sortBy, sortOrder]]
    });
    
    const totalPages = Math.ceil(products.count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    res.status(200).json({
      message: 'Products retrieved successfully',
      data: {
        category: category.toJSON(),
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
    console.error('Get products by category error:', error);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, image_url, parent_category_id, sort_order } = req.body;
    
    // Create category
    const category = await Category.create({
      name,
      description,
      image_url,
      parent_category_id,
      sort_order: sort_order || 0,
      status: 'active'
    });
    
    res.status(201).json({
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, parent_category_id, sort_order, status } = req.body;
    
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // Update category
    await category.update({
      name,
      description,
      image_url,
      parent_category_id,
      sort_order,
      status
    });
    
    res.status(200).json({
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // Instead of deleting, set status to inactive
    await category.update({ status: 'inactive' });
    
    res.status(200).json({
      message: 'Category marked as inactive successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getProductsByCategory,
  createCategory,
  updateCategory,
  deleteCategory
};
