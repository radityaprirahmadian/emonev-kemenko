import React,{Component,Fragment} from 'react';
import './Gallery.css';
import Topbar from '../../component/Topbar/Topbar.js';
import Gallery from '../../component/Gallery/Gallery';
import Footer from '../../component/Footer/Footer';


class GalleryPage extends Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    
    render(){
        return(
            <Fragment>
                <Topbar kunci={false}/>
                    <div className="gallery-title">
                        GALLERY
                    </div>
                    <Gallery/>
                    <div className="gallery-pagination">
                        <i class="material-icons">chevron_left</i>
                        <ul> 
                            <li>1</li>
                            <li>2</li>
                            <li>3</li>
                            <li>4</li>
                            <li>5</li>
                        </ul>
                        <i class="material-icons">chevron_right</i>
                    </div>
                <Footer/>
            </Fragment>
        );
    }
}

export default GalleryPage;