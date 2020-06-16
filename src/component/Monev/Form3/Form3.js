import React,{Component,Fragment} from 'react';
import './Form3.css';

class Form3Monev extends Component{
    render(){
        return(
            <Fragment>
                <div className="monev-3-container">
                    <div className="monev-3-title">
                        WAKTU DAN TEMPAT PELAKSANAAN MONEV
                    </div>
                    <form className="form-monev-3">
                        <p>
                            <label>Waktu</label>
                            <input className="monev-waktu" type="text" name="name" />
                        </p>
                        <p>
                            <label>Tempat</label>
                            <input className="monev-tempat" type="text" name="subject" />
                        </p>
                        <p>
                            <label>Gambaran Umum</label>
                            <input className="monev-gambaran" type="email" name="email" />
                        </p>
                    </form>
                    <div className="word-counter">
                        0/500
                    </div>

                    <div className="monev-navigation-button-3">
                        <button className="previous"><i className="material-icons" style={{fontSize:'36px'}}>expand_less</i></button>
                        <button className="forward"><i className="material-icons" style={{fontSize:'36px'}}>expand_more</i></button>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Form3Monev;