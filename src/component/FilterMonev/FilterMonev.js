import React,{Component,Fragment,useState,useEffect,useContext} from 'react';
import '../Filter/Filter.css';
import axios from 'axios'
import {AuthContext} from '../../context/Auth/AuthContext.js'

const FilterMonev = (props) => {
    const { token } = useContext(AuthContext)
    const [ filterTahun , setFilterTahun ] = useState([])
    const [ filterPeriode , setFilterPeriode ] = useState([])
    const [ filterInstansi , setFilterInstansi ] = useState([])

    const getDocumentLength = async () => {
        const config= {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`
            }
        }
        try {
            const res = await axios.get(`https://test.bariqmbani.me/api/v1/document?type=monev`, config)
            setFilterTahun(res.data.filter.tahun)
            setFilterPeriode(res.data.filter.periode)
            setFilterInstansi(res.data.filter.instansi)
        }
        catch (err) {
            console.log(err)  
        }  
    }

    const onChange = (e) => {
        return props.setFilterDoc({
            ...props.filterDoc,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        getDocumentLength()
    }, [])


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
                                filterTahun.map((tahun,index) => {
                                    return(
                                        <option value={tahun} key={index}>{tahun}</option>
                                    )
                                })
                            }
                        </select> 
                    </div>

                    <div className="filter-pelaporan">
                        <label className="nama-filter">Periode Pelaporan</label>
                        <select className="input-filter-pelaporan" name="periode" onChange={onChange}>
                            <option defaultValue="" hidden></option>
                            <option value="">Semua</option>
                            {
                                filterPeriode.map((periode,index) => {
                                    return(
                                        <option key={index} value={periode}>{periode}</option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div className="filter-instansi">
                        <label className="nama-filter">Instansi</label>
                        <select className="input-filter-instansi" name="instansi" onChange={onChange}>
                            <option value="" defaultValue="" hidden></option>
                            <option value="">Semua Instansi</option>
                            {
                                filterInstansi.map((instansi,index) => {
                                    return(
                                        <option key={index} value={instansi}>{instansi}</option>
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

export default FilterMonev;