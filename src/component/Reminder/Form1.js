import React,{Component,Fragment} from 'react';
import './Form1.css';
// import moment from 'moment';
// import '../src/less/input-moment.less';
// import './app.less';
// import InputMoment from '../src/input-moment';


class Form1Reminder extends Component{
    // state = {
    //     m: moment()
    // };
    
    // handleChange = m => {
    //    this.setState({ m });
    // };
    
    // handleSave = () => {
    //    console.log('saved', this.state.m.format('llll'));
    // };

    render(){
        return(
            <Fragment>
                <div className="reminder-1-container">
                    <div className="asal-reminder">
                        Dari <br/>
                        <span className="nama-pengirim-reminder">Bariq Mbani</span><br/>
                        <span className="kementrian-asal-reminder">Super Admin</span> KEMENKO PMK
                    </div>
                    <form className="form-reminder-1">
                        <p>
                            <label>Instansi Tujuan</label>
                            <input className="reminder-tujuan" type="text" name="name" />
                        </p>
                        <p>
                            <label>Akun Tujuan</label>
                            <input className="reminder-akun" type="text" name="subject" />
                        </p>
                        <p>
                            <label>Judul Reminder</label>
                            <input className="reminder-judul" type="text" name="email" />
                        </p>
                        <p>
                            <label>Isi Reminder</label>
                            <input className="reminder-isi" type="text" name="email" />
                        </p>
                        <p>
                            <label>Tanggal dan Waktu<br/>Kirim</label>
                            <input className="reminder-tanggal" type="text" name="email" />
                            {/* <InputMoment
                                moment={this.state.moment}
                                onChange={this.handleChange}
                                onSave={this.handleSave}
                                minStep={1} // default
                                hourStep={1} // default
                                prevMonthIcon="ion-ios-arrow-left" // default
                                nextMonthIcon="ion-ios-arrow-right" // default
                            /> */}
                        </p>
                    </form>

                    <div className="reminder-navigation-button">
                        <button className="button-kirim">KIRIM</button>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Form1Reminder;