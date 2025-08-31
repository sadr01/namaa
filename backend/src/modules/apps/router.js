import express from 'express'
import { getAll, add, removeQuest, deleteOne } from './controller.js'
import justAdmin from '../../middlewares/authAdmin.js';
import auth from '../../middlewares/authUser.js';

const router = express.Router();

router.get('/', auth, getAll);


router.post('/', justAdmin, add);
router.delete('/:id', justAdmin, deleteOne);
router.post('/delete_check', justAdmin, removeQuest);

export default router
