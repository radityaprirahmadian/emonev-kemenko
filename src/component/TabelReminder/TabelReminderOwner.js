import React,{Component,Fragment} from 'react';
import './TabelReminderOwner.css';
import trash from '../../assets/trash.png';

class TabelReminderOwner extends Component{
    render(){
        return(
            <Fragment>
                 <tr>
                     <td>KEMENKO PMK</td>
                     <td>Eko Fajar Putra</td>
                     <td>Segera isi laporan GNRM!</td>
                     <td>Segera isi laporan GNRM!</td>
                     <td>12 Juni 2020, 17.30</td>
                     <td>
                         <button className="button-delete">
                             <img src={trash}/>
                         </button>
                     </td>
                 </tr>   
            </Fragment>
        )
    }
}

export default TabelReminderOwner;