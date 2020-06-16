import React,{Component,Fragment} from 'react';
import './Form1.css';
import {Link} from 'react-router-dom';

class Form1Admin extends Component{
    render(){
        return(
            <Fragment>
                <div className="admin-1-container">
                    <form className="form-admin-1">
                        <p>
                            <label>Nama</label>
                            <input className="admin-nama" type="text" name="name" />
                        </p>
                        <p>
                            <label>Instansi</label>
                            <input className="admin-instansi" type="text" name="subject" />
                        </p>
                        <p>
                            <label>Username</label>
                            <input className="admin-username" type="text" name="email" />
                        </p>
                        <p>
                            <label>Password</label>
                            <input className="admin-password" type="password" name="email" />
                        </p>
                    </form>

                    <div className="admin-navigation-button">
                        <Link to='/admin'>
                        <button className="button-daftar">DAFTAR</button>
                        </Link>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Form1Admin;