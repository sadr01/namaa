import React, { useEffect, useState } from 'react'
import { icons, getIconByTitle } from "../../../more/icons";
import fetchApi from '../../../more/fetchApi';
import { Box, Button, Typography } from '@mui/material';
import ShowIcons from './ShowIcons';
import './styles.css'
import { useSnackbar } from '../components/Snackbar';
import SearchBox from '../components/SearchBox';
import { useAppModal } from '../components/Dialog';
import ErrorIcon from '@mui/icons-material/Error';

export default function IconsManage() {
  const [search, setSearch] = useState('');
  const [dbList, setDbList] = useState([]);
  const { showModal, hideModal } = useAppModal();
  const [waitingList, setWaitingList] = useState([]);
  const [defaultList, setDefaultList] = useState([]);
  const { showSnackbar } = useSnackbar();

  const addToWaitingList = (title) => {
    if (waitingList.find((item) => item.title === title)) {
      showSnackbar('آیکون در لیست وجود دارد!')
    } else {
      setWaitingList(prev => {
        let items = [...prev, { title, icon: getIconByTitle(title) }]
        return items
      })
    }
  }
  const addToDatabase = async () => {
    if (waitingList.length === 0)
      showSnackbar('لیست خالی است!')
    let newList = waitingList.map(item => item.title);
    (async () => {
      try {
        const result = await fetchApi('/icons/', 'POST', { newList });
        if (result.ok) {
          setDbList(prev => {
            let newItems = [...prev];
            result.data.savedIcons.forEach(title => {
              newItems.push({ title, icon: getIconByTitle(title) })
            });
            return newItems;
          })
          setWaitingList([]);
          showSnackbar(`${result.data.savedIcons.length} عدد آیکون جدید به منتخب افزوده شد.`)
        } else {
          showSnackbar(result.data.message);
        }
      } catch (error) {
        showSnackbar('خطا در ارتباط!')
      }
    })()
  }
  const showDeleteOneOfDbIcons = async (titleIcon) => {
    showModal({
      title: <>
        <ErrorIcon /> حذف آیکون‌
      </>,
      content: <Typography>
        آيا از حذف‌ آيکون‌ {getIconByTitle(titleIcon)} مطمئن هستید؟
      </Typography>
      ,
      actions: <>
        <Button variant='outlined' onClick={hideModal}>انصراف</Button>
        <Button variant='contained'
          onClick={() => {
            deleteOneOfDbIcons(titleIcon); hideModal();
          }}>بله حذف شوند</Button>
      </>
    })
  }
  const showDeleteAllDbIcons = async () => {
    showModal({
      title: <>
        <ErrorIcon /> حذف آیکون‌ها
      </>,
      content: <Typography>
        آيا از حذف‌ همه آيکون‌ها مطمئن هستید؟
      </Typography>
      ,
      actions: <>
        <Button variant='outlined' onClick={hideModal}>انصراف</Button>
        <Button variant='contained'
          onClick={() => {
            deleteAllDbIcons(); hideModal();
          }}>بله حذف شوند</Button>
      </>
    })
  }
  const deleteOneOfDbIcons = async (titleIcon) => {
    (async () => {
      try {
        const result = await fetchApi(`/icons/${titleIcon}`, 'DELETE');
        if (result.ok) {
          setDbList(prev => {
            let list = [...prev];
            return list.filter((item) => item.title !== titleIcon);
          });
        }
        showSnackbar(result.data.message);
      } catch (error) {
        showSnackbar('خطا در ارتباط!')
      }
    })()
  }
  const deleteAllDbIcons = async () => {
    (async () => {
      try {
        const result = await fetchApi(`/icons`, 'DELETE');
        if (result.ok) {
          setDbList([]);
        }
        showSnackbar(result.data.message);
      } catch (error) {
        showSnackbar('خطا در ارتباط!')
      }
    })()
  }
  useEffect(() => {
    (async () => {
      try {
        const result = await fetchApi('/icons');
        if (result.ok) {
          let newItems = [];
          result.data.icons.forEach(item => {
            newItems.push({ title: item.title, icon: getIconByTitle(item.title) })
          });
          setDbList(newItems);
        } else {
          showSnackbar(result.data.message);
        }
      } catch (error) {
        showSnackbar('خطا در ارتباط!')
      }
    })()
  }, []);
  useEffect(() => {
    if (search.length > 1) {
      setDefaultList(icons.filter((icon) => icon.title.toLowerCase().includes(search.toLowerCase())))
    } else {
      setDefaultList(icons)
    }
  }, [search]);

  return (
    <Box sx={{}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 3, mb: 3 }}>
        <Box sx={{ flexGrow: 1 }} >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', height: 35 }}>
            <Typography variant='subtitle1' sx={{ textAlign: 'right' }}>
              آيکون‌های منتخب
            </Typography>
            <Box sx={{ height: 30 }}>
              <Button size='small' variant='outlined' onClick={showDeleteAllDbIcons}>
                حذف همه
              </Button>
            </Box>
          </Box>
          <Box className='box-icons' sx={{ height: 125 }}>
            <ShowIcons icons={dbList} func={showDeleteOneOfDbIcons} />
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1 }} >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', height: 35 }}>
            <Typography variant='subtitle1' sx={{ textAlign: 'right' }}>
              لیست انتظار
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, height: 30 }}>
              <Button size='small' variant='outlined' onClick={() => setWaitingList([])}>
                ریست
              </Button>
              <Button size='small' variant='outlined' onClick={addToDatabase}>
                ذخیره
              </Button>
            </Box>
          </Box>
          <Box className='box-icons' sx={{ height: 125 }}>
            <ShowIcons icons={waitingList} />
          </Box>
        </Box >
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', height: 40, alignItems: 'center' }}>
        <Typography variant='subtitle1' sx={{ textAlign: 'right' }}>
          آيکون‌ها
        </Typography>
        <SearchBox search={search} setSearch={setSearch} />
      </Box>
      <Box className='box-icons' sx={{ height: 350 }}>
        <ShowIcons icons={defaultList} func={addToWaitingList} />
      </Box>
    </Box>
  )
}
