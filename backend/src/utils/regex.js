const regex = {
  name: /^[A-Za-z\u0600-\u06FF ]{2,30}$/,
  username: /^[A-Za-z][A-Za-z0-9_]{4,29}$/,
  mail: /^(?=.{1,50}$)[\w.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
  password: /^(?=.*[A-Za-z]).{8,22}$/,
  url: /^(?=.{1,100}$)(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/\S*)?$/,
  titleLink: /^(?! )[A-Za-z\u0600-\u06FF0-9\u06F0-\u06F9\u0660-\u0669 ]{2,20}(?<! )$/u,
}
export default regex;