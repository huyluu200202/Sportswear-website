# Sportswear E-commerce Website

This project is a sportswear e-commerce website built using Node.js, Express.js, and MongoDB. It provides various features for users and administrators, including user authentication, product search, shopping cart management, and order management.

Video demo: https://drive.google.com/file/d/1weIjTJCAfbbI4wAmCwQJDBqsIEZJ8_Lx/view

## Table of Contents

- [Features](#features)
  - [User](#user)
  - [Admin](#admin)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [First-Time Setup](#first-time-setup)

## Features

### User
- **Sign Up**: Create a new account.
- **Log In**: Access the website using registered credentials.
- **Log Out**: Sign out from the website.
- **Search**: Search for sportswear products.
- **View Products**: Browse through different sportswear products.
- **Add to Cart**: Add products to the shopping cart.

### Admin
- **Add Products**: Add new products to the store.
- **Edit Products**: Modify existing product details.
- **Soft Delete Products**: Remove products from the store without permanently deleting them.
- **Order Management**: View and manage customer orders.

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed and running

### Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/huyluu200202/Sportswear-website.git
    cd sportswear-ecommerce
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Set up environment variables**:
    Create a `.env` file in the root directory and add the following variables:
    ```
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/Sportswear
    SESSION_SECRET=your_secret_key
    ```

4. **Start the server**:
    ```sh
    npm start
    ```

    The server will start on `http://localhost:3000`.

### First-Time Setup

- To create an admin account:
  1. Sign up with your preferred email and password.
  2. Manually update the role of this user in the `users` collection in your MongoDB database from `user` to `admin`. You can do this using a MongoDB GUI tool like MongoDB Compass, or through the MongoDB shell:

    ```js
    db.users.updateOne(
      { email: "admin@example.com" },
      { $set: { role: "admin" } }
    );
    ```
