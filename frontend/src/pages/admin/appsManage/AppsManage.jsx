import { useState } from 'react';
import { useEffect } from 'react';
import fetchApi from '../../../more/fetchApi';
import { useSnackbar } from '../components/Snackbar';
import { getIconByTitle } from '../../../more/icons';
import { Box, Button, Typography } from '@mui/material';
import DataTable from '../components/DataTable';
import { useAppModal } from '../components/Dialog';
import EditApp from './EditApp';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorIcon from '@mui/icons-material/Error';

import Alt from '../components/Alt';

export default function AppManage() {
  const { showModal, hideModal } = useAppModal();
  const [apps, setApps] = useState([]);
  const { showSnackbar } = useSnackbar();
  const columns = [
    {
      field: 'icon_title', headerName: 'آیکون', flex: 0.5, sortable: false, display: 'flex',
      justifyContent: 'flex-start',
      renderCell: (params) => (getIconByTitle(params.value)),
    },
    { field: 'title', headerName: 'عنوان', flex: 1 },
    {
      field: 'link', headerName: 'لینک', flex: 2,
      renderCell: (params) => (
        <span style={{ direction: "ltr", width: "100%" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: 'actions', headerName: 'عملیات', flex: 2, sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 2 }}>
          <Alt text="ویرایش"> <EditSquareIcon onClick={() => showEditHandler(params.row)} /></Alt>
          <Alt text="حذف"> <DeleteIcon onClick={() => ShowRemoveHandler(params.row.id)} /></Alt>
        </Box>
      ),
    },
  ];
  const ShowRemoveHandler = async (id) => {
    try {
      const res = await fetchApi('/apps/delete_check', "POST", { id })
      if (res.ok) {
        let message = <></>
        if (res.data.number) {
          message = <>
            <Typography sx={{ mb: 2 }}>
              {res.data.number} کاربر از این شبکه اجتماعی استفاده میکند!
            </Typography>
            <Typography>
              تایید حذف باعث حذف اطلاعات کاربر نیز میشود!
            </Typography>
          </>
        } else {
          message = <Typography>
            از حذف شبکه اجتماعی اطمینان دارید؟
          </Typography>
        }
        showModal({
          title: <><ErrorIcon />  حذف شبکه اجتماعی</>,
          content: message,
          actions: <>
            <Button variant='outlined' onClick={hideModal}>انصراف</Button>
            <Button variant='contained'
              onClick={() => {
                deleteOneOfDbApps(id); hideModal();
              }}>بله حذف شود</Button>
          </>
        })

      }
      else showSnackbar(res.data.message);
    } catch (error) {
      showSnackbar('خطا در ارتباط!');
    }
  }
  const deleteOneOfDbApps = async (id) => {
    try {
      const res = await fetchApi(`/apps/${id}`, "DELETE")
      if (res.ok) {
        setApps(prev => prev.filter(item => item.id !== id));
      }
      showSnackbar(res.data.message);
    } catch (error) {
      showSnackbar('خطا در ارتباط!');
    }
  }
  const showEditHandler = async (data) => {
    const defaultApp = {
      id: data.id,
      title: data.title,
      link: data.link,
      titleIcon: data.icon_title
    }
    showModal({
      title: <><EditSquareIcon />  ویرایش شبکه اجتماعی</>,
      content: <EditApp save={savingApp} cancel={hideModal}
        defaultApp={defaultApp} />
    })
  }
  const showAddHandler = async () => {
    showModal({
      title: <><AddCircleIcon />  افزودن شبکه اجتماعی</>,
      content: <EditApp save={savingApp} cancel={hideModal} />
    })
  }
  const savingApp = async (app) => {
    try {
      const res = await fetchApi('/apps', "POST", { app })
      if (res.ok) {
        if (app.id)
          setApps(prev =>
            prev.map(item => item.id === app.id ? res.data.app : item)
          )
        else
          setApps(prev => [...prev, res.data.app])
      }
      else showSnackbar(res.data.message);
    } catch (error) {
      showSnackbar('خطا در ارتباط!');
    }
    hideModal();
  }
  useEffect(() => {
    (async () => {

      try {
        const res = await fetchApi('/apps')
        if (res.ok) {
          setApps(res.data.apps);
        }
        else showSnackbar(res.data.message);
      } catch (error) {
        showSnackbar('خطا در ارتباط!');
      }
    })()
  }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ height: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography>
          شبکه‌های اجتماعی
        </Typography>
        <Button size='small' variant='contained' onClick={showAddHandler}>
          افزودن
        </Button>
      </Box>
      <DataTable columns={columns} rows={apps} colSize={10} />
    </Box>
  );
}
