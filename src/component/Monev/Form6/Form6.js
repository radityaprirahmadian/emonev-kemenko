import React,{Component,Fragment} from 'react';
import './Form6.css';

class Form6Monev extends Component{
    render(){
        return(
            <Fragment>
                <div className="monev-6-container">
                    <div className="monev-6-title">
                        KETERCAPAIAN INDIKATOR DAN TARGET
                    </div>
                    <form className="form-monev-6">
                        <p>
                            <label>Penjelasan</label>
                            <input className="monev-penjelasan" type="text" name="name" />
                        </p>
                    </form>
                    <div className="word-counter">
                        0/2000
                    </div>

                    <div className="monev-navigation-button-6">
                        <button className="previous"><i className="material-icons" style={{fontSize:'36px'}}>expand_less</i></button>
                        <button className="forward"><i className="material-icons" style={{fontSize:'36px'}}>expand_more</i></button>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Form6Monev;