import { useState } from 'react';
import { useEffect } from 'react';
import fetchApi from '../../../more/fetchApi';
import CellGridAvatar from '../usersManage/CellGridAvatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useSnackbar } from '../components/Snackbar';
import { getIconByTitle } from '../../../more/icons';
import { Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import Alt from '../components/Alt';
import DataTable from '../components/DataTable';

export default function LinkManage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [links, setLinks] = useState([]);

  const { showSnackbar } = useSnackbar();
  const columns = [
    {
      field: 'user_photo', headerName: 'کاربر', flex: 0.5, sortable: false, display: 'flex',
      justifyContent: 'flex-start',
      renderCell: (params) => (<CellGridAvatar photo={params.value}
        click={() => navigate(`/admin/users/${params.row.id_user}`)} />),
    },
    {
      field: 'icon_title', headerName: 'آیکون', flex: 0.5, sortable: false, display: 'flex',
      justifyContent: 'flex-start',
      renderCell: (params) => (getIconByTitle(params.value)),
    },
    { field: 'title', headerName: 'عنوان', flex: 1 },
    { field: 'link', headerName: 'لینک', flex: 2 },
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
        const res = await fetchApi('/links/all')
        if (res.ok) {
          if (id) {
            setLinks(res.data.filter(item => item.id_user === id));
          } else
            setLinks(res.data);
        }
        else showSnackbar(res.data.message);
      } catch (error) {
        showSnackbar('خطا در ارتباط!');
      }
    })()
  }, [])
  return (
    <DataTable columns={columns} rows={links} colSize={10} />
  );
}
