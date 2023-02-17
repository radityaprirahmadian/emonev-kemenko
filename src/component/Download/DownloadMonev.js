import React, { useContext, useEffect, useState } from 'react';
import { Document, Page, Text, Image, StyleSheet, Font, View } from '@react-pdf/renderer';
import { ArtikelContext } from '../../context/Artikel/artikelContext';
import axios from 'axios';
import logo_kemenko from '../../assets/logo_kemenko.png';
import line2 from '../../assets/line2.png';
import image from '../../assets/image.png';
import logo_footer from '../../assets/logo_link_terkait_1.png';

Font.register({
  family: 'Open Sans',
  src: 'https://fonts.gstatic.com/s/opensans/v15/mem5YaGs126MiZpBA-UN7rgOUuhs.ttf',
});

const style = StyleSheet.create({
  body: {
    paddingTop: 30,
    paddingBottom: 80,
    paddingLeft: 60,
    paddingRight: 60,
    fontSize: 9,
    position: 'relative',
  },

  header: {
    textAlign: 'center',
    marginBottom: 40,
  },

  headerBold: {
    fontFamily: 'Open Sans',
  },

  headerBoldBotFlex: {
    fontFamily: 'Open Sans',
  },

  isi: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 25,
    textAlign: 'justify',
  },

  secondLineHeaderBold: {
    marginLeft: 10,
    marginTop: 5,
    fontFamily: 'Open Sans',
  },

  isiWaktu: {
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'justify',
  },

  isiFix: {
    marginLeft: 20,
    marginTop: 10,
    textAlign: 'justify',
  },

  headerMargTop: {
    marginTop: 6,
  },

  alamat: {
    width: 300,
  },

  headerMargBot: {
    marginBottom: 8,
  },

  footer: {
    marginTop: 20,
  },

  footer2: {
    position: 'absolute',
    bottom: 35,
    fontSize: 7,
    left: 60,
    right: 60,
  },

  images: {
    width: 200,
    height: 200,
    objectFit: 'contain',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },

  textimage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  isiFlex: {
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 30,
    width: 500,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  isiimage: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    textAlign: 'center',
    width: 220,
    height: 220,
    position: 'relative',
    overflow: 'hidden',
  },

  // imagesFlie: {
  //     width: 80,
  //     height: 80,
  //     objectFit: "contain",
  //     position: "absolute",
  //     top: 0,
  //     left: 0,
  //     right: 0,
  // },

  // isiimageFile: {
  //     marginLeft: 10,
  //     marginRight: 10,
  //     marginTop: 10,
  //     textAlign: "center",
  //     width: 100,
  //     height: 100,
  //     position: "relative",
  //     overflow: "hidden",
  // },

  logoFooter1: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 70,
  },

  logoFooter2: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 70,
  },

  notesFooter: {
    position: 'absolute',
    left: 75,
    bottom: -10,
    width: 250,
  },

  headerMargBold: {
    marginBottom: 8,
    fontFamily: 'Open Sans',
  },

  text: {
    marginBottom: 10,
  },

  hasMarginTop: {
    marginTop: 8,
  },

  marginBottomWide: {
    marginBottom: 20,
  },

  signature: {
    position: 'relative',
    textAlign: 'right',
    marginTop: 3,
  },

  testStyle: {
    right: -395,
    textAlign: 'left',
    position: 'relative',
  },

  ttd: {
    marginTop: 15,
    marginBottom: 15,
    right: -395,
    textAlign: 'left',
    position: 'relative',
  },

  testStyle2: {
    textAlign: 'right',
  },

  red: {
    color: 'black',
  },
  image: {
    height: 53,
    width: 53,
    objectFit: 'contain',
    position: 'absolute',
    top: -3,
    left: 5,
  },

  testStyle3: {
    textAlign: 'right',
    position: 'relative',
    right: -20,
  },

  kop: {
    marginLeft: 65,
    width: 500,
  },
  line: {
    marginBottom: 12,
    marginTop: 14,
  },

  line2: {
    marginBottom: 29,
  },

  halaman: {
    position: 'absolute',
    left: 100,
    bottom: 0,
  },
  width1: {
    width: 100,
  },
});

const DownloadMonev = (props) => {
  const nol = (i) => {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  };

  const isFileImage = (file) => {
    return file && file['mimetype'].split('/')[0] === 'image';
  };

  const mydate = new Date(props.data.document1 && props.data.document1.tanggal_diperbarui);
  const hour = nol(mydate.getHours());
  const minute = nol(mydate.getMinutes());
  const date = mydate.getDate();
  let month = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ][mydate.getMonth()];
  let str = hour + ':' + minute + ' WIB, ' + date + ' ' + month + ' ' + mydate.getFullYear();
  let str2 = date + ' ' + month + ' ' + mydate.getFullYear();
  return (
    <Document size="A4">
      <Page style={style.body}>
        {/*KOP*/}
        <View fixed>
          <Image
            style={style.image}
            source={`http://api.simonev.revolusimental.go.id:8882${
              props.data.instansi && props.data.instansi.logo
            }`}
          />
          <View style={style.kop}>
            <Text style={style.headerBold}>Gerakan Nasional Revolusi Mental</Text>
            <Text style={style.headerBold}>{props.data.instansi && props.data.instansi.nama}</Text>
            <Text style={style.alamat}>{props.data.instansi && props.data.instansi.alamat}</Text>
            {/* <Text>
                                Gedung Kementerian Koordinator Bidang Pembangunan Manusia & Kebudayaan
                            </Text> */}
            <Text>
              Telp {props.data.instansi && props.data.instansi.kontak}; Fax{' '}
              {props.data.instansi && props.data.instansi.fax};
            </Text>
            <Text>
              website : {props.data.instansi && props.data.instansi.website}, email:{' '}
              {props.data.instansi && props.data.instansi.email}
            </Text>
          </View>
          <Image style={style.line} source={line2} />
        </View>
        {/*Header*/}
        <View style={style.header}>
          <Text style={style.headerMargBold}>LAPORAN MONITORING DAN EVALUASI</Text>
          <Text style={style.headerBold}>
            GERAKAN NASIONAL REVOLUSI MENTAL Tahun{' '}
            <Text style={style.red}>
              {props.data.document1.form && props.data.document1.form.tahun}
            </Text>
          </Text>
          <Text style={style.hasMarginTop}>
            Periode Laporan Program/Kegiatan:{' '}
            {props.data.document1.form && props.data.document1.form.periode === 'Jan-Mei'
              ? 'Januari-Mei'
              : 'Juli-November'}
          </Text>
        </View>

        {/*Body*/}
        <View style={style.headerMargTop}>
          <Text style={style.headerBold}>1. Judul Kegiatan</Text>
          <Text style={style.isi}>
            {props.data.document1.form && props.data.document1.form.kegiatan.nama_program}
          </Text>
          <Text style={style.headerBold}>2. Pemilihan 5 Gerakan</Text>
          <Text style={style.isi}>
            {props.data.document1.form && props.data.document1.form.gerakan}
          </Text>
          <Text style={style.headerBold}>
            3. Identifikasi Kondisi sebelum mental negative/ sebelum implementasi program/ Kegiatan
            Aksi Nyata,
          </Text>
          <Text style={style.secondLineHeaderBold}>Program yang sedang berjalan di K/L/D</Text>
          <Text style={style.isi}>
            {props.data.document1.form && props.data.document1.form.identifikasi_kondisi}
          </Text>
          <Text style={style.headerBold}>4. Pihak Terkait</Text>
          <Text style={style.isi}>
            {props.data.document1.form && props.data.document1.form.pihak_terkait}
          </Text>
          <Text style={style.headerBold}>5. Jumlah Peserta Kegiatan</Text>
          <Text style={style.isi}>
            {props.data.document1.form && props.data.document1.form.jumlah_peserta}
          </Text>
          <Text style={style.headerBold}>6. Hasil Capaian/ Dampak setelah Pelaksanaan Program</Text>
          <Text style={style.isi}>
            {props.data.document1.form && props.data.document1.form.ketercapaian}
          </Text>
          <Text style={style.headerBold}>7. Kendala/Hambatan</Text>
          <Text style={style.isi}>
            {props.data.document1.form && props.data.document1.form.hambatan}
          </Text>
          <Text style={style.headerBoldBotFlex}>8. Dokumentasi</Text>
          <View style={style.isiFlex}>
            {props.data.document1.form &&
              props.data.document1.form.lampiran.dokumentasi
                .filter((media) => isFileImage(media) === true)
                .map((media, index) => {
                  return (
                    <View style={style.isiimage} wrap={false}>
                      <Image
                        style={style.images}
                        source={`http://api.simonev.revolusimental.go.id:8882${media.path}`}
                      />
                      <Text style={style.textimage}>
                        {media.filename.length > 40
                          ? `${media.filename.substr(0, 37)}...`
                          : media.filename}
                      </Text>
                    </View>
                  );
                })}
          </View>
          <View style={style.isi}>
            {props.data.document1.form &&
              props.data.document1.form.lampiran.dokumentasi
                .filter((media) => isFileImage(media) === false)
                .map((media, index) => {
                  return <Text style={style.text}>{media.filename}</Text>;
                })}
          </View>
        </View>

        {/*Footer*/}
        <View wrap={false}>
          <View style={style.footer}>
            <Text>
              Demikian laporan monitoring dan evaluasi{' '}
              {props.data.document1.form && props.data.document1.form.id_laporan} GNRM ini
              disampaikan,
            </Text>
            <Text>atas perhatian dan kerja samanya diucapkan terimakasih</Text>
          </View>

          <View style={style.signature} wrap={false}>
            <Text style={style.testStyle}>Pengesahan Laporan</Text>
            <Text style={style.testStyle}>Jakarta , {str2}</Text>
            <View style={style.width1}>
              <Text style={style.testStyle}>
                {props.data.document1.form && props.data.document1.form.penanggung_jawab.jabatan}
              </Text>
            </View>
            <Text style={style.ttd}>TTD</Text>
            <Text style={style.testStyle}>
              {props.data.document1.form && props.data.document1.form.penanggung_jawab.nama}
            </Text>
            <Text style={style.testStyle}>
              NIP. {props.data.document1.form && props.data.document1.form.penanggung_jawab.nip}
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: '8px',
            color: '#aaa',
            position: 'absolute',
            minHeight: '40px',
            bottom: '5px',
            right: '190px',
          }}
          render={({ pageNumber, totalPages }) => `Halaman ${pageNumber}`}
          fixed
        />

        <View style={style.footer2} fixed>
          <Image style={style.line2} source={line2} fixed />
          <Image style={style.logoFooter1} source={logo_footer} />
          <View style={style.notesFooter}>
            <Text>Waktu Unggah : {str}</Text>
            <Text>
              Dilarang menyalin, menyimpan, memperbanyak sebagian atau seluruh laporan ini dalam
              bentuk apapun kecuali oleh Koordinator Pelaksana Gerakan (KPG) dan Sektretariat
              Revolusi Mental
            </Text>
          </View>
          <Image style={style.logoFooter2} source={logo_footer} />
        </View>
      </Page>
    </Document>
  );
};

export default DownloadMonev;
