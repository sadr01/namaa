import { query } from "../../../db/db.js"

const pageQueries = {
  addView: async (userId, ip) => {
    let [checkDaily] = await query('SELECT * FROM views WHERE id_user=? AND ip=? AND DATE(created_at)=CURDATE()', [userId, ip])
    if (!checkDaily)
      return await query('INSERT INTO views( id_user, ip) VALUES (?,?)',
        [userId, ip]
      )
    return null;
  },
  viewsDate: async (userId) => {
    return await query('SELECT DATE(created_at) AS view_date, COUNT(*) AS total_views FROM views WHERE created_at >= CURDATE() - INTERVAL 30 DAY AND id_user=? GROUP BY id_user, DATE(created_at) ORDER BY id_user, view_date;',
      [userId]
    )
  },
  getAllUsers: async () => {
    return await query('SELECT users.id, users.name, users.username, users.mail, users.photo, users.status, users.access, users.created_at, COUNT(DISTINCT links.id) AS link_count,COUNT(DISTINCT socials.id) AS social_count FROM users LEFT JOIN links ON users.id = links.id_user LEFT JOIN socials ON users.id = socials.id_user GROUP BY users.id;'
    )
  },
  deleteOne: async (userId) => {
    return await query('DELETE FROM users WHERE id=?',
      [userId]
    )
  },
  changeUserData: async (userId, username, mail, access) => {
    return await query('UPDATE users SET mail=?,username=?,access=? WHERE id=?',
      [mail, username, access, userId]
    )
  },
};
export default pageQueries;