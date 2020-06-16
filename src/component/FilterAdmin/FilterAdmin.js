import React,{Component,Fragment} from 'react';
import './FilterAdmin.css';

const FilterAdmin = (props) => {
        const onChange = (e) => {
            return props.setFilter({
                ...props.filterUser,
                [e.target.name]: e.target.value
            })
        }

        const onSubmit = (e) => {
            e.preventDefault()
            props.getUser()
        }

        console.log(props.filterUser)

        return(
            <Fragment>
                <div className="filter-container">
                    <form id="filter-admin">
                        <div className="filter-nama">
                            <h6 className="nama-filter">Nama</h6>
                            <input className="input-filter-nama" type="text" name="nama" value={props.nama} onChange={onChange}></input> 
                        </div>
                        <div className="filter-nama-instansi">
                            <h6 className="nama-filter">Nama Instansi</h6>
                            <select className="input-filter-nama-instansi" name="instansi" onChange={onChange} >
                                <option value="" defaultValue="" hidden></option>
                                <option value="" defaultValue="">SEMUA INSTANSI</option>
                                <option value="Kemenko PMK">KEMENKO PMK</option>
                                <option value="Kemenpan">KEMENPAN</option>
                            </select>
                        </div>
    
                        <button className="button-submit-filter" onClick={onSubmit}>FILTER</button>
                    </form>

                </div>
            </Fragment>           
        );
    }

export default FilterAdmin;