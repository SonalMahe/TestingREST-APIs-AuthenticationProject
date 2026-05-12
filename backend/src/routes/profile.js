import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';

const router = Router();

router.get('/', verifyToken, (req, res) => {
  res.json({
    uid: req.user.uid,
    email: req.user.email,
    name: req.user.name || req.user.email
  });
});

export default router;
