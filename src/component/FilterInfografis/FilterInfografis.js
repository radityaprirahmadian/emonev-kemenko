import React,{Component,Fragment,useState,useEffect,useContext} from 'react';
import axios from 'axios'
import { AuthContext } from '../../context/Auth/AuthContext';

const FilterInfografis = (props) => {
    const {token,user} = useContext(AuthContext)
    const [ filterTahun , setFilterTahun ] = useState([])
    const [ filterInstansi , setFilterInstansi ] = useState([])
    
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

    const getDocumentLength = async () => {
        const config= {
            headers: {
                'X-Auth-Token': `aweuaweu ${token}`
            }
        }
        try {
            if(user && user.role === 'owner') {
                const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/kabar?`, config)
                console.log(res)
                setFilterTahun(res.data.filter.tahun)
                setFilterInstansi(res.data.filter.instansi)
            } else {
                const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/kabar?`, config)
                setFilterTahun(res.data.filter.tahun)
            }
        }
        catch (err) {
            console.log(err)  
        }  
    }

    useEffect(() => {
        getDocumentLength()
    }, [])

    return(
        <Fragment>
            <div className="filter-container">
                <form id="filter-admin">
                    <div className="filter-nama">
                        <h6 className="nama-filter">Tahun</h6>
                        <select className="input-filter-tahun" name="tahun" onChange={onChange} >
                            <option value="" defaultValue="" hidden></option>
                            <option value="" defaultValue="">Semua</option>
                            {
                                filterTahun.map((tahun,index) => {
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
                        : ''
                    }

                    <button className="button-submit-filter-info" onClick={onSubmit} style={{marginLeft:'40px'}}>FILTER</button>
                </form>

            </div>
        </Fragment>           
    );
}

export default FilterInfografis;