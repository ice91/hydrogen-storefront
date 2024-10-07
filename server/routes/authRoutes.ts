import express from 'express';
import { User } from '../models/User';

const router = express.Router();

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