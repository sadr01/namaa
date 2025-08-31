import express from 'express'
import { deleteOne, edit, getAllForUser, getOneForUser, getAllForAdmin } from './controller.js'
import justAdmin from '../../middlewares/authAdmin.js';
import auth from '../../middlewares/authUser.js';
const router = express.Router();

router.post('/edit', auth, edit);
router.get('/get_all', auth, getAllForUser);
router.post('/get_one', auth, getOneForUser);
router.post('/delete', auth, deleteOne);

router.get('/all', justAdmin, getAllForAdmin);


export default router
