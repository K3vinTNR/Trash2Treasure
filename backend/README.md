# Trash2Treasure Backend API

Backend API untuk aplikasi T2T Rewards menggunakan Express.js, TypeScript, dan MySQL.

## Setup

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Configure database**
- Copy `.env.example` menjadi `.env`
- Edit file `.env` dengan kredensial MySQL Anda:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=trash2treasure
DB_PORT=3306

JWT_SECRET=your_super_secret_jwt_key
PORT=5000
```

3. **Jalankan server**
```bash
# Development mode
npm run dev

# Build
npm run build

# Production
npm start
```

Server akan berjalan di `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User
- `GET /api/user/profile` - Get user profile (Auth required)
- `PUT /api/user/profile` - Update user profile (Auth required)
- `GET /api/user/points-history` - Get points history (Auth required)
- `POST /api/user/add-points` - Add points (Auth required)
- `GET /api/user/transactions` - Get transactions history (Auth required)

### Rewards
- `GET /api/rewards` - Get all rewards (Auth required)
- `GET /api/rewards/:id` - Get reward detail (Auth required)
- `POST /api/rewards/redeem` - Redeem reward (Auth required)

### Reminders
- `GET /api/reminders` - Get all reminders (Auth required)
- `POST /api/reminders` - Create reminder (Auth required)
- `PUT /api/reminders/:id` - Update reminder (Auth required)
- `DELETE /api/reminders/:id` - Delete reminder (Auth required)
- `PATCH /api/reminders/:id/toggle` - Toggle reminder active (Auth required)

## Authentication

API menggunakan JWT Bearer token. Setelah login, simpan token dan gunakan di header:

```
Authorization: Bearer <your_token>
```

## Testing

Gunakan tools seperti Postman atau Thunder Client untuk testing API.

### Test Login
```json
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "user.a@test.com",
  "password": "password"
}
```

Note: Password untuk dummy users di database masih plain text. Untuk production, pastikan hash dengan bcrypt.
