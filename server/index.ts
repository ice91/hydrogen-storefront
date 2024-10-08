import express from 'express';
import authRoutes from './routes/authRoutes';
import session from 'express-session';
import passport from 'passport';
import { Strategy as OpenIDConnectStrategy } from 'passport-openidconnect';
import { User } from './models/User';
import dotenv from 'dotenv';

// 載入環境變數
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 使用會話中間件（應在路由之前設置）
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key', // 建議使用環境變數
  resave: false,
  saveUninitialized: false,
}));

// 配置 OIDC 策略
const PROVIDER_URL = process.env.PROVIDER_URL || 'https://accounts.google.com';
const CLIENT_ID = process.env.CLIENT_ID || 'your-client-id';
const CLIENT_SECRET = process.env.CLIENT_SECRET || 'your-client-secret';
const SCOPES = process.env.SCOPES || 'openid email profile';
const NAME_CLAIM = process.env.NAME_CLAIM || 'name';

passport.use('oidc', new OpenIDConnectStrategy({
    issuer: PROVIDER_URL,
    authorizationURL: `${PROVIDER_URL}/o/oauth2/v2/auth`,
    tokenURL: 'https://oauth2.googleapis.com/token',
    userInfoURL: 'https://openidconnect.googleapis.com/v1/userinfo',
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: '/api/auth/callback', // 確保與後端路由掛載路徑一致
    scope: SCOPES,
  },
  async (issuer, sub, profile, accessToken, refreshToken, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      if (!user) {
        user = new User({
          username: profile.displayName,
          email: profile.emails[0].value,
          name: profile.displayName,
          roles: ['seller'],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// 序列化與反序列化用戶
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// 初始化 Passport（確保在掛載路由之前）
app.use(passport.initialize());
app.use(passport.session());

// 使用認證路由，掛載到 /api/auth
app.use('/api/auth', authRoutes);

// ... 其他中間件和路由 ...

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});