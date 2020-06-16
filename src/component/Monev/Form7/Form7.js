import React,{Component,Fragment} from 'react';
import './Form7.css';

class Form7Monev extends Component{
    render(){
        return(
            <Fragment>
                <div className="monev-7-container">
                    <div className="monev-7-title">
                        TINDAK LANJUT HASIL MONITORING DAN EVALUASI
                    </div>
                    <form className="form-monev-7">
                        <p>
                            <label>Penjelasan</label>
                            <input className="monev-penjelasan" type="text" name="name" />
                        </p>
                    </form>
                    <div className="word-counter">
                        0/1000
                    </div>

                    <div className="monev-navigation-button-7">
                        <button className="previous"><i className="material-icons" style={{fontSize:'36px'}}>expand_less</i></button>
                        <button className="forward"><i className="material-icons" style={{fontSize:'36px'}}>expand_more</i></button>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Form7Monev;