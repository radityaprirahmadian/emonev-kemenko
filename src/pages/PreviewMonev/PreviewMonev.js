import React,{Component,Fragment} from 'react';
import './PreviewMonev.css';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import {Link} from 'react-router-dom';
import preview from '../../assets/preview.png';

class PreviewMonev extends Component{
    render(){
        return(
            <Fragment>
                <SideBarOff/>
                <div className="preview-page">
                    <div className="title-preview-page">
                        PREVIEW LAPORAN
                    </div>
                    <div className="preview-picture">
                        <img src={preview}/>
                    </div>
                    <div className="button-action">
                        <Link to='/formulir-monev'>
                            <button className="button-edit-kembali">EDIT KEMBALI</button>
                        </Link>
                        <Link to='monev'>
                            <button className="button-unggah">UNGGAH LAPORAN</button>
                        </Link>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default PreviewMonev;