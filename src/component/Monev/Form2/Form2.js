import React,{Component,Fragment} from 'react';
import './Form2.css';

class Form2Monev extends Component{
    render(){
        return(
            <Fragment>
                <div className="monev-2-container">
                    <div className="monev-2-title">
                        TUJUAN PELAPORAN
                    </div>
                    <form className="form-monev-2">
                        <p>
                            <label>Penjelasan</label>
                            <input className="monev-penjelasan" type="text" name="name" />
                        </p>
                    </form>
                    <div className="word-counter">
                        0/5000
                    </div>

                    <div className="monev-navigation-button-2">
                        <button className="previous"><i className="material-icons" style={{fontSize:'36px'}}>expand_less</i></button>
                        <button className="forward"><i className="material-icons" style={{fontSize:'36px'}}>expand_more</i></button>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Form2Monev;