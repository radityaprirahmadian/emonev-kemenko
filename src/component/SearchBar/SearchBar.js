import React,{Component,Fragment} from 'react';
import './SearchBar.css';
import home from '../../assets/home.png';

class SearchBar extends Component{
    render(){
        return(
            <Fragment>
                
                    <div className="search-box">
                        <button className="search-logo">
                            <i className="fa fa-search"></i>
                        </button>
                        <input 
                            className="search-input"
				            type="text"
				            placeholder="Type to search"/>
                    </div>

            </Fragment>
        );
    }
}

export default SearchBar;