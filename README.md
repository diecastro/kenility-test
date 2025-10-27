# 🧩 Kenility Technical Test

This project was developed as part of a technical assessment for **Kenility**.  
It implements a **RESTful API** using **NestJS** and **MongoDB**, featuring authentication, product and order management, and analytical endpoints.

---

## 🚀 Features

### Core Requirements
- **NestJS** API connected to **MongoDB** using `@nestjs/mongoose`
- **JWT Authentication** for secure access
- **Product Management**
    - Create, list, and retrieve products
    - Fields: `name`, `sku`, `picture`, and `price`
    - File upload supported for product images
- **Order Management**
    - Create and update orders
    - Fields: `identifier`, `clientName`, `total`, and `productList`
- **Analytical Endpoints**
    - Get total sold price for the last month
    - Get highest amount order

### Bonus Features
- **Dockerized environment** for both the API and MongoDB
- **Search Products**
    - Pagination
    - Sorting
    - Filtering (exact match and criteria)

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| Framework | [NestJS](https://nestjs.com/) |
| Database | [MongoDB](https://www.mongodb.com/) |
| ODM | [Mongoose](https://mongoosejs.com/) |
| Auth | [JWT](https://jwt.io/) |
| File Upload | [Multer](https://github.com/expressjs/multer) |
| Containerization | [Docker](https://www.docker.com/) |
| Language | TypeScript |

---

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/diecastro/kenility-test.git
cd kenility-test
```

### 2. Install dependencies
Using **Yarn** (recommended):
```bash
yarn install
```

Or with **npm**:
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory with the following content:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/kenility
JWT_SECRET=supersecretkey
```

---

## 🐳 Running with Docker (Bonus)

To run both MongoDB and the API with Docker:

```bash
docker-compose up --build
```

This will:
- Launch MongoDB on port `27017`
- Start the NestJS API on port `3000`

---

## ▶️ Running the App Locally

### Development
```bash
yarn start:dev
```

### Production
```bash
yarn build
yarn start:prod
```

API will be available at  
👉 `http://localhost:3000`

---

## 🔐 Authentication

JWT tokens are required for protected routes.  
To authenticate:
1. Register or log in using the `/auth/login` endpoint.
2. Use the returned token as a `Bearer` token in your headers:

```
Authorization: Bearer <your_token_here>
```

---

## 📦 API Endpoints

### **Products**
| Method | Endpoint | Description |
|---------|-----------|-------------|
| `POST` | `/products` | Create a new product (with image upload) |
| `GET` | `/products/:id` | Retrieve a specific product |
| `GET` | `/products` | List products with pagination, sorting, filtering |

### **Orders**
| Method | Endpoint | Description |
|---------|-----------|-------------|
| `POST` | `/orders` | Create a new order |
| `PUT` | `/orders/:id` | Update an existing order |
| `GET` | `/orders/total-last-month` | Get total sold price for the last month |
| `GET` | `/orders/highest` | Get highest amount order |

---

## 🧪 Example Requests

### Create Product
```bash
POST /products
Content-Type: multipart/form-data
Authorization: Bearer <token>

{
  "name": "Wireless Mouse",
  "sku": "WM-123",
  "price": 25.99,
  "picture": <image_file>
}
```

### Create Order
```bash
POST /orders
Authorization: Bearer <token>

{
  "identifier": "ORD-001",
  "clientName": "John Doe",
  "products": ["<productId1>", "<productId2>"],
  "total": 51.98
}
```

---

## 📊 Analytical Endpoints

- **GET `/orders/total-last-month`**
    - Returns the total sales amount from the last 30 days.
- **GET `/orders/highest`**
    - Returns the order with the highest total amount.

---

## 🧠 Project Structure

```
src/
├── auth/
├── products/
├── orders/
├── common/
├── main.ts
└── app.module.ts
```

---

## 🧑‍💻 Author

**Diego Alonso Castro Díaz**  
[GitHub](https://github.com/diecastro) • [LinkedIn](https://www.linkedin.com/in/diego-castro-22882a76/)

---

## 📄 License

This project is released under the **MIT License**.

---
