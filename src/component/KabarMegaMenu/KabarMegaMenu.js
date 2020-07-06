import React,{useState, useEffect} from 'react';
import axios from 'axios'
import {useHistory} from 'react-router-dom'

const KabarMegaMenu = (props) => {
    const [ documents , setDocuments ] = useState([])
    const [hide,setHide] = useState(true)
    const initDetail = {}
    const [detail,setDetail] = useState({})
    const history = useHistory()

    useEffect(() => {
        const gambar = props.kabar.gambar.map(gambar => `https://api.simonev.revolusimental.go.id${gambar.path}`)
        setDocuments(gambar)
    },[])

    const onClick = (e,doc) => {
        if(detail) {
            if(detail === doc) {
                setDetail('')
            } else {
                setDetail(doc)
            }
        } else {
            setDetail(doc)
        }
    }

    const onLinkTo = (id) => {
        history.push(`/artikel/${id}`)
    }

    return(
        <div>
                        <li style={{height:'fit-content', marginBottom:'6px' , padding: '0' , width:'400px'}}>
                            {
                                detail && (props.kabar._id === detail._id)  ?
                                    <div style={{height:'fit-content', width:'400px' , backgroundColor:'white' , padding:'12px', borderRadius:'10px' , border:'1px solid black', position:'relative'}} >
                                        <i className='fas fa-chevron-up' onClick={(event) => onClick(event,props.kabar)} style={{fontSize:'20px' , textAlign:'center',border:'none',  padding:'0' , height:'30px', width:'30px' , borderRadius:'3px', cursor:'pointer', position:'absolute', top:'12px', left:'350px'}}></i>                                        
                                        <div style={{height:'fit-content' , width: '90%'}}>{detail&&detail.judul}</div><br/><br/>
                                        <div style={{width:'100%', textAlign:'center'}}>   
                                            <img src={documents&&documents[0]} style={{width:'200px' , height:'auto', margin:'10px auto'}}></img>
                                        </div>
                                        <div style={{height:'fit-content' , fontWeight:'600', width:'90%', margin:'16px 20px' , textAlign:'justify'}}>{detail&&detail.deskripsi.length > 150 ? `${detail&&detail.deskripsi.substr(0,147)}...` : detail&&detail.deskripsi}</div>
                                        <div style={{textAlign:'center',width:'100%'}}>   
                                            <button onClick={() => onLinkTo(props.kabar._id)} className="button-topbar">Baca Lebih Lanjut</button>
                                        </div>
                                    </div>
                                :
                                    <div className='kabar-acordion' onClick={(event) => onClick(event,props.kabar)}>{props.kabar.judul.length > 38 ? `${props.kabar.judul.substr(0,35)}...` : props.kabar.judul}
                                        <i className='fas fa-chevron-down' onClick={(event) => onClick(event,props.kabar)} style={{border:'none',  padding:'0' , height:'30px', width:'30px' , borderRadius:'3px' , position:'absolute', top:'12px', left:'350px',fontSize:'20px' , textAlign:'center'}}></i>                                        
                                    </div>   
                            }
                        </li>
        </div>
    )
}

export default KabarMegaMenu;