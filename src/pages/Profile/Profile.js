import React, { Component, Fragment, useContext, useEffect, useState } from 'react';
import './Profile.css';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import lock from '../../assets/lock.png';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/Auth/AuthContext';
import { LayoutContext } from '../../context/Layout/LayoutContext';
import axios from 'axios';
import Popup from '../../component/Popup/Popup';
import bg_1 from '../../assets/decoration/bg_1.png';
import bg_2 from '../../assets/decoration/bg_2.png';
import bg_3 from '../../assets/decoration/bg_3.png';
import bg_4 from '../../assets/decoration/bg_4.png';
import Notification from '../../component/Notification/Notification';
import Spinner from '../../component/Spinner/Spinner';

const Profile = (props) => {
  const { token, userDetail, user, loading, getUserDetail } = useContext(AuthContext);
  const [foto, setFoto] = useState();
  const { sidebar } = useContext(LayoutContext);

  useEffect(() => {
    if (props.match.params.id) {
      getUserDetail();
      window.scrollTo(0, 0);
    }
  }, [props.match.params.id]);

  useEffect(() => {
    const wow = `http://api.simonev.revolusimental.go.id:8882${userDetail && userDetail.foto}`;
    setFoto(wow);
  }, [userDetail]);

  return (
    <Fragment>
      <SideBarOff setId={props.setId} />
      <Popup notif={props.notif} />
      <div className="background-after-login">
        <img src={bg_1} alt="bg1" style={{ position: 'fixed', top: '0', left: '0' }} />
        <img src={bg_2} alt="bg2" style={{ position: 'fixed', top: '0', right: '0' }} />
        <img src={bg_3} alt="bg3" style={{ position: 'fixed', bottom: '-200px', left: '0' }} />
        <img src={bg_4} alt="bg4" style={{ position: 'fixed', bottom: '-50px', right: '0' }} />
      </div>
      <div className="profile-page" style={{ marginRight: '20px', marginTop: '23px' }}>
        <div className="tajuk-page-2">
          <div>PROFIL</div>
          {user && user.role === 'owner' ? '' : <Notification />}
        </div>
        <div
          style={
            sidebar
              ? { marginRight: '20px', transition: 'all 0.3s ease-in-out' }
              : { transition: 'all 0.3s ease-in-out' }
          }
        >
          <div className="container-fluid">
            {loading ? (
              <div style={{ marginLeft: '68px' }}>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ width: '100%', height: '60vh', overflow: 'hidden' }}
                >
                  <Spinner />
                </div>
              </div>
            ) : (
              <div className="row">
                <form id="form-profile">
                  <div className="col">
                    <div
                      className="form-profile-page"
                      style={
                        sidebar
                          ? { marginLeft: '188px', transition: 'all 0.3s ease-in-out' }
                          : { marginLeft: '0' }
                      }
                    >
                      {!sidebar ? (
                        <Fragment>
                          <div className="data">
                            <label>Nama</label>
                            <br />
                            <div className="show-profile" type="text">
                              {userDetail && userDetail.nama}
                            </div>
                          </div>

                          <div className="data">
                            <label>Instansi</label>
                            <br />
                            <div className="show-profile" type="text">
                              {userDetail && userDetail.instansi.nama_pendek}
                            </div>
                          </div>

                          <div className="data">
                            <label>Peran</label>
                            <br />
                            <div className="show-profile" type="text">
                              {(userDetail && userDetail.role) === 'owner'
                                ? 'Owner'
                                : (userDetail && userDetail.role) === 'super_admin'
                                ? 'Super Admin'
                                : 'Admin'}
                            </div>
                          </div>

                          <div className="data">
                            <label>Nama Pengguna</label>
                            <br />
                            <div className="show-profile" type="text">
                              {userDetail && userDetail.username}
                            </div>
                          </div>

                          <div className="data">
                            <label>Email</label>
                            <br />
                            <div className="show-profile" type="email">
                              {userDetail && userDetail.email}
                            </div>
                          </div>
                          <div className="data">
                            <label>Nomor Telepon</label>
                            <br />
                            <div className="show-profile" type="text">
                              {userDetail && userDetail.kontak}
                            </div>
                          </div>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <div className="data">
                            <label>Nama</label>
                            <br />
                            <div className="show-profile" style={{ width: '466px' }} type="text">
                              {userDetail && userDetail.nama}
                            </div>
                          </div>

                          <div className="data">
                            <label>Instansi</label>
                            <br />
                            <div className="show-profile" style={{ width: '466px' }} type="text">
                              {userDetail && userDetail.instansi.nama_pendek}
                            </div>
                          </div>

                          <div className="data">
                            <label>Peran</label>
                            <br />
                            <div className="show-profile" style={{ width: '466px' }} type="text">
                              {(userDetail && userDetail.role) === 'owner'
                                ? 'Owner'
                                : (userDetail && userDetail.role) === 'super_admin'
                                ? 'Super Admin'
                                : 'Admin'}
                            </div>
                          </div>

                          <div className="data">
                            <label>Nama Pengguna</label>
                            <br />
                            <div className="show-profile" style={{ width: '466px' }} type="text">
                              {userDetail && userDetail.username}
                            </div>
                          </div>

                          <div className="data">
                            <label>Email</label>
                            <br />
                            <div className="show-profile" style={{ width: '466px' }} type="email">
                              {userDetail && userDetail.email}
                            </div>
                          </div>
                          <div className="data">
                            <label>Nomor Telepon</label>
                            <br />
                            <div className="show-profile" style={{ width: '466px' }} type="text">
                              {userDetail && userDetail.kontak}
                            </div>
                          </div>
                        </Fragment>
                      )}
                    </div>
                  </div>
                </form>

                <div className="col">
                  <div className="photo-profile-page">
                    <label>Foto Profil</label>
                    <br />
                    <div className="photo-profile-container">
                      <div className="photo-profile">
                        <img src={foto}></img>
                      </div>
                    </div>
                    <Link
                      to={`/${
                        userDetail && userDetail.role === 'owner' ? 'super-admin' : 'admin'
                      }/edit-profile/${userDetail && userDetail._id}`}
                    >
                      <input
                        form="form-profile"
                        type="submit"
                        className="button-submit-profile"
                        value="UBAH PROFIL"
                        style={{ backgroundColor: '#E76975' }}
                      ></input>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Profile;
