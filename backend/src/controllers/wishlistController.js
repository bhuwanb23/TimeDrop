const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const User = require('../models/User');

const getWishlist = async (req, res) => {
  try {
    // For local project without authentication, use default customer ID
    const userId = req.user ? req.user.id : 2; // Default to customer user
    
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
    
    const wishlistItems = await Wishlist.findAndCountAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'image_url', 'status'],
          include: [{
            model: Category,
            as: 'category',
            attributes: ['id', 'name']
          }]
        }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [[sortBy, sortOrder]]
    });
    
    const totalPages = Math.ceil(wishlistItems.count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    res.status(200).json({
      message: 'Wishlist retrieved successfully',
      data: {
        wishlistItems: wishlistItems.rows.map(item => ({
          ...item.toJSON(),
          product: item.product ? {
            ...item.product.toJSON(),
            isFavorited: true
          } : null
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: wishlistItems.count,
          hasNextPage,
          hasPrevPage,
          pageSize: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ error: 'Failed to retrieve wishlist' });
  }
};

const addToWishlist = async (req, res) => {
  try {
    // For local project without authentication, use default customer ID
    const userId = req.user ? req.user.id : 2; // Default to customer user
    const { productId, notes, priority } = req.body;
    
    // Validate product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Check if already in wishlist
    const existingItem = await Wishlist.findOne({
      where: {
        user_id: userId,
        product_id: productId
      }
    });
    
    if (existingItem) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }
    
    // Create wishlist item
    const wishlistItem = await Wishlist.create({
      user_id: userId,
      product_id: productId,
      notes,
      priority: priority || 'normal'
    });
    
    // Fetch complete wishlist item with product details
    const completeItem = await Wishlist.findByPk(wishlistItem.id, {
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'image_url', 'status'],
          include: [{
            model: Category,
            as: 'category',
            attributes: ['id', 'name']
          }]
        }
      ]
    });
    
    res.status(201).json({
      message: 'Added to wishlist successfully',
      data: {
        ...completeItem.toJSON(),
        product: {
          ...completeItem.product.toJSON(),
          isFavorited: true
        }
      }
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ error: 'Failed to add item to wishlist' });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    // For local project without authentication, use default customer ID
    const userId = req.user ? req.user.id : 2; // Default to customer user
    const { id } = req.params;
    
    const wishlistItem = await Wishlist.findOne({
      where: {
        id,
        user_id: userId
      }
    });
    
    if (!wishlistItem) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }
    
    await wishlistItem.destroy();
    
    res.status(200).json({
      message: 'Removed from wishlist successfully'
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ error: 'Failed to remove item from wishlist' });
  }
};

const updateWishlistItem = async (req, res) => {
  try {
    // For local project without authentication, use default customer ID
    const userId = req.user ? req.user.id : 2; // Default to customer user
    const { id } = req.params;
    const { notes, priority } = req.body;
    
    const wishlistItem = await Wishlist.findOne({
      where: {
        id,
        user_id: userId
      }
    });
    
    if (!wishlistItem) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }
    
    await wishlistItem.update({
      notes,
      priority
    });
    
    // Fetch updated item
    const updatedItem = await Wishlist.findByPk(id, {
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'image_url', 'status'],
          include: [{
            model: Category,
            as: 'category',
            attributes: ['id', 'name']
          }]
        }
      ]
    });
    
    res.status(200).json({
      message: 'Wishlist item updated successfully',
      data: {
        ...updatedItem.toJSON(),
        product: {
          ...updatedItem.product.toJSON(),
          isFavorited: true
        }
      }
    });
  } catch (error) {
    console.error('Update wishlist item error:', error);
    res.status(500).json({ error: 'Failed to update wishlist item' });
  }
};

const clearWishlist = async (req, res) => {
  try {
    // For local project without authentication, use default customer ID
    const userId = req.user ? req.user.id : 2; // Default to customer user
    
    await Wishlist.destroy({
      where: {
        user_id: userId
      }
    });
    
    res.status(200).json({
      message: 'Wishlist cleared successfully'
    });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({ error: 'Failed to clear wishlist' });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  updateWishlistItem,
  clearWishlist
};
