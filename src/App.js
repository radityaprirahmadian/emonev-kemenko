import React, { useContext, useEffect, useState } from 'react';
import Topbar from './component/Topbar/Topbar';
import './App.css';
import Footer from './component/Footer/Footer';
import { BrowserRouter , Route, Link, Switch } from "react-router-dom";
import Login from './component/Login/Login';
import SearchBar from './component/SearchBar/SearchBar';
import Card from './component/Card/Card';
import SideBarOff from './component/SideBarOff/SideBarOff';
import Dashboard from './pages/InfoGrafik/InfoGrafik';
import GNRM from './pages/PelaksanaanGnrm/PelaksanaanGnrm';
import Monev from './pages/Monev/Monev';
import FormGNRM from './pages/FormGNRM/FormGNRM';
import FormMonev from './pages/FormMonev/FormMonev';
import Admin from './pages/Admin/Admin';
import Reminder from './pages/Reminder/Reminder';
import ReminderOwner from './pages/Reminder/ReminderOwner';
import FormAdmin from './pages/FormAdmin/FormAdmin';
import FormReminder from './pages/FormReminder/FormReminder';
import Profile from './pages/Profile/Profile';
import ProfileEdit from './pages/Profile/ProfileEdit';
import GalleryPage from './pages/Gallery/Gallery';
import Home from './pages/Home/Home';
import Notifikasi from './pages/Notifikasi/Notifikasi';
import Artikel from './pages/Artikel/Artikel';
import AuthState , {AuthContext} from './context/Auth/AuthContext';
import PrivateRoute from './route/PrivateRoute';
import PrivateRouteAdmin from './route/PrivateRouteAdmin';
import LayoutState from './context/Layout/LayoutContext';
import ArtikelState from './context/Artikel/artikelContext';
import NotifState from './context/Notifikasi/NotifContext';
import NotFound from './pages/NotFound/NotFound';
import EditAdmin from './pages/EditAdmin/EditAdmin';
import ProfileAdmin from './pages/EditAdmin/ProfileAdmin';
import Infografis from './pages/Infografis/Infografis';
import FormInfografis from './pages/FormInfografis/FormInfografis';
import Instansi from './pages/Instansi/Instansi'
import InfografisState from './context/Infografis/InfografisContext';
import FormInstansi from './pages/FormInstansi/FormInstansi'
import Popup from './component/Popup/Popup'
import io from 'socket.io-client'
import SocketState from './context/SocketContext/SocketContext';
import LupaPassword from './pages/LupaPassword/LupaPassword'
import ProfileInstansi from './pages/ProfileInstansi/ProfileInstansi'
import ProfileInstansiEdit from './pages/ProfileInstansi/ProfileInstansiEdit'

const App = () => {
  const [ id , setId ] = useState('')
  const [ notifs, setNotifs] = useState([])

  useEffect(() => {
    let cleanup = false;
    if (!cleanup) {
      
      const socket = io('https://api.simonev.revolusimental.go.id')
      socket.on("connect", () => {
        socket.emit("notif_subscribe", { user: id });
      });

      socket.on("notif_receive", payload => {
        setNotifs([...notifs, payload].reverse());
      });
    }

    return () => {
        cleanup = true;
      };
  },[id,notifs])


  return (
    <div className="App">
      <AuthState>
        <SocketState>
        <LayoutState>
          <ArtikelState>
            <NotifState>
            <InfografisState>
              <BrowserRouter>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/login" render={(props) => <Login {...props} setId={setId} />}/>
                    <Route path='/artikel/:id' component={Artikel}/>
                    <Route path="/:role/dashboard">
                      <PrivateRoute
                        exact
                        path="/:role/dashboard"
                        component={Dashboard}
                        setId = {setId}
                        setId = {setId}
                        notif={notifs}
                      />
                    </Route>
                    <Route path="/:role/rencana-pelaksanaan-program" >
                      <PrivateRoute
                        exact 
                        path="/:role/rencana-pelaksanaan-program" 
                        component={GNRM}
                        setId = {setId}
                        notif={notifs} 
                      />
                    </Route>
                    <Route path="/:role/laporan-monev">
                      <PrivateRoute
                        exact
                        path="/:role/laporan-monev"
                        component={Monev}
                        setId = {setId}
                        notif={notifs} 
                      />
                    </Route>
                    <Route path="/:role/kabar-gnrm">
                      <PrivateRoute
                        exact
                        path="/:role/kabar-gnrm"
                        component={Infografis}
                        setId = {setId}
                        notif={notifs} 
                      />
                    </Route>
                    <Route path="/:role/formulir-kabar-gnrm/">
                      <PrivateRoute
                        exact
                        path="/:role/formulir-kabar-gnrm/"
                        component={FormInfografis}
                        setId = {setId}
                        notif={notifs} 
                      />
                    </Route>
                    <Route path="/:role/formulir-kabar-gnrm-edit/:id">
                      <PrivateRoute
                        exact
                        path="/:role/formulir-kabar-gnrm-edit/:id"
                        component={FormInfografis}
                        setId = {setId}
                        notif={notifs} 
                      />
                    </Route>
                    <Route path="/:role/formulir-gnrm/">
                      <PrivateRoute
                        exact
                        path="/:role/formulir-gnrm/"
                        component={FormGNRM}
                        setId = {setId}
                        notif={notifs} 
                      />
                    </Route>
                    <Route path="/:role/formulir-gnrm-edit/:id">
                      <PrivateRoute
                        exact
                        path="/:role/formulir-gnrm-edit/:id"
                        component={FormGNRM}
                        setId = {setId}
                        notif={notifs} 
                      />
                    </Route>
                    <Route path="/:role/formulir-instansi/">
                      <PrivateRoute
                        exact
                        path="/:role/formulir-instansi/"
                        component={FormInstansi}
                        setId = {setId}
                        notif={notifs} 
                      />
                    </Route>
                    <Route path="/:role/formulir-instansi-edit/:id">
                      <PrivateRoute
                        exact
                        path="/:role/formulir-instansi-edit/:id"
                        component={FormInstansi}
                        setId = {setId}
                        notif={notifs} 
                      />
                    </Route>
                    <Route path="/:role/formulir-monev/">
                      <PrivateRoute
                        exact
                        path="/:role/formulir-monev/"
                        component={FormMonev}
                        setId = {setId}
                        notif={notifs} 
                      />
                    </Route>
                    <Route path="/:role/formulir-monev-edit/:id">
                      <PrivateRoute
                        exact
                        path="/:role/formulir-monev-edit/:id"
                        component={FormMonev}
                        setId = {setId}
                        notif={notifs} 
                      />
                    </Route>
                    <Route path="/:role/edit-admin/:id">
                      <PrivateRoute path="/:role/edit-admin/:id">
                        <PrivateRouteAdmin
                          exact
                          path="/:role/edit-admin/:id"
                          component={EditAdmin}
                          setId = {setId}
                          notif={notifs} 
                        />
                      </PrivateRoute>
                    </Route>
                    <Route path="/:role/profile/:id" >
                      <PrivateRoute
                        exact
                        path="/:role/profile/:id" 
                        component={Profile}
                        setId = {setId}
                        notif={notifs}
                      />
                    </Route>
                    <Route path="/:role/edit-profile/:id">
                      <PrivateRoute
                        exact
                        path="/:role/edit-profile/:id"
                        component={ProfileEdit}
                        setId = {setId}
                        notif={notifs}
                      />
                    </Route> 
                    <Route path="/:role/kelola-admin">
                      <PrivateRoute path="/:role/kelola-admin">
                        <PrivateRouteAdmin
                        exact
                        path="/:role/kelola-admin"
                        component={Admin}
                        setId = {setId}
                        notif={notifs}
                      />
                      </PrivateRoute>
                    </Route> 
                    <Route path="/:role/kelola-profile-admin/:id">
                      <PrivateRoute path="/:role/kelola-profile-admin/:id">
                        <PrivateRouteAdmin
                        exact
                        path="/:role/kelola-profile-admin/:id"
                        component={ProfileAdmin}
                        setId = {setId}
                        notif={notifs}
                      />
                      </PrivateRoute>
                    </Route> 
                    {/* <Route path="/:role/admin/formulir-admin/:id">
                      <PrivateRoute
                        exact
                        path="/:role/admin/formulir-admin/:id"
                        component={FormAdmin}
                        />
                    </Route> */}
                    <Route path="/:role/formulir-tambah-admin">
                      <PrivateRoute path="/:role/formulir-tambah-admin/">
                        <PrivateRouteAdmin
                        exact
                        path="/:role/formulir-tambah-admin"
                        component={FormAdmin}
                        setId = {setId}
                        notif={notifs}
                        />
                      </PrivateRoute>
                    </Route>  
                    <Route path="/galeri" component={GalleryPage}/>
                    <Route path="/:role/notifikasi">
                      <PrivateRoute path="/:role/notifikasi" setId = {setId}>
                        <PrivateRouteAdmin
                        exact
                        path="/:role/notifikasi"
                        component={Reminder}
                        setId = {setId}
                        notif={notifs}
                        />
                      </PrivateRoute>
                    </Route> 
                    <Route path="/:role/formulir-notifikasi">
                      <PrivateRoute path="/:role/formulir-notifikasi">
                        <PrivateRouteAdmin
                        exact
                        path="/:role/formulir-notifikasi"
                        component={FormReminder}
                        setId = {setId}
                        notif={notifs}
                        />
                      </PrivateRoute>
                    </Route> 
                    <Route path="/:role/notifikasi-saya" >
                      <PrivateRoute
                        exact
                        path="/:role/notifikasi-saya"
                        component={Notifikasi}
                        setId={setId}
                        notif={notifs}
                      />
                    </Route> 
                    <Route path="/:role/profile-instansi/:id" >
                      <PrivateRoute
                        exact
                        path="/:role/profile-instansi/:id"
                        component={ProfileInstansi}
                        setId = {setId}
                        notif={notifs}
                      />
                    </Route>
                    <Route path="/:role/edit-profile-instansi/:id" >
                      <PrivateRoute
                        exact
                        path="/:role/edit-profile-instansi/:id"
                        component={ProfileInstansiEdit}
                        setId = {setId}
                        notif={notifs}
                      />
                    </Route>
                    <Route path="/:role/kelola-instansi">
                      <PrivateRoute
                        exact
                        path="/:role/kelola-instansi"
                        component={Instansi}
                        setId = {setId}
                        notif={notifs}
                      />
                    </Route>
                    <Route path="/lupa-password" component={LupaPassword}/>
                    <Route path="/lupa-password/?token=:token" component={LupaPassword}/>  
                    <Route path="/*" component={NotFound}/>
                </Switch>
              </BrowserRouter>
              </InfografisState>
            </NotifState>
          </ArtikelState>
        </LayoutState>
        </SocketState>
      </AuthState>
    </div>
  );
}

export default App;

