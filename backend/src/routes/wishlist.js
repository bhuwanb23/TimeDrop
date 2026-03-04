const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist, updateWishlistItem, clearWishlist } = require('../controllers/wishlistController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// For local project, we're making these routes public (no authentication required)
// In production, you should uncomment the authenticateToken middleware

router.get('/', getWishlist); // Get user's wishlist
router.post('/', addToWishlist); // Add item to wishlist
router.delete('/:id', removeFromWishlist); // Remove item from wishlist
router.put('/:id', updateWishlistItem); // Update wishlist item
router.delete('/clear/all', clearWishlist); // Clear entire wishlist

module.exports = router;
