import React,{Component,Fragment,useContext, useState , useEffect} from 'react';
import './TabelMonev.css';
import { ArtikelContext } from '../../context/Artikel/artikelContext';
import { AuthContext } from '../../context/Auth/AuthContext';
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import download from '../../assets/download.png';
import DownloadMonev from '../Download/DownloadMonev'
import edit from '../../assets/edit.png';
import hapus from '../../assets/delete.png';

const TabelMonev = (props) => {
    const { getDocumentDetail , documentDetail, resetDocument, editDocument } = useContext(ArtikelContext)
    const {userDetail} = useContext(AuthContext)
    const history = useHistory()

    const id = props.id
    const type = 'monev'
    const token = localStorage.getItem('token')

    const [document,setDocument] = useState({})
    const [show,setHide] = useState(false)

    useEffect(() => {
        const getDocumentDetail = async () => {
            const config = {
                headers: {
                    'X-Auth-Token': `aweuaweu ${token}`
                }
            }
            try {
                const res = await axios.get(`https://test.bariqmbani.me/api/v1/document/${id}?type=${type}`,config)
                setDocument(res.data.document)
                setHide(true)
            }
            catch (err) {
                console.log(err)
            }
        }
        getDocumentDetail()
    },[])

    console.log(document)

    const onClickEdit = () => {
        history.push(`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/formulir-monev-edit/${props.id}`)
    }
        return(
            <Fragment>
                <tr>
                    <td>{props.tahun}</td>
                    <td>{props.kp.length > 78 ? `${props.kp.substr(0, 75)}...` : props.kp}</td>
                    <td>{props.prop.length > 78 ? `${props.prop.substr(0, 75)}...` : props.prop}</td>
                    <td>{props.instansi}</td>
                    <td>{props.periode}</td>
                    <td>{props.penanggung_jawab}</td>
                    <td>
                        
                        {
                            show ?
                            <PDFDownloadLink 
                                document={<DownloadMonev data={document}/>}
                                fileName="wow.pdf"    
                                >
                                    <button className="button-download" >
                                        <img src={download} />
                                    </button>
                            </PDFDownloadLink>
                        :
                        ''
                        }
                        
                    </td>
                    <td>
                        <button className="button-download">
                            <img src={edit} onClick={onClickEdit}/>
                        </button>
                    </td>
                    <td>
                        <button className="button-download">
                            <img src={hapus} onClick={() => props.delete(props.id)}/>
                        </button>
                    </td>
                </tr>
            </Fragment>
        )
    }

export default TabelMonev;