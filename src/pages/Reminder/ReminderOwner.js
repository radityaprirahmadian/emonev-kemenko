import React,{Component,Fragment} from 'react';
import './ReminderOwner.css';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import SearchBar from '../../component/SearchBar/SearchBar';
import plus from '../../assets/plus.png';
import Pagination from '../../component/Pagination/Pagination';
import TabelReminder from '../../component/TabelReminder/TabelRemider';
import SearchBarAdmin from '../../component/SearchBarAdmin/SeacrhBarAdmin';
import TabelReminderOwner from '../../component/TabelReminder/TabelReminderOwner';
import Notification from '../../component/Notification/Notification';

class ReminderOwner extends Component{
    render(){
        return(
            <Fragment>
                <SideBarOff/>
                    <SearchBarAdmin/>
                        <Notification/>

                        <div className="input-dan-tajuk">
                            <button className="tambah-reminder">
                                <img src={plus}></img>
                                <div className="spacer"></div>
                                <p className="text-input-reminder">
                                    Buat Reminder
                                </p>
                            </button>
                            <div className="spacer"></div>
                            <div className="tajuk-reminder">
                                <p>REMINDER</p>
                            </div>
                        </div>
                    <TabelReminderOwner/>
                <Pagination/>
            </Fragment>

        )
    }
}

export default ReminderOwner;