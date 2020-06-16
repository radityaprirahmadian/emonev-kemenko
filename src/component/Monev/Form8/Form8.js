import React,{Component,Fragment} from 'react';
import './Form8.css';
import {Link} from 'react-router-dom';

class Form8Monev extends Component{
    render(){
        return(
            <Fragment>
                <div className="monev-8-container">
                    <form className="form-monev-8">
                        <p>
                            <label>Jangka Pelaporan</label>
                            <input className="monev-jangka" type="text" name="name" />
                        </p>
                        <p>
                            <label>Pejabat Eselon</label>
                            <input className="monev-eselon" type="text" name="name" />
                        </p>
                        <p>
                            <label>NIP</label>
                            <input className="monev-nip" type="text" name="name" />
                        </p>
                        <p>
                            <label>Lampiran Berkas <span><br/>dan Media</span></label>
                            <input className="monev-lampiran" type="file" name="name" />
                        </p>
                    </form>

                    <div className="monev-navigation-button-8">
                        <button className="previous-last"><i className="material-icons" style={{fontSize:'36px'}}>expand_less</i></button>
                        <Link to='/preview-monev'>
                        <button className="preview-monev">PREVIEW LAPORAN</button>
                        </Link>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Form8Monev;