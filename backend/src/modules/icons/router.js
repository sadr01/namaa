import express from 'express'
import { getAll, addToList, deleteOne, deleteAll, } from './controller.js'
import justAdmin from '../../middlewares/authAdmin.js';
import auth from '../../middlewares/authUser.js';

const router = express.Router()

router.get('/', auth, getAll);


router.post('/', justAdmin, addToList);
router.delete('/:title', justAdmin, deleteOne);
router.delete('/', justAdmin, deleteAll);



export default router
