import React,{Component,Fragment} from 'react';
import './Sidebar.css';
import avatar from '../../assets/avatar.png';
import anjay from '../../assets/anjay.png';

class Sidebar extends Component{
    render(){
        return(
            <Fragment>
                <div className="side-bar">
                    <div className="side-bar-avatar">
                        <img src={avatar} alt="avatar"/>
                            <div className="avatar-identity">
                                <p className ="user-name">Eko Fajar</p>
                                <p className ="user-position">Super Admin</p>
                                <p className ="user-ministry">KEMENKO PMK</p>
                            </div>
                    </div>

                    <div className="side-bar-menu">
                        <div className="side-bar-menu-on">
                        <ul>
                            <img src={anjay}/>
                        </ul>
                    </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}
            
export default Sidebar;