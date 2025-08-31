import express from 'express';
import { editPage, getDataPublicUser, getDataAllUsers, DeleteOneUser, editUserByAdmin, viewsDate } from './controller.js';
import auth from '../../middlewares/authUser.js';
import justAdmin from '../../middlewares/authAdmin.js';
import upload from '../../utils/upload.js';
const router = express.Router()

router.post("/get_public", getDataPublicUser);

router.post("/editpage", auth, upload.single("avatar"), editPage);
router.get("/views", auth, viewsDate);

router.get("/get_all", justAdmin, getDataAllUsers);
router.delete("/:id", justAdmin, DeleteOneUser);
router.post("/edit", justAdmin, editUserByAdmin);

export default router;