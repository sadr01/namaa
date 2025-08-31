import { Box, Button, TextField, Typography } from '@mui/material'
import fetchApi from '../../../more/fetchApi.js'
import useField from '../../../hooks/useField'
import regexes from '../../../more/regexes'
import BoxCaptionField from '../components/BoxCaptionField'
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/authContext.js'
import { useAppModal } from '../components/ModalContext';


export default function Register() {
  const navigate = useNavigate();
  const [name, setName, captionName, setCaptionName] = useField();
  const [mail, setMail, captionMail, setCaptionMail] = useField();
  const [password, setPassword, captionPassword, setCaptionPassword] = useField();
  const { setUser } = useAuth();
  const { showModal, hideModal } = useAppModal();

  const registerHandler = async () => {
    let isTrueName = regexes.name.test(name)
    let isTrueMail = regexes.mail.test(mail)
    let isTruePassword = regexes.password.test(password)

    await setCaptionName(!isTrueName)
    await setCaptionMail(!isTrueMail)
    await setCaptionPassword(!isTruePassword)

    if (isTrueName && isTrueMail && isTruePassword) {
      try {
        let res = await fetchApi('/auth/register', 'POST', { name, mail, password })
        if (res.ok) {
          setUser(res.data)
          navigate('/me')
        } else {
          showModal({
            content: <p>{res.data.message}</p>,
          });
        }
      } catch (error) {
        showModal({
          content: <p >خطا در ارتباط!</p>,
        });
      } finally {
        setPassword('');
      }
    }
  }
  ////
  return (
    <Box className="form-box" >
      <Box className="row-form-box">
        <Typography sx={{ alignSelf: 'flex-start' }}>
          نام
        </Typography>
        <TextField className='input' size='small' value={name} onChange={(e) => { setName(e.target.value) }} id="outlined"
          inputProps={{ maxLength: 30 }} />
        {captionName && <BoxCaptionField caption='حداقل 2 و حداکثر 30 حرف فارسی یا لاتین' />}
      </Box>
      <Box className="row-form-box">
        <Typography sx={{ alignSelf: 'flex-start' }}>
          ایمیل
        </Typography>
        <TextField className='input' size='small' value={mail} onChange={(e) => { setMail(e.target.value) }} id="outlined"
          dir='ltr' inputProps={{ maxLength: 50 }} />
        {captionMail && <BoxCaptionField caption='ایمیل فاقد اعتبار' />}
      </Box>

      <Box className="row-form-box">
        <Typography sx={{ alignSelf: 'flex-start' }}>
          رمز عبور
        </Typography>
        <TextField className='input' size='small' value={password} onChange={(e) => { setPassword(e.target.value) }} id="outlined"
          dir='ltr' type="password" />
        {captionPassword && <BoxCaptionField caption='حداقل 8 کاراکتر + حروف لاتین' />}
      </Box>

      <Button className='btn' variant="outlined" onClick={() => registerHandler()}
        sx={{ borderColor: '#fff', color: '#fff', my: 2 }}>
        <HowToRegIcon sx={{ position: 'absolute', right: 12 }} />
        ثبت نام
        <ArrowBackIosIcon sx={{ position: 'absolute', left: 12 }} />
      </Button>

      <Link to='/login'>
        <Typography variant="caption" sx={{ color: "#fff" }}>
          حساب کاربری دارم!(ورود)
        </Typography>
      </Link>



    </Box >
  )
}
