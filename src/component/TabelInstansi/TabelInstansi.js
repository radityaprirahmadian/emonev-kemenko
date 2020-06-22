import React,{Component,Fragment,useContext,useState} from 'react';
import axios from 'axios';
import {Link,useHistory} from 'react-router-dom';
import hapus from '../../assets/hapus.png';
import edit from '../../assets/edit.png';
import { AuthContext } from '../../context/Auth/AuthContext';

const TabelInstansi = (props) => {
    const { user,token,userDetail } = useContext(AuthContext)
    const history = useHistory()

    const [hapuss,setHapus] = useState(false)
    
    const onHapus = (e) => {
        e.preventDefault()
        setHapus(true)
    }

    const onDelete = (e) => {
        e.preventDefault()
        props.delete(props.id)
        setHapus(false)
    }

    const onTidakHapus = (e) => {
        e.preventDefault()
        setHapus(false)
    }

    // () => props.delete(props.id)
        return(
            <Fragment>
                {
                    hapuss ? 
                        <div className="popup_delete" style={{width:'300px',height:'200px', borderRadius:'10px', border:'1px solid black', padding:'10px', backgroundColor:'white', position:'fixed',top:'20%',left:'40%'}}>
                            <h1 style={{color:'red',fontSize:'16px', textAlign:'center' , fontWeight:'600', lineHeight:'18px'}}>Apakah anda yakin akan menghapus instansi? <br/>Jika menghapus instansi, semua hal yang berhubungan dengan instansi akan terhapus juga. </h1>
                            <div style={{marginTop:'30px'}}>
                                <button onClick={onDelete}  className="preview-gnrm" style={{width:'100px' , height: '40px'}}>YA</button> 
                                <button onClick={onTidakHapus} className="preview-gnrm" style={{marginLeft:'30px' , width:'100px' , height: '40px'}}>TIDAK</button>
                            </div>
                        </div>
                    : ''
                }

                <tr>
                    <td>{props.nama}</td>
                    <td>{props.nama_pendek}</td>
                    <td>{props.jenis}</td>
                    <td className='logo' style={{paddingLeft:'16px'}}> 
                        <Link to={`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/formulir-instansi-edit/` + (props.id)}>
                            <button className="button-edit-admin">
                                <img src={edit}/>
                            </button>
                        </Link>                
                    </td>
                    <td className='logo' style={{padding:'0'}}> 
                        <button className="button-delete" onClick={onHapus}>
                            <img src={hapus}/>
                        </button>
                    </td>
                </tr>            
            </Fragment>
        )
}

export default TabelInstansi;