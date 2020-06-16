import React,{Component,Fragment,useState,useEffect} from 'react';
import './Filter.css';
import axios from 'axios'

const Filter = (props) => {
    const [allInstansi, setAllInstansi] = useState([])
    const onChange = (e) => {
        return props.setFilterDoc({
            ...props.filterDoc,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        axios.get('https://test.bariqmbani.me/api/v1/instansi')
        .then(res => {
            setAllInstansi(res.data.instansi)
            console.log('wow')
        })
        .catch(err => {
            console.log('wow', +err)
        })
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
                            <option value="">Semua Tahun</option>
                            <option value="2020">2020</option>
                            <option value="2019">2019</option>
                            <option value="2018">2018</option>
                            <option value="2017">2017</option>
                            <option value="2016">2016</option>
                            <option value="2015">2015</option>
                        </select> 
                    </div>
                    <div className="filter-instansi">
                        <label className="nama-filter">Instansi</label>
                        <select className="input-filter-instansi" name="instansi" onChange={onChange}>
                            <option value="" defaultValue="" hidden></option>
                            <option value="">Semua Instansi</option>
                            {
                                allInstansi.map((instansi,index) => {
                                    return(
                                        <option key={index} value={instansi.nama_pendek}>{instansi.nama_pendek}</option>
                                    )
                                })

                            }
                        </select>
                    </div>
                    <div className="filter-pelaporan">
                        <label className="nama-filter">Periode Pelaporan</label>
                        <select className="input-filter-pelaporan" name="periode" onChange={onChange}>
                            <option defaultValue="" hidden></option>
                            <option value="">Semua Periode</option>
                            <option value="tahunan">Tahunan</option>
                            <option value="triwulan">Triwulan</option>
                            <option value="bulanan">Bulanan</option>
                        </select>
                    </div>

                    <button className="button-submit-filter-admin" onClick={onSubmit}>FILTER</button>   
                </div>
            </Fragment>           
        );
}

export default Filter;