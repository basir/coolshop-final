# Coolshop - An ECommerce website powered by CommerceJS and NextJS

In this course I teach you how to build an ecommerce ECommerce website powered by CommerceJS and NextJS.

## Run Locally

### 1. Clone repo

```
$ git clone git@github.com:basir/coolshop-final.git
$ cd coolshop-final
```

### 2. Setup MongoDB

- Local MongoDB
  - Install it from [here](https://www.mongodb.com/try/download/community)
  - Create .env file in root folder
  - Set MONGODB_URL=mongodb://localhost/coolshop-final  
- Atlas Cloud MongoDB
  - Create database at [https://cloud.mongodb.com](https://cloud.mongodb.com)
  - Create .env file in root folder
  - Set MONGODB_URL=mongodb+srv://your-db-connection

### 3. Install NPM Packages

```
$ npm install
```

### 4. Run Application

```
$ npm run dev
```

### 5. Seed Users and Products

- Run this on chrome: http://localhost:3000/api/users/seed
- It returns admin email (admin@example.com) and password (1234)
- Run this on chrome: http://localhost:3000/api/products/seed
- It creates 6 sample products

### 6. Admin Login

- Run http://localhost:3000/signin
- Enter admin email and password and click signin
