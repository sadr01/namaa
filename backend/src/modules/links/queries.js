import { query } from "../../../db/db.js"

const linkQueries = {
  add: async (userId, title, link, iconId, position, isShow) => {
    return await query('INSERT INTO links( id_user, title, link, id_icon, position, is_show) VALUES (?,?,?,?,?,?)',
      [userId, title, link, iconId, position, isShow]
    )
  },
  findAllByUserId: async (userId) => {
    return await query('SELECT links.id, links.id_user, links.title, links.link, links.id_icon, icons.title AS icon_title, links.position, links.is_show FROM links JOIN icons ON links.id_icon = icons.id WHERE links.id_user =? ORDER BY position ASC',
      [userId]
    )
  },
  findOneById: async (userId, linkId) => {
    return await query('SELECT links.id, links.id_user, links.title, links.link, links.id_icon, icons.title AS icon_title, links.position, links.is_show FROM links JOIN icons ON links.id_icon = icons.id WHERE links.id =? AND links.id_user=? ',
      [linkId, userId]
    )
  },
  findAllPublicByUserId: async (userId) => {
    return await query('SELECT links.id, links.title, links.link, icons.title AS icon_title FROM links JOIN icons ON links.id_icon = icons.id WHERE links.id_user =? AND links.is_show=1 ORDER BY position ASC',
      [userId]
    )
  },
  findOneByIdAndUpdate: async (linkId, title, link, iconId, isShow) => {
    return await query('UPDATE links SET title=?,link=?,id_icon=?,is_show=? WHERE id=?',
      [title, link, iconId, isShow, linkId]
    )
  },
  changePosition: async (userId, linkId, position) => {
    return await query('UPDATE links SET position=? WHERE id=? AND id_user=?',
      [position, linkId, userId]
    )
  },
  deleteOne: async (userId, linkId) => {
    return await query('DELETE FROM links WHERE id=? AND id_user=?',
      [linkId, userId]
    )
  },
  deleteAll: async (userId) => {
    return await query('DELETE FROM links WHERE id_user=?',
      [userId]
    )
  },
  findAll: async () => {
    return await query('SELECT links.id, links.id_user, links.title, links.link, links.id_icon , links.is_show,links.created_at , users.photo AS user_photo, icons.title as icon_title FROM links INNER JOIN users on users.id = links.id_user INNER JOIN icons on icons.id = links.id_icon ORDER BY links.created_at DESC;'
    )
  },

}
export default linkQueries