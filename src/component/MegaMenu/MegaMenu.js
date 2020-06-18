import React,{useState, useEffect} from 'react';
import axios from 'axios'

const Megamenu = (props) => {
    const [ documents , setDocuments ] = useState([])

    useEffect(() => {
        const getAllDocument = async () => {
            try {
                    const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/infografis?status=true&instansi=${props.instansi}`)
                    setDocuments(res.data.infografis)
            }
            catch (err) {
                console.log(err)  
            }  
        }
        getAllDocument()
    },[])

    return(
        <div>
            {
                documents.map((document,index) => {
                    return(
                        <li key={index}>
                            <div className="titit">{document.nama_program}</div>
                        </li>
                    )
                })
            }
        </div>
    )
}

export default Megamenu;