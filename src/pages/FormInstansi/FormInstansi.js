import React, { Component, Fragment, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import trash from '../../assets/trash.png';
import './FormInstansi.css';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/Auth/AuthContext';
import Popup from '../../component/Popup/Popup';
import Scroll, { Element } from 'react-scroll';
import objectToFormData from '../../objectToFormDataUtil';
import Spinner from '../../component/Spinner/Spinner';
import bg_1 from '../../assets/decoration/bg_1.png';
import bg_2 from '../../assets/decoration/bg_2.png';
import bg_3 from '../../assets/decoration/bg_3.png';
import bg_4 from '../../assets/decoration/bg_4.png';
import { LayoutContext } from '../../context/Layout/LayoutContext';

const FormInstansi = (props) => {
  const Link = Scroll.Link;
  const { user, token } = useContext(AuthContext);
  const { sidebar } = useContext(LayoutContext);
  const history = useHistory();
  const [allInstansi, setAllInstansi] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const jenis = ['Kementerian', 'Lembaga', 'Pemerintah Daerah'];
  const [loading, setLoading] = useState(false);

  const [instansiDetail, setInstansiDetail] = useState(null);

  const [newInstansi, setNewInstansi] = useState({
    nama: '',
    nama_pendek: '',
    jenis: '',
    kontak: '',
    alamat: '',
    email: '',
    website: '',
    user_nama: '',
    user_role: 'admin',
    user_username: '',
    user_password: '',
    user_kontak: '',
    user_email: '',
    deleted_logo: [],
  });

  const [seen, setSeen] = useState(false);
  const [media, setMedia] = useState([]);
  const [mediaUrl, setMediaUrl] = useState([]);
  const [deletedMedia, setDeletedMedia] = useState([]);

  const onChangeInstansi = (e) => {
    return setNewInstansi({
      ...newInstansi,
      [e.target.name]: e.target.value,
    });
  };

  const onChangeFiles = (event) => {
    setMedia([...event.target.files]);
    event.target.value = null;
  };

  useEffect(() => {
    axios
      .get('https://api.simonev.revolusimental.go.id/api/v1/instansi')
      .then((res) => {
        setAllInstansi(res.data.instansi);
      })
      .catch((err) => {
        console.log(err);
      });
    window.scrollTo(0, 0);
  }, []);

  const getInstansiDetail = async () => {
    setLoading(true);
    const config = {
      headers: {
        'X-Auth-Token': `Bearer ${token}`,
      },
    };
    try {
      const res = await axios.get(
        `https://api.simonev.revolusimental.go.id/api/v1/instansi/${props.match.params.id}`,
        config,
      );
      setInstansiDetail(res.data.instansi);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const addNewInstansi = async (data) => {
    setLoading(true);
    const formData = objectToFormData(data);

    for (let i = 0; i < media.length; i++) {
      formData.append(`logo`, media[i]);
    }

    // for (let pair of formData.entries()) {
    //     console.log(pair[0] + ', ' + pair[1])
    // }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Auth-Token': `Bearer ${token}`,
      },
    };

    try {
      const res = await axios.post(
        'https://api.simonev.revolusimental.go.id/api/v1/instansi',
        formData,
        config,
      );
      alert(res.data.message);
      setLoading(false);
      history.push(`/${user && user.role === 'owner' ? 'super-admin' : 'admin'}/kelola-instansi`);
    } catch (err) {
      alert(err.response.data.message);
      setLoading(false);
    }
  };

  const editInstansi = async (data) => {
    setLoading(true);
    const formData = objectToFormData(data);

    if (media.length > 0) {
      for (let i = 0; i < media.length; i++) {
        formData.append(`logo`, media[i]);
      }
    } else {
      formData.append('logo', new File([null], 'blob'));
    }

    // for (let pair of formData.entries()) {
    //     console.log(pair[0] + ', ' + pair[1])
    // }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Auth-Token': `Bearer ${token}`,
      },
    };
    try {
      const res = await axios.put(
        `https://api.simonev.revolusimental.go.id/api/v1/instansi/${props.match.params.id}`,
        formData,
        config,
      );
      alert(res.data.message);
      setLoading(false);
      history.push(`/${user && user.role === 'owner' ? 'super-admin' : 'admin'}/kelola-instansi`);
    } catch (err) {
      alert(err.response.data.message);
      setLoading(false);
    }
  };

  const getFileName = (url) => {
    const split = url.split('/');
    return split[split.length - 1];
  };

  const onSubmit = (e) => {
    e.preventDefault();
    addNewInstansi(newInstansi);
  };

  const onEdit = (e) => {
    e.preventDefault();
    editInstansi(newInstansi);
  };

  const handlePassword = (e) => {
    e.preventDefault();
    setSeen(!seen);
  };

  const onDeleteMedia = (isFile, filename, data) => {
    setMediaUrl(mediaUrl.filter((media) => getFileName(media) !== filename));
    if (isFile) setMedia(media.filter((media) => media !== data));
    else setMedia(media.filter((media) => media.name !== filename));
    const deleted = [...deletedMedia, filename];
    setDeletedMedia(deleted);
  };

  useEffect(() => {
    if (props.match.params.id) {
      setNewInstansi({});
      getInstansiDetail();
      setIsEditing(true);
    }
  }, [props.match.params.id]);

  useEffect(() => {
    if (instansiDetail) {
      setNewInstansi({
        jenis: instansiDetail.jenis,
        nama: instansiDetail.nama,
        nama_pendek: instansiDetail.nama_pendek,
        kontak: instansiDetail.kontak,
        alamat: instansiDetail.alamat,
        email: instansiDetail.email,
        website: instansiDetail.website,
      });

      if (instansiDetail.logo) {
        const mediaFileUrl = [`https://api.simonev.revolusimental.go.id${instansiDetail.logo}`];
        const files = [];
        mediaFileUrl.forEach((url) => {
          fetch(url)
            .then((res) => res.blob())
            .then((blob) => {
              const objectURL = URL.createObjectURL(blob);
              blob.name = getFileName(url);
              files.push(blob);
            });
        });

        setMedia(files);
        setMediaUrl(mediaFileUrl);
      }
    }
  }, [instansiDetail]);

  useEffect(() => {
    setNewInstansi({ ...newInstansi, deleted_logo: deletedMedia });
  }, [deletedMedia]);

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isEditing) {
        editInstansi(newInstansi);
      } else {
        addNewInstansi(newInstansi);
      }
    }
  };

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
      <div className="tajuk-page">
        <h1> FORMULIR INSTANSI</h1>
      </div>
      {loading ? (
        <div style={{ marginLeft: '68px' }}>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              width: '100%',
              height: '60vh',
              overflow: 'hidden',
            }}
          >
            <Spinner />
          </div>
        </div>
      ) : (
        <div
          style={
            sidebar
              ? {
                  marginLeft: '188px',
                  marginRight: '20px',
                  transition: 'all 0.3s ease-in-out',
                }
              : { transition: 'all 0.3s ease-in-out' }
          }
        >
          <form
            id="form-admin"
            className="form-admin-1"
            onSubmit={isEditing ? onEdit : onSubmit}
            style={{
              width: 'fit-content',
              height: 'fit-content',
              margin: 'auto',
            }}
          >
            {!sidebar ? (
              <Fragment>
                <Element id="instansi" name="instansi">
                  <div
                    className="admin-1-container"
                    style={{
                      transition: 'all 0.3s ease-in-out',
                    }}
                  >
                    <div>
                      <label>Nama Instansi</label>
                      <input
                        className="admin-nama"
                        type="text"
                        tabIndex="1"
                        name="nama"
                        value={newInstansi.nama}
                        onChange={onChangeInstansi}
                        onKeyPress={onKeyPress}
                        required={true}
                        style={{
                          width: '955px',
                          marginLeft: '97px',
                          transition: 'all 0.3s ease-in-out',
                        }}
                      />
                    </div>
                    <div>
                      <label>Nama Singkat</label>
                      <input
                        className="admin-nama"
                        type="text"
                        name="nama_pendek"
                        tabIndex="2"
                        value={newInstansi.nama_pendek}
                        onChange={onChangeInstansi}
                        onKeyPress={onKeyPress}
                        required={true}
                        style={{
                          width: '366px',
                          marginLeft: '101px',
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          textAlign: 'left',
                          clear: 'both',
                          float: 'left',
                          lineHeight: '20px',
                        }}
                      >
                        Kementerian/Lembaga/
                        <br />
                        Pemerintah Daerah
                      </label>
                      {instansiDetail && instansiDetail.jenis ? (
                        <select
                          className="admin-instansi"
                          style={{
                            marginLeft: '24px',
                            border: '1px solid #ACACAC',
                          }}
                          name="jenis"
                          tabIndex="3"
                          onChange={onChangeInstansi}
                          onKeyPress={onKeyPress}
                          required={true}
                        >
                          <option value="" defaultValue="" hidden></option>
                          {jenis.map((jenis, i) => (
                            <option
                              key={i}
                              selected={instansiDetail.jenis === jenis && true}
                              title={jenis}
                              value={jenis}
                            >
                              {jenis}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <select
                          className="admin-instansi"
                          style={{
                            marginLeft: '24px',
                            border: '1px solid #ACACAC',
                          }}
                          name="jenis"
                          tabIndex="3"
                          onChange={onChangeInstansi}
                          onKeyPress={onKeyPress}
                          required={true}
                        >
                          <option selected={true} hidden></option>
                          {jenis.map((jenis, i) => (
                            <option key={i} title={jenis} value={jenis}>
                              {jenis}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div>
                      <label>Kontak Instansi</label>
                      <input
                        className="admin-username"
                        type="text"
                        name="kontak"
                        tabIndex="4"
                        value={newInstansi.kontak}
                        onChange={onChangeInstansi}
                        onKeyPress={onKeyPress}
                        required={true}
                        style={{
                          marginLeft: '87px',
                          width: '366px',
                        }}
                      />
                    </div>
                    <div>
                      <label>Logo Instansi</label>
                      <label
                        htmlFor="testing"
                        required={true}
                        tabIndex="5"
                        className="label_lampiran"
                        style={{
                          marginLeft: '108px',
                          width: '170px',
                        }}
                      >
                        <span
                          style={{
                            marginRight: '15px',
                          }}
                        >
                          +
                        </span>{' '}
                        PILIH BERKAS
                      </label>
                      <input
                        id="testing"
                        className="gnrm-penjelasan"
                        style={{
                          height: '178px',
                          marginLeft: '108px',
                          width: '178px',
                        }}
                        onChange={onChangeFiles}
                        onKeyPress={onKeyPress}
                        type="file"
                        accept="image/*"
                        name="logo"
                      />
                      <div>
                        {media && media.length > 0 ? (
                          <div
                            style={{
                              height: '178px',
                              marginTop: '5px',
                              marginLeft: '214px',
                              width: '178px',
                              border: '1px solid #ACACAC',
                              borderRadius: '5px',
                              padding: '10px',
                              overflow: 'hidden',
                            }}
                          >
                            {media.map((media, index) => {
                              const objectURL = URL.createObjectURL(media);
                              return (
                                <div key={index}>
                                  <div
                                    style={{
                                      width: '120px',
                                      height: '120px',
                                      margin: 'auto',
                                      position: 'relative',
                                    }}
                                    className="d-flex align-items-center justify-content-center"
                                  >
                                    <div
                                      style={{
                                        width: '120px',
                                        height: '120px',
                                        overflow: 'hidden',
                                        position: 'absolute',
                                      }}
                                    >
                                      <img
                                        src={objectURL}
                                        alt={media.name}
                                        className="gnrm-media--image"
                                        style={{
                                          maxWidth: '100%',
                                          maxHeight: '120px',
                                          objectFit: 'contain',
                                        }}
                                      />
                                    </div>
                                    <div
                                      style={{
                                        position: 'absolute',
                                        backgroundColor: '#C04B3E',
                                        width: '25px',
                                        height: '25px',
                                        borderRadius: '50%',
                                        top: '-7px',
                                        right: '-7px',
                                        lineHeight: '25px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        color: 'white',
                                      }}
                                      onClick={(e) => onDeleteMedia(true, media.name, media)}
                                    >
                                      {' '}
                                      X{' '}
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      marginTop: '10px',
                                      width: '150px',
                                      height: '20px',
                                      wordWrap: 'break-word',
                                      lineHeight: '20px',
                                    }}
                                  >
                                    <p className="gnrm-media--name">
                                      {media.name.length > 18
                                        ? `${media.name.substr(0, 15)}...`
                                        : media.name}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div
                            style={{
                              height: '178px',
                              marginTop: '5px',
                              marginLeft: '214px',
                              width: '178px',
                              border: '1px solid #ACACAC',
                              borderRadius: '5px',
                              padding: '10px',
                              overflow: 'hidden',
                            }}
                          >
                            {mediaUrl.map((url, index) => {
                              return (
                                <div key={index}>
                                  <div
                                    style={{
                                      width: '120px',
                                      height: '120px',
                                      margin: 'auto',
                                      position: 'relative',
                                    }}
                                    className="d-flex align-items-center justify-content-center"
                                  >
                                    <div
                                      style={{
                                        width: '120px',
                                        height: '120px',
                                        overflow: 'hidden',
                                        position: 'absolute',
                                      }}
                                    >
                                      <img
                                        src={url}
                                        alt={getFileName(url)}
                                        className="gnrm-media--image"
                                        style={{
                                          maxWidth: '100%',
                                          maxHeight: '120px',
                                          objectFit: 'contain',
                                        }}
                                      />
                                    </div>
                                    <div
                                      style={{
                                        position: 'absolute',
                                        backgroundColor: '#C04B3E',
                                        width: '25px',
                                        height: '25px',
                                        borderRadius: '50%',
                                        top: '-7px',
                                        right: '-7px',
                                        lineHeight: '25px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        color: 'white',
                                      }}
                                      onClick={(e) => onDeleteMedia(false, getFileName(url))}
                                    >
                                      {' '}
                                      X{' '}
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      marginTop: '10px',
                                      width: '150px',
                                      height: '20px',
                                      wordWrap: 'break-word',
                                      lineHeight: '20px',
                                    }}
                                  >
                                    <p className="gnrm-media--name">
                                      {getFileName(url).length > 18
                                        ? `${getFileName(url).substr(0, 15)}...`
                                        : getFileName(url)}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        style={{
                          textAlign: 'right',
                          clear: 'both',
                          float: 'left',
                        }}
                      >
                        Alamat
                      </label>
                      <textarea
                        className="form-instansi-alamat"
                        type="text"
                        name="alamat"
                        value={newInstansi.alamat}
                        tabIndex="6"
                        onChange={onChangeInstansi}
                        style={{
                          marginLeft: '156px',
                          width: '955px',
                          height: '84px',
                          transition: 'all 0.3s ease-in-out',
                        }}
                      />
                    </div>
                    <div>
                      <label>Website</label>
                      <input
                        className="admin-username"
                        type="text"
                        onKeyPress={onKeyPress}
                        name="website"
                        tabIndex="8"
                        value={newInstansi.website}
                        onChange={onChangeInstansi}
                        style={{
                          marginLeft: '150px',
                          width: '366px',
                        }}
                      />
                    </div>
                    <div>
                      <label>Email Instansi</label>
                      <input
                        className="admin-username"
                        type="email"
                        onKeyPress={onKeyPress}
                        name="email"
                        value={newInstansi.email}
                        tabIndex="9"
                        onChange={onChangeInstansi}
                        style={{
                          marginLeft: '102px',
                          width: '366px',
                        }}
                      />
                    </div>

                    {isEditing ? (
                      <div className="admin-navigation-button" style={{ textAlign: 'right' }}>
                        <input
                          className="button-daftar"
                          form="form-admin"
                          type="submit"
                          value="SIMPAN PERUBAHAN"
                        ></input>
                      </div>
                    ) : (
                      <div className="gnrm-navigation-button" style={{ textAlign: 'right' }}>
                        <Link to="admin_form" spy={true} smooth={true} duration={500} offset={-30}>
                          <button
                            className="forward"
                            style={{
                              right: '-1109px',
                              transition: 'all 0.3s ease-in-out',
                            }}
                          >
                            <i className="material-icons">expand_more</i>
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                </Element>

                {!props.match.params.id ? (
                  <Element id="admin_form" name="admin_form">
                    <div
                      className="admin-1-container"
                      style={{
                        marginBottom: '227px',
                        transition: 'all 0.3s ease-in-out',
                      }}
                    >
                      <div className="gnrm-title">FORMULIR ADMIN</div>
                      <div>
                        <label>Nama</label>
                        <input
                          className="admin-nama"
                          type="text"
                          name="user_nama"
                          value={newInstansi.user_nama}
                          tabIndex="10"
                          onChange={onChangeInstansi}
                          required={true}
                          onKeyPress={onKeyPress}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            textAlign: 'right',
                            clear: 'both',
                            float: 'left',
                            marginTop: '15px',
                          }}
                        >
                          Peran
                        </label>
                        <div
                          className="admin-role"
                          name="role"
                          value="admin"
                          style={{
                            border: '1px solid #ACACAC',
                            marginLeft: '210px',
                            lineHeight: '42px',
                            paddingLeft: '5px',
                            fontWeight: '600',
                          }}
                        >
                          Admin
                        </div>
                      </div>
                      <div>
                        <label>Nama Pengguna</label>
                        <input
                          className="admin-username"
                          type="text"
                          name="user_username"
                          tabIndex="11"
                          onKeyPress={onKeyPress}
                          value={newInstansi.user_username}
                          onChange={onChangeInstansi}
                          required={true}
                          style={{
                            marginLeft: '78px',
                          }}
                        />
                      </div>
                      <div>
                        <label>Kata Sandi</label>
                        <input
                          className="admin-password"
                          type={seen ? 'text' : 'password'}
                          name="user_password"
                          tabIndex="12"
                          value={newInstansi.user_password}
                          onChange={onChangeInstansi}
                          onKeyPress={onKeyPress}
                          required={true}
                        />
                        <button
                          className="button-password"
                          style={{
                            border: 'none',
                            padding: '0',
                            height: '30px',
                            width: '30px',
                            borderRadius: '3px',
                            background: '#C4C4C4',
                          }}
                          onKeyPress={onKeyPress}
                          onClick={handlePassword}
                        >
                          {seen ? (
                            <i
                              class="fa fa-eye-slash"
                              style={{
                                fontSize: '20px',
                                textAlign: 'center',
                              }}
                            ></i>
                          ) : (
                            <i
                              class="fas fa-eye"
                              style={{
                                fontSize: '20px',
                                textAlign: 'center',
                              }}
                            ></i>
                          )}
                        </button>
                      </div>
                      <div>
                        <label>Kontak Admin</label>
                        <input
                          className="admin-username"
                          type="text"
                          name="user_kontak"
                          tabIndex="13"
                          onKeyPress={onKeyPress}
                          value={newInstansi.user_kontak}
                          onChange={onChangeInstansi}
                          required={true}
                          style={{
                            marginLeft: '95px',
                          }}
                        />
                      </div>
                      <div>
                        <label>Email</label>
                        <input
                          className="admin-role"
                          type="email"
                          name="user_email"
                          tabIndex="14"
                          value={newInstansi.user_email}
                          onChange={onChangeInstansi}
                          onKeyPress={onKeyPress}
                          required
                          style={{
                            marginLeft: '165px',
                          }}
                          // onKeyPress={onKeyPress}
                        />
                      </div>

                      <div className="admin-navigation-button" style={{ textAlign: 'right' }}>
                        <input
                          className="button-daftar"
                          form="form-admin"
                          type="submit"
                          value="DAFTAR"
                        ></input>
                      </div>
                    </div>
                  </Element>
                ) : (
                  ''
                )}
              </Fragment>
            ) : (
              <Fragment>
                <Element id="instansi" name="instansi">
                  <div
                    className="admin-1-container-test"
                    style={{
                      transition: 'all 0.3s ease-in-out',
                    }}
                  >
                    <div>
                      <label>Nama Instansi</label>
                      <input
                        className="admin-nama"
                        type="text"
                        name="nama"
                        value={newInstansi.nama}
                        onChange={onChangeInstansi}
                        onKeyPress={onKeyPress}
                        required={true}
                        style={{
                          width: '767px',
                          marginLeft: '97px',
                          transition: 'all 0.3s ease-in-out',
                        }}
                      />
                    </div>
                    <div>
                      <label>Nama Singkat</label>
                      <input
                        className="admin-nama"
                        type="text"
                        name="nama_pendek"
                        value={newInstansi.nama_pendek}
                        onKeyPress={onKeyPress}
                        onChange={onChangeInstansi}
                        required={true}
                        style={{
                          width: '366px',
                          marginLeft: '101px',
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          textAlign: 'left',
                          clear: 'both',
                          float: 'left',
                          lineHeight: '20px',
                        }}
                      >
                        Kementerian/Lembaga/
                        <br />
                        Pemerintah Daerah
                      </label>
                      {instansiDetail && instansiDetail.jenis ? (
                        <select
                          className="admin-instansi"
                          style={{
                            marginLeft: '24px',
                            border: '1px solid #ACACAC',
                          }}
                          name="jenis"
                          onKeyPress={onKeyPress}
                          onChange={onChangeInstansi}
                          required={true}
                        >
                          <option value="" defaultValue="" hidden></option>
                          {jenis.map((jenis, i) => (
                            <option
                              key={i}
                              selected={instansiDetail.jenis === jenis && true}
                              title={jenis}
                              value={jenis}
                            >
                              {jenis}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <select
                          className="admin-instansi"
                          style={{
                            marginLeft: '24px',
                            border: '1px solid #ACACAC',
                          }}
                          name="jenis"
                          onKeyPress={onKeyPress}
                          onChange={onChangeInstansi}
                          required={true}
                        >
                          <option selected={true} hidden></option>
                          {jenis.map((jenis, i) => (
                            <option key={i} title={jenis} value={jenis}>
                              {jenis}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div>
                      <label>Kontak Instansi</label>
                      <input
                        className="admin-username"
                        type="text"
                        name="kontak"
                        value={newInstansi.kontak}
                        onChange={onChangeInstansi}
                        onKeyPress={onKeyPress}
                        required={true}
                        style={{
                          marginLeft: '87px',
                          width: '366px',
                        }}
                      />
                    </div>
                    <div>
                      <label>Logo Instansi</label>
                      <label
                        htmlFor="testing"
                        required={true}
                        className="label_lampiran"
                        style={{
                          marginLeft: '108px',
                          width: '170px',
                        }}
                      >
                        <span
                          style={{
                            marginRight: '15px',
                          }}
                        >
                          +
                        </span>{' '}
                        PILIH BERKAS
                      </label>
                      <input
                        id="testing"
                        className="gnrm-penjelasan"
                        style={{
                          height: '178px',
                          marginLeft: '108px',
                          width: '178px',
                        }}
                        onChange={onChangeFiles}
                        onKeyPress={onKeyPress}
                        type="file"
                        accept="image/*"
                        name="logo"
                      />
                      <div>
                        {media && media.length > 0 ? (
                          <div
                            style={{
                              height: '178px',
                              marginTop: '5px',
                              marginLeft: '214px',
                              width: '178px',
                              border: '1px solid #ACACAC',
                              borderRadius: '5px',
                              padding: '10px',
                              overflow: 'hidden',
                            }}
                          >
                            {media.map((media, index) => {
                              const objectURL = URL.createObjectURL(media);
                              return (
                                <div key={index}>
                                  <div
                                    style={{
                                      width: '120px',
                                      height: '120px',
                                      margin: 'auto',
                                      position: 'relative',
                                    }}
                                    className="d-flex align-items-center justify-content-center"
                                  >
                                    <div
                                      style={{
                                        width: '120px',
                                        height: '120px',
                                        overflow: 'hidden',
                                        position: 'absolute',
                                      }}
                                    >
                                      <img
                                        src={objectURL}
                                        alt={media.name}
                                        className="gnrm-media--image"
                                      />
                                    </div>
                                    <div
                                      style={{
                                        position: 'absolute',
                                        backgroundColor: '#C04B3E',
                                        width: '25px',
                                        height: '25px',
                                        borderRadius: '50%',
                                        top: '-7px',
                                        right: '-7px',
                                        lineHeight: '25px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        color: 'white',
                                      }}
                                      onClick={(e) => onDeleteMedia(true, media.name, media)}
                                    >
                                      {' '}
                                      X{' '}
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      marginTop: '10px',
                                      width: '150px',
                                      height: '20px',
                                      wordWrap: 'break-word',
                                      lineHeight: '20px',
                                      textAlign: 'center',
                                    }}
                                  >
                                    <p className="gnrm-media--name">
                                      {media.name.length > 18
                                        ? `${media.name.substr(0, 15)}...`
                                        : media.name}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div
                            style={{
                              height: '178px',
                              marginTop: '5px',
                              marginLeft: '214px',
                              width: '178px',
                              border: '1px solid #ACACAC',
                              borderRadius: '5px',
                              padding: '10px',
                              overflow: 'hidden',
                            }}
                          >
                            {mediaUrl.map((url, index) => {
                              return (
                                <div key={index}>
                                  <div
                                    style={{
                                      width: '120px',
                                      height: '120px',
                                      margin: 'auto',
                                      position: 'relative',
                                    }}
                                    className="d-flex align-items-center justify-content-center"
                                  >
                                    <div
                                      style={{
                                        width: '120px',
                                        height: '120px',
                                        overflow: 'hidden',
                                        position: 'absolute',
                                      }}
                                    >
                                      <img
                                        src={url}
                                        alt={getFileName(url)}
                                        className="gnrm-media--image"
                                      />
                                    </div>
                                    <div
                                      style={{
                                        position: 'absolute',
                                        backgroundColor: '#C04B3E',
                                        width: '25px',
                                        height: '25px',
                                        borderRadius: '50%',
                                        top: '-7px',
                                        right: '-7px',
                                        lineHeight: '25px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        color: 'white',
                                      }}
                                      onClick={(e) => onDeleteMedia(false, getFileName(url))}
                                    >
                                      {' '}
                                      X{' '}
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      marginTop: '10px',
                                      width: '150px',
                                      height: '20px',
                                      wordWrap: 'break-word',
                                      lineHeight: '20px',
                                      textAlign: 'center',
                                    }}
                                  >
                                    <p className="gnrm-media--name">
                                      {getFileName(url).length > 18
                                        ? `${getFileName(url).substr(0, 15)}...`
                                        : getFileName(url)}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        style={{
                          textAlign: 'right',
                          clear: 'both',
                          float: 'left',
                        }}
                      >
                        Alamat
                      </label>
                      <textarea
                        className="form-instansi-alamat"
                        type="text"
                        name="alamat"
                        value={newInstansi.alamat}
                        onChange={onChangeInstansi}
                        onKeyPress={onKeyPress}
                        style={{
                          marginLeft: '156px',
                          width: '767px',
                          height: '84px',
                          transition: 'all 0.3s ease-in-out',
                        }}
                      />
                    </div>
                    <div>
                      <label>Website</label>
                      <input
                        className="admin-username"
                        type="text"
                        name="website"
                        value={newInstansi.website}
                        onChange={onChangeInstansi}
                        onKeyPress={onKeyPress}
                        style={{
                          marginLeft: '150px',
                          width: '366px',
                        }}
                      />
                    </div>
                    <div>
                      <label>Email Instansi</label>
                      <input
                        className="admin-username"
                        type="email"
                        name="email"
                        value={newInstansi.email}
                        onKeyPress={onKeyPress}
                        onChange={onChangeInstansi}
                        style={{
                          marginLeft: '102px',
                          width: '366px',
                        }}
                      />
                    </div>

                    {isEditing ? (
                      <div className="admin-navigation-button" style={{ textAlign: 'right' }}>
                        <input
                          className="button-daftar"
                          form="form-admin"
                          type="submit"
                          value="SIMPAN PERUBAHAN"
                        ></input>
                      </div>
                    ) : (
                      <div className="gnrm-navigation-button" style={{ textAlign: 'right' }}>
                        <Link to="admin_form" spy={true} smooth={true} duration={500} offset={-30}>
                          <button
                            className="forward"
                            style={{
                              right: '-921px',
                              transition: 'all 0.3s ease-in-out',
                            }}
                          >
                            <i className="material-icons">expand_more</i>
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                </Element>

                {!props.match.params.id ? (
                  <Element id="admin_form" name="admin_form">
                    <div
                      className="admin-1-container-test"
                      style={{
                        marginBottom: '227px',
                        transition: 'all 0.3s ease-in-out',
                      }}
                    >
                      <div className="gnrm-title">FORMULIR ADMIN</div>
                      <div>
                        <label>Nama</label>
                        <input
                          className="admin-nama"
                          type="text"
                          name="user_nama"
                          value={newInstansi.user_nama}
                          onChange={onChangeInstansi}
                          onKeyPress={onKeyPress}
                          required={true}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            textAlign: 'right',
                            clear: 'both',
                            float: 'left',
                            marginTop: '15px',
                          }}
                        >
                          Peran
                        </label>
                        <div
                          className="admin-role"
                          name="role"
                          value="admin"
                          style={{
                            border: '1px solid #ACACAC',
                            marginLeft: '210px',
                            lineHeight: '42px',
                            paddingLeft: '5px',
                            fontWeight: '600',
                          }}
                        >
                          Admin
                        </div>
                      </div>
                      <div>
                        <label>Nama Pengguna</label>
                        <input
                          className="admin-username"
                          type="text"
                          name="user_username"
                          value={newInstansi.user_username}
                          onChange={onChangeInstansi}
                          onKeyPress={onKeyPress}
                          required={true}
                          style={{
                            marginLeft: '78px',
                          }}
                        />
                      </div>
                      <div>
                        <label>Kata Sandi</label>
                        <input
                          className="admin-password"
                          type={seen ? 'text' : 'password'}
                          name="user_password"
                          value={newInstansi.user_password}
                          onChange={onChangeInstansi}
                          onKeyPress={onKeyPress}
                          required={true}
                        />
                        <button
                          className="button-password"
                          style={{
                            border: 'none',
                            padding: '0',
                            height: '30px',
                            width: '30px',
                            borderRadius: '3px',
                            background: '#C4C4C4',
                          }}
                          onClick={handlePassword}
                        >
                          {seen ? (
                            <i
                              class="fa fa-eye-slash"
                              style={{
                                fontSize: '20px',
                                textAlign: 'center',
                              }}
                            ></i>
                          ) : (
                            <i
                              class="fas fa-eye"
                              style={{
                                fontSize: '20px',
                                textAlign: 'center',
                              }}
                            ></i>
                          )}
                        </button>
                      </div>
                      <div>
                        <label>Kontak Admin</label>
                        <input
                          className="admin-username"
                          type="text"
                          name="user_kontak"
                          value={newInstansi.user_kontak}
                          onKeyPress={onKeyPress}
                          onChange={onChangeInstansi}
                          required={true}
                          style={{
                            marginLeft: '95px',
                          }}
                        />
                      </div>
                      <div>
                        <label>Email</label>
                        <input
                          className="admin-role"
                          type="email"
                          name="user_email"
                          value={newInstansi.user_email}
                          onChange={onChangeInstansi}
                          required
                          onKeyPress={onKeyPress}
                          style={{
                            marginLeft: '165px',
                          }}
                        />
                      </div>

                      <div className="admin-navigation-button" style={{ textAlign: 'right' }}>
                        <input
                          className="button-daftar"
                          form="form-admin"
                          type="submit"
                          value="DAFTAR"
                        ></input>
                      </div>
                    </div>
                  </Element>
                ) : (
                  ''
                )}
              </Fragment>
            )}
          </form>
        </div>
      )}
    </Fragment>
  );
};

export default FormInstansi;
