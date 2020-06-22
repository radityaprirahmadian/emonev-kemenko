import React,{Component,Fragment,useContext,useState,useEffect} from 'react';
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../../context/Auth/AuthContext' 
import download from '../../assets/download.png';
import edit from '../../assets/edit.png';
import hapus from '../../assets/delete.png';
import upload from '../../assets/upload.png';
import preview from '../../assets/preview.png';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'
import { InfografisContext } from '../../context/Infografis/InfografisContext';

const TabelInfografis = (props) => {
    const { setInfografis } = useContext(InfografisContext)
    const { user,userDetail } = useContext(AuthContext)
    const [ open ,setOpen] = useState(false)
    const [galleriIndex , setGalleriIndex] = useState(0)
    const [gambar,setGambar] = useState([])
    console.log(gambar)

    const history = useHistory()
    
    const onClickEdit = () => {
        history.push(`/${userDetail&&userDetail.role === 'owner' ? 'super-admin' : 'admin'}/formulir-kabar-gnrm-edit/${props.id}`)
    }

    const onOpen = (e) => {
        e.preventDefault()
        setOpen(true)
        const gams = props.gambar.map(gambar => `https://test.bariqmbani.me${gambar.path}` )
        setGambar(gams)
    }

    const tahun1 = new Date(props.tanggal)
    const tahun = tahun1.getFullYear()

    const onDelete = (e) => {
        e.preventDefault()
        props.delete(props.id)
    }
    return(
        <Fragment>
            <tr>
                <td>{props.tahun}</td>
                <td>{props.judul}</td>
                <td className={user && user.role === 'owner' ? '' : 'd-none'}>{props.instansi}</td>
                <td>
                    <button className="button-download">
                        <img src={preview} onClick={onOpen}/>
                    </button>
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
                    <button className="button-download">
                        <img src={edit} onClick={onClickEdit}/>
                    </button>
                </td>
                <td>
                    <button className="button-download">
                        <img src={hapus} onClick={onDelete}/>
                    </button>
                </td>
            </tr>


        </Fragment>
    )
}

export default TabelInfografis;