import React,{Component,Fragment,useContext,useEffect,useState} from 'react';
import { AuthContext } from '../../context/Auth/AuthContext'
import './FormReminder.css';
import axios from 'axios';
import io from "socket.io-client";
import { useHistory } from 'react-router-dom'
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import Form1Reminder from '../../component/Reminder/Form1';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Popup from '../../component/Popup/Popup';
import bg_1 from '../../assets/decoration/bg_1.png'
import bg_2 from '../../assets/decoration/bg_2.png'
import bg_3 from '../../assets/decoration/bg_3.png'
import bg_4 from '../../assets/decoration/bg_4.png'

const FormReminder = (props) => {
    const { token,userDetail } = useContext(AuthContext)
    
    const history = useHistory()
    const [ users , setUsers ] = useState([])

    const [ instansi , setInstansi] = useState({
        nama_pendek: ''
    })

    

    const [ reminder , setReminder ] = useState({
        date: '',
        time: '',
        kepada: [],
        judul: '',
        isi: ''
    })

    const {
        date,
        time,
        kepada,
        judul,
        isi
    } = reminder

    console.log(reminder)
    const {
        nama_pendek
    } = instansi
    
    const getAllUser = async () => {
        const config= {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`,
            }
        }
        try {
            const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/user?select=_id,nama&instansi=${nama_pendek}`, config)
            // console.log(res)
            setUsers(res.data.users)
        }
        catch (err) {
            console.log(err)  
        }  
    }

    const [allInstansi, setAllInstansi] = useState([])

    useEffect(() => {
        axios.get('https://api.simonev.revolusimental.go.id/api/v1/instansi')
        .then(res => {
            setAllInstansi(res.data.instansi)
            console.log('wow')
        })
        .catch(err => {
            console.log('wow', +err)
        })
    }, [])

    useEffect(() => {
        if(userDetail && userDetail.role === 'super_admin') {
            setInstansi({
                nama_pendek:(userDetail && userDetail.instansi.nama_pendek)
            })
        }
    }, [])

    useEffect(() => {
        getAllUser()
    },[instansi])

    const onChange = (e, array = false ) => {
        array ? 
        setReminder({
            ...reminder,
            kepada: [
                e.target.value
            ]
            
        })
        :
        setReminder({
            ...reminder,
            [e.target.name]: e.target.value
        })
    }

    const onChangeDropDown = (e) => {
        setInstansi({
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        return () => {
          const socket = io("https://api.simonev.revolusimental.go.id");
          socket.close();
        };
    }, []);

    const addNewNotification = async (formData) => {
        console.log(formData)
        const config = {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`,
                'Content-Type': 'application/json'
            }
        }
        try {
            const res = await axios.post(`https://api.simonev.revolusimental.go.id/api/v1/notifikasi`,formData,config)
            alert(res.data.message)
            if(res.data.success) {
                const socket = io("https://api.simonev.revolusimental.go.id");
                socket.on("connect", () => {
                  console.log("id:", socket.id);
                  socket.emit("notif_send", formData);
            })
            }
            history.push(`/${userDetail && userDetail.role === 'owner' ? 'super-admin' : 'admin'}/reminder`)
        }
        catch (err) {
            console.log(err)
        }
    }

    const onSubmit = (e) => {
        e.preventDefault()
        addNewNotification({
            date,
            time,
            kepada,
            judul,
            isi
        })
        
    }

    const [startDate, setStartDate] = useState(new Date());

    useEffect(() =>{
        const nol = (i) => {
            if (i < 10) {
              i = "0" + i;
            }
            return i;
        }
        
        const tanggal = new Date(startDate);
        const hour = nol(tanggal.getHours());
        const minute = nol(tanggal.getMinutes());
        const month = nol(tanggal.getMonth() + 1);
        const day = nol(tanggal.getDate());
        const year = tanggal.getFullYear();
        const tanggalFix = `${year}-${month}-${day}`
        const jamFix = `${hour}:${minute}`

        setReminder({
            ...reminder,
            date: tanggalFix,
            time: jamFix
        })
    }, [startDate])



    return(
      <Fragment>
          <SideBarOff/>
          <Popup notif={props.notif}/>
          <div className="background-after-login">
                    <img src={bg_1} alt='bg1' style={{position: 'fixed' , top:'0' , left: '0'}}/>
                    <img src={bg_2} alt='bg2' style={{position: 'fixed' , top:'0' , right: '0'}}/>
                    <img src={bg_3} alt='bg3' style={{position: 'fixed' , bottom:'-200px' , left: '0'}}/>
                    <img src={bg_4} alt='bg4' style={{position: 'fixed' , bottom:'-50px' , right: '0'}}/>
                </div>
          <div className="tajuk-page">
              <h1>FORMULIR NOTIFIKASI</h1>
          </div>
          <div style={{width:'fit-content' , height: 'fit-content' , margin: 'auto'}}>
            <div className="reminder-1-container" >
                <div className="asal-reminder" style={{lineHeight:'20px'}}>
                    Dari <br/>
                    <span className="nama-pengirim-reminder">{userDetail && userDetail.nama}</span><br/>
                    <span className="kementrian-asal-reminder">{userDetail && userDetail.role === 'owner' ? 'Owner' : 'Super Admin'} </span> 
                    {userDetail && userDetail.instansi.nama_pendek}
                </div>
                <form className="form-reminder-1" onSubmit={onSubmit}>
                    <div className={userDetail && userDetail.role === 'owner' ? 'div-reminder' : 'd-none'}>
                        <label>Instansi Tujuan</label>
                        {
                            userDetail && userDetail.role === 'owner' ? 
                                <select className="reminder-tujuan" type="text" required name="nama_pendek" onChange={onChangeDropDown}>
                                    <option defaultValue='' hidden></option>
                                    {
                                        allInstansi.map((instansi,index) => {
                                            return(
                                                <option key={index} value={instansi.nama_pendek}>{instansi.nama_pendek}</option>
                                            )
                                        })

                                    }
                                </select>
                        :
                            ''
                        }
                    </div>
                    <div className="div-reminder">
                        <label>Akun Tujuan</label>
                        <select className="reminder-akun" type="text" required onChange={(e) => onChange(e,true)}>
                            <option defaultValue='' hidden></option>
                            {
                                users.map(user => {
                                    return(
                                        <option key={user._id} name="kepada" value={user._id}>{user.nama}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="div-reminder">
                        <label>Judul Notifikasi</label>
                        <input 
                            className="reminder-judul" 
                            type="text" 
                            name="judul"
                            required
                            value={judul} 
                            onChange={onChange}
                        />
                    </div>
                    <div className="div-reminder">
                        <label>Isi Notifikasi</label>
                        <textarea 
                            className="reminder-isi" 
                            type="text" 
                            name="isi"
                            required
                            value={isi}
                            onChange={onChange} 
                        />
                    </div>
                    <div className="div-reminder">
                        <label>Tanggal dan Waktu<br/>Kirim</label>
                        <div style={{marginLeft:'46px' , display:'inline-block'}}>
                            <DatePicker
                                cus
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                timeInputLabel="Time:"
                                dateFormat="MM/dd/yyyy h:mm aa"
                                showTimeInput
                                className="red"
                                />                            
                        </div>
                    </div>
                <div className="reminder-navigation-button">
                    <button className="button-kirim" type='submit' >KIRIM</button>
                </div>
                </form>
            </div>
          </div>
      </Fragment>  
    );
}

export default FormReminder;