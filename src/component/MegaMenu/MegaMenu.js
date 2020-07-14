import React from 'react';

const Megamenu = (props) => {
    return(
        <div>
            <li style={{borderRadius: '0'}}>
                <div>{props.gnrm.form.kegiatan.nama_program}</div>
            </li>
        </div>
    )
}

export default Megamenu;