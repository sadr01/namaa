import { Box, Button, TextField, Typography } from '@mui/material'
import useField from '../../../hooks/useField'
import regexes from '../../../more/regexes'
import BoxCaptionField from '../components/BoxCaptionField'
import { Link, useNavigate } from 'react-router-dom'
import fetchApi from '../../../more/fetchApi'
import { useLoading } from '../../../context/loadingContext.js'
import { useAppModal } from '../components/ModalContext';
import { useAuth } from '../../../context/authContext.js';
import GoogleIcon from '@mui/icons-material/Google';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
////

export default function Login() {
  let [mail, setMail, captionMail, setCaptionMail] = useField();
  let [password, setPassword, captionPassword, setCaptionPassword] = useField();
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { showModal, hideModal } = useAppModal();

  const handleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
  };
  const loginHandler = async () => {
    setLoading(true)
    let isTrueMail = regexes.mail.test(mail)
    let isTruePass = regexes.password.test(password)
    setCaptionMail(!isTrueMail)
    setCaptionPassword(!isTruePass)

    if (isTrueMail && isTruePass) {
      try {
        let res = await fetchApi('/auth/login', 'POST', { mail, password })
        if (res.ok) {
          setUser(res.data);
          navigate('/me');
        } else {
          showModal({
            content: <p>{res.data.message}</p>,
            actions: (
              <Button onClick={hideModal} variant='outlined'
                color='secondary'>باشه</Button>
            ),
          });
          setMail('');
          setPassword('');
        }
      } catch (error) {
        showModal({
          content: <p>خطا در ارتباط!</p>,
        });
      }
    }
    setLoading(false)
  }
  ////
  return (
    <Box className="form-box" >
      <Box className="row-form-box">
        <Typography sx={{ alignSelf: 'flex-start' }}>
          ایمیل
        </Typography>
        <TextField size='small' className='input' value={mail} onChange={(e) => { setMail(e.target.value) }} id="outlined"
          dir='ltr' inputProps={{ maxLength: 30 }} />
        {captionMail && <BoxCaptionField caption='ایمیل فاقد اعتبار' />}
      </Box>

      <Box className="row-form-box">
        <Typography sx={{ alignSelf: 'flex-start' }}>
          رمز عبور
        </Typography>
        <TextField size='small' value={password} onChange={(e) => { setPassword(e.target.value) }} id="outlined" className='input'
          dir='ltr' type="password" inputProps={{ maxLength: 22 }} />
        {captionPassword && <BoxCaptionField caption='حداقل 8 کاراکتر + حروف لاتین' />}
      </Box>

      <Button variant="outlined" className='btn' onClick={() => loginHandler()}
        sx={{ mb: 2 }} >
        <AccountCircleIcon sx={{ position: 'absolute', right: 12 }} />
        ورود
        <ArrowBackIosIcon sx={{ position: 'absolute', left: 12 }} />
      </Button>

      <Button variant="outlined" className='btn'
        sx={{ mb: 4 }} onClick={handleLogin}>
        <GoogleIcon sx={{ position: 'absolute', right: 12 }} />
        ورود با حساب گوگل
        <ArrowBackIosIcon sx={{ position: 'absolute', left: 12 }} />
      </Button>
      <Link to='/register'>
        <Typography variant="caption" >
          حساب کاربری ندارم!(ثبت نام)
        </Typography>
      </Link>
      <Link to='/forgetpass'>
        <Typography variant="caption" sx={{ mt: 0.5 }}>
          فراموشی رمز عبور
        </Typography>
      </Link>
    </Box>
  )
}
