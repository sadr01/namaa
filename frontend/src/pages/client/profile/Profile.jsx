import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Box, Skeleton, Stack } from '@mui/material';
import { useAuth } from '../../../context/authContext.js';
import { Typography } from '@mui/material';
import Socials from './Socials';
import Links from './Links';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import regexes from '../../../more/regexes.js';
import fetchApi from '../../../more/fetchApi.js';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';

import { useAppModal } from '../components/ModalContext.jsx';
export default function Profile() {
  const { username } = useParams();
  const { user } = useAuth();
  const [userFound, setUserFound] = useState({});
  const [links, setLinks] = useState([]);
  const [socials, setSocials] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showModal, hideModal } = useAppModal();
  const navigate = useNavigate();

  useEffect(() => {
    const isTrueUsername = username.startsWith('@') && regexes.username.test(username.slice(1))
    if (isTrueUsername) {
      setLoading(true);
      (async () => {
        try {
          const res = await fetchApi('/users/get_public', 'POST', { username: username.slice(1) });
          if (res.ok) {
            setUserFound(res.data.user);
            setLinks(res.data.links);
            setSocials(res.data.socials);
          } else {
            setUserFound(null);
          }
        } catch (error) {
          showModal({ content: <p>خطا در ارتباط!</p> })
        } finally {
          setLoading(false);
        }
      }
      )()
    } else {
      navigate("/404");
    }
  }, [])
  return (
    loading ?
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3.5 }}>
        <Skeleton animation="wave" variant="rounded" width={110} height={110} sx={{ borderRadius: '50%', mt: 2.5 }} />
        <Skeleton animation="wave" variant="rounded" width={110} height={40} />
        <Skeleton animation="wave" variant="rounded" width={110} height={40} />
        <Skeleton animation="wave" variant="rounded" width={'100%'} height={30} />
        <Skeleton animation="wave" variant="rounded" width={'100%'} height={30} />
      </Box>
      :
      userFound ?
        <>
          {user?.username === userFound?.username &&
            <Box sx={{ justifySelf: 'flex-end' }} >
              <TuneOutlinedIcon sx={{ fontSize: '2rem' }} onClick={() => navigate('/set')} />
            </Box>
          }
          <Box sx={{
            width: { xs: '100%', sm: 500 },
            display: 'flex', flexDirection: 'column', alignItems: 'center'
          }} >

            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
              <Avatar
                src={`${process.env.REACT_APP_API_URL}/public${userFound.photo}`}
                sx={{
                  width: 110,
                  height: 110,
                  boxShadow: `
                 0 0 5px #0ff,
                 0 0 10px #0ff,
                 0 0 20px #0ff,
                 0 0 40px #0ff
               `,
                  border: "2px solid #0ff",
                }}
              />
            </Stack>
            <Typography variant='h6' >
              {userFound?.name}
            </Typography>
            <Typography variant='caption' sx={{ mb: 1, direction: 'ltr' }} >
              @{userFound?.username}
            </Typography>
            {socials.length ? <Socials datas={socials} /> : <></>}
            {links.length ? <Links datas={links} /> : <></>}
          </Box>
        </>
        :
        <Box>
          <PersonSearchOutlinedIcon sx={{ fontSize: '3rem', my: 2 }} />
          <Typography variant='h6' sx={{ mb: 2 }}>
            «فرستادنت دنبال نخود سیاه»
          </Typography>
          <Typography variant='caption'>
            صفحه ای با این شناسه یافت نشد!
          </Typography>

        </Box>


  )
}
