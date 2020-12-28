# Coolshop
  An ECommerce website powered by CommerceJS and NextJS
 
## Run Locally

### 1. Clone repo

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

### 3. Install NPM Packages

```
$ npm install
```

### 4. Run Application

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
- 
### 3. Check order
- open admin dashboard on https://dashboard.chec.io/orders
- find the last order
- check email to see the order


## Deploy on vercel

### 1. Create vercel account
- open 