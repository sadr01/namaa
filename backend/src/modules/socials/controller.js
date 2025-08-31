import sendError from '../../utils/sendError.js'
import regex from "../../utils/regex.js";
import socialQueries from "./queries.js";
import iconQueries from '../icons/queries.js';
import appQueries from '../apps/queries.js';


export const edit = async (req, res) => {
  try {
    const user = req.user
    let { id, appId, link, isShow } = req.body
    const [app] = await appQueries.findOneById(appId);
    if (!app || !link.startsWith(app.link))
      return sendError(res, 401, 'اطلاعات ارسالی صحیح نمی باشد!')

    const publicSocial = isShow ? 1 : 0;
    const socialsUser = await socialQueries.findAllByUserId(user.id)
    link = link.replace(app.link, "");

    ///new social
    if (id === 'new') {
      if (socialsUser.length >= 4)
        return sendError(res, 401, 'تعداد شبکه های اجتماعی شما بیش از حد مجاز است!');
      const newSocial = await socialQueries.add(user.id, app.id, link, publicSocial);
      if (newSocial.affectedRows === 1)
        return res.status(201).json({ message: 'شبکه اجتماعی شما موفقیت ثبت شد' });
      return sendError(res, 401, 'ثبت شبکه اجتماعی مورد نظر امکان پذیر نمی باشد!');
    }
    ///edit link

    const [editingSocial] = await socialQueries.findOneById(user.id, id);
    if (!editingSocial) return sendError(res, 401, 'تغییر در شبکه اجتماعی مورد نظر امکان پذیر نمی باشد!')
    const result = await socialQueries.findOneByIdAndUpdate(user.id, editingSocial.id, app.id, link, publicSocial);
    if (result.changedRows)
      return res.status(200).json({ message: 'بروزرسانی شبکه اجتماعی انجام شد' })
    return sendError(res, 401, "تغییرات در شبکه اجتماعی امکان پذیر نمی باشد!")
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}
export const getAllForUser = async (req, res) => {
  try {
    const user = req.user
    const socialsUser = await socialQueries.findAllByUserId(user.id);
    if (socialsUser) {
      return res.status(200).json({ socials: socialsUser })
    }
    return sendError(res, 401, 'شبکه اجتماعی برای این کاربر وجود ندارد!')
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}
export const getOneForUser = async (req, res) => {
  try {

    const user = req.user
    const { id } = req.body
    if (user && id) {
      const [social] = await socialQueries.findOneById(user.id, id);
      if (social) {
        return res.status(200).json({ social })
      }
    }
    return sendError(res, 401, 'چنین شبکه اجتماعی وجود ندارد!')
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}
export const deleteOne = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.body;
    if (user && id) {
      const result = await socialQueries.deleteOne(user.id, id);
      if (result.affectedRows) {
        return res.status(200).json({ message: 'شبکه اجتماعی مورد نظر حذف شد!' })
      }
    }
    return sendError(res, 401, 'چنین شبکه اجتماعی وجود ندارد!')
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}
export const getAllForAdmin = async (req, res) => {
  try {
    const socials = await socialQueries.findAll();
    if (socials) {
      return res.status(200).json(socials)
    }
    return sendError(res, 401, 'شبکه اجتماعی برای این کاربر وجود ندارد!')
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}
