import * as React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import fetchApi from '../../../more/fetchApi';
import { Box } from '@mui/material';
import CellGridAvatar from './CellGridAvatar';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import StarsIcon from '@mui/icons-material/Stars';
import CellGridActionsUsers from './CellGridActionsUsers';
import { useSnackbar } from '../components/Snackbar';
import { useParams } from 'react-router-dom';
import { useAppModal } from '../components/Dialog';
import Alt from '../components/Alt';
import Bdg from '../components/Bdg';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import DatasetLinkedIcon from '@mui/icons-material/DatasetLinked';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';

export default function UserManage() {
  const [users, setUsers] = useState([]);
  const { showSnackbar } = useSnackbar();
  const { showModal, hideModal } = useAppModal();
  const { id } = useParams();
  const navigate = useNavigate();
  const columns = [
    {
      field: 'photo', headerName: 'نمایه', flex: 0.5, sortable: false, display: 'flex',
      justifyContent: 'flex-start',
      renderCell: (params) => (<CellGridAvatar photo={params.value}
        click={() => showPhoto(params.value)} />),
    },
    { field: 'name', headerName: 'نام', flex: 1 },
    { field: 'mail', headerName: 'ایمیل', flex: 2 },
    { field: 'username', headerName: 'نام کاربری', flex: 1, },
    {
      field: 'access', headerName: 'سطح', flex: 0.5,
      renderCell: (params) => {
        switch (params.value) {
          case 0:
            return <Alt text="بدون احراز"> <HorizontalRuleIcon sx={{ mt: 2 }} /> </Alt>
          case 1:
            return <Alt text="احراز هویت شده"> <MarkEmailReadIcon sx={{ mt: 2 }} /> </Alt>
          case 10:
            return <Alt text="ادمین"> <StarsIcon sx={{ mt: 2 }} /> </Alt>
        }
      }
    },
    {
      field: 'id',
      headerName: '‌لینک‌ها',
      sortable: false,
      flex: 1.5,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Bdg number={params.row.link_count}>
            <Alt text="لینک‌ها">
              <DatasetLinkedIcon sx={{ mt: 2 }}
                onClick={() => {
                  params.row.link_count &&
                    navigate(`/admin/links/${params.row.id}`)
                }} />
            </Alt>
          </Bdg>
          <Bdg number={params.row.social_count}>
            <Alt text="شبکه‌های اجتماعی">
              <SmartphoneIcon sx={{ mt: 2 }}
                onClick={() => {
                  params.row.social_count &&
                    navigate(`/admin/socials/${params.row.id}`)
                }} />
            </Alt>
          </Bdg>
        </Box>
      )
    },

    {
      field: 'action',
      headerName: 'عملیات',
      sortable: false,
      flex: 2,
      renderCell: (params) => (<CellGridActionsUsers user={params.row} setUsers={setUsers} />)

    },
  ];
  const showPhoto = (photo) => {
    if (photo)
      showModal({
        content:
          <Box component="img" src={`${process.env.REACT_APP_API_URL}/public${photo}`}
            sx={{ width: 350, height: "auto", borderRadius: 2 }} alt="تصویر کاربر"
            onClick={hideModal} />
      })
    else
      showSnackbar('کاربر مورد نظر تصویر ندارد!');
  }
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchApi('/users/get_all')
        if (res.ok) {
          if (id) {
            setUsers(res.data.filter(item => item.id === id));
          } else
            setUsers(res.data);
        }
        else showSnackbar(res.data.message);
      } catch (error) {
        showSnackbar('خطا در ارتباط!');
      }
    })()
  }, []);

  return (
    <DataTable columns={columns} rows={users} colSize={10} />
  );
}
