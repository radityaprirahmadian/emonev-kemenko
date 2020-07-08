import React, { Component, Fragment , useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';

const NotFound = (props) => {

    useEffect(() => {
        props.history.goBack(-2)
    }, [])


    return(
        <Fragment>
        </Fragment>
    )
}

export default NotFound;