import appQueries from "./queries.js";
import iconQueries from '../icons/queries.js';
import socialQueries from '../socials/queries.js';

export const getAll = async (req, res) => {
  try {
    const apps = await appQueries.findAll();
    if (apps) {
      return res.status(200).json({ apps })
    }
    return sendError(res, 401, 'اکنون امکان خدمات وجود ندارد')
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}
export const add = async (req, res) => {
  try {
    const { app } = req.body;
    const [icon] = await iconQueries.findOneByName(app.titleIcon);
    if (!icon) return sendError(res, 401, 'این آیکون وجود ندارد!');
    if (app.id) {
      await appQueries.update(app.id, app.title, app.link, icon.id);
    } else {
      await appQueries.addOne(app.title, app.link, icon.id);
    }
    const [newApp] = await appQueries.findBy_title_link_idIcon(app.title, app.link, icon.id);
    if (newApp) return res.status(200).json({ app: newApp });
    return sendError(res, 401, 'خطا در ثبت اطلاعات!')
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}
export const removeQuest = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await socialQueries.findByApp(id);
    return res.status(200).json({ number: result.length });
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}
export const deleteOne = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await socialQueries.findByApp(id);
    if (result.length) {
      for (let i = 0; i < result.length; i++) {
        await socialQueries.deleteOne(result[i].id_user, result[i].id)
      }
    }
    await appQueries.deleteOne(id);
    return res.status(200).json({ message: 'شبکه اجتماعی حذف شد!' });
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}