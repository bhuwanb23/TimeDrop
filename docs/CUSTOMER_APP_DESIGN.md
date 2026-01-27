# Customer App Design Specification

## 1. Product Catalog Screen

### Design Theme: Modern Minimalist with Soft Shadows
**Color Palette:**
- Primary: #1152d4 (Deep Blue)
- Secondary: #f59e0b (Amber)
- Background: #f8fafc (Light Gray)
- Text: #111318 (Dark Gray)
- Accent: #dbeafe (Light Blue)

### Layout Structure
```
┌─────────────────────────────────┐
│  ┌─────────────────────────────┐ │
│  │  Search Bar                 │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │  Categories                 │ │
│  │  [All] [Food] [Drinks] [Snacks]│ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │  Product Grid               │ │
│  │  ┌─────┐ ┌─────┐ ┌─────┐   │ │
│  │  │Item1│ │Item2│ │Item3│   │ │
│  │  └─────┘ └─────┘ └─────┘   │ │
│  │  ┌─────┐ ┌─────┐ ┌─────┐   │ │
│  │  │Item4│ │Item5│ │Item6│   │ │
│  │  └─────┘ └─────┘ └─────┘   │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │  Bottom Navigation          │ │
│  │  [Home] [Cart] [Profile]    │ │
│  └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### Product Card Design (100-150 words)
Each product card features a clean, modern design with soft shadows and rounded corners. The card displays a high-quality product image at the top, followed by the product name in bold typography. The price is prominently displayed in the primary color (#1152d4) with a subtle background highlight. A brief description provides context, while an "Add to Cart" button with a subtle gradient sits at the bottom. The card includes a small wishlist icon in the top-right corner. Hover effects (on web) or tap feedback (mobile) provide interactive cues. The design maintains consistent spacing with 16px padding and 12px between elements. Cards are arranged in a responsive grid that adapts to different screen sizes. The overall aesthetic is clean, professional, and inviting, encouraging users to explore and purchase products.

### Key Features
- Search bar with real-time filtering
- Category tabs with active state indication
- Responsive grid layout (2-3 columns)
- Pull-to-refresh functionality
- Infinite scrolling for large catalogs
- Sort options (Price: Low-High, High-Low, Popularity)

## 2. Product Detail Screen

### Layout Structure
```
┌─────────────────────────────────┐
│  ┌─────────────────────────────┐ │
│  │  Image Gallery              │ │
│  │  [Main Image]               │ │
│  │  [Thumbnail][Thumbnail]     │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │  Product Info               │ │
│  │  Product Name               │ │
│  │  ⭐⭐⭐⭐⭐ (4.5) 128 reviews  │ │
│  │  $12.99                     │ │
│  │  Description text...        │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │  Quantity Selector          │ │
│  │  [-] 2 [+]                  │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │  [♥] [Add to Cart] [Buy Now]│ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │  Related Products           │ │
│  │  ┌─────┐ ┌─────┐ ┌─────┐   │ │
│  │  │RP1  │ │RP2  │ │RP3  │   │ │
│  │  └─────┘ └─────┘ └─────┘   │ │
│  └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### Product Detail Design (100-150 words)
The product detail screen offers an immersive shopping experience with a focus on product information and easy purchasing. The screen begins with a prominent image gallery featuring swipeable product photos and thumbnail navigation. Below, product information is clearly organized with the name in large, bold typography, followed by star ratings and review count in a subtle accent color. The price is displayed prominently, often with any discounts or special offers highlighted. A detailed description section provides comprehensive product information. The quantity selector features intuitive plus/minus buttons with proper validation. Action buttons include "Add to Cart" and "Buy Now" with distinct styling to guide user actions. The screen concludes with a "Related Products" section to encourage additional purchases. The design maintains excellent readability with proper spacing and typography hierarchy.

## 3. Shopping Cart Screen

### Layout Structure
```
┌─────────────────────────────────┐
│  ┌─────────────────────────────┐ │
│  │  Cart Items (Scrollable)    │ │
│  │  ┌─────────────────────────┐ │ │
│  │  │ [Image] Item Name       │ │ │
│  │  │         $12.99          │ │ │
│  │  │ [-] 2 [+]      [×]     │ │ │
│  │  └─────────────────────────┘ │ │
│  │  ┌─────────────────────────┐ │ │
│  │  │ [Image] Item Name       │ │ │
│  │  │         $8.50           │ │ │
│  │  │ [-] 1 [+]      [×]     │ │ │
│  │  └─────────────────────────┘ │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │  Promo Code                 │ │
│  │  [Enter Code] [Apply]       │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │  Order Summary              │ │
│  │  Subtotal:      $21.49      │ │
│  │  Delivery Fee:  $2.99       │ │
│  │  Tax:           $1.72       │ │
│  │  ────────────────────────── │ │
│  │  Total:         $26.20      │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │  [Continue Shopping]        │ │
│  │  [Proceed to Checkout]      │ │
│  └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### Cart Screen Design (100-150 words)
The shopping cart screen provides a clear overview of selected items with intuitive editing capabilities. Each cart item displays a thumbnail image, product name, and price in a clean horizontal layout. Quantity controls feature prominent plus/minus buttons for easy adjustment, while a trash icon allows quick item removal. The cart maintains real-time updates as quantities change or items are removed. A dedicated section for promo codes enables users to apply discounts or special offers. The order summary section clearly breaks down costs including subtotal, delivery fees, and taxes, with the final total prominently displayed. Action buttons include "Continue Shopping" for users who want to browse more items and "Proceed to Checkout" for those ready to complete their purchase. The design emphasizes clarity and ease of use, ensuring users can quickly review and modify their selections before checkout.

## 4. Checkout Screen

### Layout Structure (Multi-step)
```
Step 1: Delivery Information
┌─────────────────────────────────┐
│  ┌─────────────────────────────┐ │
│  │  Step Indicator             │ │
│  │  ● 1  ○ 2  ○ 3  ○ 4        │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │  Delivery Address           │ │
│  │  [Full Name]                │ │
│  │  [Phone Number]             │ │
│  │  [Address Line 1]           │ │
│  │  [Address Line 2]           │ │
│  │  [City] [State] [ZIP]       │ │
│  │  [Save Address]             │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │  Delivery Time              │ │
│  │  [ASAP] [Later Today] [Tomorrow]│ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │  [Back] [Continue]          │ │
│  └─────────────────────────────┘ │
└─────────────────────────────────┘

Step 2: Payment Method
┌─────────────────────────────────┐
│  ┌─────────────────────────────┐ │
│  │  Step Indicator             │ │
│  │  ○ 1  ● 2  ○ 3  ○ 4        │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │  Payment Options            │ │
│  │  [●] Cash on Delivery       │ │
│  │  [○] Credit Card            │ │
│  │  [○] Digital Wallet         │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │  [Back] [Continue]          │ │
│  └─────────────────────────────┘ │
└─────────────────────────────────┘

Step 3: Order Review
┌─────────────────────────────────┐
│  ┌─────────────────────────────┐ │
│  │  Step Indicator             │ │
│  │  ○ 1  ○ 2  ● 3  ○ 4        │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │  Order Summary              │ │
│  │  Items: 3                   │ │
│  │  Total: $26.20              │ │
│  │  Delivery: Tomorrow 2-4PM   │ │
│  │  Payment: Cash on Delivery  │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │  [Back] [Place Order]       │ │
│  └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### Checkout Design (100-150 words)
The checkout process is designed as a multi-step wizard to guide users through the purchasing journey without overwhelming them. Each step is clearly indicated with a progress tracker showing completed and pending sections. The first step focuses on delivery information with intuitive address input fields and delivery time selection. The second step handles payment method selection with clear options for cash on delivery, credit cards, or digital wallets. The final review step presents a comprehensive summary of the order, delivery details, and payment method for user confirmation. Throughout the process, "Back" buttons allow users to correct mistakes, while "Continue" or "Place Order" buttons guide them forward. The design maintains consistency with the overall app aesthetic while emphasizing trust and security through clear communication and professional presentation. The streamlined approach reduces cart abandonment by making the process feel simple and secure.

## 5. Profile Screen

### Layout Structure
```
┌─────────────────────────────────┐
│  ┌─────────────────────────────┐ │
│  │  User Header                │ │
│  │  [Profile Image]            │ │
│  │  John Doe                   │ │
│  │  john.doe@email.com         │ │
│  │  [Edit Profile]             │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │  Quick Actions              │ │
│  │  [My Orders] [Wishlist]     │ │
│  │  [Addresses] [Settings]     │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │  Order History              │ │
│  │  ┌─────────────────────────┐ │ │
│  │  │ Order #12345           │ │ │
│  │  │ Delivered - $26.20      │ │ │
│  │  │ 2 items                 │ │ │
│  │  └─────────────────────────┘ │ │
│  │  ┌─────────────────────────┐ │ │
│  │  │ Order #12344           │ │ │
│  │  │ In Progress - $18.75    │ │ │
│  │  │ 1 item                  │ │ │
│  │  └─────────────────────────┘ │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │  [Logout]                   │ │
│  └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### Profile Screen Design (100-150 words)
The profile screen serves as a personalized hub for user account management and quick access to important features. The header section prominently displays the user's profile image, name, and email address with an easy "Edit Profile" option. Quick action buttons provide one-tap access to frequently used features like order history, wishlist, saved addresses, and app settings. The order history section shows recent purchases with clear status indicators and order details, making it easy for users to track their shopping activity. The design maintains a clean, organized layout with appropriate spacing and visual hierarchy. A prominent logout button ensures account security. The overall aesthetic is welcoming and professional, reinforcing trust while providing convenient access to account management features. The screen balances functionality with visual appeal, creating a positive user experience that encourages continued engagement with the app.

## Microcopy & Tone

### Friendly, Personalized Messaging
- "Hello there! Ready to explore some amazing products?"
- "Found something you love? Add it to your cart!"
- "Your cart is looking great! Ready to checkout?"
- "Thanks for choosing us! Your order is confirmed."
- "Made with love for you, crafted with care for your satisfaction."

### Error & Success Messages
- Success: "Perfect! Item added to your cart!"
- Error: "Oops! Something went wrong. Please try again."
- Empty State: "Your cart is empty. Let's find something amazing!"
- Loading: "Getting things ready for you..."

## Accessibility Considerations
- Proper contrast ratios for text and backgrounds
- Screen reader support for all interactive elements
- Keyboard navigation support
- Clear focus states for interactive components
- Alternative text for all images
- Scalable text for users with visual impairments