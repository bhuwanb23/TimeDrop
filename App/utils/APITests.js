// Simple API testing utilities for development
const API_TESTS = {
    // Test product endpoints
    async testProductsAPI() {
        try {
            console.log('🧪 Testing Products API...');
            
            // Test get all products
            const productsResponse = await fetch('http://localhost:3000/api/products');
            const productsData = await productsResponse.json();
            console.log('✅ Products API:', productsData.message);
            
            // Test single product (if products exist)
            if (productsData.data && productsData.data.products && productsData.data.products.length > 0) {
                const firstProductId = productsData.data.products[0].id;
                const productResponse = await fetch(`http://localhost:3000/api/products/${firstProductId}`);
                const productData = await productResponse.json();
                console.log('✅ Single Product API:', productData.message);
            }
            
            return true;
        } catch (error) {
            console.error('❌ Products API Test Failed:', error.message);
            return false;
        }
    },

    // Test order endpoints
    async testOrdersAPI() {
        try {
            console.log('🧪 Testing Orders API...');
            
            // Test get all orders
            const ordersResponse = await fetch('http://localhost:3000/api/orders');
            const ordersData = await ordersResponse.json();
            console.log('✅ Orders API:', ordersData.message);
            
            return true;
        } catch (error) {
            console.error('❌ Orders API Test Failed:', error.message);
            return false;
        }
    },

    // Test health endpoint
    async testHealthAPI() {
        try {
            console.log('🧪 Testing Health API...');
            
            const healthResponse = await fetch('http://localhost:3000/health');
            const healthData = await healthResponse.json();
            console.log('✅ Health API:', healthData.status);
            
            return true;
        } catch (error) {
            console.error('❌ Health API Test Failed:', error.message);
            return false;
        }
    },

    // Run all tests
    async runAllTests() {
        console.log('🚀 Running API Tests...\n');
        
        const results = {
            health: await this.testHealthAPI(),
            products: await this.testProductsAPI(),
            orders: await this.testOrdersAPI()
        };
        
        console.log('\n📊 Test Results Summary:');
        console.log('========================');
        Object.entries(results).forEach(([test, passed]) => {
            console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
        });
        
        const allPassed = Object.values(results).every(result => result);
        console.log(`\n${allPassed ? '🎉 All tests passed!' : '⚠️  Some tests failed!'}`);
        
        return allPassed;
    }
};

// Export for use in development
export default API_TESTS;

// Usage example:
// In development console: 
// import API_TESTS from './utils/APITests';
// API_TESTS.runAllTests();