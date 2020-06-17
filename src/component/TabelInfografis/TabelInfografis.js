import React,{Component,Fragment,useContext,useState,useEffect} from 'react';
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../../context/Auth/AuthContext' 
import download from '../../assets/download.png';
import edit from '../../assets/edit.png';
import hapus from '../../assets/delete.png';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'
import { InfografisContext } from '../../context/Infografis/InfografisContext';

const TabelInfografis = (props) => {
    const { setInfografis } = useContext(InfografisContext)
    const { user } = useContext(AuthContext)
    const [ open ,setOpen] = useState(false)
    const [galleriIndex , setGalleriIndex] = useState(0)
    const [gambar,setGambar] = useState([])
    console.log(gambar)

    const history = useHistory()
    
    const onClickEdit = () => {
        history.push(`./formulir-infografis/${props.id}`)
    }

    const onOpen = (e) => {
        e.preventDefault()
        setOpen(true)
        const gams = props.document.gambar.map(gambar => `https://test.bariqmbani.me${gambar.path}` )
        setGambar(gams)
    }

    const tahun1 = new Date(props.tanggal)
    const tahun = tahun1.getFullYear()

    const onDelete = (e) => {
        e.preventDefault()
        props.delete(props.id)
    }

    console.log(props.document)
    return(
        <Fragment>
            <tr>
                <td>{tahun}</td>
                <td>{props.nama}</td>
                <td className={user && user.role === 'owner' ? '' : 'd-none'}>{props.instansi}</td>
                <td>{props.status ? <i className='fas fa-check-circle' style={{fontSize:'24px', lineHeight:'50px', color:'green'}}></i> : ''}</td>
                <td>
                    <button className="button-download">
                        <i className="fa fa-upload" style={{fontSize:'20px', color:'#ACACAC'}} onClick={onClickEdit}></i>
                    </button>
                </td>
                <td>
                    {
                        props.status ?
                            <button className="button-download">
                                <i className='fas fa-eye' style={{fontSize:'20px', color:'#ACACAC'}} onClick={onOpen}></i>
                            </button>
                        :
                            <button className="button-download" disabled>
                                <i className='fas fa-eye' style={{fontSize:'20px', color:'#ACACAC'}}></i>
                            </button>
                    }

                    { 
                        open ?
                            <Lightbox
                                mainSrc={gambar[galleriIndex]}
                                nextSrc={gambar[(galleriIndex + 1) % gambar.length]}
                                prevSrc={gambar[(galleriIndex + gambar.length - 1) % gambar.length]}
                                onCloseRequest={() => setOpen(false)}
                                onMovePrevRequest={() =>
                                setGalleriIndex((galleriIndex + gambar.length - 1) % gambar.length)}
                                onMoveNextRequest={() =>
                                setGalleriIndex((galleriIndex + 1) % gambar.length)}
                            />
                        : ''
                    }
                </td>
                <td>
                    {
                        props.status ?
                            <button className="button-download">
                                <img src={edit} onClick={onClickEdit}/>
                            </button>
                        :
                            <button className="button-download" disabled>
                                <img src={edit}/>
                            </button>
                    }
                </td>
                <td>
                    {
                        props.status ?
                            <button className="button-download">
                                <img src={hapus} onClick={onDelete}/>
                            </button>
                        :
                            <button className="button-download" disabled>
                                <img src={hapus}/>
                            </button>
                    }
                </td>
            </tr>


        </Fragment>
    )
}

export default TabelInfografis;