import { query } from "../../../db/db.js"

const appQueries = {

  findAll: async () => {
    return await query('SELECT apps.id, apps.title, apps.link, apps.id_icon, icons.title AS icon_title FROM apps JOIN icons ON apps.id_icon = icons.id ',
      []
    )
  },
  findOneById: async (appId) => {
    return await query('SELECT * FROM apps Where id=?',
      [appId]
    )
  },
  addOne: async (title, link, idIcon) => {
    return await query('INSERT INTO apps( title,link, id_icon) VALUES (?,?,?)',
      [title, link, idIcon]
    )
  },
  findBy_title_link_idIcon: async (title, link, idIcon) => {
    return await query('SELECT apps.id, apps.title, apps.link, apps.id_icon, icons.title AS icon_title FROM apps JOIN icons ON apps.id_icon = icons.id WHERE apps.title=? AND apps.link=? AND apps.id_icon=?',
      [title, link, idIcon]
    )
  },
  update: async (idApp, title, link, idIcon) => {
    return await query('UPDATE apps SET title=?,link=?,id_icon=? WHERE id=?',
      [title, link, idIcon, idApp]
    )
  },
  deleteOne: async (idApp) => {
    return await query('DELETE FROM apps WHERE id=?',
      [idApp]
    )
  },
}
export default appQueries