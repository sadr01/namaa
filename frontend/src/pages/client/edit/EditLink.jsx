import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, TextField, Typography, Checkbox, FormControlLabel, IconButton, Skeleton } from '@mui/material';
import regexes from '../../../more/regexes';
import BackButton from '../components/BackButton';
import { useAppModal } from '../components/ModalContext';
import { getIconByTitle } from '../../../more/icons';
import { useNavigate, useParams } from 'react-router-dom';
import fetchApi from '../../../more/fetchApi';
import useField from '../../../hooks/useField';
import BoxCaptionField from '../components/BoxCaptionField';
import './setting.css'

export default function EditLink() {

  let [title, setTitle, captionTitle, setCaptionTitle] = useField();
  let [link, setLink, captionLink, setCaptionLink] = useField();

  const navigate = useNavigate();
  const { id } = useParams();
  const [icons, setIcons] = useState([]);
  const [isShow, setIsShow] = useState(true);
  const [selected, setSelected] = useState(0);
  const { showModal, hideModal } = useAppModal();
  const [loading, setLoading] = useState(false);
  const iconRefs = useRef([]);

  const savingHandler = async () => {
    const isTrueTitle = regexes.titleLink.test(title);
    setCaptionTitle(!isTrueTitle);
    const isTrueLink = regexes.url.test(link);
    setCaptionLink(!isTrueLink);
    if (isTrueTitle && isTrueLink && id) {
      try {
        let res = await fetchApi('/links/edit', 'POST',
          { id, title, nameIcon: icons[selected].title, link, isShow })
        if (res) showModal({
          content: <p >{res.data.message}</p>,
        });
      } catch (err) {
        navigate('/set/links');
      } finally {
        navigate('/set/links');
      }
    }
  }

  useEffect(() => {
    if (selected !== null && iconRefs.current[selected]) {
      iconRefs.current[selected].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest"
      });
    }
  }, [selected]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchApi('/icons');
        if (res.ok) {
          setIcons(res.data.icons)
        }
        else {
          showModal({ content: <p>{res.data.message}</p> })
          navigate('/set/links')
        }
      } catch (err) {
        showModal({ content: <p>خطا در  ارتباط</p> });
        navigate('/set/links')
      }
    })()

    if (id && id !== 'new') {
      setLoading(true);
      (async () => {
        try {
          const res = await fetchApi('/links/get_one', 'POST', { id });
          if (res.ok) {
            const resLink = res.data.link;
            setTitle(resLink.title);
            setLink(resLink.link);
            setIsShow(Boolean(resLink.is_show));
            let index = icons.findIndex((icon) => icon.title === resLink.icon_title)
            setSelected(index >= 0 ? index : 0);
          }
          else {
            showModal({ content: <p>{res.data.message}</p> })
            navigate('/set/links')
          }
        } catch (err) {
          showModal({ content: <p>خطا در دریافت لینک‌ها</p> });
          navigate('/set/links')
        } finally {
          setLoading(false);
        }
      })()

    }

  }, []);

  return (
    <Box className="form-box" >
      <Box sx={{ display: 'flex', justifyContent: 'end' }}>
        <BackButton address={'/set/links'} />
      </Box>
      {loading ?
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          <Skeleton animation="wave" variant="rounded" width={'100%'} height={50} />
          <Skeleton animation="wave" variant="rounded" width={'100%'} height={50} />
          <Skeleton animation="wave" variant="rounded" width={'100%'} height={80} />
          <Skeleton animation="wave" variant="rounded" width={'100%'} height={20} />
          <Skeleton animation="wave" variant="rounded" width={'100%'} height={50} />
        </Box>
        :
        <>
          <Box className="row-form-box">
            <Typography variant='body2' sx={{ width: "4rem", textAlign: 'start' }}>
              عنوان
            </Typography>
            <TextField size='small' className="input" id="outlined" placeholder='مثال: فروشگاه من'
              value={title} onChange={(e) => setTitle(e.target.value)}
              inputProps={{ maxLength: 20 }} />
            {captionTitle && <BoxCaptionField caption='حداقل 2 و حداکثر 20 کاراکتر' />}
          </Box>
          <Box className="row-form-box">
            <Typography variant='body2' sx={{ width: "4rem", textAlign: 'start' }}>
              لینک
            </Typography>
            <TextField size='small' className="input" placeholder='http://myshop.com' id="outlined"
              value={link} dir='ltr' onChange={(e) => { setLink(e.target.value) }}
              inputProps={{ maxLength: 100 }} />
            {captionLink && <BoxCaptionField caption='ساختار لینک را رعایت کنید.(حداکثر 100 کاراکتر)' />}
          </Box>
          <Box className="row-form-box">
            <Typography variant='body2' sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              انتخاب آیکون
            </Typography>
            <Box className="icons-wrapper">
              <Box>
                {icons.map((item, index) => (
                  <IconButton
                    key={index}
                    ref={(el) => (iconRefs.current[index] = el)}
                    onClick={() => setSelected(index)}
                    className={selected === index ? "selected" : ""}
                  >
                    {getIconByTitle(item.title)}
                  </IconButton>
                ))}
              </Box>
            </Box>

          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='body2'>
              این لینک برای عموم قابل نمایش باشد
            </Typography>
            <FormControlLabel control={<Checkbox checked={isShow} onChange={() => setIsShow(!isShow)} />}
              sx={{ alignSelf: 'flex-end' }}
            />
          </Box>
          <Box className="row-form-box">
            <Button className='btn' variant="outlined" fullWidth onClick={() => savingHandler()}
              sx={{ my: 2 }} >ذخیره </Button>
          </Box>
        </>
      }
    </Box>

  );
}
