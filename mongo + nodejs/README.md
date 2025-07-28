Place CRUD Application
A simple CRUD application built with Node.js, Express, MongoDB, and Mongoose, connected to MongoDB Atlas.
Features

Create, Read, Update, and Delete places
Input validation
Error handling
MongoDB Atlas integration

Prerequisites

Node.js
MongoDB Atlas account
npm

Installation

Clone the repository
Run npm install
Create a .env file and add your MongoDB Atlas connection string
Run npm start to start the server

API Endpoints

GET /api/places - Get all places
GET /api/places/:id - Get a single place
POST /api/places - Create a new place
PUT /api/places/:id - Update a place
DELETE /api/places/:id - Delete a place

Example POST Request Body
{
    "title": "Beautiful Park",
    "description": "A lovely park with green spaces",
    "address": "123 Park Ave, City"
}
