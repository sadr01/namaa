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
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recoveryLinks, setRecoveryLinks] = useState([]);


  const removeHandler = (index) => {
    if (!recoveryLinks.length) setRecoveryLinks(links)
    setTimeout(() => {
      setLinks(prevLinks => {
        const updated = [...prevLinks];
        updated.splice(index, 1);
        return updated;
      });
    }, 300);
  };
  const changeOrder = (index) => {
    if (!recoveryLinks.length) setRecoveryLinks(links)
    setLinks(prevLinks => {
      const updated = [...prevLinks];
      [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
      return updated;
    });
  };
  const recoveryHandler = () => {
    setLinks(recoveryLinks);
    setRecoveryLinks([]);
  };
  const saveChanges = async () => {

    if (recoveryLinks.length) {
      try {
        const res = await fetchApi('/links/save_changes', 'POST', { links });
        showModal({ content: <p>{res.data.message}</p> });
      } catch (err) {
        showModal({ content: <p> اکنون امکان ذخیره سازی تغییرات وجود ندارد!</p> });
      } finally {
        setRecoveryLinks([])
      }
    }
  }
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchApi('/links/get_all');
        if (res.ok) setLinks(res.data.links);

        else showModal({ content: <p>{res.data.message}</p> });
      } catch (err) {
        showModal({ content: <p>خطا در دریافت لینک‌ها</p> });
      } finally {
        setLoading(false);
      }
    })()
  }, []);

  return (
    <Box component="form" sx={{ width: '100%' }}>
      <Box className="top-row-manager">
        {recoveryLinks.length ?
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              sx={{ borderRadius: '2rem' }}
              onClick={() => saveChanges()}
            >
              ذخیره تغییرات
            </Button>
            <Button
              variant="outlined"
              sx={{ border: '1px solid #fff', borderRadius: '2rem' }}
              onClick={() => recoveryHandler()}
            >
              انصراف
            </Button>
          </Box>
          :
          <Button
            variant="contained"
            sx={{ borderRadius: '2rem' }}
            onClick={() => navigate('/set/elink/new')}
          >
            افزودن لینک
          </Button>
        }
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
          links.length > 0 ?
            <>
              {links?.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  transition={{ duration: 0.3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Box sx={{ width: '100%', display: 'flex', gap: 1, mb: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/set/elink/${item.id}`)}
                      sx={{
                        flexGrow: 1, border: '1px solid #fff',
                        borderRadius: '2rem', display: 'flex',
                        alignItems: 'center', justifyContent: 'space-between'
                      }}
                    >
                      {React.cloneElement(getIconByTitle(item.icon_title),
                        { sx: { fontSize: '1.5rem' } })}
                      <Box sx={{ flex: 1, textAlign: 'center' }}>
                        {item.title}
                      </Box>
                      {item.is_show ?
                        <VisibilityIcon sx={{ opacity: 0.5 }} />
                        :
                        <VisibilityOffIcon sx={{ opacity: 0.5 }} />
                      }
                    </Button>

                    <IconButton
                      aria-label="eject"
                      sx={[
                        { border: '1px solid #fff', borderRadius: '50%' },
                        index === 0 && { opacity: 0.4 }
                      ]}
                      onClick={() => changeOrder(index)}
                      disabled={index === 0}
                    >
                      <EjectIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      sx={{ border: '1px solid #fff', borderRadius: '50%' }}
                      onClick={() => removeHandler(index)}
                    >
                      <ClearIcon />
                    </IconButton>

                  </Box>
                </motion.div>
              ))}
            </>
            ://else
            <Box>
              <NewReleasesIcon sx={{ fontSize: 100, mt: 5, mb: 3 }} />
              {recoveryLinks.length ?
                <Typography sx={{ fontSize: '120%', mb: 2 }}>
                  قصد پاکسازی کامل داری!
                </Typography>
                :
                <>
                  <Typography sx={{ fontSize: '120%', mb: 2 }}>
                    هیچ لینکی پیش ما نداری!

                  </Typography>
                  <Link to='/set/elink/new'>
                    <Typography >
                      وقتشه اولین لینک خودت را بسازی :)
                    </Typography>
                  </Link>
                </>
              }

            </Box>
      }
    </Box>
  );
}
