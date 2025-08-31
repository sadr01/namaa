import React, { useEffect, useState } from 'react';
import { Box, Avatar, Button, TextField, Typography, Skeleton } from '@mui/material';
import BackButton from '../components/BackButton';
import BoxCaptionField from '../components/BoxCaptionField';
import { useAppModal } from '../components/ModalContext';
import useField from '../../../hooks/useField';
import './setting.css';
import regexes from '../../../more/regexes';
import fetchApi from '../../../more/fetchApi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const [avatar, setAvatar] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showModal, hideModal } = useAppModal();
  const [name, setName, captionName, setCaptionName] = useField();
  const [username, setUsername, captionUsername, setCaptionUsername] = useField();
  const navigate = useNavigate();
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const handleAvatarChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    if (selectedFile.size > MAX_FILE_SIZE) {
      showModal({ content: <p>حجم تصویر بیش از 2 مگابایت است!</p> })
      return;
    }
    setFile(selectedFile);
    setAvatar(URL.createObjectURL(selectedFile));
  };
  const savingHandler = async () => {
    if (!regexes.name.test(name)) {
      setCaptionName(true);
      return;
    }
    if (file && file.size > MAX_FILE_SIZE) {
      showModal({ content: <p>حجم تصویر بیش از 2 مگابایت است!</p> })
      return;
    }
    if (username && !regexes.username.test(username)) {
      showModal({
        content: <>
          <p>نام کاربری مجاز نیست!</p>
          <p>فقط از حروف کوچک لاتین +اعداد استفاده شود.</p>
          <p>حداقل 5 و حداکثر 30 کاراکتر!</p>
          <p>کاراکتر ابتدایی از حروف لاتین باشد.</p>
        </>
      })
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('username', username);
      if (file) {
        formData.append('avatar', file);
      }
      const res = await fetchApi('/users/editpage', 'POST', formData);
      showModal({ content: <p>{res.data.message}</p> })
      if (res.ok) {
        let newUser = res.data.user;
        setUser((prev) => {
          return { ...prev, ...newUser }
        });
        navigate('/set');
      }
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setName(user.name);
    setUsername(user.username);
    setAvatar(`${process.env.REACT_APP_API_URL}/public/${user.photo}`)

  }, [])
  return (
    <Box className="form-box">
      <Box sx={{ display: 'flex', justifyContent: 'end' }}>
        <BackButton address="/set" />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          <Skeleton animation="wave" variant="rounded" width="100%" height={50} />
          <Skeleton animation="wave" variant="rounded" width="100%" height={50} />
          <Skeleton animation="wave" variant="rounded" width="100%" height={80} />
          <Skeleton animation="wave" variant="rounded" width="100%" height={20} />
          <Skeleton animation="wave" variant="rounded" width="100%" height={50} />
        </Box>
      ) : (
        <>
          <Box className="row-form-box">
            <Box sx={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              mb: 1, gap: 5,
            }}
            >
              <Avatar src={avatar || ''} sx={{ width: 70, height: 70 }} />

              <Button
                className="btn"
                variant="outlined"
                component="label"
                sx={{ flexGrow: 1 }}
              >
                بارگذاری تصویر
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarChange}
                />
              </Button>
            </Box>
          </Box>

          <Box className="row-form-box">
            <Typography variant="body2" sx={{ textAlign: 'start' }}>
              نام
            </Typography>
            <TextField
              size="small"
              className="input"
              id="outlined"
              placeholder="نام کوتاه و مستعار..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              inputProps={{ maxLength: 20 }}
            />
            {captionName && (
              <BoxCaptionField caption="حداقل 2 و حداکثر 20 کاراکتر" />
            )}
          </Box>
          <Box className="row-form-box">
            <Typography variant="body2" sx={{ textAlign: 'start' }}>
              نام کاربری
              <Typography variant="caption" sx={{ mr: 1 }}>
                (راه ارتباطی به صفحه شما)
              </Typography>
            </Typography>
            <TextField
              size="small"
              className="input"
              placeholder="username"
              id="outlined"
              value={username}
              dir="ltr"
              onChange={(e) => setUsername(e.target.value)}
              inputProps={{ maxLength: 100 }}
            />
            <BoxCaptionField
              dir="ltr"
              caption={`http://namaa.com/@${username}`}
            />
          </Box>

          <Box className="row-form-box">
            <Button
              className="btn"
              variant="outlined"
              fullWidth
              onClick={savingHandler}
              sx={{ my: 2 }}
            >
              ذخیره
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
