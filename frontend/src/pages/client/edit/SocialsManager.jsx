import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, Skeleton, Typography } from '@mui/material';
import BackButton from '../components/BackButton';
import ClearIcon from '@mui/icons-material/Clear';
import EjectIcon from '@mui/icons-material/Eject';
import { Link, useNavigate } from 'react-router-dom';
import { useAppModal } from '../components/ModalContext';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import { icons, getIconByTitle } from '../../../more/icons';
import { motion, AnimatePresence } from "framer-motion";
import fetchApi from '../../../more/fetchApi';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import './setting.css';

export default function LinksManager() {
  const navigate = useNavigate();
  const { showModal, hideModal } = useAppModal();
  const [socials, setSocials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchApi('/socials/get_all');
        if (res.ok) setSocials(res.data.socials);

        else showModal({ content: <p>{res.data.message}</p> });
      } catch (err) {
        showModal({ content: <p>خطا در دریافت شبکه های اجتماعی</p> });
      } finally {
        setLoading(false);
      }
    })()
  }, []);

  return (
    <Box component="form" sx={{ width: '100%' }}>
      <Box className="top-row-manager">
        <Button
          variant="contained"
          sx={{ borderRadius: '2rem' }}
          onClick={() => navigate('/set/esocial/new')}
        >
          افزودن شبکه اجتماعی
        </Button>
        <BackButton address="/set" />
      </Box>
      {
        loading ? //if
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Skeleton animation="wave" variant="rounded" width={'100%'} height={40} />
            <Skeleton animation="wave" variant="rounded" width={'100%'} height={40} />
            <Skeleton animation="wave" variant="rounded" width={'100%'} height={40} />
          </Box>
          : //else if
          socials.length > 0 ?
            <>
              {socials?.map((item) => (
                <Box sx={{ width: '100%', display: 'flex', gap: 1, mb: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/set/esocial/${item.id}`)}
                    sx={{
                      flexGrow: 1, border: '1px solid #fff',
                      borderRadius: '2rem', display: 'flex',
                      alignItems: 'center', justifyContent: 'space-between'
                    }}
                  >
                    {React.cloneElement(getIconByTitle(item.app_icon),
                      { sx: { fontSize: '1.5rem' } })}
                    <Box sx={{ flex: 1, textAlign: 'center' }}>
                      {item.app_title}
                    </Box>
                    {item.is_show ?
                      <VisibilityIcon sx={{ opacity: 0.5 }} />
                      :
                      <VisibilityOffIcon sx={{ opacity: 0.5 }} />
                    }
                  </Button>

                </Box>

              ))}
            </>
            ://else
            <Box>
              <NewReleasesIcon sx={{ fontSize: 100, mt: 5, mb: 3 }} />

              <Typography sx={{ fontSize: '120%', mb: 2 }}>
                هیچ لینکی پیش ما نداری!

              </Typography>
              <Link to='/set/elink/new'>
                <Typography >
                  وقتشه اولین لینک خودت را بسازی :)
                </Typography>
              </Link>



            </Box>
      }
    </Box>
  );
}
