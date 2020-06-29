import React,{useState, useEffect} from 'react';
import axios from 'axios'

const Megamenu = (props) => {
    const [ documents , setDocuments ] = useState([])

    // useEffect(() => {
    //     const getAllDocument = async () => {
    //         try {
    //                 const res = await axios.get(`https://test.bariqmbani.me/api/v1/infografis?status=true&instansi=${props.instansi}`)
    //                 setDocuments(res.data.infografis)
    //         }
    //         catch (err) {
    //             console.log(err)  
    //         }  
    //     }
    //     getAllDocument()
    // },[])

    return(
        <div>
            <li>
                <div>{props.gnrm.form.kegiatan.nama_program}</div>
            </li>
        </div>
    )
}

export default Megamenu;