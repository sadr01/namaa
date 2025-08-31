import sendError from '../../utils/sendError.js';
import regex from "../../utils/regex.js";
import linkQueries from "./queries.js";
import userQueries from "../auth/queries.js";
import iconQueries from '../icons/queries.js';

//LINKS
export const getAllForUser = async (req, res) => {

  try {
    const user = req.user;
    const linksUser = await linkQueries.findAllByUserId(user.id);
    if (linksUser) {
      return res.status(200).json({ links: linksUser })
    }
    return sendError(res, 401, 'لینکی برای این کاربر وجود ندارد!')
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}
export const getOneForUser = async (req, res) => {
  try {
    const user = req.user
    const { id } = req.body
    if (user && id) {
      const [link] = await linkQueries.findOneById(user.id, id);
      if (link) {
        return res.status(200).json({ link })
      }
    }
    return sendError(res, 401, 'چنین لینکی وجود ندارد!')
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}
export const edit = async (req, res) => {
  try {
    const user = req.user
    let { id, title, nameIcon, link, isShow } = req.body

    if (!regex.url.test(link) || !regex.titleLink.test(title) || !nameIcon || !id)
      return sendError(res, 409, 'اطلاعات ارسالی صحیح نمی باشد!')

    const linksUser = await linkQueries.findAllByUserId(user.id);

    const [icon] = await iconQueries.findOneByName(nameIcon);
    if (!icon) return sendError(res, 409, 'اطلاعات ارسالی صحیح نمی باشد!')
    const publicLink = isShow ? 1 : 0;

    ///new link
    if (id === 'new') {
      if (linksUser.length > 10)
        return sendError(res, 400, 'تعداد لینک ها بیش از حد مجاز!');

      const newLink = await linkQueries.add(user.id, title, link, icon.id, linksUser.length + 1, publicLink);
      if (newLink.affectedRows === 1)
        return res.status(201).json({ message: 'لینک شما موفقیت ثبت شد' });
      return sendError(res, 401, 'ثبت لینک مورد نظر امکان پذیر نمی باشد!');
    }
    ///edit link

    const [editingLink] = await linkQueries.findOneById(user.id, id);
    if (!editingLink) return sendError(res, 401, 'تغییر در لینک مورد نظر امکان پذیر نمی باشد!')
    const result = await linkQueries.findOneByIdAndUpdate(editingLink.id, title, link, icon.id, isShow);
    if (result.changedRows)
      return res.status(200).json({ message: 'بروزرسانی لینک انجام شد' })
    return sendError(res, 401, "تغییرات در لینک  امکان پذیر نمی باشد!")
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}
export const saveChanges = async (req, res) => {
  try {
    const user = req.user;
    const { links } = req.body;
    const oldlinks = await linkQueries.findAllByUserId(user.id);
    if (!oldlinks) return sendError(res, 401, "تغییرات در لینک  امکان پذیر نمی باشد!");
    if (!links.length) {
      const resDeleteAll = await linkQueries.deleteAll(user.id);
      console.log("resDeleteAll", resDeleteAll);
      return res.status(200).json({ message: 'پاکسازی لینک ها انجام شد' })
    }
    oldlinks.forEach(async (oLink) => {
      let indexNewLink = links.findIndex(nLink => nLink.id === oLink.id);
      if (indexNewLink >= 0) {
        await linkQueries.changePosition(user.id, oLink.id, indexNewLink + 1)
      } else {
        await linkQueries.deleteOne(user.id, oLink.id);
      }
    });
    return res.status(200).json({ message: 'تغییرات با موفقیت انجام شد' })
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}
export const getAllForAdmin = async (req, res) => {
  try {
    const links = await linkQueries.findAll();
    if (links) {
      return res.status(200).json(links)
    }
    return sendError(res, 401, 'لینکی برای این کاربر وجود ندارد!')
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}