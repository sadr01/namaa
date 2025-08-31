import { query } from "../../../db/db.js"

const iconQueries = {

  findOneByName: async (iconName) => {
    return await query('SELECT * FROM icons WHERE title=?',
      [iconName]
    )
  },
  findAll: async () => {
    return await query('SELECT * FROM icons')
  },
  add: async (iconName) => {
    return await query('INSERT INTO icons(title) VALUES (?)',
      [iconName]
    )
  },
  deleteOne: async (title) => {
    return await query('DELETE FROM icons WHERE title=?',
      [title]
    )
  },
  deleteAll: async () => {
    return await query('DELETE FROM icons WHERE 1')
  },
}
export default iconQueries