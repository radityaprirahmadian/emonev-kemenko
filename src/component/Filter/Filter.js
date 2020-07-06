import React,{Component,Fragment,useState,useEffect,useContext} from 'react';
import './Filter.css';
import axios from 'axios'
import {AuthContext} from '../../context/Auth/AuthContext.js'

const Filter = (props) => {
    const { token, user } = useContext(AuthContext)

    // const getDocumentLength = async () => {
    //     const config= {
    //         headers: {
    //             'X-Auth-Token': `aweuaweu ${token}`
    //         }
    //     }
    //     try {
    //         const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/document?type=gnrm`, config)
    //         setFilterTahun(res.data.filter.tahun)
    //         setFilterKp(res.data.filter.kp)
    //         setFilterInstansi(res.data.filter.instansi)
    //     }
    //     catch (err) {
    //         console.log(err)  
    //     }  
    // }

    const onChange = (e) => {
        return props.setFilterDoc({
            ...props.filterDoc,
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
                    <div className="filter-tahun">
                        <label className="nama-filter">Tahun</label>
                        <select className="input-filter-tahun" name="tahun" onChange={onChange}>
                            <option defaultValue="" hidden></option>
                            <option value="">Semua</option>
                            {
                                props.filterValue && props.filterValue.tahun && props.filterValue.tahun.filter(filter => filter !== '').map((tahun,index) => {
                                    return(
                                        <option value={tahun} key={index}>{tahun}</option>
                                    )
                                })
                            }
                        </select> 
                    </div>
                    {
                        user && user.role === 'owner' ?
                            <div className="filter-instansi">
                                <label className="nama-filter">Instansi</label>
                                <select className="input-filter-instansi" name="instansi" onChange={onChange}>
                                    <option value="" defaultValue="" hidden></option>
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
                        : 
                        ''
                    }
                    <div className="filter-pelaporan">
                        <label className="nama-filter">Kegiatan Prioritas</label>
                        <select className="input-filter-pelaporan" name="kp" onChange={onChange}>
                            <option defaultValue="" hidden></option>
                            <option value="">Semua</option>
                            {
                                props.filterValue && props.filterValue.kp && props.filterValue.kp.filter(filter => filter !== '').map((kp,index) => {
                                    return(
                                        <option key={index} value={kp}>{kp.length > 50 ? `${kp.substr(0, 47)}...` : kp}</option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <button className="button-submit-filter-admin" onClick={onSubmit}>FILTER</button>   
                </div>
            </Fragment>           
        );
}

export default Filter;