import { query } from "../../../db/db.js"

const userQueries = {
  add: async (name, mail, password) => {
    await query('INSERT INTO users(name,mail,password) VALUES (?,?,?)',
      [name, mail, password]
    )
    return await userQueries.findOneByMail(mail);
  },
  setRefreshToken: async (userId, refreshToken) => {
    return await query('UPDATE users SET refresh_token=? WHERE id=?',
      [refreshToken, userId]
    )
  },
  findOneById: async (userId) => {
    return await query('SELECT * FROM users WHERE id=?',
      [userId]
    )
  },
  findOneByMail: async (mail) => {
    return await query('SELECT * FROM users WHERE mail= ?',
      [mail]
    )
  },
  findOneByUsername: async (username) => {
    return await query('SELECT id, name, username, photo, access FROM users WHERE username= ?',
      [username]
    )
  },
  changeNumberUsedPinCode: async (pincodeId, numberUsedPinCode) => {
    return await query('UPDATE pincodes SET used=?  WHERE id=?',
      [numberUsedPinCode, pincodeId]
    )
  },
  changeAccessUser: async (userId, numberAccess) => {
    return await query('UPDATE users SET access=? WHERE id=?',
      [numberAccess, userId]
    )
  },
  changePassword: async (userId, newPassword) => {
    return await query('UPDATE users SET password=? WHERE id=?',
      [newPassword, userId]
    )
  },
  addPinCode: async (userId, pinCode, time_minute) => {
    return await query(`INSERT INTO pincodes(id_user, pin,expired_at) VALUES (?,?,
      (CURRENT_TIMESTAMP + INTERVAL ? MINUTE))`,
      [userId, pinCode, time_minute]
    )
  },
  lastPinCode: async (userId) => {
    return await query('SELECT * FROM pincodes WHERE id_user= ? ORDER BY expired_at DESC LIMIT 1',
      [userId]
    )
  },
  changeUserData: async (userId, name, username, avatar) => {
    return await query('UPDATE users SET name=?,username=?,photo=? WHERE id=?',
      [name, username, avatar, userId]
    )
  },
}
export default userQueries