import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

class NotFound extends Component {
    render(){
        return(
            <Fragment>
                <div className="text-center">
                    <h1>WAKWAW</h1>
                    <Link to="/">
                        <button className="btn btn-primary">BACK TO HOME</button>
                    </Link>
                </div>
            </Fragment>

        )
    }
}

export default NotFound;