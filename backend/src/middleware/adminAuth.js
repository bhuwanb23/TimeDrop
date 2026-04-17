const User = require('../models/User');

const requireAdmin = async (req, res, next) => {
    try {
        // Check if admin is logged in via session
        if (!req.session.adminUser) {
            req.flash('error_msg', 'Please log in to access admin panel');
            return res.redirect('/admin/login');
        }

        // Verify user is still active and is admin
        const user = await User.findByPk(req.session.adminUser.id);
        if (!user || user.role !== 'admin' || user.status !== 'active') {
            req.session.destroy();
            req.flash('error_msg', 'Unauthorized access');
            return res.redirect('/admin/login');
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Admin auth error:', error);
        res.redirect('/admin/login');
    }
};

module.exports = { requireAdmin };
