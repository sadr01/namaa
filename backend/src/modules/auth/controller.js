import dotenv from "dotenv";
dotenv.config({ path: "./.env", quiet: true });
import userQueries from "./queries.js";
import bcrypt from 'bcrypt';
import sendError from '../../utils/sendError.js';
import regex from "../../utils/regex.js";
import jwt from "jsonwebtoken";
import sendMail from "../../utils/sendMail.js";

export const register = async (req, res) => {
  try {
    let { name, mail, password } = req.body
    mail = mail.toLowerCase()

    if (!regex.name.test(name) || !regex.mail.test(mail) || !regex.password.test(password))
      return sendError(res, 401, 'اطلاعات وارد شده صحیح نمی باشد.')
    const [user] = await userQueries.findOneByMail(mail)
    if (user)
      return sendError(res, 401, 'اطلاعات وارد شده صحیح نمی باشد.')

    const hashPassword = await bcrypt.hash(password, 7);
    const [newUser] = await userQueries.add(name, mail, hashPassword)

    const accessToken = jwt.sign({ id: newUser.id },
      process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.EXPIRE_ACCESS_SECRET });
    const refreshToken = jwt.sign({ id: newUser.id },
      process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.EXPIRE_REFRESH_SECRET });
    await userQueries.setRefreshToken(newUser.id, refreshToken)

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15,
      path: '/',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: '/',
    });
    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      access: newUser.access,
      mail: newUser.mail,
    })
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}
export const login = async (req, res) => {
  try {
    let { mail, password } = req.body
    if (!regex.mail.test(mail) || !regex.password.test(password)) {
      return sendError(res, 401, 'ایمیل یا رمز عبور شما صحیح نمی باشد!')
    }
    const [user] = await userQueries.findOneByMail(mail)
    if (!user) return sendError(res, 401, 'ایمیل یا رمز عبور شما صحیح نمی باشد!')
    const isAuth = await bcrypt.compare(password, user.password)
    if (!isAuth) return sendError(res, 401, 'ایمیل یا رمز عبور شما صحیح نمی باشد!')

    const accessToken = jwt.sign({ id: user.id },
      process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.EXPIRE_ACCESS_SECRET });
    const refreshToken = jwt.sign({ id: user.id },
      process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.EXPIRE_REFRESH_SECRET });
    await userQueries.setRefreshToken(user.id, refreshToken)

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 1,
      path: '/',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: '/',
    });

    res.status(200).json({
      id: user.id,
      name: user.name,
      access: user.access,
      username: user.username,
      mail: user.mail,
      photo: user.photo,
    })
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}
export const loginWithGoogle = async (req, res) => {
  try {
    const user = req.user;
    const accessToken = jwt.sign({ id: user.id },
      process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.EXPIRE_ACCESS_SECRET });
    const refreshToken = jwt.sign({ id: user.id },
      process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.EXPIRE_REFRESH_SECRET });
    await userQueries.setRefreshToken(user.id, refreshToken)

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 1,
      path: '/',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: '/',
    });
    res.redirect(`${process.env.BASE_URL}`);
  } catch (err) {
    res.status(500).json({ ok: false, message: "Server error", error: err.message });
  }
};
export const me = (req, res) => {
  try {
    const user = req.user
    if (!user) return sendError(res, 401, 'دسترسی غیر مجاز')
    res.status(200).json(user);

  } catch (error) {
    sendError(res, 401, 'دسترسی غیر مجاز')
  }
}
export const refreshToken = async (req, res) => {
  try {
    const accessToken = req.cookies?.accessToken;
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        return res.status(200).json({ message: 'Access token هنوز معتبر است' });
      } catch (err) {
        if (err.name !== 'TokenExpiredError') {
          return sendError(res, 403, 'Access token نامعتبر است');
        }
      }
    }
    ////
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return sendError(res, 403, 'Refresh token وجود ندارد');
    let decodedRefresh;
    try {
      decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return sendError(res, 403, 'Refresh token منقضی شده یا نامعتبر است');
    }

    const [user] = await userQueries.findOneById(decodedRefresh.id);
    if (!user) return sendError(res, 403, 'کاربر یافت نشد');

    if (refreshToken !== user.refresh_token) {
      return sendError(res, 403, 'Refresh token مطابقت ندارد');
    }
    const newAccessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.EXPIRE_ACCESS_SECRET }
    );
    const newRefreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.EXPIRE_REFRESH_SECRET }
    );
    await userQueries.setRefreshToken(user.id, newRefreshToken);

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15,
      path: '/',
    });
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: '/',
    });
    return res.status(200).json({ message: 'توکن‌ با موفقیت رفرش شد' });
  } catch (err) {
    return sendError(res, 500, 'خطای داخلی سرور');
  }
}
export const sendMailForForgetPassword = async (req, res) => {

  try {
    const { mail } = req.body
    if (!regex.mail.test(mail))
      return sendError(res, 401, 'ایمیل صحیح نمی باشد')
    const [user] = await userQueries.findOneByMail(mail)
    if (!user)
      return sendError(res, 401, 'ایمیل صحیح نمی باشد')
    const [oldCode] = await userQueries.lastPinCode(user.id);

    if (oldCode && oldCode?.expired_at > Date.now()) {
      let minute = Math.floor((oldCode.expired_at - Date.now()) / 60000) + 1;
      return sendError(res, 400, `ارسال مجدد کد ${minute} دقیقه دیگر امکان پذیر است`)
    }
    const code = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    await userQueries.addPinCode(user.id, String(code), 5);
    await userQueries.changeAccessUser(user.id, 0);
    let isSend = sendMail(user.mail, code);
    if (isSend)
      return res.status(200).json({ message: "کد ارسال شد" });
    else
      return sendError(res, 500, 'امکان ارسال ایمیل وجود ندارد!')
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}
export const receiveCodeForForgetPassword = async (req, res) => {
  try {
    const { mail, pin, password, confirmPassword } = req.body


    const [user] = await userQueries.findOneByMail(mail)
    if (!user || password !== confirmPassword)
      return sendError(res, 401, "اطلاعات وارد شده صحیح نمی باشد!")

    const [oldCode] = await userQueries.lastPinCode(user.id);

    if (oldCode && oldCode.used < 3)
      await userQueries.changeNumberUsedPinCode(oldCode.id, oldCode.used + 1)
    else
      return sendError(res, 400, 'کد اشتباه است')
    if (oldCode?.expired_at < Date.now() || oldCode.pin !== pin || oldCode.used > 3)
      return sendError(res, 400, 'کد اشتباه است')

    const hashPassword = await bcrypt.hash(password, 7);
    await userQueries.changePassword(user.id, hashPassword)
    await userQueries.changeNumberUsedPinCode(oldCode.id, 3)

    return res.status(200).json({ message: "رمز عبور شما با موفقیت تغییر کرد" });
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }

}
export const sendMailForRegister = async (req, res) => {
  try {
    const { id } = req.user
    const [user] = await userQueries.findOneById(id)
    if (!user)
      return sendError(res, 403, 'کاربر معتبر نیست!')
    if (user.access !== 0)
      return sendError(res, 401, 'ایمیل شما قبلا تایید شده است!')
    const [oldCode] = await userQueries.lastPinCode(user.id);

    if (oldCode && oldCode?.expired_at > Date.now()) {
      let minute = Math.floor((oldCode.expired_at - Date.now()) / 60000) + 1;
      return sendError(res, 400, `ارسال مجدد کد ${minute} دقیقه دیگر امکان پذیر است`)
    }
    const code = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    await userQueries.addPinCode(user.id, String(code), 5);
    let isSend = sendMail(user.mail, code);
    if (isSend)
      return res.status(200).json({ message: "کد ارسال شد" });
    else
      return sendError(res, 500, 'امکان ارسال ایمیل وجود ندارد!')
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }
}
export const receiveCodeForRegister = async (req, res) => {
  try {
    const { pin } = req.body
    const user = req.user

    const [oldCode] = await userQueries.lastPinCode(user.id);

    if (oldCode && oldCode.used < 3)
      await userQueries.changeNumberUsedPinCode(oldCode.id, oldCode.used + 1);
    else
      return sendError(res, 400, 'کد اشتباه است')

    if (oldCode?.expired_at < Date.now() || oldCode.pin !== pin || oldCode.used > 3)
      return sendError(res, 400, 'کد اشتباه است')

    const result = await userQueries.changeAccessUser(user.id, 1)
    if (result.changedRows) {
      await userQueries.changeNumberUsedPinCode(oldCode.id, 3)
      return res.status(200).json({ message: "ایمیل شما تایید شد" });
    }
    sendError(res, 400, 'ایمیل شما قبلا تایید شده است!')
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }

}
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, password, confirmPassword } = req.body
    const { id } = req.user
    const [user] = await userQueries.findOneById(id)
    if (!user || password !== confirmPassword ||
      !regex.password.test(oldPassword) ||
      !regex.password.test(password) ||
      !regex.password.test(confirmPassword))
      return sendError(res, 403, "اطلاعات وارد شده صحیح نمی باشد!")
    await userQueries.setRefreshToken(user.id, '')
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    const isAuth = await bcrypt.compare(oldPassword, user.password);
    if (!isAuth) return sendError(res, 401, 'رمز عبور  وارد شده صحیح نمی باشد!')
    const hashPassword = await bcrypt.hash(password, 7);
    await userQueries.changePassword(user.id, hashPassword)
    return res.status(200).json({ message: "رمز عبور شما با موفقیت تغییر کرد" });
  } catch (err) {
    return sendError(res, 500, "خطایی پیش آمده!!  لطفا پس از گذشت چند لحظه دوباره امتحان کنید")
  }

}
export const logout = async (req, res) => {
  try {
    const { id } = req.user;
    await userQueries.setRefreshToken(id, "")
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: 'خروج از حساب کاربری' });
  } catch (err) {
    return sendError(res, 401, "خطا در ارتباط");
  }
}
