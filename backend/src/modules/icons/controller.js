import sendError from '../../utils/sendError.js';
import iconQueries from './queries.js';

export const getAll = async (req, res) => {
  try {
    const icons = await iconQueries.findAll();
    if (icons) {
      return res.status(200).json({ icons })
    }
    return sendError(res, 401, 'آیکونی وجود ندارد!')
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}
export const addToList = async (req, res) => {
  try {
    const { newList } = req.body;
    let savedIcons = []
    for (let i = 0; i < newList.length; i++) {
      let [hasIcon] = await iconQueries.findOneByName(newList[i]);
      if (!hasIcon) {
        await iconQueries.add(newList[i]);
        savedIcons.push(newList[i])
      }
    }
    if (savedIcons.length) {
      return res.status(201).json({ savedIcons })
    }
    return sendError(res, 401, 'آیکون‌های مورد نظر ذخیره نشدند!')
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}
export const deleteOne = async (req, res) => {
  try {
    const { title } = req.params;
    await iconQueries.deleteOne(title);
    return res.status(200).json({ message: 'آیکون مورد نظر حذف شد.' })
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}
export const deleteAll = async (req, res) => {
  try {
    await iconQueries.deleteAll();
    return res.status(200).json({ message: 'تمام آيکون‌ها حذف شدند!' })
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}
