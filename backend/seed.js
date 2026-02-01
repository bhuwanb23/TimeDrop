require('dotenv').config();
const { sequelize } = require('./src/config/database');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const Category = require('./src/models/Category');

async function seedDatabase() {
  try {
    console.log('Seeding database...');
    
    // Authenticate with the database first
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    // Sync models to create tables
    await sequelize.sync();
    console.log('Tables synchronized.');
    
    // Create sample user
    const sampleUser = await User.findOrCreate({
      where: { email: 'driver@example.com' },
      defaults: {
        name: 'John Driver',
        email: 'driver@example.com',
        password: 'hashed_password_placeholder', // In real app, this would be bcrypt hashed
        phone: '+1234567890',
        role: 'driver',
        status: 'active'
      }
    });
    
    console.log('Sample user created:', sampleUser[0].name);
    
    // Create sample customer
    const sampleCustomer = await User.findOrCreate({
      where: { email: 'customer@example.com' },
      defaults: {
        name: 'Jane Customer',
        email: 'customer@example.com',
        password: 'hashed_password_placeholder', // In real app, this would be bcrypt hashed
        phone: '+0987654321',
        role: 'customer',
        status: 'active'
      }
    });
    
    console.log('Sample customer created:', sampleCustomer[0].name);
    
    // Create sample products
    const electronicsCategory = await Category.findOrCreate({
      where: { name: 'Electronics' },
      defaults: {
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        status: 'active'
      }
    });
    
    const homeCategory = await Category.findOrCreate({
      where: { name: 'Home' },
      defaults: {
        name: 'Home',
        description: 'Home and kitchen items',
        status: 'active'
      }
    });
    
    const fashionCategory = await Category.findOrCreate({
      where: { name: 'Fashion' },
      defaults: {
        name: 'Fashion',
        description: 'Clothing and accessories',
        status: 'active'
      }
    });
    
    const sampleProducts = [
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 129.00,
        stock_quantity: 50,
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEdclVWy3M8BxMzFeb1J8f-hS8djSpmXa6b9iE8h9X0A8zLlFO0WmE7ZRrSxnR9-_RWY_1PMTL4TOfjJHRSHdDJn1rdYoASaK6VNdURRjwlX8q5eqYehv8VH3a5CRK9MEDCT4APc6sV1p55Dq4Wecd4F8m8ik8Hu6RTrUZx4pr0tY44g57TsGfQx_Ijy9PGKM4Av2BEK-nsWHj2gVGmBRK67hOY1nqg_tSaKzx960_DQQpAn07KDKG5qhO9UfXeV8BVvLayHEnPgE',
        category_id: electronicsCategory[0].id,
        status: 'active',
        rating: 4.5
      },
      {
        name: 'Smart Watch Series 7',
        description: 'Latest smartwatch with health monitoring features',
        price: 199.00,
        stock_quantity: 30,
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQO437bK_hgQmHBH9VoZkMmbRpEslnGjb9OmHyaCKtH6qe6i0p3Z7EXKX5kMG8Zf5ZGHPHcwIhKYl9g7u-uPA1ui4BoLYK5FDtLaRsCy5lQMSJmucwZ2OqlWzrQXGVtGF39nvi_vlfJ-iTvHpL90HXtzK6OBj-l3Fl3GelEeZItTGgwWBCatUx2yRxYaMYBeM533BOKAf4iFRX_uuMj3JbTaea4Vre3rEApKuXSRO1mAMSisEQP15ykRRaE1sUuqEGc_Ysniz_MIg',
        category_id: electronicsCategory[0].id,
        status: 'active',
        rating: 4.7
      },
      {
        name: 'Minimalist Lamp',
        description: 'Modern minimalist desk lamp with adjustable brightness',
        price: 45.00,
        stock_quantity: 25,
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKS0Pgzg5smSaKAiicZemb5MlJn114352m03oR2dmX9Uaiv7VIrAKughWPR8uz77s0QCTcAdt1GugcbACR2JOXd7GdhFTORwRZkbkLdWDm-ufDhZhkioucO-rlgIu3gGouseZl00OlkGV70_iuxXBwIdQvItQKkpMQmfg_kTmbo3IkO-iOfZ8iqmJjoeD2JSPagh2Jc7ewKn1zZD9hdfDS0-N-xYhtOp--7mh1qlmJKcoo5TNsTg6iG7j-nAGmYE72e6leicMG4AU',
        category_id: homeCategory[0].id,
        status: 'active',
        rating: 4.3
      },
      {
        name: 'Leather Jacket',
        description: 'Premium genuine leather jacket for men',
        price: 120.00,
        stock_quantity: 15,
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBBqBSbJ6tsg-GPkChiFsBu4qV5kOhQe9zicIg2RFU9sohLTWC0nslkxbLPOJ0vAl3OxrvxkpqEKufQcu14lPsMGU_l0zyFTh50UP0GHRqmxwVcPFEZIM-Cra4uQBML6c6Mbq7RjN2yKW63liuwhZt8FQF6L1RdluIbJTYonkZucdwexp2f6vDNB6L8vcnypK_LKcwnxfaut6uOjeMKL9dr3cikoIDPp7_QbwSemyE6U6tXEC1BI9J1KcKnS0vz6uczJX8V_nbeHY',
        category_id: fashionCategory[0].id,
        status: 'active',
        rating: 4.6
      },
      {
        name: 'Bluetooth Speaker',
        description: 'Portable Bluetooth speaker with excellent sound quality',
        price: 79.99,
        stock_quantity: 40,
        image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEdclVWy3M8BxMzFeb1J8f-hS8djSpmXa6b9iE8h9X0A8zLlFO0WmE7ZRrSxnR9-_RWY_1PMTL4TOfjJHRSHdDJn1rdYoASaK6VNdURRjwlX8q5eqYehv8VH3a5CRK9MEDCT4APc6sV1p55Dq4Wecd4F8m8ik8Hu6RTrUZx4pr0tY44g57TsGfQx_Ijy9PGKM4Av2BEK-nsWHj2gVGmBRK67hOY1nqg_tSaKzx960_DQQpAn07KDKG5qhO9UfXeV8BVvLayHEnPgE',
        category_id: electronicsCategory[0].id,
        status: 'active',
        rating: 4.4
      }
    ];
    
    for (const productData of sampleProducts) {
      const [product, created] = await Product.findOrCreate({
        where: { name: productData.name },
        defaults: productData
      });
      
      if (created) {
        console.log(`Created product: ${product.name}`);
      } else {
        console.log(`Product already exists: ${product.name}`);
      }
    }
    
    console.log('Database seeded successfully!');
    await sequelize.close(); // Close the connection
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();