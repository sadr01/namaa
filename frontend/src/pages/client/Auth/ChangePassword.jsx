import { Box, Button, TextField, Typography } from '@mui/material';
import useField from '../../../hooks/useField.js';
import regexes from '../../../more/regexes.js';
import BoxCaptionField from '../components/BoxCaptionField.jsx';
import { Link, useNavigate } from 'react-router-dom';
import fetchApi from '../../../more/fetchApi.js';
import { useAppModal } from '../components/ModalContext.jsx';
import { useAuth } from '../../../context/authContext.js';
////

export default function ChangePassword() {
  let [oldPassword, setOldPassword, captionOldPassword, setCaptionOldPassword] = useField();
  let [password, setPassword, captionPassword, setCaptionPassword] = useField();
  let [confirmPassword, setConfirmPassword, captionConfirmPassword, setCaptionConfirmPassword] = useField();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { showModal } = useAppModal();

  const changePassHandler = async () => {
    let isTrueOldPass = regexes.password.test(oldPassword)
    setCaptionOldPassword(!isTrueOldPass)
    let isTruePass = regexes.password.test(password)
    setCaptionPassword(!isTruePass)
    let isTrueConfirmPass = (password === confirmPassword)
    setCaptionConfirmPassword(!isTrueConfirmPass)

    if (isTrueOldPass && isTruePass && isTrueConfirmPass) {
      try {
        let res = await fetchApi('/auth/change_password', 'POST',
          { oldPassword, password, confirmPassword })
        if (res.ok) {
          logout();
          navigate("/login");
          showModal({
            content: <><p >رمز عبور شما با موفقیت تغییر کرد</p>
              <p style={{ fontSize: "small" }}>لطفا با رمز جدید وارد حساب خود بشوید و دوباره ایمیل خود را احراز نمایید</p> </>,
          });
          return null
        } else {
          showModal({
            content: <p >{res.data.message}</p>,
          });
        }
      } catch (error) {
        showModal({
          content: <p >خطا در ارتباط!</p>,
        });
      }
    }
  }
  ////
  return (
    <Box className="form-box" >

      <Box className="row-form-box">
        <Typography sx={{ alignSelf: 'flex-start' }}>
          رمز عبور جاری
        </Typography>
        <TextField size='small' className='input' value={oldPassword} onChange={(e) => { setOldPassword(e.target.value) }} id="outlined"
          dir='ltr' type="password" inputProps={{ maxLength: 22 }} />
        {captionOldPassword && <BoxCaptionField caption='حداقل 8 کاراکتر + حروف لاتین' />}
      </Box>

      <Box className="row-form-box">
        <Typography sx={{ alignSelf: 'flex-start' }}>
          رمز عبور جدید
        </Typography>
        <TextField size='small' value={password} onChange={(e) => { setPassword(e.target.value) }} id="outlined" className='input'
          dir='ltr' type="password" inputProps={{ maxLength: 22 }} />
        {captionPassword && <BoxCaptionField caption='حداقل 8 کاراکتر + حروف لاتین' />}
      </Box>
      <Box className="row-form-box">
        <Typography sx={{ alignSelf: 'flex-start' }}>
          تکرار رمز عبور جدید
        </Typography>
        <TextField size='small' value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} id="outlined" className='input'
          dir='ltr' type="password" inputProps={{ maxLength: 22 }} />
        {captionConfirmPassword && <BoxCaptionField caption='عدم تطابق با رمز عبور فوق' />}
      </Box>


      <Button variant="outlined" onClick={() => changePassHandler()}
        sx={{ mt: 2 }} className='btn'>
        تغییر رمز عبور
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <Link to='/me'>
          <Typography variant="caption" >
            صفحه من
          </Typography>
        </Link>

      </Box>
    </Box>
  )
}
