import express from 'express';
import passport from 'passport';
import { User } from '../models/User';

const router = express.Router();

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
  req.logout((err) => {
    if (err) { 
      console.error(err); 
      return res.redirect('/'); 
    }
    res.redirect('/');
  });
});

// 獲取當前用戶
router.get('/user', async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } else {
    res.json({ user: null });
  }
});

export default router;