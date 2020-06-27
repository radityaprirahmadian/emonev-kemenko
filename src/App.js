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
import Form1Admin from './component/Admin/Form1';
import FormAdmin from './pages/FormAdmin/FormAdmin';
import FormReminder from './pages/FormReminder/FormReminder';
import Profile from './pages/Profile/Profile';
import ProfileEdit from './pages/Profile/ProfileEdit';
import GalleryPage from './pages/Gallery/Gallery';
import Home from './pages/Home/Home';
import Notifikasi from './pages/Notifikasi/Notifikasi';
import PreviewGNRM from './pages/PreviewGNRM/PreviewGNRM';
import PreviewMonev from './pages/PreviewMonev/PreviewMonev';
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

  console.log(id)

  useEffect(() => {
    let cleanup = false;
    if (!cleanup) {
      console.log("test");
      
      const socket = io('https://test.bariqmbani.me')
      socket.on("connect", () => {
        socket.emit("notif_subscribe", { user: id });
      });

      socket.on("notif_receive", payload => {
        console.log('wowowow')
        console.log(payload);
        setNotifs([...notifs, payload].reverse());
      });
    }

    return () => {
        cleanup = true;
      };
  },[id,notifs])

  console.log(notifs)

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
                        notif={notifs}
                      />
                    </Route>
                    <Route path="/:role/rencana-pelaksanaan-program" >
                      <PrivateRoute
                        exact 
                        path="/:role/rencana-pelaksanaan-program" 
                        component={GNRM}
                        notif={notifs} 
                      />
                    </Route>
                    <Route path="/:role/laporan-monev">
                      <PrivateRoute
                        exact
                        path="/:role/laporan-monev"
                        component={Monev}
                        notif={notifs} 
                      />
                    </Route>
                    <Route path="/:role/kabar-gnrm">
                      <PrivateRoute
                        exact
                        path="/:role/kabar-gnrm"
                        component={Infografis}
                        notif={notifs} 
                      />
                    </Route>
                    <Route path="/:role/formulir-kabar-gnrm/">
                      <PrivateRoute
                        exact
                        path="/:role/formulir-kabar-gnrm/"
                        component={FormInfografis}
                        notif={notifs} 
                      />
                    </Route>
                    <Route path="/:role/formulir-kabar-gnrm-edit/:id">
                      <PrivateRoute
                        exact
                        path="/:role/formulir-kabar-gnrm-edit/:id"
                        component={FormInfografis}
                        notif={notifs} 
                      />
                    </Route>
                    <Route path="/:role/formulir-gnrm/">
                      <PrivateRoute
                        exact
                        path="/:role/formulir-gnrm/"
                        component={FormGNRM}
                        notif={notifs} 
                      />
                    </Route>
                    <Route path="/:role/formulir-gnrm-edit/:id">
                      <PrivateRoute
                        exact
                        path="/:role/formulir-gnrm-edit/:id"
                        component={FormGNRM}
                        notif={notifs} 
                      />
                    </Route>
                    <Route path="/:role/formulir-instansi/">
                      <PrivateRoute
                        exact
                        path="/:role/formulir-instansi/"
                        component={FormInstansi}
                        notif={notifs} 
                      />
                    </Route>
                    <Route path="/:role/formulir-instansi-edit/:id">
                      <PrivateRoute
                        exact
                        path="/:role/formulir-instansi-edit/:id"
                        component={FormInstansi}
                        notif={notifs} 
                      />
                    </Route>
                    <Route path="/:role/formulir-monev/">
                      <PrivateRoute
                        exact
                        path="/:role/formulir-monev/"
                        component={FormMonev}
                        notif={notifs} 
                      />
                    </Route>
                    <Route path="/:role/formulir-monev-edit/:id">
                      <PrivateRoute
                        exact
                        path="/:role/formulir-monev-edit/:id"
                        component={FormMonev}
                        notif={notifs} 
                      />
                    </Route>
                    <Route path="/:role/edit-admin/:id">
                      <PrivateRoute path="/:role/edit-admin/:id">
                        <PrivateRouteAdmin
                          exact
                          path="/:role/edit-admin/:id"
                          component={EditAdmin}
                          notif={notifs} 
                        />
                      </PrivateRoute>
                    </Route>
                    <Route path="/:role/profile/:id" >
                      <PrivateRoute
                        exact
                        path="/:role/profile/:id" 
                        component={Profile}
                        notif={notifs}
                      />
                    </Route>
                    <Route path="/:role/edit-profile/:id">
                      <PrivateRoute
                        exact
                        path="/:role/edit-profile/:id"
                        component={ProfileEdit}
                        notif={notifs}
                      />
                    </Route> 
                    <Route path="/:role/kelola-admin">
                      <PrivateRoute path="/:role/kelola-admin">
                        <PrivateRouteAdmin
                        exact
                        path="/:role/kelola-admin"
                        component={Admin}
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
                        notif={notifs}
                        />
                      </PrivateRoute>
                    </Route>  
                    <Route path="/gallery" component={GalleryPage}/>
                    <Route path="/:role/reminder">
                      <PrivateRoute path="/:role/reminder">
                        <PrivateRouteAdmin
                        exact
                        path="/:role/reminder"
                        component={Reminder}
                        notif={notifs}
                        />
                      </PrivateRoute>
                    </Route> 
                    <Route path="/:role/formulir-reminder">
                      <PrivateRoute path="/:role/formulir-reminder">
                        <PrivateRouteAdmin
                        exact
                        path="/:role/formulir-reminder"
                        component={FormReminder}
                        notif={notifs}
                        />
                      </PrivateRoute>
                    </Route> 
                    <Route path="/:role/notifikasi" >
                      <PrivateRoute
                        exact
                        path="/:role/notifikasi"
                        component={Notifikasi}
                        notif={notifs}
                        setId={setId}
                      />
                    </Route> 
                    <Route path="/:role/profile-instansi/:id" >
                      <PrivateRoute
                        exact
                        path="/:role/profile-instansi/:id"
                        component={ProfileInstansi}
                        notif={notifs}
                        setId={setId}
                      />
                    </Route>
                    <Route path="/:role/edit-profile-instansi/:id" >
                      <PrivateRoute
                        exact
                        path="/:role/edit-profile-instansi/:id"
                        component={ProfileInstansiEdit}
                        notif={notifs}
                        setId={setId}
                      />
                    </Route>
                    {/* {/* <Route path="/preview-gnrm/:id">
                      <PrivateRoute
                        exact
                        path="/preview-gnrm/:id"
                        component={PreviewGNRM}
                        notif={notifs}
                      />
                    </Route>  */}
                    <Route path="/:role/kelola-instansi">
                      <PrivateRoute
                        exact
                        path="/:role/kelola-instansi"
                        component={Instansi}
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

