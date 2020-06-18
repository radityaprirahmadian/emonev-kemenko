import React,{Component,Fragment} from 'react';

const FilterInstansi = (props) => {
        const onChange = (e) => {
            return props.setFilter({
                ...props.filter,
                [e.target.name]: e.target.value
            })
        }

        const onSubmit = (e) => {
            e.preventDefault()
            props.getInstansi()
        }

        return(
            <Fragment>
                <div className="filter-container">
                    <form id="filter-admin">
                        <div className="filter-nama">
                            <h6 className="nama-filter">Nama Instansi</h6>
                            <input className="input-filter-nama" type="text" name="nama" value={props.nama} onChange={onChange}></input> 
                        </div>
                        <div className="filter-nama-instansi">
                            <h6 className="nama-filter">Jenis</h6>
                            <select className="input-filter-nama-instansi" name="jenis" onChange={onChange} >
                                <option value="" defaultValue="" hidden></option>
                                <option value="" defaultValue="">Semua</option>
                                <option value="Kementerian">Kementerian/Lembaga</option>
                                <option value="Pemerintah">Pemerintah Daerah</option>
                            </select>
                        </div>
    
                        <button className="button-submit-filter" onClick={onSubmit}>FILTER</button>
                    </form>

                </div>
            </Fragment>           
        );
    }

export default FilterInstansi;