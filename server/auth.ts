import express from 'express';
import passport from 'passport';
import { Strategy as OpenIDConnectStrategy } from 'passport-openidconnect';
import { User } from '../models/User'; // 確保有 User 模型

const router = express.Router();

// 配置 OIDC 策略
passport.use('oidc', new OpenIDConnectStrategy({
    issuer: 'https://your-oidc-provider.com',
    authorizationURL: 'https://your-oidc-provider.com/auth',
    tokenURL: 'https://your-oidc-provider.com/token',
    userInfoURL: 'https://your-oidc-provider.com/userinfo',
    clientID: 'your-client-id',
    clientSecret: 'your-client-secret',
    callbackURL: '/auth/callback',
    scope: 'openid profile email',
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

router.use(passport.initialize());

// 登入路由
router.get('/login', passport.authenticate('oidc'));

// 認證回調路由
router.get('/callback',
  passport.authenticate('oidc', { failureRedirect: '/seller/login' }),
  (req, res) => {
    // 認證成功後重定向至賣家儀表板
    res.redirect('/seller/dashboard');
  }
);

// 登出路由
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

export default router;