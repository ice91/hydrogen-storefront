import express from 'express';
import authRoutes from './auth';
import session from 'express-session';

const app = express();
const PORT = process.env.PORT || 3000;

// 使用認證路由
app.use('/auth', authRoutes);

// 使用會話中間件
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// ... existing middleware and routes ...

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
