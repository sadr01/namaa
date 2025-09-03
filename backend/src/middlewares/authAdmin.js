import jwt from 'jsonwebtoken';
import userQueries from '../modules/auth/queries.js';
import sendError from '../utils/sendError.js';

const authToken = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) return sendError(res, 403, 'دسترسی غیر مجاز');
    const data = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const [user] = await userQueries.findOneById(data.id);
    if (!user) return sendError(res, 403, 'کاربر یافت نشد')
    if (user.access !== 10)
      return sendError(res, 404, 'مسیر نادرست!')
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 403, 'توکن منقضی شده است');
    }
    return sendError(res, 403, 'توکن نامعتبر است');
  }
};

export default authToken;
