import React,{Component,Fragment,useContext,useEff} from 'react';
import './TabelAdmin.css';
import axios from 'axios';
import {Link,useHistory} from 'react-router-dom'
import hapus from '../../assets/hapus.png';
import edit from '../../assets/edit.png';
import { AuthContext } from '../../context/Auth/AuthContext';

const TabelAdmin = (props) => {
    const { user,token } = useContext(AuthContext)
    const history = useHistory()

        return(
            <Fragment>
                <tr>
                    <td>{props.nama}</td>
                    <td className={user && user.role === 'super_admin' ? 'd-none' : ''}>{props.instansi}</td>
                    <td>{props.username}</td>
                    <td className={user && user.role === 'super_admin' ? 'd-none' : ''}>{props.role === 'super_admin' ? 'Super Admin' : 'Admin'}</td>
                    <td> 
                        <Link to={'/profile-admin/' + (props.id)}>
                            <button className="button-edit-admin">
                                <img src={edit}/>
                            </button>
                        </Link>                
                    </td>
                    <td>
                        <button className="button-delete" onClick={() => props.delete(props.id)}>
                            <img src={hapus}/>
                        </button>
                    </td>
                </tr>            
            </Fragment>
        )
}

export default TabelAdmin;