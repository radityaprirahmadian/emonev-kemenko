import React,{Component,Fragment,useContext,useState} from 'react';
import './TabelAdmin.css';
import axios from 'axios';
import {Link,useHistory} from 'react-router-dom'
import hapus from '../../assets/hapus.png';
import edit from '../../assets/edit.png';
import { AuthContext } from '../../context/Auth/AuthContext';

const TabelAdmin = (props) => {
    const [hapuss,setHapus] = useState(false)
    const { user,token } = useContext(AuthContext)
    const history = useHistory()

    const onDelete = (e) => {
        e.preventDefault()
        setHapus(true)
    }

    const onHapus = (e) => {
        e.preventDefault()
        props.delete(props.id)
        setHapus(false)
    }

    const onTidakHapus = (e) => {
        e.preventDefault()
        setHapus(false)
    }

        return(
            <Fragment>
                {
                    hapuss ? 
                    <div style={{position: 'fixed' ,top: '0' ,bottom: '0' ,left: '0', right: '0' , zIndex: '9998' ,backgroundColor: 'rgba(0,0,0,0.4)'}}>
                        <div className="popup_delete" style={{width:'400px',height:'300px', borderRadius:'10px', padding:'28px', zIndex:'9998', backgroundColor:'white', position:'fixed',top:'20%',left:'40%'}}>
                            <h1 style={{textAlign:'center', fontWeight:'700' , marginBottom:'32px' , fontSize:'18px'}}>Konfirmasi</h1><br/>
                            <h1 style={{fontSize:'18px', textAlign:'center' , fontWeight:'normal', lineHeight:'20px'}}>Apakah anda yakin akan menghapus <br/> Admin ini?</h1>
                            <div style={{marginTop:'30px', textAlign:'center'}}>
                                <button onClick={onHapus}  className="preview-gnrm" style={{width:'294px' , fontSize:'24px', height: '50px', borderRadius:'20px', backgroundColor:'#D4362E', color: 'white' , marginBottom:'16px' , boxShadow:'none'}}>Ya</button><br/>
                                <button onClick={onTidakHapus} className="preview-gnrm" style={{width:'294px' , fontSize:'24px', height: '50px', borderRadius:'20px', backgroundColor: '#E9E9E9' , color :'#656A6A' , boxShadow:'none'}}>Tidak</button>
                            </div>
                        </div>
                    </div>
                    : ''
                }
                <tr>
                    <td>{props.nama}</td>
                    <td className={user && user.role === 'super_admin' ? 'd-none' : ''}>{props.instansi}</td>
                    <td>{props.username}</td>
                    <td className={user && user.role === 'super_admin' ? 'd-none' : ''}>{props.role === 'super_admin' ? 'Super Admin' : 'Admin'}</td>
                    <td> 
                        <Link to={`/${user&&user.role === 'owner' ? 'super-admin' : 'admin'}/kelola-profile-admin/` + (props.id)}>
                            <button className="button-edit-admin">
                                <img src={edit}/>
                            </button>
                        </Link>                
                    </td>
                    <td>
                        <button className="button-delete" onClick={onDelete}>
                            <img src={hapus}/>
                        </button>
                    </td>
                </tr>            
            </Fragment>
        )
}

export default TabelAdmin;