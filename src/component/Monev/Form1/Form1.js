import React,{Component,Fragment} from 'react';
import './Form1.css';

class Form1Monev extends Component{
    render(){
        return(
            <Fragment>
                <div className="monev-1-container">
                    <form className="form-monev-1">
                        <p>
                            <label>Tahun</label>
                            <input className="monev-tahun" type="text" name="name" />
                        </p>
                        <p>
                            <label>ID Program</label>
                            <input className="monev-id-program" type="text" name="subject" />
                        </p>
                        <p>
                            <label>Instansi</label>
                            <input className="monev-instansi" type="email" name="email" />
                        </p>
                    </form>

                    <div className="gnrm-navigation-button">
                        <button className="previous"><i className="material-icons" style={{fontSize:'36px'}}>expand_less</i></button>
                        <button className="forward"><i className="material-icons" style={{fontSize:'36px'}}>expand_more</i></button>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Form1Monev;