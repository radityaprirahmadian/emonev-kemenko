import React,{Component,Fragment} from 'react';
import './SearchBarAdmin.css';
import home from '../../assets/home.png';

class SearchBarAdmin extends Component{
    render(){
        return(
            <Fragment>
                
                    <div className="search-box">
                        <button className="search-logo">
                            <i className="fa fa-search"></i>
                        </button>
                        <input 
                            className="search"
				            type="text"
				            placeholder="Type to search"/>
                    </div>

            </Fragment>
        );
    }
}

export default SearchBarAdmin;