import { query } from "../../../db/db.js"

const socialQueries = {
  add: async (userId, appId, link, isShow) => {
    return await query('INSERT INTO socials( id_user, id_app, username, is_show) VALUES (?,?,?,?)',
      [userId, appId, link, isShow]
    )
  },
  findAllByUserId: async (userId) => {
    return await query('SELECT socials.id, socials.id_user, socials.username, socials.is_show,socials.id_app,apps.title As app_title, icons.title AS app_icon FROM socials INNER JOIN apps ON socials.id_app=apps.id INNER JOIN icons ON apps.id_icon=icons.id WHERE socials.id_user =?',
      [userId]
    )
  },
  findAllPublicByUserId: async (userId) => {
    return await query('SELECT socials.id, socials.username,apps.link As app_link, icons.title AS app_icon FROM socials INNER JOIN apps ON socials.id_app=apps.id INNER JOIN icons ON apps.id_icon=icons.id WHERE socials.id_user =? AND socials.is_show=1',
      [userId]
    )
  },
  findOneById: async (userId, socialId) => {
    return await query('SELECT socials.id, socials.id_user, socials.username, socials.is_show,socials.id_app,apps.title As app_title,apps.link As app_link, icons.title AS app_icon FROM socials INNER JOIN apps ON socials.id_app=apps.id INNER JOIN icons ON apps.id_icon=icons.id WHERE socials.id_user =? AND socials.id=?',
      [userId, socialId]
    )
  },
  findOneByIdAndUpdate: async (userId, socialId, appId, link, isShow) => {
    return await query('UPDATE socials SET id_app= ?,username=?,is_show=? WHERE  id=?  AND id_user=?',
      [appId, link, isShow, socialId, userId]
    )
  },
  findByApp: async (appId) => {
    return await query('SELECT* FROM socials WHERE id_app=?',
      [appId]
    )
  },
  deleteOne: async (userId, socialId) => {
    return await query(' DELETE FROM socials WHERE id_user=? AND id=?',
      [userId, socialId]
    )
  },

  findAll: async () => {
    return await query(`SELECT socials.id, socials.id_user,CONCAT(apps.link, '', socials.username) AS link,  socials.is_show,  users.photo AS user_photo,apps.title As app_title, icons.title AS app_icon, socials.created_at FROM socials 
    INNER JOIN users ON socials.id_user=users.id 
    INNER JOIN apps ON socials.id_app=apps.id 
    INNER JOIN icons ON apps.id_icon=icons.id ORDER BY socials.created_at DESC`)
  },
}
export default socialQueries