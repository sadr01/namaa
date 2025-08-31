import React, { useState } from 'react';
import { useEffect } from 'react';
import fetchApi from '../../../more/fetchApi';
import CellGridAvatar from '../usersManage/CellGridAvatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useSnackbar } from '../components/Snackbar';
import { getIconByTitle } from '../../../more/icons';
import { Typography } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DataTable from '../components/DataTable';

import Alt from '../components/Alt'
export default function SocialManage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [socials, setSocials] = useState([]);
  const { showSnackbar } = useSnackbar();
  const columns = [
    {
      field: 'user_photo', headerName: 'کاربر', flex: 0.5, sortable: false, display: 'flex',
      justifyContent: 'flex-start',
      renderCell: (params) => (<CellGridAvatar photo={params.value}
        click={() => navigate(`/admin/users/${params.row.id_user}`)} />),
    },
    {
      field: 'app_icon', headerName: 'برنامه', flex: 0.5, sortable: false, display: 'flex',
      justifyContent: 'flex-start',
      renderCell: (params) =>
        (<Alt text={params.row.app_title}> {React.cloneElement(getIconByTitle(params.value), { sx: { mb: 1 } })}</Alt>),
    },
    {
      field: 'link', headerName: 'لینک', flex: 2,
      renderCell: (params) => (<a href={params.value}>{params.value}</a>),
    },
    {
      field: 'is_show', headerName: 'وضعیت', flex: 1,
      renderCell: (params) =>
      (params.value == 1 ?
        <Alt text="قابل نمایش"> <VisibilityIcon sx={{ opacity: 0.5 }} />  </Alt>
        :
        <Alt text="عدم نمایش"> <VisibilityOffIcon sx={{ opacity: 0.5 }} /> </Alt>)
    },
    {
      field: 'created_at',
      headerName: 'تاریخ ساخت',
      sortable: false,
      flex: 2,
      renderCell: (params) => {
        const date = params.row.created_at ? new Date(params.row.created_at) : null;
        return (
          <Typography sx={{ direction: 'ltr' }}>
            {date ? Intl.DateTimeFormat("fa-IR", {
              dateStyle: "short",
              timeStyle: "medium",
            }).format(date) : "-"}
          </Typography>
        )
      }
    },
  ];
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchApi('/socials/all')
        if (res.ok) {
          if (id) {
            setSocials(res.data.filter(item => item.id_user === id));
          } else
            setSocials(res.data);
        }
        else showSnackbar(res.data.message);
      } catch (error) {
        showSnackbar('خطا در ارتباط!');
      }
    })()
  }, [])
  return (
    <DataTable columns={columns} rows={socials} colSize={10} />
  );
}
