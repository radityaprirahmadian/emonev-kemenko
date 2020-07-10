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
                        <li className='kabar-mega-li' style={{height: 'fit-content' , borderRadius: '0'}}>
                            {
                                detail && (props.kabar._id === detail._id)  ?
                                    <div className='kabar-mega-div'>
                                        <i className='fas fa-chevron-up' onClick={(event) => onClick(event,props.kabar)}></i>                                        
                                        <div className='kabar-mega-judul'>{detail&&detail.judul}</div><br/><br/>
                                        <div className='kabar-mega-image' style={{textAlign: 'center' , width: '100%'}}>   
                                            <img src={documents&&documents[0]}></img>
                                        </div>
                                        <div className='kabar-mega-deskripsi'>{detail&&detail.deskripsi.length > 150 ? `${detail&&detail.deskripsi.substr(0,147)}...` : detail&&detail.deskripsi}</div>
                                        <div className='kabar-mega-button' style={{textAlign: 'center' , width: '100%'}}>   
                                            <button onClick={() => onLinkTo(props.kabar._id)} className="button-topbar">Baca Lebih Lanjut</button>
                                        </div>
                                    </div>
                                :
                                    <div className='kabar-acordion' onClick={(event) => onClick(event,props.kabar)}>{props.kabar.judul.length > 38 ? `${props.kabar.judul.substr(0,35)}...` : props.kabar.judul}
                                        <i className='fas fa-chevron-down' onClick={(event) => onClick(event,props.kabar)}></i>                                        
                                    </div>   
                            }
                        </li>
        </div>
    )
}

export default KabarMegaMenu;