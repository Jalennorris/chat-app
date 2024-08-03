import express from 'express';
import user from '../controllers/user.js';
import { verify, verifyRole } from '../middlewares/verify.js';

const router = express.Router();

// Public routes
router.post('/register',user.onCreateUser);
router.post('/login', user.loginUser);
router.post('/logout', user.logout);
router.get('/admin', verify, verifyRole, (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      message: "Welcome to the Admin portal!",
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Protected routes
router.get('/', user.onGetAllUsers);
router.get('/:id', user.onGetUserById);
router.put('/:id', verify, verifyRole, user.onUpdateUserById);
router.delete('/:id', verify, verifyRole, user.onDeleteUserById);
router.get('/theme-color/:id', user.getUserThemeColor);
router.put('/theme-color/:id', user.updateUserThemeColor);

export default router;
