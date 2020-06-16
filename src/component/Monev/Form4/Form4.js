import React,{Component,Fragment} from 'react';
import './Form4.css';

class Form4Monev extends Component{
    render(){
        return(
            <Fragment>
                <div className="monev-4-container">
                    <div className="monev-4-title">
                        METODOLOGI MONITORING DAN EVALUASI
                    </div>
                    <form className="form-monev-4">
                        <p>
                            <label>Penjelasan</label>
                            <input className="monev-penjelasan" type="text" name="name" />
                        </p>
                    </form>
                    <div className="word-counter">
                        0/1000
                    </div>

                    <div className="monev-navigation-button-4">
                        <button className="previous"><i className="material-icons" style={{fontSize:'36px'}}>expand_less</i></button>
                        <button className="forward"><i className="material-icons" style={{fontSize:'36px'}}>expand_more</i></button>
                    </div>
                </div>   
            </Fragment>
        )
    }
}

export default Form4Monev;