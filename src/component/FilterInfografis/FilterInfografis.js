import React,{Component,Fragment,useState,useEffect,useContext} from 'react';
import axios from 'axios'
import { AuthContext } from '../../context/Auth/AuthContext';

const FilterInfografis = (props) => {
    const {token,user} = useContext(AuthContext)
    
    const onChange = (e) => {
        return props.setFilter({
            ...props.filter,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        props.getDocument()
    }

    return(
        <Fragment>
            <div className="filter-container">
                <form id="filter-admin">
                    <div className="filter-nama">
                        <h6 className="nama-filter">Tahun</h6>
                        <select className="input-filter-tahun" name="tahun" onChange={onChange} >
                            <option value="" hidden></option>
                            <option value="" >Semua</option>
                            {
                                props.filterValue && props.filterValue.tahun && props.filterValue.tahun.filter(filter => filter !== '').map((tahun,index) => {
                                    return(
                                        <option key={index} value={tahun}>{tahun}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    
                    {
                    user && user.role === 'owner' ?
                        <div className="filter-instansi" style={{marginLeft:'-79px'}}>
                            <label className="nama-filter">Instansi</label>
                            <select className="input-filter-instansi" name="instansi" onChange={onChange}>
                                <option value="" hidden></option>
                                <option value="">Semua Instansi</option>
                                {
                                     props.filterValue && props.filterValue.instansi && props.filterValue.instansi.filter(filter => filter !== '').map((instansi,index) => {
                                        return(
                                            <option key={index} value={instansi}>{instansi}</option>
                                        )
                                    })

                                }
                            </select>
                        </div>
                        : ''
                    }

                    <button className="button-submit-filter-info" onClick={onSubmit} style={{marginLeft:'40px'}}>FILTER</button>
                </form>

            </div>
        </Fragment>           
    );
}

export default FilterInfografis;