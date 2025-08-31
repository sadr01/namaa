import ProtectedRoute from "../pages/client/components/ProtectedRoute";
import { AuthProvider } from "../context/authContext";
import Login from '../pages/client/Auth/Login';
import Register from '../pages/client/Auth/Register';
import ForgetPassword from '../pages/client/Auth/ForgetPassword'
import Main from '../pages/client/main/Main.jsx';
import Wellcome from '../pages/client/main/Wellcome';
import NotFind from '../pages/client/main/NotFind';
import Profile from '../pages/client/profile/Profile';
import ViewsChart from '../pages/client/profile/ViewsChart';
import Me from '../pages/client/profile/Me';
import ShareMe from '../pages/client/profile/ShareMe';
import SettingManager from '../pages/client/edit/SettingManager';
import EditProfile from '../pages/client/edit/EditProfile';
import LinksManager from '../pages/client/edit/LinksManager';
import SocialsManager from '../pages/client/edit/SocialsManager'
import EditLink from '../pages/client/edit/EditLink';
import EditSocial from '../pages/client/edit/EditSocial';
import GuestRoute from "../pages/client/components/GuestRoute";
import VerifyMail from "../pages/client/Auth/VerifyMail";
import ChangePassword from "../pages/client/Auth/ChangePassword";
import Logout from "../pages/client/Auth/Logout";
////
import MainAdmin from '../pages/admin/main/MainAdmin.jsx'
import HomeAdmin from '../pages/admin/main/Home.jsx'
import UsersManage from '../pages/admin/usersManage/UsersManage.jsx'
import LinksManage from '../pages/admin/linksManage/LinksManage.jsx'
import SocialsManage from '../pages/admin/socialsManage/SocialsManage.jsx'
import IconsManage from '../pages/admin/iconsManage/IconsManage.jsx'
import AppsManage from '../pages/admin/appsManage/AppsManage.jsx'

const routes = [
  {
    path: '/admin/',
    element: <AuthProvider><ProtectedRoute access={10}><MainAdmin /></ProtectedRoute></AuthProvider>,
    children: [
      { path: '', element: <HomeAdmin /> },
      { path: 'users/:id?', element: <UsersManage /> },
      { path: "links/:id?", element: <LinksManage /> },
      { path: "socials/:id?", element: <SocialsManage /> },
      { path: "icons", element: <IconsManage /> },
      { path: "apps", element: <AppsManage /> }
    ]
  },
  {
    path: '/',
    element: <AuthProvider><Main /></AuthProvider>,
    children: [
      // Guest-only pages
      { path: '', element: <GuestRoute><Wellcome /></GuestRoute> },
      { path: 'login', element: <GuestRoute><Login /></GuestRoute> },
      { path: 'register', element: <GuestRoute><Register /></GuestRoute> },
      { path: 'forgetpass', element: <GuestRoute><ForgetPassword /></GuestRoute> },

      // Protected pages
      { path: 'verifymail', element: <ProtectedRoute><VerifyMail /></ProtectedRoute> },
      { path: 'changepass', element: <ProtectedRoute access={1}><ChangePassword /></ProtectedRoute> },
      { path: 'logout', element: <ProtectedRoute><Logout /></ProtectedRoute> },
      { path: 'me', element: <ProtectedRoute access={1}><Me /></ProtectedRoute> },
      { path: 'chart', element: <ProtectedRoute access={1}><ViewsChart /></ProtectedRoute> },
      { path: 'share', element: <ProtectedRoute access={1}><ShareMe /></ProtectedRoute> },

      // Profile settings
      { path: 'set', element: <ProtectedRoute><SettingManager /></ProtectedRoute> },
      { path: 'set/profile', element: <ProtectedRoute access={1}><EditProfile /></ProtectedRoute> },
      { path: 'set/links', element: <ProtectedRoute><LinksManager /></ProtectedRoute> },
      { path: 'set/elink/:id', element: <ProtectedRoute access={1}><EditLink /></ProtectedRoute> },
      { path: 'set/socials', element: <ProtectedRoute><SocialsManager /></ProtectedRoute> },
      { path: 'set/esocial/:id', element: <ProtectedRoute access={1}><EditSocial /></ProtectedRoute> },

      // Dynamic user profiles (GuestRoute ok)
      { path: ':username', element: <GuestRoute><Profile /></GuestRoute> },

      // Catch-all inside "/"
      { path: '404', element: <GuestRoute><NotFind /></GuestRoute> },
      { path: '*', element: <GuestRoute><NotFind /></GuestRoute> },
    ]
  },

];


export default routes;