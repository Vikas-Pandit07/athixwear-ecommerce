# AthixWear E-Commerce Platform 👕

![GitHub](https://img.shields.io/badge/React-18.2-blue)
![GitHub](https://img.shields.io/badge/Spring_Boot-3.3-green)
![GitHub](https://img.shields.io/badge/MySQL-8.0-orange)
![GitHub](https://img.shields.io/badge/License-MIT-yellow)

A modern, full-stack e-commerce application built with React and Spring Boot.

## 🚀 Live Demo

- **Frontend:** [Coming Soon]
- **Backend API:** `http://localhost:9090`

## 📸 Screenshots

| Login Page                      | Dashboard                               | Product View                        |
| ------------------------------- | --------------------------------------- | ----------------------------------- |
| ![Login](screenshots/login.png) | ![Dashboard](screenshots/dashboard.png) | ![Product](screenshots/product.png) |

## ✨ Features

### ✅ Authentication & Security

- User Registration & Login with JWT
- Password Reset via Email
- Role-based Authorization (Admin/Customer)
- Protected Routes

### 🛒 E-commerce Features

- Product Browsing with Categories
- Advanced Search & Filtering
- Shopping Cart Management
- Wishlist Functionality
- Order Placement & Tracking

### 👨‍💼 Admin Dashboard

- Product Management (CRUD)
- Order Management
- User Management
- Sales Analytics
- Inventory Tracking

### 🎨 User Experience

- Responsive Design
- Loading Skeletons
- Toast Notifications
- Modern UI/UX
- Mobile Friendly

## 🏗️ Tech Stack

### **Frontend**

- React 18
- React Router DOM
- CSS3 (Custom Styled)
- Axios for API calls

### **Backend**

- Spring Boot 3.3
- Spring Security with JWT
- Spring Data JPA
- MySQL Database
- Cloudinary (Image Storage)

### **Tools & Libraries**

- Git & GitHub
- Postman (API Testing)
- VS Code / IntelliJ IDEA / Ste(Spring Tool Suite
- Maven (Dependency Management)

## 📁 Project Structure

athixwear-ecommerce/
├── frontend/ # React Application
│ ├── src/
│ │ ├── components/ # Reusable components
│ │ ├── pages/ # Page components
│ │ ├── assets/ # CSS & Images
│ │ └── utils/ # Helper functions
│ └── package.json
│
├── backend/ # Spring Boot Application
│ ├── src/main/java/com/athixwear/
│ │ ├── controller/ # REST Controllers
│ │ ├── service/ # Business Logic
│ │ ├── repository/ # Data Access
│ │ ├── entity/ # JPA Entities
│ │ ├── dto/ # Data Transfer Objects
│ │ └── security/ # JWT & Security
│ └── pom.xml
│
└── README.md # This file

## 🛠️ Installation & Setup

### **Prerequisites**

- Node.js (v16 or higher)
- Java 17 or higher
- MySQL 8.0
- Git

### **Backend Setup**

# Clone the repository

git clone https://github.com/Vikas-Pandit07/athixwear-ecommerce.git
cd athixwear-ecommerce/backend

# Configure application.properties

# Update database credentials in src/main/resources/application.properties

# Run the Spring Boot application

mvn spring-boot:run

# Server starts at http://localhost:9090

Frontend Setup

cd ../frontend

# Install dependencies

npm install

# Start development server

npm run dev

# App runs at http://localhost:5173

🔧 Environment Variables
Create .env file in frontend:
VITE_API_URL=http://localhost:9090/api

Update application.properties in backend:
spring.datasource.url=jdbc:mysql://localhost:3306/athixwear
spring.datasource.username=root
spring.datasource.password=your_password

jwt.secret=your_jwt_secret_key
cloudinary.cloud-name=your_cloud_name
cloudinary.api-key=your_api_key
cloudinary.api-secret=your_api_secret

🗃️ Database Schema
Key tables: users, products, categories, cart, cart_items, orders, order_items

📚 API Documentation
Authentication Endpoints
POST /api/auth/register - Register new user

POST /api/auth/login - User login

POST /api/auth/forgot-password - Request password reset

POST /api/auth/reset-password - Reset password

Product Endpoints
GET /api/products - Get all products

GET /api/products?category={name} - Filter by category

Cart Endpoints
POST /api/cart/add - Add to cart

GET /api/cart - Get cart items

PUT /api/cart/items/{id} - Update quantity

DELETE /api/cart/items/{id} - Remove from cart

🧪 Testing

# Backend tests

mvn test

# Frontend tests

npm test
🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit changes (git commit -m 'Add some AmazingFeature')

Push to branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is licensed under the MIT License - see LICENSE file for details.

📞 Contact
Vikas Pandit - @Vikas-Pandit07
Email: vikaaspanditt369@gmail.com

Project Link: comming soon

⭐️ Star this repository if you find it helpful!
EOF

