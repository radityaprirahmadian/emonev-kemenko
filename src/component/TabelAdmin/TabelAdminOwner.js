import React,{Component,Fragment} from 'react';
import './TabelAdminOwner.css';
import trash from '../../assets/trash.png';

class TabelAdminOwner extends Component{
    render(){
        return(
            <Fragment>
                <div className="table-container">
                    <table className="table-admin">
                        <thead className="table-head-admin">
                            <tr>
                                <th width='258px'>Nama</th>
                                <th width='258px'>Instansi</th>
                                <th width='258px'>Username</th>
                                <th width='133px'>Level</th>
                                <th width='100px'>Operations</th>
                                <th width='42px'></th>
                            </tr>
                        </thead>
                        <tbody className="table-body-admin">
                            <tr>
                                <td>Eko Fajar Putra</td>
                                <td>KEMENKO PMK</td>
                                <td>ekofajarputra</td>
                                <td>Admin</td>
                                <td className="ada-button"><button className="button-edit">Edit</button></td>
                                <td>
                                    <button className="button-delete">
                                        <img src={trash}/>
                                    </button>
                                </td>
                            </tr>

                            <tr>
                                <td>Eko Fajar Putra</td>
                                <td>KEMENKO PMK</td>
                                <td>ekofajarputra</td>
                                <td>Admin</td>
                                <td className="ada-button"><button className="button-edit">Edit</button></td>
                                <td>
                                    <button className="button-delete">
                                        <img src={trash}/>
                                    </button>
                                </td>
                            </tr>

                            <tr>
                                <td>Eko Fajar Putra</td>
                                <td>KEMENKO PMK</td>
                                <td>ekofajarputra</td>
                                <td>Super Admin</td>
                                <td className="ada-button"><button className="button-edit">Edit</button></td>
                                <td>
                                    <button className="button-delete">
                                        <img src={trash}/>
                                    </button>
                                </td>
                            </tr>

                            <tr>
                                <td>Eko Fajar Putra</td>
                                <td>KEMENKO PMK</td>
                                <td>ekofajarputra</td>
                                <td>Admin</td>
                                <td className="ada-button"><button className="button-edit">Edit</button></td>
                                <td>
                                    <button className="button-delete">
                                        <img src={trash}/>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Fragment>
        )
    }
}

export default TabelAdminOwner;