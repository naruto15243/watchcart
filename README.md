# WatchCart

WatchCart is a full-stack marketplace and discovery platform that combines shopping, cart management, price comparison, food ordering, movie/series discovery, and user authentication in a single application.

## Features

- Product catalog and browsing
- Cart and checkout flow
- Order management
- User authentication and profile support
- Wishlist and comparison tools
- Food and restaurant discovery
- Movie, series, and entertainment recommendations
- Express + MongoDB backend API
- Static multi-page HTML frontend

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Auth: JWT + bcrypt
- Other: CORS, dotenv

## Project Structure

```text
watchcart/
├── backend/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
├── frontend/
│   ├── index.html
│   ├── products.html
│   ├── cart.html
│   ├── orders.html
│   ├── payment.html
│   ├── login.html
│   ├── profile.html
│   ├── checkout.html
│   └── ...
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB running locally or a valid MongoDB connection string

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/watchcart
JWT_SECRET=your_super_secret_key
```

## Run the app

Start the backend server:

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

Open the frontend in a browser by serving the static pages, for example:

```bash
python -m http.server 4173
```

Then visit:

```text
http://localhost:4173
```

## API Notes

The backend exposes REST APIs under `/api`, including:

- `/api/auth`
- `/api/products`
- `/api/cart`
- `/api/orders`
- `/api/wishlist`
- `/api/compare`
- `/api/recommendations`
- `/api/health`

## License

This project is for educational and portfolio use.

## GitHub Project Description

WatchCart is a full-stack shopping and discovery platform built with Node.js, Express, MongoDB, and plain HTML/CSS/JavaScript. It includes product browsing, cart management, orders, wishlist features, user authentication, and entertainment/food discovery modules in one unified app.
