import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import regexes from '../../../more/regexes';
import { Link, useNavigate } from 'react-router-dom';
import fetchApi from '../../../more/fetchApi';
import { useAppModal } from '../components/ModalContext';
import RestoreIcon from '@mui/icons-material/Restore';
import { useAuth } from '../../../context/authContext.js';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import '../edit/setting.css';
////

export default function VerifyMail() {
  const { user, setUser } = useAuth();
  const [pin, setPin] = useState('');
  const [usedPin, setUsedPin] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const btnSendCode = useRef();
  const navigate = useNavigate();
  const { showModal, hideModal } = useAppModal();

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
    if (timeLeft === 0) {
      let res = await fetchApi('/auth/verify_mail/request')
      if (res.ok) {
        setTimeLeft(299);
      } else {
        showModal({
          content: <p >{res.data.message}</p>,
        });
      }
    }
  }
  const sendPinHandler = async () => {
    let isTruePin = regexes.pin.test(pin)
    setUsedPin(prev => prev + 1)

    if (isTruePin && timeLeft > 0) {
      try {
        let res = await fetchApi('/auth/verify_mail/confirm', 'POST', { pin })
        if (res.ok) {
          setUser((prev) => {
            return { ...prev, access: 1 }
          });
          navigate('/me')
        } else {
          if (usedPin >= 3) {
            setTimeLeft(0);
            setUsedPin(0)
            throw new Error("تعداد دفعات ارسال بیش از حد مجاز!");
          }
        }
        showModal({
          content: <p >{res.data.message}</p>
        });
      } catch (error) {
        showModal({
          content: <p >{error.message}</p>
        });
      } finally {
        setPin('')
      }
    }
  }
  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(1, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };
  ////
  return (
    user.access === 0 ?
      <Box className="form-box" >
        {timeLeft === 0 ?
          <>
            <Box className="row-form-box" sx={{ mb: 5 }}>
              <Typography variant="body2">
                «برای دسترسی به امکانات پلتفرم ابتدا ایمیل خود را احراز نمایید»
              </Typography>

            </Box>
            <Box className="row-form-box" sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ textAlign: 'start' }}>
                ایمیل
              </Typography>
              <TextField size='small' value={user.mail} className="input" id="outlined"
                dir='ltr' disabled />
            </Box>
            <Button variant="outlined" className='btn' onClick={() => sendMailHandler()}
              disabled={timeLeft > 0} sx={{ mb: 5 }}>
              ارسال کد احراز
            </Button>
          </> :
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontSize: '110%', fontWeight: 200, mt: '0.2rem' }}>
                {formatTime(timeLeft)}
              </Typography>
              <RestoreIcon />
            </Box>
            <Typography sx={{ alignSelf: 'flex-start', mb: 0.5 }}>
              کد احراز
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 5 }}
            >
              <TextField className='input' value={pin} size='small' dir="ltr" placeholder='_____'
                onChange={(e) => handleChangePin(e.target.value)} disabled={timeLeft == 0}
                inputProps={{
                  maxLength: 5, inputMode: "numeric", pattern: "[0-9]*",
                  style: {
                    letterSpacing: "1.2rem", textAlign: "center", fontSize: "1rem",
                    marginLeft: '0.6rem'
                  }
                }}
              />
              <Button className='btn' ref={btnSendCode} variant="outlined" onClick={() => sendPinHandler()}
                disabled={timeLeft == 0} >
                تایید
              </Button>
            </Box>
          </>
        }
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to='/set/profile'>
            <Typography variant="caption" >
              تنظیم پروفایل
            </Typography>
          </Link>
        </Box>
      </Box>
      :
      <Box>
        <NewReleasesIcon sx={{ height: '5rem', width: '5rem', my: 2 }} />
        <Typography>
          ایمیل شما قبلا احراز شده!
        </Typography>
      </Box>
  )
}
