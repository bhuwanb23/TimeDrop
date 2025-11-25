const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const Driver = sequelize.define('Driver', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Driver name is required'
      }
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Phone number is required'
      },
      is: {
        args: /^[0-9]{10}$/,
        msg: 'Phone number must be a 10-digit number'
      }
    }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Password hash is required'
      }
    }
  },
  current_lat: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
    validate: {
      isDecimal: {
        msg: 'Latitude must be a decimal number'
      }
    }
  },
  current_lng: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
    validate: {
      isDecimal: {
        msg: 'Longitude must be a decimal number'
      }
    }
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'drivers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Hash password before saving
Driver.beforeCreate(async (driver) => {
  if (driver.password_hash) {
    const salt = await bcrypt.genSalt(10);
    driver.password_hash = await bcrypt.hash(driver.password_hash, salt);
  }
});

Driver.beforeUpdate(async (driver) => {
  if (driver.changed('password_hash')) {
    const salt = await bcrypt.genSalt(10);
    driver.password_hash = await bcrypt.hash(driver.password_hash, salt);
  }
});

// Method to compare password
Driver.prototype.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

module.exports = Driver;