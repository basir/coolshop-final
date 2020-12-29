# Coolshop
  An ECommerce website powered by CommerceJS and NextJS
 
## Run Locally

### 1. Fork and Clone repo
- Open http://github.com/basir/coolshop-final.git
- Fork repo
- Open terminal
```
$ git clone git@github.com:basir/coolshop-final.git
$ cd coolshop-final
```

### 2. Get CommerceJS keys
Create account on [CommerceJS](http://commercejs.com/) website and get your api keys.

### 3. Create .env file
```
COMMERCE_PUBLIC_KEY_LIVE=pk_xxx
COMMERCE_SECRET_KEY_LIVE=sk_xxx
```

### 4. Install NPM Packages
```
$ npm install
```

### 5. Run Application
```
$ npm run dev
```

### 6. Open ecommerce website
Open [http://localhost:3000](http://localhost:3000)

## Use Ecommerce Website

### 1. Create product
Create a product on [CommerceJS dashboard](https://dashboard.chec.io/products).
 - Set SHIPPING OPTIONS to enabled
 - Set Domestic (United States) to enabled

### 2. Place an order
- open website on http://localhost:3000
- select one product
- add to cart
- proceed to checkout
- confirm order
  
### 3. Check order
- open admin dashboard on https://dashboard.chec.io/orders
- find the last order
- check email to see the order

## Deploy on Vercel

### 1. Create Vercel account
- open [https://vercel.com](https://vercel.com)
- sign up and login to your account


### 2. Import github repo to vercel
- Open https://vercel.com/dashboard
- Click Import Project
- Click Import Git Repository
- Enter forked repo for coolshop on your github
- give permission in github to vercel

### 3. Enter env variable for CommerceJS
- Enter name:COMMERCE_PUBLIC_KEY_LIVE
- Enter value: your public key on Commercejs

### 4. Deploy
- click deploy button
- wait to complete deployment
- click Visit Site at the end

## Lessons
1. Introduction
   1. What we will build
   2. What we will learn
   3. What is CommerceJS
   4. What is NextJS
   5. Conclusion
2. Create NextJS App
   1. run npx create-next-app
   2. answer questions
3. Create Products
   1. Create CommerceJS account
   2. Create a merchant
   3. Create a product
   4. Enter image, name, price, shipping, ...
   5. Create 2 more products
4. List Products
   1. Create utils/commerce.js
   2. Edit pages/index.js
   3. commerce.products.list()
   4. Show products in divs
6. Create React Context
   1. Create Store.js
   2. Create _app.js
   3. set publicKey in page props
5. Design MaterialUI Layout
   1. Install MaterialUI packages
   3. Create _document.js
   2. Create Layout.js
7. Show Cart Menu on Header
   1. Create CART_RETRIEVE actions
   2. show cart items in header
8. Style Product List Screen
   1. Use Layout
   2. Show alert on no product found
   3. Create Grid, Slide, ...
9.  Create Product Details Screen
   4. create products/[id].js
   5. create 2 columns
10. Implement Add To Cart action
   6.  check cart line items
   7.  add or update item in the cart
   8.  redirect to /cart
11. Create Cart Screen
    1.  add cart items columns
    2.  add cart summary columns
12. Implement Cart Actions
    1.  update cart item
    2.  remove cart item
    3.  proceed to checkout
13. Create Checkout Screen
    1.  Create checkout form and order summary columns
    2.  create steppers to make a wizard
14. Create Checkout Form
    1.  add customer details inputs
    2.  add Shipping details inputs
    3.  add Payment information inputs
15. Fetch Select Options
    1.  fetch countries
    2.  fetch states 
    3.  fetch shipping options
16. Implement Checkout Actions
    1.  Create order
    2.  Show error on creating order
    3.  Set order in Context
    4.  redirect user to confirmation screen on success
17. Create order confirmation screen
    1.  Show order summary
    2.  Show order details
18. Deploy on Vercel
    1.  Open https://vercel.com/dashboard
    2.  Click Import Project
    3.  Click Import Git Repository
    4.  Enter forked repo for coolshop on your github
    5.  give permission in github to vercel
    6.  Enter env variable for CommerceJS
    7.  Enter name:COMMERCE_PUBLIC_KEY_LIVE
    8.  Enter value: your public key on Commercejs
    