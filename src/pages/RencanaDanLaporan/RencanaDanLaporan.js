import React, { useState } from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import Monev from '../Monev/Monev';
import GNRM from '../PelaksanaanGnrm/PelaksanaanGnrm';

const RencanaDanLaporan = (props) => {
  const [active, setActive] = useState('laporan-monev');
  const history = useHistory();

  useEffect(() => {
    setActive(history.location.search.split('=')[1]);
  }, [history.location.search]);

  return (
    <>
      <SideBarOff setId={props.setId} />
      {active === 'laporan-monev' ? (
        <Monev setId={props.setId} notif={props.notifs} setActive={setActive} />
      ) : (
        <GNRM setId={props.setId} notif={props.notifs} setActive={setActive} />
      )}
    </>
  );
};

export default RencanaDanLaporan;
