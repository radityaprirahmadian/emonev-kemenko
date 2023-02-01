import React, { Fragment, useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/Auth/AuthContext.js';
import './NewPassword.css';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import aset_1 from '../../assets/decoration/aset_1.png';
import aset_2 from '../../assets/decoration/aset_2.png';
import aset_3 from '../../assets/decoration/aset_3.png';
import aset_4 from '../../assets/decoration/aset_4.png';
import aset_5 from '../../assets/decoration/aset_5.png';
import aset_6 from '../../assets/decoration/aset_6.png';
import aset_7 from '../../assets/decoration/aset_7.png';

const NewPassword = () => {
  const { token, userDetail } = useContext(AuthContext);
  const history = useHistory();
  const [seen1, setSeen1] = useState(false);
  const [seen2, setSeen2] = useState(false);
  const [pass, setPassword] = useState({
    password: '',
    confirm: '',
    err: '',
    disable: true,
    login_awal: true,
  });

  const { password, confirm, err, disable, login_awal } = pass;

  const onChange = (e) => {
    return setPassword({
      ...pass,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (password && confirm) {
      if (password === confirm) {
        setPassword({
          ...pass,
          err: 'Kata Sandi Sama',
          disable: false,
          login_awal: false,
        });
      } else {
        setPassword({
          ...pass,
          err: 'Kata Sandi Tidak Sama',
          disable: true,
        });
      }
    } else {
      setPassword({
        ...pass,
        err: '',
        disable: true,
      });
    }
  }, [confirm, password]);

  const changePassword = async (formData) => {
    const config = {
      headers: {
        'X-Auth-Token': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    try {
      await axios.put(
        `http://api.simonev.revolusimental.go.id:8882/api/v1/user/${userDetail && userDetail._id}`,
        formData,
        config,
      );
      history.push(
        `/${userDetail && userDetail.role === 'owner' ? 'super-admin' : 'admin'}/dashboard`,
      );
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    changePassword({
      password,
      login_awal,
    });
  };

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      changePassword({
        password,
        login_awal,
      });
    }
  };
  const handlePassword = (e) => {
    e.preventDefault();
    setSeen1(!seen1);
  };

  const confirmPassword = (e) => {
    e.preventDefault();
    setSeen2(!seen2);
  };

  return (
    <Fragment>
      <div className="login-page">
        <div
          className="row"
          style={{
            margin: 'auto',
            width: '1134px',
            height: '506px',
            marginTop: '173px',
          }}
        >
          <div className="col-5 login" style={{ width: '424px' }}>
            <div className="login-page-left-title">
              <h1>LOGIN</h1>
              <h1>E-REPORT</h1>
            </div>
            <img src={aset_1} alt="decoration 1" style={{ bottom: '23px', left: '16px' }} />
            <img src={aset_2} alt="decoration 2" style={{ top: '17px', right: '18px' }} />
            <img src={aset_3} alt="decoration 3" style={{ bottom: '23px', right: '34px' }} />
          </div>

          <div className="col-7 login" style={{ width: '693px' }}>
            <div className="header-ubah">
              <h1>UBAH KATA SANDI</h1>
            </div>
            <div className="body-ubah">
              <h1>Halo {userDetail && userDetail.nama},</h1>
              <h1>
                Untuk menjaga akun Anda harap mengganti <br />
                kata sandi Anda terlebih dahulu.
              </h1>

              <form onSubmit={onSubmit} autoComplete="off">
                <div>
                  <input
                    className="input-ubah"
                    type={seen1 ? 'text' : 'password'}
                    required
                    name="password"
                    value={password}
                    tabIndex="1"
                    onChange={onChange}
                    onKeyPress={!disable && onKeyPress}
                    placeholder="Kata sandi baru"
                  />
                  <button
                    className="button-password"
                    style={{
                      border: 'none',
                      padding: '0',
                      height: '30px',
                      width: '30px',
                      borderRadius: '3px',
                      backgroundColor: 'rgba(0,0,0,0)',
                    }}
                    onClick={handlePassword}
                  >
                    {seen1 ? (
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
                  <input
                    className="input-ubah"
                    type={seen2 ? 'text' : 'password'}
                    required
                    name="confirm"
                    value={confirm}
                    tabIndex="2"
                    onChange={onChange}
                    onKeyPress={!disable && onKeyPress}
                    placeholder="Konfirmasi kata sandi baru"
                  />
                  <button
                    className="button-password"
                    style={{
                      border: 'none',
                      padding: '0',
                      height: '30px',
                      width: '30px',
                      borderRadius: '3px',
                      backgroundColor: 'rgba(0,0,0,0)',
                    }}
                    onClick={confirmPassword}
                  >
                    {seen2 ? (
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
                {disable ? (
                  <Fragment>
                    <div
                      className="pesan-ubah"
                      style={{
                        color: 'red',
                        left: '175px',
                      }}
                    >
                      {err}
                    </div>
                    <button
                      className="button-ubah"
                      type="submit"
                      disabled
                      style={{ backgroundColor: 'grey' }}
                    >
                      UBAH KATA SANDI
                    </button>
                  </Fragment>
                ) : (
                  <Fragment>
                    <div
                      className="pesan-ubah"
                      style={{
                        color: 'green',
                        left: '210px',
                      }}
                    >
                      {err}
                    </div>
                    <button className="button-ubah" type="submit">
                      UBAH KATA SANDI
                    </button>
                  </Fragment>
                )}
              </form>
            </div>
            <img src={aset_4} alt="decoration 4" style={{ bottom: '0', left: '39px' }} />
            <img src={aset_5} alt="decoration 5" style={{ bottom: '-27px', right: '-16px' }} />
            <img src={aset_6} alt="decoration 6" style={{ top: '0', right: '32px' }} />
            <img src={aset_7} alt="decoration 7" style={{ top: '8px', left: '12.53px' }} />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default NewPassword;
