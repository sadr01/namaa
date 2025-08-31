import { Badge, Box, Button, TextField, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import EditSquareIcon from '@mui/icons-material/EditSquare';
import DeleteIcon from '@mui/icons-material/Delete';

import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate } from 'react-router-dom';
import { useAppModal } from '../components/Dialog';
import ErrorIcon from '@mui/icons-material/Error';
import { useSnackbar } from '../components/Snackbar';
import fetchApi from '../../../more/fetchApi';
import LaunchIcon from '@mui/icons-material/Launch';
import Alt from '../components/Alt';

export default function CellGridActionsUsers({ user, setUsers }) {
  const navigate = useNavigate();
  const { showModal, hideModal } = useAppModal();
  const { showSnackbar } = useSnackbar();
  const usernameRef = useRef();
  const mailRef = useRef();
  const accessRef = useRef();

  const showEditHandler = () => {
    showModal({
      title: <>
        <ErrorIcon /> ویرایش کاربر
      </>,
      content: <Box display={{ display: 'flex', flexDirection: 'column', rowGap: 10 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'center' }}>
          <Typography sx={{ flexGrow: 1 }}> نام کاربری</Typography>
          <TextField size='small' defaultValue={user.username}
            inputRef={usernameRef}
            sx={{ width: '15rem' }} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'center' }}>
          <Typography sx={{ justifySelf: "flex-start" }}>ایمیل</Typography>
          <TextField size='small'
            defaultValue={user.mail}
            inputRef={mailRef} sx={{ width: '15rem' }} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'center' }}>
          <Typography sx={{ justifySelf: "flex-start" }}>سطح</Typography>
          <TextField size='small' type='number' defaultValue={user.access} inputRef={accessRef}
            sx={{ width: '15rem' }} />
        </Box>
      </Box>,
      actions: <>
        <Button variant='outlined' onClick={hideModal}>انصراف</Button>
        <Button variant='contained'
          onClick={() => {
            editUser(usernameRef.current.value, mailRef.current.value, Number(accessRef.current.value));
            hideModal();
          }}>ویرایش</Button>
      </>
    })
  }
  const editUser = async (username, mail, access) => {
    if (username != user.username || mail != user.mail || access != user.access) {
      try {
        const result = await fetchApi('/users/edit', 'POST', { id: user.id, username, mail, access });
        if (result.ok) {
          setUsers(prev => {
            let newUsers = prev.map(item => {
              if (item.id === user.id) {
                return { ...item, username, mail, access }
              }
              return item
            });
            return newUsers;
          });
        }
        showSnackbar(result.data.message);
      } catch (error) {
        showSnackbar('خطا در ارتباط!');
      }
    }
  }
  const ShowRemoveHandler = () => {
    showModal({
      title: <>
        <ErrorIcon /> حذف کاربر!
      </>,
      content: <Typography>آیا از حذف کاربر «{user.mail}» اطمینان دارید؟</Typography>,
      actions: <>
        <Button variant='outlined' onClick={hideModal}>انصراف</Button>
        <Button variant='contained' onClick={() => { removeUser(); hideModal(); }}>بله حذف شود</Button>
      </>
    })
  }
  const removeUser = async () => {
    try {
      const result = await fetchApi(`/users/${user.id}`, 'DELETE');
      if (result.ok) {
        setUsers(prev => {
          let newUsers = prev.filter(item => item.id !== user.id)
          return newUsers;
        });
      }
      showSnackbar(result.data.message);
    } catch (error) {
      showSnackbar('خطا در ارتباط!');
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 2 }}>

      {user.username ?
        <Alt text="صفحه کاربر"> <LaunchIcon onClick={() => navigate(`${process.env.REACT_APP_API_URL}/@${user.username}`)} /> </Alt>
        :
        <Alt text="بدون صفحه"> <LaunchIcon sx={{ opacity: 0.3 }} /> </Alt>
      }
      <Alt text="تیکت‌ها"> <ChatIcon /></Alt>
      <Alt text="ویرایش کاربر"> <EditSquareIcon onClick={showEditHandler} /></Alt>
      <Alt text="حذف کاربر"> <DeleteIcon onClick={ShowRemoveHandler} /></Alt>

    </Box>
  )
}
