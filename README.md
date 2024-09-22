# Project API Documentation

## Overview
This document provides a comprehensive overview of the API routes for the application, detailing their functionality and usage.

## Table of Contents
- [Introduction](#introduction)
- [Authentication](#authentication)
- [Categories](#categories)
- [Brands](#brands)
- [Subcategories](#subcategories)
- [Products](#products)
- [Users](#users)
- [Reviews](#reviews)
- [Watchlist](#watchlist)
- [Addresses](#addresses)
- [Coupons](#coupons)
- [Cart](#cart)
- [Error Handling](#error-handling)
- [API Versioning](#api-versioning)
- [Environment Setup](#environment-setup)
- [Contributing](#contributing)
- [License](#license)
- [steps to run](#steps-to-run)

## Introduction
This API serves as the backend for an e-commerce application, providing endpoints for managing products, users, orders, and more. All routes are protected, and certain routes are restricted to admin users.

## Authentication
### Endpoints
- **Login**: `POST api/v1/auth/login`  
  *Authenticates a user and returns a token.*
  
- **Logout**: `POST api/v1/auth/logout`  
  *Invalidates the user’s token.*

- **Register**: `POST api/v1/auth/register`  
  *Creates a new user account.*

- **Forgot Password**: `POST api/v1/auth/forgotPassword`  
  *Sends a password reset link to the user’s email.*

- **Reset Password**: `POST api/v1/auth/resetPassword`  
  *Resets the user's password.*

## Categories
### Endpoints
- **Get all categories**: `GET api/v1/category`
- **Delete category**: `DELETE api/v1/category/:categoryId`
- **Get specific category**: `GET api/v1/category/:categoryId`
- **Create new category**: `POST api/v1/category`
- **Update specific category**: `PUT api/v1/category/:categoryId`

## Brands
### Endpoints
- **Get all brands**: `GET api/v1/brand`
- **Delete brand**: `DELETE api/v1/brand/:brandId`
- **Get specific brand**: `GET api/v1/brand/:brandId`
- **Create new brand**: `POST api/v1/brand`
- **Update specific brand**: `PUT api/v1/brand/:brandId`

## Subcategories
### Endpoints
- **Get all subcategories**: `GET api/v1/subCategory`
- **Delete subcategory**: `DELETE api/v1/subCategory/:subCategoryId`
- **Get specific subcategory**: `GET api/v1/subCategory/:subCategoryId`
- **Create new subcategory**: `POST api/v1/subCategory`
- **Update specific subcategory**: `PUT api/v1/subCategory/:subCategoryId`

## Products
### Endpoints
- **Get all products**: `GET api/v1/product`
- **Delete product**: `DELETE api/v1/product/:productId`
- **Get specific product**: `GET api/v1/product/:productId`
- **Create new product**: `POST api/v1/product`
- **Update specific product**: `PUT api/v1/product/:productId`

## Users
### Endpoints
- **Get all users**: `GET api/v1/user`
- **Delete user**: `DELETE api/v1/user/:userId`
- **Get specific user**: `GET api/v1/user/:userId`
- **Create new user**: `POST api/v1/user`
- **Update specific user**: `PUT api/v1/user/:userId`

## Reviews
### Endpoints
- **Get all reviews**: `GET api/v1/review`
- **Delete review**: `DELETE api/v1/review/:reviewId`
- **Get specific review**: `GET api/v1/review/:reviewId`
- **Create new review**: `POST api/v1/product/:productId/review`
- **Update specific review**: `PUT api/v1/review/:reviewId`

## Watchlist
### Endpoints
- **Add product to watchlist**: `POST api/v1/watchlist/:productId`
- **Delete product from watchlist**: `DELETE api/v1/watchlist/:productId`
- **Get watchlist**: `GET api/v1/watchlist`

## Addresses
### Endpoints
- **Add addresses for user**: `POST api/v1/addresses`
- **Delete addresses from user**: `DELETE api/v1/addresses`
- **Get addresses**: `GET api/v1/addresses`

## Coupons
### Endpoints
- **Get all coupons**: `GET api/v1/coupon`
- **Create coupon**: `POST api/v1/coupon`
- **Delete coupon**: `DELETE api/v1/coupon/:couponCode`
- **Get specific coupon**: `GET api/v1/coupon/:couponId`
- **Update specific coupon**: `PUT api/v1/coupon/:couponId`

## Cart
### Endpoints
- **Add product to cart**: `POST api/v1/cart/:productId`
- **Delete product from cart**: `DELETE api/v1/cart/:productId`
- **Delete all items from cart**: `DELETE api/v1/cart`
- **Get cart**: `GET api/v1/cart`
- **Update cart**: `PUT api/v1/cart`

## Error Handling
The API uses standard HTTP status codes to indicate the outcome of a request. Common error responses include:
- **400 Bad Request**: The request was invalid. Check the request body and parameters.
- **401 Unauthorized**: Authentication failed. Please check your token.
- **403 Forbidden**: The user does not have permission to access this resource.
- **404 Not Found**: The requested resource was not found.
- **500 Internal Server Error**: An unexpected error occurred on the server.

In the response body, you will receive a JSON object with an error message, for example:
```json
{
    "error": "Resource not found."
}

## steps to run
- **npm i**: for install all packages
- **set config file **: have secure data like port, stripe API key, jsonwebtoken security key
- **npm run start:dev**: for run the project in development mode
