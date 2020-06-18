import React,{Component,Fragment,useContext,useEffect,useState} from 'react';
import { AuthContext } from '../../context/Auth/AuthContext';
import axios from 'axios'
import './TabelReminder.css';
import hapus from '../../assets/hapus.png';

const TabelReminder = (props) => {
    
    const { user,token } = useContext(AuthContext)

    const nol = (i) => {
        if (i < 10) {
          i = "0" + i;
        }
        return i;
    }
    console.log(props.tanggal)
    const mydate = new Date(props.tanggal);
    const hour = nol(mydate.getHours());
    const minute = nol(mydate.getMinutes());
    const date = mydate.getDate();
    let month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][mydate.getMonth()];
    let str = date + ' ' + month + ' ' + mydate.getFullYear() + ' , ' + hour + ':' + minute;

        return(
            <Fragment>
                <tr>
                    <td className={user && user.role === 'super_admin' ? 'd-none' : ''}>{props.kepada}</td>
                    <td>{props.nama}</td>
                    <td>{props.judul}</td>
                    <td>{props.isi}</td>
                    <td>{str}</td>
                    <td>
                        <button className="button-delete" onClick={() => props.delete(props.id)}>
                            <img src={hapus}/>
                        </button>
                    </td>
                </tr>
            </Fragment>
        )
    }

export default TabelReminder;