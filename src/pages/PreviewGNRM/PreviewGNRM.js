import React,{Component,Fragment,useContext,useState,useEffect} from 'react';
import { ArtikelContext } from '../../context/Artikel/artikelContext'
import './PreviewGNRM.css';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import {Link} from 'react-router-dom';
import preview from '../../assets/preview.png';

const PreviewGNRM = (props) => {
    console.log(props.location)
    const { documentDetail, getDocumentDetail } = useContext(ArtikelContext)
    console.log(documentDetail)

    useEffect(() => {
        getDocumentDetail(props.match.params.id)
    }, [])
    
        return(
            <Fragment>
                <SideBarOff/>
                <div className="preview-page">
                    <div className="title-preview-page" style={{color:'#D33732'}}>
                        PREVIEW LAPORAN
                    </div>
                    <div className="preview-picture">
                        <div className="preview-header">
                            <div className="judul-preview" style={{textAlign:"center", fontSize:'12px'}}>
                                <h1 style={{lineHeight:'25px', fontWeight:'bold'}}>
                                    Proteksi Input Program Gerakan Nasioal Revolusi Mental (GNRM) Tahun 
                                    <span style={{color:'#D33732'}}> {documentDetail && documentDetail.form.tahun}</span>
                                </h1>
                                
                                <h1 style={{lineHeight:'15px'}}>Dilarang menyalin, menyimpan, memperbanyakan sebagian atau seluruh isi laporan ini dalam bentuk <br/> apapun kecuali oleh Koordinator Pelaksana Gerakan (KPG) dan Sekretariat Revolusi Mental</h1><br/>

                                <h1 style={{lineHeight:'35px', fontWeight:'bold'}}>
                                    PROGRAM PELAKSANAAN GNRM 
                                    <span style={{color:'#D33732'}}> {documentDetail && documentDetail.form.tahun}</span>
                                </h1>
                                
                                <h1 style={{lineHeight:'15px'}}> 
                                    ID Laporan : 
                                    <span style={{color:'#D33732'}}> {documentDetail && documentDetail.form.id_program}</span>
                                </h1>

                                <h1 style={{lineHeight:'15px'}}> 
                                    Program 
                                    <span style={{color:'#D33732'}}> {documentDetail && documentDetail.instansi} </span> 
                                    GNRM TAHUN 
                                    <span style={{color:'#D33732'}}> {documentDetail && documentDetail.form.tahun}</span>
                                </h1>
                            </div>
                        </div>

                            <div className="preview-body" style={{margin:'20px auto 0', width:'1042px', fontSize:'12px', lineHeight:'16px'}}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th width="54px"></th>
                                            <th width="997px"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                       <tr style={{fontWeight:'bold'}}>
                                            <td>1.</td>
                                            <td >Instansi</td> 
                                       </tr>
                                       <tr>
                                            <td></td>
                                            <td style={{paddingTop:'12px', paddingBottom:'32px'}}>{documentDetail && documentDetail.instansi}</td> 
                                       </tr>
                                       <tr style={{fontWeight:'bold'}}>
                                            <td>2.</td>
                                            <td>Kegiatan</td> 
                                       </tr>
                                       <tr>
                                            <td></td>
                                            <td style={{paddingTop:'12px', paddingBottom:'32px'}}>
                                                {documentDetail && documentDetail.form.kegiatan.penjelasan_kegiatan}
                                            </td> 
                                       </tr>
                                       <tr style={{fontWeight:'bold'}}>
                                            <td>3.</td>
                                            <td>Output</td> 
                                       </tr>
                                       <tr>
                                            <td></td>
                                            <td style={{paddingTop:'12px', paddingBottom:'32px'}}>
                                                {documentDetail && documentDetail.form.output.indikator_capaian} <br/>
                                                {documentDetail && documentDetail.form.output.sasaran} <br/>
                                                {documentDetail && documentDetail.form.output.target}
                                            </td> 
                                       </tr>
                                       <tr style={{fontWeight:'bold'}}>
                                            <td>4.</td>
                                            <td>Kondisi Awal</td> 
                                       </tr>
                                       <tr>
                                            <td></td>
                                            <td style={{paddingTop:'12px', paddingBottom:'32px'}}>
                                            {documentDetail && documentDetail.form.kondisi_awal}
                                            </td> 
                                       </tr>
                                       <tr style={{fontWeight:'bold'}}>
                                            <td>5.</td>
                                            <td>Anggaran</td> 
                                       </tr>
                                       <tr>
                                            <td></td>
                                            <td style={{paddingTop:'12px', paddingBottom:'32px'}}>
                                            {documentDetail && documentDetail.form.anggaran.besar_anggaran}
                                            </td> 
                                       </tr>
                                       <tr style={{fontWeight:'bold'}}>
                                            <td>6.</td>
                                            <td>Proses Perkembangan Pelaksaan Kegiatan</td> 
                                       </tr>
                                       <tr>
                                            <td></td>
                                            <td style={{paddingTop:'12px', paddingBottom:'32px'}}>
                                            {documentDetail && documentDetail.form.proses}
                                            </td> 
                                       </tr>
                                       <tr style={{fontWeight:'bold'}}>
                                            <td>7.</td>
                                            <td>Pihak Terkait</td> 
                                       </tr>
                                       {
                                           documentDetail ? 
                                            (documentDetail && documentDetail.form.pihak_terkait).map((pihak,index) => {
                                               return(
                                                    <tr key={index}>
                                                        <td></td>
                                                        <td style={{paddingTop:'12px', paddingBottom:'32px'}}>
                                                            {pihak.lembaga} , {pihak.penjelasan_pihak_terkait} , {pihak.peran}
                                                        </td> 
                                                    </tr>
                                               )
                                            })
                                            :
                                            ''
                                       }
                                       <tr style={{fontWeight:'bold'}}>
                                            <td>8.</td>
                                            <td>Lampiran Media</td> 
                                       </tr>
                                       <tr>
                                            <td></td>
                                            <td style={{paddingTop:'12px', paddingBottom:'32px'}}>Nam augue neque fermentum non, magnis. Nibh eu sed vel eleifend cursus arcu faucibus sapien integer. Aenean duis convallis enim lobortis. Venenatis cursus nibh porta magnis orci, nunc. Massa ut feugiat posuere facilisi. Imperdiet sed felis faucibus mattis et, nunc non. Pharetra non vitae purus non pharetra commodo rutrum enim. Eu viverra magna dictum non vitae velit amet. Nibh at aliquet ultrices proin suscipit sit. Nisl auctor leo, tincidunt non volutpat iaculis est nibh non. Massa sed blandit facilisi pharetra faucibus sed non ac. Sit aliquam tellus morbi a faucibus. 
                                            Ullamcorper ultrices porta nulla erat in magna ante. Aliquet vel eget id interdum ornare. Ut ipsum ullamcorper at vel orci arcu laoreet in. Sed tempor tortor mattis augue pellentesque consectetur. Elit elementum vel consectetur purus.
                                            </td> 
                                       </tr>
                                       <tr>
                                            <td></td>
                                            <td style={{paddingTop:'154px'}}>
                                            Demikian program ini dibuat dan dapat dikoordinasikan untuk dilaksanakan sebagaimana mestinya. <br/>
                                            Atas perhatiannya diucapkan terimakasih.</td> 
                                       </tr>
                                    </tbody> 
                                </table>
                            </div>
                                <div className="preview-ttd" style={{marginTop:'10px', marginBottom:'119px' , fontSize:'12px'}}>
                                    <div style={{textAlign:'left' , marginLeft:'991px'}}>
                                        <h1>..................., ...................</h1><br/>
                                        <h1>{documentDetail && documentDetail.form.penanggung_jawab.nama}</h1>
                                        <br/>
                                        <br/>
                                        <br/>
                                        <h1>TTD</h1>
                                        <h1>{documentDetail && documentDetail.form.penanggung_jawab.nip}</h1>
                                    </div>
                                </div>

                            
                            <Link to={`/formulir-gnrm-edit/${props.match.params.id}`}>
                                <button className="button-edit-kembali">EDIT KEMBALI</button>
                            </Link>
                            <Link to='gnrm'>
                                <button className="button-unggah">UNGGAH LAPORAN</button>
                            </Link>
                    </div>
                </div>
            </Fragment>
        );
}

export default PreviewGNRM;