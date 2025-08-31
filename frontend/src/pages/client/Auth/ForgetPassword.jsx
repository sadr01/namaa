import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import useField from '../../../hooks/useField';
import regexes from '../../../more/regexes';
import BoxCaptionField from '../components/BoxCaptionField';
import { Link, useNavigate } from 'react-router-dom';
import fetchApi from '../../../more/fetchApi';
import { useAppModal } from '../components/ModalContext';
import { useLoading } from '../../../context/loadingContext';
import TimerBox from '../components/TimerBox';
import RestoreIcon from '@mui/icons-material/Restore';
////

export default function ForgetPassword() {
  let [mail, setMail, captionMail, setCaptionMail] = useField();
  let [password, setPassword, captionPassword, setCaptionPassword] = useField();
  let [confirmPassword, setConfirmPassword, captionConfirmPassword, setCaptionConfirmPassword] = useField();
  const [pin, setPin] = useState('');
  const [usedPin, setUsedPin] = useState(0);
  const [endTimeFlag, setEndTimeFlag] = useState(true);
  const btnSendCode = useRef();
  const navigate = useNavigate();
  const { showModal, hideModal } = useAppModal();
  const { setLoading } = useLoading();
  const handleChangePin = (val) => {
    let value = val;
    value = value.replace(/\D/g, "");
    if (value.length >= 5) {
      value = value.slice(0, 5);
      btnSendCode.current.focus()
    }
    setPin(value);
  };
  const sendMailHandler = async () => {
    let isTrueMail = regexes.mail.test(mail)
    setCaptionMail(!isTrueMail)
    if (isTrueMail) {
      try {
        let res = await fetchApi('/auth/forget_password/request', 'POST', { mail })
        if (res.ok) {
          setEndTimeFlag(false);
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
  const sendPinHandler = async () => {
    let isTruePin = regexes.pin.test(pin)
    let isTruePass = regexes.password.test(password)
    setCaptionPassword(!isTruePass)
    let isTrueConfirmPassword = (password === confirmPassword)
    setCaptionConfirmPassword(!isTrueConfirmPassword)
    setUsedPin(prev => prev + 1)
    if (isTruePin && isTruePass && isTrueConfirmPassword) {
      setLoading(true);
      try {
        let res = await fetchApi('/auth/forget_password/confirm', 'POST',
          { mail, pin, password, confirmPassword })
        if (res.ok) {
          navigate('/login')
        } else {
          if (usedPin >= 3) {
            setEndTimeFlag(true);
            setUsedPin(0);
            setPassword('');
            setConfirmPassword('');
            throw new Error("تعداد دفعات ارسال بیش از حد مجاز!");
          }
        }
        showModal({
          content: <p >{res.data.message}</p>,
        });
      } catch (error) {
        showModal({
          content: <p >{error.message}</p>,
        });
      } finally {
        setPin('')
        setLoading(false);
      }

    }
  }
  ////
  return (
    <Box className="form-box" >
      {endTimeFlag ?
        <>
          <Box className="row-form-box" sx={{ mb: 3 }}>
            <Typography sx={{ alignSelf: 'flex-start' }}>
              ایمیل
            </Typography>
            <TextField className='input' size='small' value={mail} onChange={(e) => { setMail(e.target.value) }} id="outlined"
              dir='ltr' inputProps={{ maxLength: 50 }} />
            {captionMail && <BoxCaptionField caption='ایمیل وارد شده فاقد اعتبار است!' />}
          </Box>
          <Button className='btn' variant="outlined" onClick={() => sendMailHandler()}
            sx={{ mb: 5 }}>
            ارسال کد احراز
          </Button>
        </> :
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontSize: '110%', fontWeight: 200, mt: '0.2rem' }}>
              <TimerBox time={300} setEndTimeFlag={setEndTimeFlag} />
            </Typography>
            <RestoreIcon />

          </Box>
          <Box className="row-form-box">
            <Typography sx={{ alignSelf: 'flex-start' }}>
              رمز عبور جدید
            </Typography>
            <TextField className='input' size='small' value={password} onChange={(e) => { setPassword(e.target.value) }} id="outlined"
              dir='ltr' type="password" inputProps={{ maxLength: 22 }} />
            {captionPassword && <BoxCaptionField caption='حداقل 8 کاراکتر + حروف لاتین' />}
          </Box>
          <Box className="row-form-box">
            <Typography sx={{ alignSelf: 'flex-start' }}>
              تکرار رمز عبور جدید
            </Typography>
            <TextField className='input' size='small' value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} id="outlined"
              dir='ltr' type="password" inputProps={{ maxLength: 22 }} />
            {captionConfirmPassword && <BoxCaptionField caption='عدم تطابق با رمز عبور فوق' />}
          </Box>
          <Typography sx={{ alignSelf: 'flex-start' }}>
            کد احراز
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 3 }}
          >
            <TextField className='input' value={pin} size='small' dir="ltr" placeholder='_____'
              onChange={(e) => handleChangePin(e.target.value)}
              inputProps={{
                maxLength: 5, inputMode: "numeric", pattern: "[0-9]*",
                style: {
                  letterSpacing: "1.2rem", textAlign: "center", fontSize: "1rem",

                }
              }} />
            <Button className='btn' ref={btnSendCode} variant="outlined" onClick={() => sendPinHandler()}
            >
              تایید
            </Button>
          </Box>
        </>
      }
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Link to='/register'>
          <Typography variant="caption" >
            ثبت نام
          </Typography>
        </Link>
        <Link to='/login'>
          <Typography variant="caption">
            ورود
          </Typography>
        </Link>
      </Box>
    </Box>
  )
}
