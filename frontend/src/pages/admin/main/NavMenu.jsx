import * as React from 'react';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PeopleIcon from '@mui/icons-material/People';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmailIcon from '@mui/icons-material/Email';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import SocialDistanceIcon from '@mui/icons-material/SocialDistance';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import CategoryIcon from '@mui/icons-material/Category';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const menus = [
  { id: 1, title: 'داشبورد', link: '/admin', icon: <DashboardIcon />, children: [] },
  {
    id: 2, title: 'مدیریت', link: '', icon: <ManageAccountsIcon />, children: [
      { id: 21, title: "کاربران", link: '/admin/users', icon: <PeopleIcon /> },
      { id: 22, title: "لینک‌ها", link: '/admin/links', icon: <InsertLinkIcon /> },
      { id: 23, title: "شبکه‌های اجتماعی", link: '/admin/socials', icon: <SocialDistanceIcon /> },
    ]
  },
  {
    id: 3, title: 'سفارشی‌سازی', link: '', icon: <ManageAccountsIcon />, children: [
      { id: 31, title: "شبکه‌های اجتماعی", link: '/admin/apps', icon: <DashboardCustomizeIcon /> },
      { id: 32, title: "آیکون‌ها", link: '/admin/icons', icon: <CategoryIcon /> },
    ]
  },
  { id: 4, title: "تیکت‌ها", link: '#', icon: <EmailIcon />, children: [] },
]

export default function NestedList() {
  const [open, setOpen] = useState(Array(menus.length).fill(false));
  const navigate = useNavigate();
  const handleClick = (index) => {
    setOpen((prev) => {
      const newOpen = Array(prev.length).fill(false);
      newOpen[index] = !prev[index];
      return newOpen;
    });
  };
  return (
    <List
      sx={{ width: '100%', maxWidth: 360, pt: { xs: '4rem', sm: 0 }, '& *': { color: '#faf7f0' }, }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      {
        menus.map(item => {
          if (item.children.length == 0) {
            return (
              <ListItemButton key={item.id} onClick={() => navigate(item.link)}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText sx={{ textAlign: 'start' }} primary={item.title} />
              </ListItemButton>
            )
          } else {
            return (
              <React.Fragment key={item.id}>
                <ListItemButton onClick={() => handleClick(item.id - 1)}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText sx={{ textAlign: 'start' }} primary={item.title} />
                  {open[item.id - 1] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open[item.id - 1]} timeout="auto" unmountOnExit sx={{ background: '#ffffff11' }}>
                  <List component="div" disablePadding>
                    {item.children.map(child => {
                      return (
                        <ListItemButton key={child.id} onClick={() => navigate(child.link)} sx={{ pl: 4 }}>
                          <ListItemIcon>
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText sx={{ textAlign: 'start' }} primary={child.title} />
                        </ListItemButton>
                      )
                    })}
                  </List>
                </Collapse>
              </React.Fragment>
            )

          }
        })
      }
    </List>
  );
}