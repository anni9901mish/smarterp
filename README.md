# SmartERP

SmartERP is a full-stack ERP web application built to simplify day-to-day business operations such as inventory management, billing, sales, purchases, customer management, and accounting.

The project is inspired by TallyPrime but built using modern web technologies with a cleaner interface and cloud deployment support.

---

## Features

### Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes

### Company Management
- Create, Update and Delete Company
- Multi-company support
- Company-wise data isolation

### Ledger
- Customer & Supplier Management
- Opening Balance
- Outstanding Balance
- Search and Edit Ledger

### Inventory
- Add/Edit/Delete Items
- Product Code
- HSN Code
- Purchase Price
- Selling Price
- GST
- Current Stock
- Minimum Stock
- Inventory Value

### Purchase
- Purchase Voucher
- Supplier Selection
- Automatic Stock Update
- Purchase History
- Voucher Details

### Sales
- Sales Voucher
- Customer Selection
- Automatic Stock Deduction
- Sales History
- Invoice Generation

### Dashboard
- Sales Summary
- Purchase Summary
- Customer Count
- Supplier Count
- Inventory Value
- Low Stock Indicator
- Sales Analytics
- Inventory Status

### Reports
- Sales Report
- Purchase Report
- Inventory Report
- Voucher Reports

### Invoice
- Print Invoice
- Download PDF

---

# Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Framer Motion
- Axios
- Recharts
- Lucide React

### Backend

- Node.js
- Express.js
- Prisma ORM
- JWT
- bcryptjs

### Database

- PostgreSQL

### Deployment

- Vercel
- Render

---

# Folder Structure

```
ERP
│
├── frontend
│   ├── src
│   ├── public
│   ├── components
│   ├── pages
│   └── api
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── prisma
│   ├── routes
│   └── server.js
│
└── README.md
```

---

# Getting Started

Clone the repository

```bash
git clone https://github.com/anni9901mish/smarterp.git
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file

```env
DATABASE_URL=
JWT_SECRET=
PORT=5000
```

Run

```bash
npx prisma generate
npx prisma db push
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Run

```bash
npm run dev
```

---

# Architecture

```
React + Vite
        │
        │ Axios
        ▼
Express API
        │
        │ Prisma ORM
        ▼
PostgreSQL
```

---

# Database Design

```
User
 │
 ├── Company
 │       │
 │       ├── Ledger
 │       ├── Item
 │       └── Voucher
 │               │
 │               └── Voucher Items
```

---

# API Overview

Authentication

```
POST /api/auth/register

POST /api/auth/login
```

Company

```
GET    /api/company

POST   /api/company

PUT    /api/company/:id

DELETE /api/company/:id
```

Ledger

```
GET

POST

PUT

DELETE
```

Items

```
GET

POST

PUT

DELETE
```

Purchase

```
POST Purchase Voucher

GET Purchase History

GET Voucher Details
```

Sales

```
POST Sales Voucher

GET Sales History

GET Voucher Details
```

Dashboard

```
GET Dashboard Summary
```

Reports

```
Sales Report

Purchase Report

Inventory Report
```

# Future Scope

- Barcode Support
- QR Invoice
- Email Invoice
- Excel Export
- AI Sales Forecast
- AI Inventory Prediction
- Role Based Access
- Backup & Restore



# Author

Animesh Mishra

GitHub

https://github.com/anni9901mish

LinkedIn

https://www.linkedin.com/in/animesh-mishra



If you have any suggestions or feedback regarding the project, feel free to open an issue or connect with me.
