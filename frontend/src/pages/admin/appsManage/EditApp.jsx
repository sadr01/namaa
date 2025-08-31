import { Box, Button, FormControl, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import fetchApi from '../../../more/fetchApi';
import { useSnackbar } from '../components/Snackbar';
import { getIconByTitle } from '../../../more/icons';

export default function EditApp({ save, cancel,
  defaultApp = { id: 0, title: '', link: '', titleIcon: '' } }) {
  const [title, setTitle] = useState();
  const [link, setLink] = useState();
  const [titleIcon, setTitleIcon] = useState();
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbar();
  const styleRowBox = { display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'flex-start' };

  useEffect(() => {
    if (defaultApp.id) {
      setTitle(defaultApp.title)
      setLink(defaultApp.link)
      setTitleIcon(defaultApp.titleIcon)
    }
    (async () => {
      try {
        const result = await fetchApi('/icons');
        if (result.ok) {
          let iconsApp = [];
          result.data.icons.forEach(item => {
            iconsApp.push({ title: item.title, icon: getIconByTitle(item.title) })
          });
          setIcons(iconsApp);
        } else {
          cancel();
          showSnackbar(result.data.message);
        }
      } catch (error) {
        showSnackbar('خطا در ارتباط!')
      } finally {
        setLoading(false);
      }
    })()
  }, [])

  return (
    loading ?
      <CircularProgress disableShrink sx={{ m: 5 }} />
      :
      <>
        <Box display={{ display: 'flex', flexDirection: 'column', rowGap: 10 }}>
          <Box sx={styleRowBox}>
            <Typography sx={{ justifySelf: "flex-start" }}> عنوان </Typography>
            <TextField size='small' defaultValue={defaultApp.title} sx={{ width: '15rem' }}
              onChange={e => setTitle(e.target.value)} />
          </Box>
          <Box sx={styleRowBox}>
            <Typography sx={{ justifySelf: "flex-start" }}>الگو لینک</Typography>
            <TextField size='small' sx={{ width: '15rem', direction: 'ltr' }}
              defaultValue={defaultApp.link} onChange={e => setLink(e.target.value)} />
          </Box>
          <Box sx={styleRowBox}>
            <Typography sx={{ justifySelf: "flex-start" }}>
              آیکون
            </Typography>
            <FormControl fullWidth sx={{ width: '15rem' }}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                size="small"
                onChange={e => setTitleIcon(e.target.value)}
                defaultValue={defaultApp.titleIcon}
                renderValue={(selected) => {
                  const selectedIcon = icons.find((i) => i.title === selected);
                  return (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, alignItems: 'center' }}>
                      {selectedIcon?.title}
                      {selectedIcon?.icon}
                    </Box>
                  );
                }}
              >
                {icons.map((icon) => (
                  <MenuItem
                    key={icon.title}
                    value={icon.title}
                    sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}
                  >
                    {icon.title}
                    {icon.icon}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant='outlined' onClick={() => cancel()}>انصراف</Button>
          <Button variant='contained'
            onClick={() => save({ id: defaultApp.id, title, link, titleIcon })}>ذخیره</Button>
        </Box>
      </>
  )
}
