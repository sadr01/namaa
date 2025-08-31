import userQueries from "../auth/queries.js";
import linkQueries from "../links/queries.js";
import pageQueries from './queries.js'
import socialQueries from "../socials/queries.js";
import sendError from '../../utils/sendError.js';
import regex from "../../utils/regex.js";
import fs from "fs";
import path from "path";

export const editPage = async (req, res) => {

  try {
    const userId = req.user.id;
    const { name, username } = req.body;
    if (name && !regex.name.test(name)) return sendError(res, 401, "محتوای فیلد نام مجاز نیست!");
    if (username && !regex.username.test(username)) return sendError(res, 401, "محتوای فیلد نام کاربری مجاز نیست!");

    const [user] = await userQueries.findOneById(userId);

    const [userWithThisUsername] = await userQueries.findOneByUsername(username);
    if (userWithThisUsername && user.username !== userWithThisUsername.username)
      return sendError(res, 401, "این نام کاربری قبلا انتخاب شده!!");

    let avatarPath = '';
    if (!req.file) {
      avatarPath = user.photo;
    } else {
      if (user.photo) {
        const oldPath = path.join("public", user.photo);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      avatarPath = `/uploads/avatars/${req.file.filename}`;
    }
    await userQueries.changeUserData(userId, name, username, avatarPath);

    return res.status(201).json({
      message: "پروفایل با موفقیت به‌روزرسانی شد",
      user: { name, username, photo: avatarPath }
    });
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
};
export const getDataPublicUser = async (req, res) => {
  try {
    const { username } = req.body;
    if (!regex.username.test(username))
      return sendError(res, 401, 'صفحه ای با این نام وجود ندارد!');
    const [user] = await userQueries.findOneByUsername(username);
    if (!user)
      return sendError(res, 401, 'صفحه ای با این نام وجود ندارد!');
    ///
    const viewerIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    pageQueries.addView(user.id, viewerIp);
    ///
    const links = await linkQueries.findAllPublicByUserId(user.id);
    const socials = await socialQueries.findAllPublicByUserId(user.id);
    return res.status(200).json({ user, links, socials });
  } catch (error) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}
export const viewsDate = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pageQueries.viewsDate(userId);
    const chartData = [];
    const today = new Date();

    let founded = 0; let viewNumber = 0;
    for (let i = 29; i >= 0; i--) {
      const day = new Date();
      day.setDate(today.getDate() - i);
      founded = result.find(item => item.view_date.toLocaleString().slice(0, 5) === day.toLocaleString().slice(0, 5));
      viewNumber = founded ? founded.total_views : 0;
      let persianDate = new Intl.DateTimeFormat("fa-IR").format(day);
      chartData.push({ day: persianDate, views: viewNumber });
    }
    return res.status(200).json(chartData);
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}
export const getDataAllUsers = async (req, res) => {
  try {
    const users = await pageQueries.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}
export const DeleteOneUser = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pageQueries.deleteOne(id);
    if (result.affectedRows)
      return res.status(200).json({ message: 'کاربر مورد نظر حذف شد!' });
    return sendError(res, 400, 'حذف امکان پذیر نیست!')
  } catch (error) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}
export const editUserByAdmin = async (req, res) => {
  try {

    const { id, username, mail, access } = req.body;
    if (username && !regex.username.test(username))
      return sendError(res, 401, "محتوای فیلد نام کاربری مجاز نیست!");
    if (mail && !regex.mail.test(mail))
      return sendError(res, 401, "محتوای فیلد ایمیل مجاز نیست!");
    const [user] = await userQueries.findOneById(id);
    if (!user) return sendError(res, 401, "کاربر مورد نظر وجود ندارد!");


    if (user.mail !== mail) {
      const [userWithThisMail] = await userQueries.findOneByMail(mail);
      if (userWithThisMail)
        return sendError(res, 401, "این ایمیل قبلا ثبت شده!!");
    }
    if (user.username !== username) {
      const [userWithThisUsername] = await userQueries.findOneByUsername(username);
      if (userWithThisUsername)
        return sendError(res, 401, "این نام کاربری قبلا انتخاب شده!!");

    }

    await pageQueries.changeUserData(user.id, username, mail, access)

    return res.status(201).json({ message: "اطلاعات کاربر به‌روزرسانی شد" });
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
};