import React , { useContext, useEffect, useState } from 'react'
import { ArtikelContext } from '../../context/Artikel/artikelContext'
import { PDFDownloadLink } from "@react-pdf/renderer";
import download from '../../assets/download.png';
import DownloadGNRM from '../Download/DownloadGNRM'
import axios from 'axios'

const Download = (props) => {
    const { getDocumentDetail , documentDetail, resetDocument, editDocument } = useContext(ArtikelContext)

    const id = props.id
    const type = 'gnrm'
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
                const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/document/${id}?type=${type}`,config)
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

    return(
        <div>
            {
                show ?
                    <PDFDownloadLink 
                    document={<DownloadGNRM data={document}/>}
                    fileName="wow.pdf"    
                    >
                    <button className="button-download">
                        <img src={download} />
                    </button>
                    </PDFDownloadLink>
            :
            ''    
            }    
        </div>
    )
}

export default Download