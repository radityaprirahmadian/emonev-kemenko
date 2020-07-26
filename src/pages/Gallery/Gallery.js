import React,{Component,Fragment,useEffect,useState} from 'react';
import './Gallery.css';
import Topbar from '../../component/Topbar/Topbar.js';
import Gallery from '../../component/Gallery/Gallery';
import Footer from '../../component/Footer/Footer';
import Pagination from "react-js-pagination";

const GalleryPage = () => {
    const [filter,setFilter] = useState({
        page: '1',
        limit: '9'
    })

    const {
        page,
        limit
    } = filter

    useEffect(() => {
        window.scrollTo(0, 0);
    },[]) 
    
    
        return(
            <Fragment>
                <Topbar kunci={false}/>
                    <div className="gallery-title">
                        GALERI
                    </div>
                    <Gallery 
                        pagination={true}
                        logged_in={false}
                    />
                    {/* <div className="gallery-pagination">
                        <i class="material-icons">chevron_left</i>
                        <ul> 
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                            <li>5</li>
                        </ul>
                        <i class="material-icons">chevron_right</i>
                    </div> */}
                <Footer/>
            </Fragment>
        );
    }

export default GalleryPage;