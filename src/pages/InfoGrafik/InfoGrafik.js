import React, { Component, Fragment, useContext, useEffect } from 'react';
import SearchBar from '../../component/SearchBar/SearchBar';
import Card from "../../component/Card/Card";
import SideBarOff from "../../component/SideBarOff/SideBarOff";
import Gallery from '../../component/Gallery/Gallery';
import SearchBarAdmin from '../../component/SearchBarAdmin/SeacrhBarAdmin';
import './InfoGrafik.css';
import lonceng from '../../assets/lonceng.png';
import Sidebar from '../../component/Sidebar/Sidebar';
import statistik from '../../assets/statistik.png';
import { AuthContext } from '../../context/Auth/AuthContext'
import Notification from '../../component/Notification/Notification';
import {Bar} from 'react-chartjs-2';
import Popup from '../../component/Popup/Popup';
import { NotifContext } from '../../context/Notifikasi/NotifContext';


const data = {
  labels: ['KEMENPAN', `KEMENKO POLHUKAM`, 'KEMENKO MARITIM', 'KEMENKO PEREKONOMIAN', 'KEMENDAGRI', 'KEMENKO PMK'],
  datasets: [
    {
      label: 'Jumlah Program Kementrian',
      color: 'black',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [65, 59, 80, 81, 56, 70]
    }
  ]
};



const Dashboard = (props) => {
    const { isAuthenticated, login, role, email, password, user } = useContext(AuthContext);
    const { notifNew , setNotifNew } = useContext(NotifContext)

    useEffect(() => {
      setNotifNew(props.notif)
    },[props.notif])

  return (
      <Fragment>
            <SideBarOff/>
            <Popup notif={props.notif}/>
            {
              user && user.role === 'owner' ?
                ''
              :
                <Notification/>
            }
                <div className="dashboard-page">
                  <div className="dashboard-section">
                      <div className="tajuk-page1">
                          <p>STATISTIK TERKINI</p>
                      </div>
                    
                    <div className="infografik-statistik">
                      <Bar
                        data={data}
                        width={10}
                        height={445}
                        options={{
                        maintainAspectRatio: false
                        }}
                      />
                    </div>

                    <div className="drop-down-menu">
                      <div className={user && user.role !== 'owner' ? "d-none" : "drop-down-kementrian"}>
                        <form> 
                            <select>
                              <option value="kemenko-pmk">KEMENKO PMK</option>
                              <option value="kemenpan">KEMENPAN</option>
                              <option value="kemenko-polhukam">KEMENKO POLHUKAM</option>
                              <option value="kemenko-maritim">KEMENKO MARITIM</option>
                              <option value="kemenko-perekonomian">KEMENKO PEREKONOMIAN</option>
                              <option value="kemendagri">KEMENDAGRI</option>
                            </select>
                            <br/>
                            <label>
                              KEMENTRIAN
                            </label>
                        </form>
                      </div>

                      <div className="spacer"></div>

                      <div className="drop-down-waktu">
                        <form> 
                            <select >
                              <option value="triwulan">TRIWULAN</option>
                              <option value="enambulan">NAMBULAN</option>
                              <option value="bulanan">BULANAN</option>
                              <option value="tahunan">TAHUNAN</option>
                            </select>
                            <br/>
                            <label>
                              WAKTU
                            </label>
                        </form>
                      </div>

                      <div className="drop-down-jangka">
                        <form> 
                            <select >
                              <option value="kemenkopmk">TRIWULAN PERTAMA</option>
                              <option value="kemenkopmk">TRIWULAN KEDUA</option>
                              <option value="kemenkopmk">TRIWULAN KETIGA</option>
                              <option value="kemenkopmk">TRIWULAN KEEMPAT</option>
                            </select>
                            <br/>
                            <label>
                              TRIWULAN
                            </label>
                        </form>
                      </div>

                    </div>
                  </div>

                  <div className="dashboard-section">
                    <div className="tajuk-page2">
                        <p>INFOGRAFIK TERKINI</p>
                    </div>
                    <Card />
                  </div>
                
                  <div className="tajuk-page3">
                      <p>GALLERY</p>
                  </div>
                  <Gallery/>
                  <div className="gallery-pagination" style={{marginBottom:'61px'}}>
                        <i className="material-icons">chevron_left</i>
                        <ul> 
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                            <li>5</li>
                        </ul>
                        <i className="material-icons">chevron_right</i>
                    </div>
              </div>
      </Fragment>
    );
}

export default Dashboard;
