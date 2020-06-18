import React,{Component,Fragment,useContext,useState,useEffect} from 'react';
import { ArtikelContext } from '../../context/Artikel/artikelContext'
import './TabelGNRM.css';
import { useHistory } from 'react-router-dom'
import { PDFDownloadLink } from "@react-pdf/renderer";
import download from '../../assets/download.png';
import edit from '../../assets/edit.png';
import hapus from '../../assets/delete.png';
import Download from './Download'
import Pagination from '../Pagination/Pagination';

const TabelGNRM = (props) => {
    const { getDocumentDetail , documentDetail, resetDocument, editDocument } = useContext(ArtikelContext)
    const history = useHistory()
    const id = props.id
    const type = 'gnrm'
    
    const onClickEdit = () => {
        history.push(`./formulir-gnrm-edit/${props.id}`)
    }

    return(
        <Fragment>
            <tr>
                <td>{props.tahun}</td>
                <td>{props.nama}</td>
                <td>{props.instansi}</td>
                <td>
                    {
                    props.pihak.map((pihak,index) => {
                        return(
                            <h1 key={index}>{pihak.lembaga}</h1>
                        )
                    })
                    }
                </td>
                <td>{props.pejabat}</td>
                <td>
                    <Download id={props.id}/>
                </td>
                <td>
                    <button className="button-download" style={{backgroundColor:'white'}}>
                        <img src={edit} onClick={onClickEdit}/>
                    </button>
                </td>
                <td>
                    <button className="button-download" style={{backgroundColor:'white'}}>
                        <img src={hapus} onClick={() => props.delete(props.id)}/>
                    </button>
                </td>
            </tr>


        </Fragment>
    )
}

export default TabelGNRM;