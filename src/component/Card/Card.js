import React,{Component,Fragment} from 'react';
import './Card.css';
import bg_card from '../../assets/bg_card.png';


class Card extends Component{
    render(){
        return(
            <Fragment>
                
            <div className="container-for-card">
                <div className="card-container">
                    <div className="top-card">
                        <div className="card-background">
                            <img src={bg_card}/>
                        </div>
                    </div>

                    <div className="bottom-card">
                        <div className="card-title-bottom">
                            <h4>Pembangunan Tanah Papua</h4>
                        </div>

                        <div className="date-and-button">
                                <div className="card-date">
                                    <h4>7 April 2020</h4>
                                </div>
                                <div className="spacer"></div>
                                <button className="detail-button">
                                            LIHAT DETAIL
                                </button>
                                
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
        );
    }
}

export default Card;