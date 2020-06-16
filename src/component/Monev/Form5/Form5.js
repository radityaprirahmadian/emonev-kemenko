import React,{Component,Fragment} from 'react';
import './Form5.css';

class Form5Monev extends Component{
    render(){
        return(
            <Fragment>
                <div className="monev-5-container">
                    <div className="monev-5-title">
                        HASIL MONITORING DAN EVALUASI PROGRAM
                    </div>
                    <form className="form-monev-5">
                        <p>
                            <label>Hasil Monitoring</label>
                            <input className="monev-hasil-monitoring" type="text" name="name" />
                        </p>
                        <p>
                            <label>Evaluasi Program</label>
                            <input className="monev-evaluasi-program" type="text" name="subject" />
                        </p>
                    </form>
                    <div className="word-counter">
                        0/3000
                    </div>

                    <div className="monev-navigation-button-5">
                        <button className="previous"><i className="material-icons" style={{fontSize:'36px'}}>expand_less</i></button>
                        <button className="forward"><i className="material-icons" style={{fontSize:'36px'}}>expand_more</i></button>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Form5Monev;