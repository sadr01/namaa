import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, TextField, Typography, Checkbox, FormControlLabel, IconButton, Skeleton } from '@mui/material';
import regexes from '../../../more/regexes';
import BackButton from '../components/BackButton';
import { useAppModal } from '../components/ModalContext';
import { icons, getIconByTitle } from '../../../more/icons';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import fetchApi from '../../../more/fetchApi';
import useField from '../../../hooks/useField';
import BoxCaptionField from '../components/BoxCaptionField';
import './setting.css'

export default function EditSocial() {
  const [apps, setApps] = useState([]);
  let [link, setLink, captionLink, setCaptionLink] = useField();
  const { id } = useParams();
  const [isShow, setIsShow] = useState(true);
  const [selected, setSelected] = useState(-1);
  const { showModal, hideModal } = useAppModal();
  const [loading, setLoading] = useState(true);
  const iconRefs = useRef([]);
  const navigate = useNavigate();
  const savingHandler = async () => {
    const isTrueLink = link.startsWith(apps[selected].link)
    setCaptionLink(!isTrueLink);
    if (isTrueLink && id) {
      try {
        let res = await fetchApi('/socials/edit', 'POST',
          { id, appId: apps[selected].id, link, isShow })
        if (res) showModal({
          content: <p >{res.data.message}</p>,
        });
        if (res.ok) navigate('/set/socials');
      } catch (err) {
        navigate('/set/socials');
      }
    }
  }
  const removeHandler = () => {
    showModal({
      content: <p >از حذف آن مطمئن هستید؟</p>,
      actions: (
        <>
          <Button onClick={hideModal} sx={{ ml: 1 }} variant='outlined'
            color='secondary'>انصراف</Button>
          <Button onClick={confirmRemove} sx={{ ml: 1, background: '#f64747', color: '#fff' }}
            color='secondary'>بله</Button>
        </>
      ),
    });
  }
  const confirmRemove = async () => {
    try {
      const res = await fetchApi('/socials/delete', 'POST', { id });
      showModal({ content: <p>{res.data.message}</p> })
      if (res.ok)
        navigate('/set/socials')

    } catch (err) {
      navigate('/set/socials')
    }

  }
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchApi('/apps');
        if (res.ok) {
          setApps(res.data.apps);
          if (id === 'new') setSelected(0);
        }
        else {
          showModal({ content: <p>{res.data.message}</p> })
          navigate('/set/socials')
        }
      } catch (err) {
        navigate('/set/socials')
      }
    })()
  }, []);

  useEffect(() => {
    (async () => {
      if (id !== 'new') {
        try {
          const res = await fetchApi('/socials/get_one', 'POST', { id });
          if (res.ok) {
            const resSocial = res.data.social;
            let index = apps.findIndex((app) => app.icon_title === resSocial.app_icon
            );
            setSelected(index >= 0 ? index : 0);
            setLink(`${resSocial.app_link}${resSocial.username}`);
            setIsShow(Boolean(resSocial.is_show));
          }
          else {
            showModal({ content: <p>{res.data.message}</p> })
            navigate('/set/socials')
          }
        } catch (err) {
          showModal({ content: <p>خطا در دریافت لینک‌ها</p> });
          navigate('/set/socials')
        } finally {

        }
      } else {
        setLink(apps[0]?.link);
      }

    })()
  }, [apps]);

  useEffect(() => {
    if (selected !== null && iconRefs.current[selected]) {
      iconRefs.current[selected].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest"
      });
    }
    if (loading && apps.length) {
      setLoading(false);
    }
  }, [selected]);


  return (
    <Box className="form-box" >
      <Box sx={{ display: 'flex', justifyContent: 'end' }}>
        <BackButton address={'/set/socials'} />
      </Box>
      {loading ?
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          <Skeleton animation="wave" variant="rounded" width={'100%'} height={70} />
          <Skeleton animation="wave" variant="rounded" width={'100%'} height={40} />
          <Skeleton animation="wave" variant="rounded" width={'100%'} height={20} />
          <Skeleton animation="wave" variant="rounded" width={'100%'} height={50} />
        </Box>
        :
        <>
          <Box className="row-form-box">
            <Typography variant='body2' sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              انتخاب شبکه اجتماعی
            </Typography>
            <Box className="icons-wrapper">
              <Box>
                {apps.map((item, index) => (
                  <IconButton
                    key={index}
                    ref={(el) => (iconRefs.current[index] = el)}
                    onClick={() => { setSelected(index); setLink(item.link); }}
                    className={selected === index ? "selected" : ""}
                  >
                    {getIconByTitle(item.icon_title)}
                  </IconButton>
                ))}
              </Box>
            </Box>

          </Box>

          <Box className="row-form-box">
            <Typography variant='body2' sx={{ width: "4rem", textAlign: 'start' }}>
              لینک
            </Typography>
            <TextField size='small' className="input" placeholder={'شناسه یا شماره خود را در انتهای الگو قرار دهید'} id="outlined"
              value={link} dir='ltr' onChange={(e) => { setLink(e.target.value) }}
              inputProps={{ maxLength: 50 }} />
            {captionLink && <BoxCaptionField caption='!الگو را رعایت کنید' />}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='body2'>
              این شبکه اجتماعی برای عموم قابل نمایش باشد
            </Typography>
            <FormControlLabel control={<Checkbox checked={isShow} onChange={() => setIsShow(!isShow)} />}
              sx={{ alignSelf: 'flex-end' }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button className='btn' variant="outlined" fullWidth onClick={() => savingHandler()}
              sx={{ flexGrow: 1 }} >ذخیره </Button>
            {id !== 'new' &&
              <Button
                aria-label="delete"
                sx={{ background: '#f64747 ', borderRadius: '2rem' }}
                onClick={() => removeHandler()}
              >
                <DeleteIcon />
              </Button>
            }
          </Box>
        </>
      }
    </Box>

  );
}
