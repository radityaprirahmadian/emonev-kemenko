import React,{Component,Fragment,useContext} from 'react';
import axios from 'axios';
import {Link,useHistory} from 'react-router-dom'
import trash from '../../assets/trash.png';
import edit from '../../assets/edit.png';
import { AuthContext } from '../../context/Auth/AuthContext';

const TabelInstansi = (props) => {
    const { user,token } = useContext(AuthContext)
    const history = useHistory()

        return(
            <Fragment>
                <tr>
                    <td>{props.nama}</td>
                    <td>{props.nama_pendek}</td>
                    <td>{props.jenis}</td>
                    <td> 
                        <Link to={'/formulir-instansi-edit/' + (props.id)}>
                            <button className="button-edit-admin">
                                <img src={edit}/>
                            </button>
                        </Link>                
                    </td>
                    <td>
                        <button className="button-delete" onClick={() => props.delete(props.id)}>
                            <img src={trash}/>
                        </button>
                    </td>
                </tr>            
            </Fragment>
        )
}

export default TabelInstansi;