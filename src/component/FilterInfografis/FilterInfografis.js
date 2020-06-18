import React,{Component,Fragment,useState,useEffect} from 'react';
import axios from 'axios'

const FilterInfografis = (props) => {
    const [allInstansi, setAllInstansi] = useState([])
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

        useEffect(() => {
            axios.get('https://api.simonev.revolusimental.go.id/api/v1/instansi')
            .then(res => {
                setAllInstansi(res.data.instansi)
                console.log('wow')
            })
            .catch(err => {
                console.log('wow', +err)
            })
        }, [])

        return(
            <Fragment>
                <div className="filter-container">
                    <form id="filter-admin">
                        <div className="filter-nama">
                            <h6 className="nama-filter">Tahun</h6>
                            <select className="input-filter-nama" name="tahun" onChange={onChange} >
                                <option value="" defaultValue="" hidden></option>
                                <option value="" defaultValue="">Semua</option>
                                <option value="2019">2019</option>
                                <option value="2020">2020</option>
                                <option value="2021">2021</option>
                                <option value="2022">2022</option>
                            </select>
                        </div>
                        <div className="filter-nama-instansi" style={{width:'120px'}}>
                            <h6 className="nama-filter">Status</h6>
                            <select className="input-filter-nama-instansi" style={{width:'120px'}}name="status" onChange={onChange} >
                                <option value="" defaultValue="" hidden></option>
                                <option value="" defaultValue="">Semua</option>
                                <option value="true">Sudah Ada</option>
                                <option value="false">Belum Ada</option>
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
    
                        <button className="button-submit-filter" onClick={onSubmit} style={{marginLeft:'40px'}}>FILTER</button>
                    </form>

                </div>
            </Fragment>           
        );
    }

export default FilterInfografis;