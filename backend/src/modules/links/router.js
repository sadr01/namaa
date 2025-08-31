import express from 'express'
import { edit, getAllForUser, getOneForUser, saveChanges, getAllForAdmin } from './controller.js'
import justAdmin from '../../middlewares/authAdmin.js';

import auth from '../../middlewares/authUser.js';
const router = express.Router()

router.post('/edit', auth, edit);
router.get('/get_all', auth, getAllForUser);
router.post('/get_one', auth, getOneForUser);
router.post('/save_changes', auth, saveChanges);

router.get('/all', justAdmin, getAllForAdmin);

export default router
