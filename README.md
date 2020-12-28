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

