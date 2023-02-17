import React, { Component, Fragment, useState, useContext, useEffect } from 'react';
import './FormMonev.css';
import logo_kemenko from '../../assets/logo_kemenko.png';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import logo_footer from '../../assets/logo_link_terkait_1.png';
import images from '../../assets/image.png';
import imgFile from '../../assets/file.png';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import objectToFormData from '../../objectToFormDataUtil';
import { AuthContext } from '../../context/Auth/AuthContext';
import { ArtikelContext } from '../../context/Artikel/artikelContext';
import Scroll, { Element } from 'react-scroll';
import Popup from '../../component/Popup/Popup';
import Spinner from '../../component/Spinner/Spinner';
import plus2 from '../../assets/plus2.png';
import bg_1 from '../../assets/decoration/bg_1.png';
import bg_2 from '../../assets/decoration/bg_2.png';
import bg_3 from '../../assets/decoration/bg_3.png';
import bg_4 from '../../assets/decoration/bg_4.png';
import { LayoutContext } from '../../context/Layout/LayoutContext';
import { totalWordInSentenceCounter } from '../../utils/totalWordInSentenceCounter';

const FormMonev = (props) => {
  const {
    documentDetail,
    getDocumentDetail,
    resetDocument,
    isEditing,
    editDocument,
    editDocumentFalse,
    instansiDocumentDetail,
    isPreviewing,
    preview,
    loading,
    setLoadingFalse,
    setLoadingTrue,
  } = useContext(ArtikelContext);
  const { token, userDetail } = useContext(AuthContext);
  const { sidebar } = useContext(LayoutContext);
  const history = useHistory();
  const Link = Scroll.Link;
  const id = props.match.params.id;
  const type = 'monev';

  const [instansi, setInstansi] = useState('');
  const pilihanTahun = [];
  const todaysYear = new Date().getFullYear();
  for (let year = todaysYear; year >= 2020; year--) {
    pilihanTahun.push(year);
  }
  const pilihanPeriode = ['Jan-Mei', 'Jul-Nov'];

  const [instansiDetail, setInstansiDetail] = useState({});

  const nol = (i) => {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  };

  const mydate = new Date(Date.now());
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

  const [data, setData] = useState({
    tahun: '',
    id_laporan: '',
    periode: '',
    tujuan_pelaporan: '',
    identifikasi_kondisi: '',
    jumlah_peserta: '',
    evaluasi: '',
    hambatan: '',
    pihak_terkait: '',
    kegiatan: {
      nama_program: '',
    },
    kp: '',
    prop: '',
    sk_status: '',
    sk_no: '',
    sk_kendala: '',
    gerakan: '',
    waktu: '',
    tempat: '',
    metode: '',
    hasil: '',
    ketercapaian: '',
    tindak_lanjut: '',
    penanggung_jawab: {
      nama: '',
      jabatan: '',
      nip: '',
      instansi: '',
    },
    lokasi: '',
    deleted_media: [],
    deleted_berkas: [],
    deleted_tempat: [],
    deleted_hasil: [],
    deleted_ketercapaian: [],
    deleted_dokumentasi: [],
  });

  const {
    tahun,
    id_laporan,
    tujuan_pelaporan,
    kegiatan,
    nama_program,
    kp,
    prop,
    gerakan,
    waktu,
    tempat,
    metode,
    hasil,
    evaluasi,
    ketercapaian,
    tindak_lanjut,
    penanggung_jawab,
    nama,
    lokasi,
    jabatan,
    nip,
  } = data;

  const [media, setMedia] = useState([]);
  const [mediaUrl, setMediaUrl] = useState([]);

  const [berkas, setBerkas] = useState([]);
  const [berkasUrl, setBerkasUrl] = useState([]);

  const [lampiranTempat, setLampiranTempat] = useState([]);
  const [lampiranTempatUrl, setLampiranTempatUrl] = useState([]);

  const [dokumentasi, setDokumentasi] = useState([]);
  const [dokumentasiUrl, setDokumentasiUrl] = useState([]);

  const [lampiranHasil, setLampiranHasil] = useState([]);
  const [lampiranHasiliUrl, setLampiranHasilUrl] = useState([]);

  const [lampiranKetercapaian, setLampiranKetercapaian] = useState([]);
  const [lampiranKetercapaianUrl, setLampiranKetercapaianUrl] = useState([]);

  const [formGerakan, setFormGerakan] = useState([]);
  const [proyek, setProyek] = useState([]);
  const [kpOptions, setKpOptions] = useState([]);
  const [propOptions, setPropOptions] = useState([]);
  const [gerakanOptions, setGerakanOptions] = useState([]);
  const [selectedKp, setSelectedKp] = useState(false);
  const [selectedGerakan, setSelectedGerakan] = useState({});
  const [deletedMedia, setDeletedMedia] = useState([]);
  const [deletedBerkas, setDeletedBerkas] = useState([]);
  const [deletedLampiranTempat, setDeletedLampiranTempat] = useState([]);
  const [deletedLampiranHasil, setDeletedLampiranHasil] = useState([]);
  const [deletedLampiranKetercapaian, setDeletedLampiranKetercapaian] = useState([]);
  const [deletedDokumentasi, setDeletedDokumentasi] = useState([]);

  const [wordLength, setWordLength] = useState({
    identifikasi_kondisi: 0,
    ketercapaian: 0,
    hambatan: 0,
  });

  const addFormGerakan = (e) => {
    e.preventDefault();
    if (formGerakan.length < 4) {
      let forms = formGerakan.concat(['']);
      setFormGerakan(forms);
      documentDetail &&
        setSelectedGerakan({
          ...selectedGerakan,
          [`gerakan-${forms.length}`]: '',
        });
    }
  };

  const [skFile, setSKFile] = useState([]);
  const [skGambar, setSkGambar] = useState();
  const [skGambars, setSkGambars] = useState();

  const [tempatSize, setTempatSize] = useState();
  const [hasilSize, setHasilSize] = useState();
  const [ketercapaianSize, setKetercapaianSize] = useState();
  const [SKSize, setSKSize] = useState();

  useEffect(() => {
    let size = 0;
    for (let i = 0; i < lampiranTempat.length; i++) {
      size += lampiranTempat[i] && lampiranTempat[i].size;
    }
    setTempatSize(size);
  }, [lampiranTempat]);

  useEffect(() => {
    let size = 0;
    for (let i = 0; i < lampiranHasil.length; i++) {
      size += lampiranHasil[i] && lampiranHasil[i].size;
    }
    setHasilSize(size);
  }, [lampiranHasil]);

  useEffect(() => {
    let size = 0;
    for (let i = 0; i < dokumentasi.length; i++) {
      size += dokumentasi[i] && dokumentasi[i].size;
    }
    setHasilSize(size);
  }, [dokumentasi]);

  useEffect(() => {
    let size = 0;
    for (let i = 0; i < lampiranKetercapaian.length; i++) {
      size += lampiranKetercapaian[i] && lampiranKetercapaian[i].size;
    }
    setKetercapaianSize(size);
  }, [lampiranKetercapaian]);

  useEffect(() => {
    let size = 0;
    for (let i = 0; i < skFile.length; i++) {
      size += skFile[i] && skFile[i].size;
    }
    setSKSize(size);
  }, [skFile]);

  useEffect(() => {
    setData({ ...data, gerakan: Object.values(selectedGerakan).join(',') });
  }, [selectedGerakan]);

  const onChangeGerakan = (e) => {
    setSelectedGerakan({
      ...selectedGerakan,
      [e.target.name]: e.target.value,
    });
  };

  const onDeleteGerakanForm = (deleted) => {
    const deletedGerakan = Object.values(selectedGerakan).filter((deletedGerakan, index) => {
      if (index === deleted + 1) return deletedGerakan;
    });
    const gerakanArray = Object.values(selectedGerakan).filter(
      (selected) => selected !== deletedGerakan[0],
    );
    const gerakanObj = {};
    gerakanArray.forEach((gerakan, i) => {
      gerakanObj[`gerakan-${i}`] = gerakan;
    });
    setSelectedGerakan(gerakanObj);
    let forms = formGerakan;
    forms.pop();
    setFormGerakan(forms);
  };

  const onChangeButton = (e) => {
    return setData({ ...data, sk_status: true, sk_kendala: '' });
  };

  const onChangeButtonFalse = (e) => {
    return setData({ ...data, sk_status: false, sk_no: '' });
  };

  const onChangeSK = (e) => {
    return setData({ ...data, [e.target.name]: e.target.value });
  };

  const onChangeSKFile = (event) => {
    setSKFile([...event.target.files]);
    event.target.value = null;
  };

  const onChangeMedia = (event) => {
    setMedia([...media, ...event.target.files]);
    event.target.value = null;
  };

  const onChangeBerkas = (event) => {
    setBerkas([...berkas, ...event.target.files]);
    event.target.value = null;
  };

  const onChangeDokumentasi = (event) => {
    setDokumentasi([...dokumentasi, ...event.target.files]);
    event.target.value = null;
  };

  const onChangeFilesTempat = (event) => {
    setLampiranTempat([...lampiranTempat, ...event.target.files]);
    event.target.value = null;
  };

  const onChangeFilesHasil = (event) => {
    setLampiranHasil([...lampiranHasil, ...event.target.files]);
    event.target.value = null;
  };

  const onChangeFilesKetercapaian = (event) => {
    setLampiranKetercapaian([...lampiranKetercapaian, ...event.target.files]);
    event.target.value = null;
  };

  const onChange = (event, property) => {
    if (
      event.target.name === 'identifikasi_kondisi' ||
      event.target.name === 'ketercapaian' ||
      event.target.name === 'hambatan'
    )
      setWordLength({
        ...wordLength,
        [event.target.name]: totalWordInSentenceCounter(event.target.value),
      });

    if (event.target.name === 'kp') setSelectedKp(event.target.value);
    if (property)
      setData({
        ...data,
        [property]: {
          ...data[property],
          [event.target.name]: event.target.value,
        },
      });
    else
      setData({
        ...data,
        [event.target.name]: event.target.value,
      });
  };

  useEffect(() => {}, [wordLength]);
  // const cekEkstension = (ext) => {
  //     if(ext !== 'pdf' || ext !== 'jpeg' || ext !== 'jpg' || ext !== 'png'){
  //         alert('Anda memasukkan file dengan eksensi yang salah!')
  //     }
  // }

  const isFileImage = (file) => {
    return file && file['type'].split('/')[0] === 'image';
  };

  const isFileImageUrl = (url) => {
    url = url.split('?')[0];
    const parts = url.split('.');
    const extension = parts[parts.length - 1];
    const imageTypes = ['jpg', 'jpeg', 'tiff', 'png', 'gif', 'bmp', 'JPG', 'PNG', 'JPEG'];
    if (imageTypes.indexOf(extension) !== -1) {
      return true;
    } else return false;
  };

  const onSubmit = async (event) => {
    let error = false;

    for (let key in wordLength) {
      if (Number(wordLength[key]) < 50 || Number(wordLength[key]) > 1000) error = true;
    }

    if (error) {
      alert(
        'Jumlah kata harus lebih dari 50 dan kurang dari 1000 kata, harap perbaiki kembali laporan!',
      );
      event.preventDefault();
    } else {
      setLoadingTrue();
      event.preventDefault();

      const formData = objectToFormData(data);

      for (let i = 0; i < media.length; i++) {
        formData.append(`media`, media[i]);
      }

      for (let i = 0; i < berkas.length; i++) {
        formData.append(`berkas`, berkas[i]);
      }

      for (let i = 0; i < lampiranTempat.length; i++) {
        formData.append(`lampiran_tempat`, lampiranTempat[i]);
      }

      for (let i = 0; i < dokumentasi.length; i++) {
        formData.append(`dokumentasi`, dokumentasi[i]);
      }

      for (let i = 0; i < lampiranHasil.length; i++) {
        formData.append(`lampiran_hasil`, lampiranHasil[i]);
      }

      for (let i = 0; i < lampiranKetercapaian.length; i++) {
        formData.append(`lampiran_ketercapaian`, lampiranKetercapaian[i]);
      }

      for (let i = 0; i < skFile.length; i++) {
        formData.append(`sk`, skFile[i]);
      }

      // for (let pair of formData.entries()) {
      // 	console.log(pair[0] + ', ' + pair[1])
      // }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Auth-Token': `Bearer ${token}`,
        },
      };

      try {
        const res = await axios.post(
          'http://api.simonev.revolusimental.go.id:8882/api/v1/document?type=monev',
          formData,
          config,
        );
        alert(res.data.message);
        history.push(
          `/${
            userDetail && userDetail.role === 'owner' ? 'super-admin' : 'admin'
          }/rencana-dan-laporan?active=laporan-monev`,
        );
      } catch (err) {
        alert(err.response.data.message);
      }
      setLoadingFalse();
    }
  };

  const getFIleExtension = (filename) => {
    let ext = /^.+\.([^.]+)$/.exec(filename);
    return ext == null ? '' : ext[1];
  };

  const onEdit = async (event) => {
    let error = false;

    for (let key in wordLength) {
      if (wordLength[key] < 50 || wordLength[key] > 1000) error = true;
    }

    if (error) {
      alert(
        'Jumlah kata harus lebih dari 50 dan kurang dari 1000 kata, harap perbaiki kembali laporan!',
      );
      event.preventDefault();
    } else {
      setLoadingTrue();
      event.preventDefault();

      const formData = objectToFormData(data);

      if (berkas.length > 0) {
        for (let i = 0; i < berkas.length; i++) {
          formData.append(`berkas`, berkas[i]);
        }
      } else {
        formData.append('berkas', new File([null], 'blob'));
      }

      if (media.length > 0) {
        for (let i = 0; i < media.length; i++) {
          formData.append(`media`, media[i]);
        }
      } else {
        formData.append('media', new File([null], 'blob'));
      }

      if (lampiranTempat.length > 0) {
        for (let i = 0; i < lampiranTempat.length; i++) {
          formData.append(`lampiran_tempat`, lampiranTempat[i]);
        }
      } else {
        formData.append('lampiran_tempat', new File([null], 'blob'));
      }

      if (lampiranHasil.length > 0) {
        for (let i = 0; i < lampiranHasil.length; i++) {
          formData.append(`lampiran_hasil`, lampiranHasil[i]);
        }
      } else {
        formData.append('lampiran_hasil', new File([null], 'blob'));
      }

      if (dokumentasi.length > 0) {
        for (let i = 0; i < dokumentasi.length; i++) {
          formData.append(`dokumentasi`, dokumentasi[i]);
        }
      } else {
        formData.append('dokumentasi', new File([null], 'blob'));
      }

      if (lampiranKetercapaian.length > 0) {
        for (let i = 0; i < lampiranKetercapaian.length; i++) {
          formData.append(`lampiran_ketercapaian`, lampiranKetercapaian[i]);
        }
      } else {
        formData.append('lampiran_ketercapaian', new File([null], 'blob'));
      }

      if (skFile.length > 0) {
        formData.append(`sk`, skFile[0]);
      }

      // for (let pair of formData.entries()) {
      // 	console.log(pair[0] + ', ' + pair[1])
      // }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Auth-Token': `Bearer ${token}`,
        },
      };

      try {
        const res = await axios.put(
          `http://api.simonev.revolusimental.go.id:8882/api/v1/document/${props.match.params.id}?type=monev`,
          formData,
          config,
        );
        alert(res.data.message);
        history.push(
          `/${
            userDetail && userDetail.role === 'owner' ? 'super-admin' : 'admin'
          }/rencana-dan-laporan?active=laporan-monev`,
        );

        editDocumentFalse();
      } catch (err) {
        alert(err.response.data.message);
      }
      setLoadingFalse();
    }
  };

  const setPreview = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    preview();
  };

  const [skExtension, setSkExtension] = useState('');
  const [skFileUrl, setSkFileUrl] = useState([]);

  useEffect(() => {
    if (instansiDetail) {
      setData({
        ...data,
        sk_no: instansiDetail.sk && instansiDetail.sk.no,
        sk_status: instansiDetail.sk && instansiDetail.sk.status,
        sk_kendala: instansiDetail.sk && instansiDetail.sk.kendala,
      });

      const gambar = `http://api.simonev.revolusimental.go.id:8882${
        instansiDetail.sk && instansiDetail.sk.foto
      }`;
      setSkGambar(gambar);
      const fileExt = getFIleExtension(gambar);
      setSkExtension(fileExt);

      if (instansiDetail.sk && instansiDetail.sk.foto) {
        const mediaFileUrl = [
          `http://api.simonev.revolusimental.go.id:8882${
            instansiDetail.sk && instansiDetail.sk.foto
          }`,
        ];
        const files = [];
        mediaFileUrl.forEach((url) => {
          fetch(url)
            .then((res) => res.blob())
            .then((blob) => {
              const objectURL = URL.createObjectURL(blob);
              blob.name = getFileName(url);
              files.push(blob);
            });
        });

        // setSKFile(files)
        setSkFileUrl(mediaFileUrl);
      }
    }
  }, [instansiDetail]);

  // useEffect(() => {
  //     const mediaFileUrl = [`http://api.simonev.revolusimental.go.id:8882${instansiDetail.sk&&instansiDetail.sk.foto}`]
  //     const files = []
  //     mediaFileUrl.forEach(url => {
  //         fetch(url).then(res => res.blob()).then(blob => {
  //             const objectURL = URL.createObjectURL(blob)
  //             blob.name = getFileName(url)
  //             files.push(blob)
  //         })
  //     })

  //     setSKFile(files)
  //     setSkFileUrl(mediaFileUrl)
  // }, [data.sk_status])

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      const proyekData = await axios.get(
        'http://api.simonev.revolusimental.go.id:8882/api/v1/proyek',
      );

      const { proyek, gerakan } = proyekData.data;

      setProyek(proyek);
      setGerakanOptions(gerakan);
      setKpOptions(proyek.map((proyek) => proyek.kp));
    })();
  }, []);

  useEffect(() => {
    if (props.match.params.id) {
      resetDocument();
      editDocument();
      getDocumentDetail({ id, type });
      if (isPreviewing) {
        preview();
      }
    } else {
      editDocumentFalse();
    }
  }, [props.match.params.id]);

  useEffect(() => {
    const getInstansiDetail = async () => {
      setLoadingTrue();
      const config = {
        headers: {
          'X-Auth-Token': `Bearer ${token}`,
        },
      };
      try {
        if (props.match.params.id) {
          const res = await axios.get(
            `http://api.simonev.revolusimental.go.id:8882/api/v1/document/${props.match.params.id}?type=monev`,
            config,
          );
          setInstansiDetail(res.data.instansi);
        } else {
          const res = await axios.get(
            `http://api.simonev.revolusimental.go.id:8882/api/v1/instansi/${
              userDetail && userDetail.instansi._id
            }`,
            config,
          );
          setInstansiDetail(res.data.instansi);
        }
      } catch (err) {
        console.log(err);
      }
      setLoadingFalse();
    };
    getInstansiDetail();
  }, [userDetail, props.match.params.id]);

  useEffect(() => {
    const getProp = (kp) => {
      let kpIndex;
      proyek &&
        proyek.forEach((proyek, index) => {
          if (proyek.kp === kp) kpIndex = index;
        });
      return proyek[kpIndex] && proyek[kpIndex].prop;
    };

    if (selectedKp) setPropOptions(getProp(selectedKp));
  }, [selectedKp]);

  const getFileName = (url) => {
    const split = url.split('/');
    return split[split.length - 1];
  };

  useEffect(() => {
    if (documentDetail) {
      setData(documentDetail && documentDetail.form);
      setWordLength({
        identifikasi_kondisi: totalWordInSentenceCounter(
          documentDetail && documentDetail?.form.identifikasi_kondisi,
        ),
        hambatan: totalWordInSentenceCounter(documentDetail && documentDetail?.form.hambatan),
        ketercapaian: totalWordInSentenceCounter(
          documentDetail && documentDetail?.form.ketercapaian,
        ),
      });
      setInstansi(documentDetail.instansi);
      setMedia(documentDetail?.form.lampiran.media);
      setBerkas(documentDetail?.form.lampiran.berkas);
      setDokumentasi(documentDetail?.form.lampiran.dokumentasi);
      setLampiranTempat(documentDetail?.form.lampiran.tempat);
      setLampiranHasil(documentDetail?.form.lampiran.hasil);
      setLampiranKetercapaian(documentDetail?.form.lampiran.ketercapaian);
      setSelectedKp(documentDetail?.form.kp);

      const gerakanArray = documentDetail?.form.gerakan.split(',');
      const gerakanObj = {};

      gerakanArray.forEach((gerakan, i) => {
        gerakanObj[`gerakan-${i}`] = gerakan;
      });

      setSelectedGerakan(gerakanObj);
      setFormGerakan(new Array(gerakanArray.length - 1));

      const mediaFileUrl =
        documentDetail &&
        documentDetail?.form.lampiran.media.map(
          (media) => `http://api.simonev.revolusimental.go.id:8882${media.path}`,
        );
      const files = [];
      mediaFileUrl.forEach((url) => {
        fetch(url)
          .then((res) => res.blob())
          .then((blob) => {
            const objectURL = URL.createObjectURL(blob);
            blob.name = getFileName(url);
            files.push(blob);
          });
      });

      const mediaFileUrl2 =
        documentDetail &&
        documentDetail?.form.lampiran.berkas.map(
          (berkas) => `http://api.simonev.revolusimental.go.id:8882${berkas.path}`,
        );
      const files2 = [];
      mediaFileUrl2.forEach((url) => {
        fetch(url)
          .then((res) => res.blob())
          .then((blob) => {
            const objectURL = URL.createObjectURL(blob);
            blob.name = getFileName(url);
            files2.push(blob);
          });
      });

      const mediaFileUrl3 =
        documentDetail &&
        documentDetail?.form.lampiran.tempat.map(
          (tempat) => `http://api.simonev.revolusimental.go.id:8882${tempat.path}`,
        );
      const files3 = [];
      mediaFileUrl3.forEach((url) => {
        fetch(url)
          .then((res) => res.blob())
          .then((blob) => {
            const objectURL = URL.createObjectURL(blob);
            blob.name = getFileName(url);
            files3.push(blob);
          });
      });

      const mediaFileUrl4 =
        documentDetail &&
        documentDetail?.form.lampiran.hasil.map(
          (hasil) => `http://api.simonev.revolusimental.go.id:8882${hasil.path}`,
        );
      const files4 = [];
      mediaFileUrl4.forEach((url) => {
        fetch(url)
          .then((res) => res.blob())
          .then((blob) => {
            const objectURL = URL.createObjectURL(blob);
            blob.name = getFileName(url);
            files4.push(blob);
          });
      });

      const mediaFileUrl5 =
        documentDetail &&
        documentDetail?.form.lampiran.ketercapaian.map(
          (ketercapaian) => `http://api.simonev.revolusimental.go.id:8882${ketercapaian.path}`,
        );
      const files5 = [];
      mediaFileUrl5.forEach((url) => {
        fetch(url)
          .then((res) => res.blob())
          .then((blob) => {
            const objectURL = URL.createObjectURL(blob);
            blob.name = getFileName(url);
            files5.push(blob);
          });
      });

      const mediaFileUrl6 =
        documentDetail &&
        documentDetail?.form.lampiran.dokumentasi.map(
          (dokumentasi) => `http://api.simonev.revolusimental.go.id:8882${dokumentasi.path}`,
        );
      const files6 = [];
      mediaFileUrl6.forEach((url) => {
        fetch(url)
          .then((res) => res.blob())
          .then((blob) => {
            const objectURL = URL.createObjectURL(blob);
            blob.name = getFileName(url);
            files5.push(blob);
          });
      });

      setMedia(files);
      setBerkas(files2);
      setLampiranTempat(files3);
      setLampiranHasil(files4);
      setLampiranKetercapaian(files5);
      setDokumentasi(files6);

      setMediaUrl(mediaFileUrl);
      setBerkasUrl(mediaFileUrl2);
      setLampiranTempatUrl(mediaFileUrl3);
      setLampiranHasilUrl(mediaFileUrl4);
      setLampiranKetercapaianUrl(mediaFileUrl5);
      setDokumentasiUrl(mediaFileUrl6);
    }
  }, [documentDetail]);

  const onDeleteMedia = (isFile, filename, data) => {
    setMediaUrl(mediaUrl.filter((media) => getFileName(media) !== filename));
    if (isFile) setMedia(media.filter((media) => media !== data));
    else setMedia(media.filter((media) => media.name !== filename));
    const deleted = [...deletedMedia, filename];
    setDeletedMedia(deleted);
  };

  const onDeleteBerkas = (isFile, filename, data) => {
    setBerkasUrl(berkasUrl.filter((media) => getFileName(media) !== filename));
    if (isFile) setBerkas(berkas.filter((media) => media !== data));
    else setBerkas(berkas.filter((media) => media.name !== filename));
    const deleted = [...deletedBerkas, filename];
    setDeletedBerkas(deleted);
  };

  const onDeleteDokumentasi = (isFile, filename, data) => {
    setDokumentasiUrl(dokumentasiUrl.filter((media) => getFileName(media) !== filename));
    if (isFile) setDokumentasi(dokumentasi.filter((media) => media !== data));
    else setDokumentasi(dokumentasi.filter((media) => media.name !== filename));
    const deleted = [...deletedBerkas, filename];
    setDeletedDokumentasi(deleted);
  };

  const onDeleteTempat = (isFile, filename, data) => {
    setLampiranTempatUrl(lampiranTempatUrl.filter((media) => getFileName(media) !== filename));
    if (isFile) setLampiranTempat(lampiranTempat.filter((media) => media !== data));
    else setLampiranTempat(lampiranTempat.filter((media) => media.name !== filename));
    const deleted = [...deletedLampiranTempat, filename];
    setDeletedLampiranTempat(deleted);
  };

  const onDeleteHasil = (isFile, filename, data) => {
    setLampiranHasilUrl(lampiranHasiliUrl.filter((media) => getFileName(media) !== filename));
    if (isFile) setLampiranHasil(lampiranHasil.filter((media) => media !== data));
    else setLampiranHasil(lampiranHasil.filter((media) => media.name !== filename));
    const deleted = [...deletedLampiranHasil, filename];
    setDeletedLampiranHasil(deleted);
  };

  const onDeleteKetercapaian = (isFile, filename, data) => {
    setLampiranKetercapaianUrl(
      lampiranKetercapaianUrl.filter((media) => getFileName(media) !== filename),
    );
    if (isFile) setLampiranKetercapaian(lampiranKetercapaian.filter((media) => media !== data));
    else setLampiranKetercapaian(lampiranKetercapaian.filter((media) => media.name !== filename));
    const deleted = [...deletedLampiranKetercapaian, filename];
    setDeletedLampiranKetercapaian(deleted);
  };

  useEffect(() => {
    setData({
      ...data,
      deleted_media: deletedMedia,
      deleted_berkas: deletedBerkas,
      deleted_tempat: deletedLampiranTempat,
      deleted_hasil: deletedLampiranHasil,
      deleted_ketercapaian: deletedLampiranKetercapaian,
      deleted_dokumentasi: deletedDokumentasi,
    });
  }, [
    deletedMedia,
    deletedBerkas,
    deletedLampiranHasil,
    deletedLampiranTempat,
    deletedLampiranKetercapaian,
    deletedDokumentasi,
  ]);

  return (
    <Fragment>
      <SideBarOff setId={props.setId} />
      <div className="background-after-login">
        <img src={bg_1} alt="bg1" style={{ position: 'fixed', top: '0', left: '0' }} />
        <img src={bg_2} alt="bg2" style={{ position: 'fixed', top: '0', right: '0' }} />
        <img src={bg_3} alt="bg3" style={{ position: 'fixed', bottom: '-200px', left: '0' }} />
        <img src={bg_4} alt="bg4" style={{ position: 'fixed', bottom: '-50px', right: '0' }} />
      </div>
      <Popup notif={props.notif} />
      {/* -------------------------- FORM SECTION START HERE ---------------------------------*/}
      <div className={isPreviewing ? 'd-none' : 'form'}>
        <div className="tajuk-page">
          <h1> FORMULIR LAPORAN MONITORING DAN EVALUASI GNRM</h1>
        </div>
        {loading ? (
          <div style={{ marginLeft: '68px' }}>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                width: '100%',
                height: '60vh',
                overflow: 'hidden',
              }}
            >
              <Spinner />
            </div>
          </div>
        ) : (
          <div
            style={
              sidebar
                ? {
                    marginLeft: '188px',
                    transition: 'all 0.3s ease-in-out',
                  }
                : { transition: 'all 0.3s ease-in-out' }
            }
          >
            {!sidebar ? (
              <form
                style={{
                  width: 'fit-content',
                  height: 'fit-content',
                  margin: 'auto',
                }}
                id="form-monev"
                onSubmit={isEditing ? onEdit : onSubmit}
              >
                <Element id="identitas" name="identitas">
                  <div className="monev-container">
                    <div className="form-monev">
                      <div>
                        <label>Tahun</label>
                        {documentDetail && documentDetail?.form.tahun ? (
                          <select
                            onChange={(event) => onChange(event)}
                            className="gnrm-tahun"
                            name="tahun"
                          >
                            {pilihanTahun.map((tahun, i) => (
                              <option
                                key={i}
                                selected={documentDetail?.form.tahun === tahun && true}
                                title={tahun}
                                value={tahun}
                              >
                                {tahun}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <select
                            onChange={(event) => onChange(event)}
                            className="gnrm-tahun"
                            name="tahun"
                          >
                            <option selected={true} hidden></option>
                            {pilihanTahun.map((tahun, i) => (
                              <option key={i} title={tahun} value={tahun}>
                                {tahun}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      <div>
                        <label>Periode</label>
                        {documentDetail && documentDetail?.form.periode ? (
                          <select
                            onChange={(event) => onChange(event)}
                            className="monev-id-program"
                            name="periode"
                            style={{
                              marginLeft: '151px',
                            }}
                          >
                            {pilihanPeriode.map((periode, i) => (
                              <option
                                key={i}
                                selected={documentDetail?.form.periode === periode && true}
                                title={periode}
                                value={periode}
                              >
                                {periode}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <select
                            onChange={(event) => onChange(event)}
                            className="monev-id-laporan"
                            name="periode"
                            style={{
                              marginLeft: '151px',
                            }}
                          >
                            <option selected={true} hidden></option>
                            {pilihanPeriode.map((periode, i) => (
                              <option key={i} title={periode} value={periode}>
                                {periode}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      <div>
                        <label
                          style={{
                            textAlign: 'right',
                            clear: 'both',
                            float: 'left',
                          }}
                        >
                          Judul Kegiatan
                        </label>
                        <textarea
                          className="gnrm-nama-program"
                          style={{
                            height: '100px',
                            marginLeft: '95px',
                            width: '955px',
                          }}
                          type="text"
                          name="nama_program"
                          // placeholder='Tuliskan nama program sesuai dengan matriks pembangunan RPJMN 2020-2024/Renstra K/LD. '
                          value={kegiatan.nama_program ?? ''}
                          onChange={(event) => onChange(event, 'kegiatan')}
                        />
                      </div>
                      <Fragment>
                        <Fragment>
                          <div>
                            <label>Pemilihan 5 Gerakan</label>
                            {isEditing &&
                            documentDetail?.form.gerakan &&
                            Object.values(selectedGerakan).length > 0 ? (
                              <select
                                onChange={onChange}
                                className="gnrm-select"
                                name="gerakan-0"
                                style={{
                                  marginLeft: '44px',
                                }}
                              >
                                <option value={selectedGerakan['gerakan-0']} defaultValue>
                                  {selectedGerakan['gerakan-0']}
                                </option>
                                {gerakanOptions &&
                                  gerakanOptions.map((gerakan, i) => {
                                    let alreadySelected = false;
                                    Object.values(selectedGerakan).forEach((selected) => {
                                      if (gerakan === selected) alreadySelected = true;
                                    });
                                    return (
                                      <option
                                        key={i}
                                        value={gerakan}
                                        selected={
                                          gerakan === selectedGerakan['gerakan-0'] ? true : false
                                        }
                                        hidden={alreadySelected}
                                      >
                                        {gerakan}
                                      </option>
                                    );
                                  })}
                              </select>
                            ) : (
                              <select
                                onChange={onChangeGerakan}
                                className="gnrm-select"
                                name="gerakan-0"
                                style={{
                                  marginLeft: '44px',
                                }}
                              >
                                <option selected={true} hidden></option>
                                {gerakanOptions &&
                                  gerakanOptions.map((gerakan, i) => {
                                    let alreadySelected = false;
                                    Object.values(selectedGerakan).forEach((selected) => {
                                      if (gerakan === selected) alreadySelected = true;
                                    });
                                    return (
                                      <option key={i} value={gerakan} hidden={alreadySelected}>
                                        {gerakan}
                                      </option>
                                    );
                                  })}
                              </select>
                            )}
                          </div>
                          {isEditing &&
                          documentDetail?.form.gerakan &&
                          Object.values(selectedGerakan).length > 0
                            ? Object.values(selectedGerakan)
                                .filter((selected) => selected !== selectedGerakan['gerakan-0'])
                                .map((_, index) => {
                                  return (
                                    <div>
                                      <label>Pemilihan 5 Gerakan</label>
                                      <select
                                        onChange={onChangeGerakan}
                                        className="gnrm-select"
                                        name={`gerakan-${index + 1}`}
                                        style={{
                                          marginLeft: '44px',
                                        }}
                                      >
                                        <option
                                          value={_}
                                          defaultValue
                                          hidden={_ === '' ? true : false}
                                        >
                                          {_}
                                        </option>
                                        {gerakanOptions &&
                                          gerakanOptions.map((gerakan, i) => {
                                            let alreadySelected = false;
                                            Object.values(selectedGerakan).forEach((selected) => {
                                              if (gerakan === selected) alreadySelected = true;
                                            });
                                            return (
                                              <option
                                                key={i}
                                                value={gerakan}
                                                selected={
                                                  gerakan ===
                                                  selectedGerakan[`gerakan-${index + 1}`]
                                                }
                                                hidden={alreadySelected}
                                              >
                                                {gerakan}
                                              </option>
                                            );
                                          })}
                                      </select>
                                      <span
                                        className="remove-form"
                                        onClick={() => onDeleteGerakanForm(index)}
                                      >
                                        <i className=""> x </i>
                                      </span>
                                    </div>
                                  );
                                })
                            : formGerakan.map((form, index) => {
                                return (
                                  <div key={index}>
                                    <label>Pemilihan 5 Gerakan</label>
                                    <select
                                      onChange={onChangeGerakan}
                                      className="gnrm-select"
                                      name={`gerakan-${index + 1}`}
                                      style={{
                                        marginLeft: '44px',
                                      }}
                                    >
                                      <option selected={true} hidden></option>
                                      {gerakanOptions &&
                                        gerakanOptions.map((gerakan, i) => {
                                          let alreadySelected = false;
                                          Object.values(selectedGerakan).forEach((selected) => {
                                            if (gerakan === selected) alreadySelected = true;
                                          });
                                          return (
                                            <option
                                              key={i}
                                              value={gerakan}
                                              hidden={alreadySelected}
                                              selected={
                                                gerakan === selectedGerakan[`gerakan-${index + 1}`]
                                              }
                                            >
                                              {gerakan}
                                            </option>
                                          );
                                        })}
                                    </select>
                                    <span
                                      className="remove-form"
                                      onClick={() => onDeleteGerakanForm(index)}
                                    >
                                      <i className=""> x </i>
                                    </span>
                                  </div>
                                );
                              })}
                          {/* {formGerakan.length < 4 ? (
                            <div>
                              <label className="tambah-lembaga">Tambah Gerakan</label>
                              <img
                                src={plus2}
                                alt="plus"
                                style={{
                                  position: 'absolute',
                                  marginTop: '-3px',
                                  marginLeft: '20px',
                                  cursor: 'pointer',
                                }}
                                onClick={addFormGerakan}
                              />
                            </div>
                          ) : (
                            ''
                          )} */}
                        </Fragment>
                      </Fragment>
                      <div>
                        <label
                          style={{
                            textAlign: 'left',
                            clear: 'both',
                            float: 'left',
                            width: 200,
                          }}
                        >
                          Identifikasi Kondisi sebelum mental negative/ sebelum implementasi
                          program/ Kegiatan Aksi Nyata, Program yang sedang berjalan di K/L/D
                        </label>
                        <textarea
                          className="gnrm-nama-program"
                          style={{
                            height: '300px',
                            marginLeft: '10px',
                            width: '955px',
                          }}
                          type="text"
                          name="identifikasi_kondisi"
                          // placeholder='Tuliskan nama program sesuai dengan matriks pembangunan RPJMN 2020-2024/Renstra K/LD. '
                          value={data.identifikasi_kondisi ?? ''}
                          onChange={(event) => onChange(event)}
                        />
                      </div>
                      <div style={{ textAlign: 'right', paddingRight: 35 }}>
                        {wordLength.identifikasi_kondisi}/1000
                      </div>
                      <div>
                        <label>Pihak Terkait</label>
                        <input
                          className="gnrm-terkait"
                          style={{
                            height: '42px',
                            marginLeft: '102px',
                            width: '955px',
                          }}
                          type="text"
                          placeholder="Tuliskan semua pihak yang terlibat dalam pelaksanaan program K/L/D."
                          name="pihak_terkait"
                          value={data.pihak_terkait ?? ''}
                          onChange={(event) => onChange(event)}
                        />
                      </div>
                      <div>
                        <label>Jumlah Peserta Kegiatan</label>
                        <input
                          className="gnrm-terkait"
                          style={{
                            height: '42px',
                            marginLeft: '15px',
                            width: '955px',
                          }}
                          type="text"
                          placeholder="Tuliskan semua pihak yang terlibat dalam pelaksanaan program K/L/D."
                          name="jumlah_peserta"
                          value={data.jumlah_peserta ?? ''}
                          onChange={(event) => onChange(event)}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            textAlign: 'left',
                            clear: 'both',
                            float: 'left',
                            width: 200,
                          }}
                        >
                          Hasil Capaian/ Dampak setelah Pelaksanaan Program
                        </label>
                        <textarea
                          className="gnrm-nama-program"
                          style={{
                            height: '300px',
                            marginLeft: '10px',
                            width: '955px',
                          }}
                          type="text"
                          name="ketercapaian"
                          // placeholder='Tuliskan nama program sesuai dengan matriks pembangunan RPJMN 2020-2024/Renstra K/LD. '
                          value={data.ketercapaian}
                          onChange={(event) => onChange(event)}
                        />
                      </div>
                      <div style={{ textAlign: 'right', paddingRight: 35 }}>
                        {wordLength.ketercapaian}/1000
                      </div>

                      <div>
                        <label
                          style={{
                            textAlign: 'left',
                            clear: 'both',
                            float: 'left',
                            width: 200,
                          }}
                        >
                          Kendala/Hambatan
                        </label>
                        <textarea
                          className="gnrm-nama-program"
                          style={{
                            height: '300px',
                            marginLeft: '10px',
                            width: '955px',
                          }}
                          type="text"
                          name="hambatan"
                          // placeholder='Tuliskan nama program sesuai dengan matriks pembangunan RPJMN 2020-2024/Renstra K/LD. '
                          value={data.hambatan}
                          onChange={(event) => onChange(event)}
                        />
                      </div>
                      <div style={{ textAlign: 'right', paddingRight: 35 }}>
                        {wordLength.hambatan}/1000
                      </div>
                      <div style={{position: 'relative'}}>
                        <label>Dokumentasi</label>
                        <label
                          htmlFor="testing"
                          className="label_lampiran"
                          style={{ marginLeft: '100px' }}
                        >
                          <span style={{ marginRight: '5px' }}>+</span> PILIH BERKAS
                        </label>
                        <input
                          id="testing"
                          className="gnrm-penjelasan"
                          style={{
                            height: '42px',
                            marginLeft: '28px',
                            width: '955px',
                          }}
                          onChange={onChangeDokumentasi}
                          type="file"
                          accept=".jpg,.png,.jpeg , application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.presentationml.slideshow , text/plain, application/pdf"
                          name="media"
                          multiple
                        />
                        <h1 className="penjelasan_lampiran_doc">
                          (Ukuran maksimal berkas 25MB)
                        </h1>
                      </div>
                      <div>
                        {dokumentasi && dokumentasi.length > 0 ? (
                          <div
                            style={{
                              height: 'fit-content',
                              marginLeft: '208px',
                              width: '955px',
                              border: '1px solid #ACACAC',
                              borderRadius: '5px',
                              padding: '10px',
                              display: 'flex',
                              flexWrap: 'wrap',
                              overflow: 'hidden',
                            }}
                          >
                            {dokumentasi.map((lampiran, index) => {
                              const fileType = isFileImage(lampiran);
                              const objectURL = URL.createObjectURL(lampiran);
                              return (
                                <div key={index} style={{ marginBottom: '0px' }}>
                                  <div
                                    style={{
                                      width: '150px',
                                      height: '150px',
                                      marginRight: '35px',
                                      position: 'relative',
                                    }}
                                    className="d-flex align-items-center justify-content-center"
                                  >
                                    <div
                                      style={{
                                        width: '150px',
                                        height: '150px',
                                        overflow: 'hidden',
                                        position: 'absolute',
                                        top: 0,
                                      }}
                                    >
                                      {!fileType ? (
                                        <img
                                          src={imgFile}
                                          alt={lampiran.name}
                                          style={{
                                            width: '150px',
                                            height: '150px',
                                          }}
                                          className="gnrm-media--image"
                                        />
                                      ) : (
                                        <img
                                          src={objectURL}
                                          alt={lampiran.name}
                                          className="gnrm-media--image"
                                        />
                                      )}
                                    </div>
                                    <div
                                      style={{
                                        position: 'absolute',
                                        backgroundColor: '#C04B3E',
                                        width: '25px',
                                        height: '25px',
                                        borderRadius: '50%',
                                        top: '-7px',
                                        right: '-7px',
                                        lineHeight: '25px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        color: 'white',
                                      }}
                                      onClick={(e) =>
                                        onDeleteDokumentasi(true, lampiran.name, lampiran)
                                      }
                                    >
                                      {' '}
                                      X{' '}
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      marginTop: '10px',
                                      width: '150px',
                                      height: '20px',
                                      wordWrap: 'break-word',
                                      lineHeight: '20px',
                                      textAlign: 'center',
                                      marginBottom: '0px',
                                    }}
                                  >
                                    <p className="gnrm-media--name">
                                      {lampiran.name.length > 18
                                        ? `${lampiran.name.substr(0, 15)}...`
                                        : lampiran.name}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div
                            style={{
                              height: 'fit-content',
                              marginLeft: '208px',
                              width: '955px',
                              border: '1px solid #ACACAC',
                              borderRadius: '5px',
                              padding: '10px',
                              display: 'flex',
                              flexWrap: 'wrap',
                              overflow: 'hidden',
                            }}
                          >
                            {dokumentasi.map((url, index) => {
                              const fileType = isFileImageUrl(url);
                              // console.log(fileType)
                              return (
                                <div key={index} style={{ marginBottom: '0px' }}>
                                  <div
                                    style={{
                                      width: '150px',
                                      height: '150px',
                                      marginRight: '35px',
                                      position: 'relative',
                                    }}
                                    className="d-flex align-items-center justify-content-center"
                                  >
                                    <div
                                      style={{
                                        width: '150px',
                                        height: '150px',
                                        overflow: 'hidden',
                                        position: 'absolute',
                                        top: 0,
                                      }}
                                    >
                                      {!fileType ? (
                                        <img
                                          src={imgFile}
                                          alt={getFileName(url)}
                                          style={{
                                            width: '150px',
                                            height: '150px',
                                          }}
                                          className="gnrm-media--image"
                                        />
                                      ) : (
                                        <img
                                          src={url}
                                          alt={getFileName(url)}
                                          className="gnrm-media--image"
                                        />
                                      )}
                                    </div>
                                    <div
                                      style={{
                                        position: 'absolute',
                                        backgroundColor: '#C04B3E',
                                        width: '25px',
                                        height: '25px',
                                        borderRadius: '50%',
                                        top: '-7px',
                                        right: '-7px',
                                        lineHeight: '25px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        color: 'white',
                                      }}
                                      onClick={(e) => onDeleteDokumentasi(false, getFileName(url))}
                                    >
                                      {' '}
                                      X{' '}
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      marginTop: '10px',
                                      width: '150px',
                                      height: '20px',
                                      wordWrap: 'break-word',
                                      lineHeight: '20px',
                                      textAlign: 'center',
                                      marginBottom: '0px',
                                    }}
                                  >
                                    <p className="gnrm-media--name">{getFileName(url)}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="gnrm-navigation-button">
                      <Link
                        to="penanggung_jawab"
                        spy={true}
                        smooth={true}
                        duration={500}
                        offset={-30}
                      >
                        <button className="forward tes">
                          <i
                            className="material-icons"
                            style={{
                              fontSize: '36px',
                            }}
                          >
                            expand_more
                          </i>
                        </button>
                      </Link>
                    </div>
                  </div>
                </Element>

                <Element id="penanggung_jawab" name="penanggung_jawab">
                  <div className="monev-container" style={{ marginBottom: '296px' }}>
                    <div className="monev-title">PENANGGUNG JAWAB</div>
                    <div className="form-monev">
                      <div>
                        <label>Nama</label>
                        <input
                          className="monev-nama"
                          style={{
                            height: '42px',
                            width: '403px',
                            marginLeft: '164px',
                          }}
                          type="text"
                          name="nama"
                          value={penanggung_jawab.nama}
                          onChange={(event) => onChange(event, 'penanggung_jawab')}
                        />
                      </div>
                      <div>
                        <label>Jabatan</label>
                        <input
                          className="monev-jabatan"
                          style={{
                            height: '42px',
                            width: '403px',
                            marginLeft: '150px',
                          }}
                          type="text"
                          name="jabatan"
                          value={penanggung_jawab.jabatan}
                          onChange={(event) => onChange(event, 'penanggung_jawab')}
                        />
                      </div>
                      <div>
                        <label>NIP</label>
                        <input
                          className="monev-nip"
                          style={{
                            height: '42px',
                            width: '403px',
                            marginLeft: '184px',
                          }}
                          type="text"
                          name="nip"
                          value={penanggung_jawab.nip}
                          onChange={(event) => onChange(event, 'penanggung_jawab')}
                        />
                      </div>
                      <div>
                        <label>Instansi</label>
                        <input
                          className="monev-nip"
                          style={{
                            height: '42px',
                            width: '955px',
                            marginLeft: '149px',
                          }}
                          type="text"
                          name="instansi"
                          value={penanggung_jawab.instansi}
                          onChange={(event) => onChange(event, 'penanggung_jawab')}
                        />
                      </div>
                    </div>
                    <div className="monev-navigation-button" style={{ marginTop: '162px' }}>
                      <Link to="identitas" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="previous-last-1">
                          <i className="material-icons">expand_less</i>
                        </button>
                      </Link>

                      <button className="simpan-monev" type="submit">
                        SIMPAN PERUBAHAN
                      </button>

                      <button className="preview-monev" onClick={setPreview}>
                        PRATINJAU LAPORAN
                      </button>
                    </div>
                  </div>
                </Element>
              </form>
            ) : (
              <form
                style={{
                  width: 'fit-content',
                  height: 'fit-content',
                  margin: 'auto',
                }}
                id="form-monev"
                onSubmit={isEditing ? onEdit : onSubmit}
              >
                <Element id="identitas" name="identitas">
                  <div className="monev-container-off">
                    <div className="form-monev">
                      <div>
                        <label>Tahun</label>
                        {documentDetail && documentDetail?.form.tahun ? (
                          <select
                            onChange={(event) => onChange(event)}
                            className="gnrm-tahun"
                            name="tahun"
                          >
                            {pilihanTahun.map((tahun, i) => (
                              <option
                                key={i}
                                selected={documentDetail?.form.tahun === tahun && true}
                                title={tahun}
                                value={tahun}
                              >
                                {tahun}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <select
                            onChange={(event) => onChange(event)}
                            className="gnrm-tahun"
                            name="tahun"
                          >
                            <option selected={true} hidden></option>
                            {pilihanTahun.map((tahun, i) => (
                              <option key={i} title={tahun} value={tahun}>
                                {tahun}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      <div>
                        <label>Periode</label>
                        {documentDetail && documentDetail?.form.periode ? (
                          <select
                            onChange={(event) => onChange(event)}
                            className="monev-id-program"
                            name="periode"
                            style={{
                              marginLeft: '151px',
                            }}
                          >
                            {pilihanPeriode.map((periode, i) => (
                              <option
                                key={i}
                                selected={documentDetail?.form.periode === periode && true}
                                title={periode}
                                value={periode}
                              >
                                {periode}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <select
                            onChange={(event) => onChange(event)}
                            className="monev-id-laporan"
                            name="periode"
                            style={{
                              marginLeft: '151px',
                            }}
                          >
                            <option selected={true} hidden></option>
                            {pilihanPeriode.map((periode, i) => (
                              <option key={i} title={periode} value={periode}>
                                {periode}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      <div>
                        <label
                          style={{
                            textAlign: 'right',
                            clear: 'both',
                            float: 'left',
                          }}
                        >
                          Judul Kegiatan
                        </label>
                        <textarea
                          className="gnrm-nama-program"
                          style={{
                            height: '100px',
                            marginLeft: '95px',
                            width: '767px',
                          }}
                          type="text"
                          name="nama_program"
                          // placeholder='Tuliskan nama program sesuai dengan matriks pembangunan RPJMN 2020-2024/Renstra K/LD. '
                          value={kegiatan.nama_program}
                          onChange={(event) => onChange(event, 'kegiatan')}
                        />
                      </div>
                      <Fragment>
                        <Fragment>
                          <div>
                            <label>Pemilihan 5 Gerakan</label>
                            {isEditing &&
                            documentDetail?.form.gerakan &&
                            Object.values(selectedGerakan).length > 0 ? (
                              <select
                                onChange={onChange}
                                className="gnrm-select"
                                name="gerakan-0"
                                style={{
                                  marginLeft: '45px',
                                }}
                              >
                                <option value={selectedGerakan['gerakan-0']} defaultValue>
                                  {selectedGerakan['gerakan-0']}
                                </option>
                                {gerakanOptions &&
                                  gerakanOptions.map((gerakan, i) => {
                                    let alreadySelected = false;
                                    Object.values(selectedGerakan).forEach((selected) => {
                                      if (gerakan === selected) alreadySelected = true;
                                    });
                                    return (
                                      <option
                                        key={i}
                                        value={gerakan}
                                        selected={
                                          gerakan === selectedGerakan['gerakan-0'] ? true : false
                                        }
                                        hidden={alreadySelected}
                                      >
                                        {gerakan}
                                      </option>
                                    );
                                  })}
                              </select>
                            ) : (
                              <select
                                onChange={onChangeGerakan}
                                className="gnrm-select"
                                name="gerakan-0"
                                style={{
                                  marginLeft: '45px',
                                }}
                              >
                                <option selected={true} hidden></option>
                                {gerakanOptions &&
                                  gerakanOptions.map((gerakan, i) => {
                                    let alreadySelected = false;
                                    Object.values(selectedGerakan).forEach((selected) => {
                                      if (gerakan === selected) alreadySelected = true;
                                    });
                                    return (
                                      <option key={i} value={gerakan} hidden={alreadySelected}>
                                        {gerakan}
                                      </option>
                                    );
                                  })}
                              </select>
                            )}
                          </div>
                          {isEditing &&
                          documentDetail?.form.gerakan &&
                          Object.values(selectedGerakan).length > 0
                            ? Object.values(selectedGerakan)
                                .filter((selected) => selected !== selectedGerakan['gerakan-0'])
                                .map((_, index) => {
                                  return (
                                    <div>
                                      <label>Pemilihan 5 Gerakan</label>
                                      <select
                                        onChange={onChangeGerakan}
                                        className="gnrm-select"
                                        name={`gerakan-${index + 1}`}
                                        style={{
                                          marginLeft: '45px',
                                        }}
                                      >
                                        <option
                                          value={_}
                                          defaultValue
                                          hidden={_ === '' ? true : false}
                                        >
                                          {_}
                                        </option>
                                        {gerakanOptions &&
                                          gerakanOptions.map((gerakan, i) => {
                                            let alreadySelected = false;
                                            Object.values(selectedGerakan).forEach((selected) => {
                                              if (gerakan === selected) alreadySelected = true;
                                            });
                                            return (
                                              <option
                                                key={i}
                                                value={gerakan}
                                                selected={
                                                  gerakan ===
                                                  selectedGerakan[`gerakan-${index + 1}`]
                                                }
                                                hidden={alreadySelected}
                                              >
                                                {gerakan}
                                              </option>
                                            );
                                          })}
                                      </select>
                                      <span
                                        className="remove-form"
                                        onClick={() => onDeleteGerakanForm(index)}
                                      >
                                        <i className=""> x </i>
                                      </span>
                                    </div>
                                  );
                                })
                            : formGerakan.map((form, index) => {
                                return (
                                  <div key={index}>
                                    <label>Pemilihan 5 Gerakan</label>
                                    <select
                                      onChange={onChangeGerakan}
                                      className="gnrm-select"
                                      name={`gerakan-${index + 1}`}
                                      style={{
                                        marginLeft: '45px',
                                      }}
                                    >
                                      <option selected={true} hidden></option>
                                      {gerakanOptions &&
                                        gerakanOptions.map((gerakan, i) => {
                                          let alreadySelected = false;
                                          Object.values(selectedGerakan).forEach((selected) => {
                                            if (gerakan === selected) alreadySelected = true;
                                          });
                                          return (
                                            <option
                                              key={i}
                                              value={gerakan}
                                              hidden={alreadySelected}
                                              selected={
                                                gerakan === selectedGerakan[`gerakan-${index + 1}`]
                                              }
                                            >
                                              {gerakan}
                                            </option>
                                          );
                                        })}
                                    </select>
                                    <span
                                      className="remove-form"
                                      onClick={() => onDeleteGerakanForm(index)}
                                    >
                                      <i className=""> x </i>
                                    </span>
                                  </div>
                                );
                              })}
                          {/* {formGerakan.length < 4 ? (
                            <div>
                              <label className="tambah-lembaga">Tambah Gerakan</label>
                              <img
                                src={plus2}
                                alt="plus"
                                style={{
                                  position: 'absolute',
                                  marginTop: '-3px',
                                  marginLeft: '20px',
                                  cursor: 'pointer',
                                }}
                                onClick={addFormGerakan}
                              />
                            </div>
                          ) : (
                            ''
                          )} */}
                        </Fragment>
                      </Fragment>
                      <div>
                        <label
                          style={{
                            textAlign: 'left',
                            clear: 'both',
                            float: 'left',
                            width: 200,
                          }}
                        >
                          Identifikasi Kondisi sebelum mental negative/ sebelum implementasi
                          program/ Kegiatan Aksi Nyata, Program yang sedang berjalan di K/L/D
                        </label>
                        <textarea
                          className="gnrm-nama-program"
                          style={{
                            height: '300px',
                            marginLeft: '10px',
                            width: '767px',
                          }}
                          type="text"
                          name="identifikasi_kondisi"
                          // placeholder='Tuliskan nama program sesuai dengan matriks pembangunan RPJMN 2020-2024/Renstra K/LD. '
                          value={data.identifikasi_kondisi ?? ''}
                          onChange={(event) => onChange(event)}
                        />
                      </div>
                      <div style={{ textAlign: 'right', paddingRight: 35 }}>
                        {wordLength.identifikasi_kondisi}/1000
                      </div>

                      <div>
                        <label>Pihak Terkait</label>
                        <input
                          className="gnrm-terkait"
                          style={{
                            height: '42px',
                            marginLeft: '102px',
                            width: '767px',
                          }}
                          type="text"
                          placeholder="Tuliskan semua pihak yang terlibat dalam pelaksanaan program K/L/D."
                          name="pihak_terkait"
                          value={data.pihak_terkait ?? ''}
                          onChange={(event) => onChange(event)}
                        />
                      </div>
                      <div>
                        <label>Jumlah Peserta Kegiatan</label>
                        <input
                          className="gnrm-terkait"
                          style={{
                            height: '42px',
                            marginLeft: '15px',
                            width: '767px',
                          }}
                          type="text"
                          placeholder="Tuliskan semua pihak yang terlibat dalam pelaksanaan program K/L/D."
                          name="jumlah_peserta"
                          value={data.jumlah_peserta ?? ''}
                          onChange={(event) => onChange(event)}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            textAlign: 'left',
                            clear: 'both',
                            float: 'left',
                            width: 200,
                          }}
                        >
                          Hasil Capaian/ Dampak setelah Pelaksanaan Program
                        </label>
                        <textarea
                          className="gnrm-nama-program"
                          style={{
                            height: '300px',
                            marginLeft: '10px',
                            width: '767px',
                          }}
                          type="text"
                          name="ketercapaian"
                          // placeholder='Tuliskan nama program sesuai dengan matriks pembangunan RPJMN 2020-2024/Renstra K/LD. '
                          value={data.ketercapaian}
                          onChange={(event) => onChange(event)}
                        />
                      </div>
                      <div style={{ textAlign: 'right', paddingRight: 35 }}>
                        {wordLength.ketercapaian}/1000
                      </div>

                      <div>
                        <label
                          style={{
                            textAlign: 'left',
                            clear: 'both',
                            float: 'left',
                            width: 200,
                          }}
                        >
                          Kendala/Hambatan
                        </label>
                        <textarea
                          className="gnrm-nama-program"
                          style={{
                            height: '300px',
                            marginLeft: '10px',
                            width: '767px',
                          }}
                          type="text"
                          name="hambatan"
                          // placeholder='Tuliskan nama program sesuai dengan matriks pembangunan RPJMN 2020-2024/Renstra K/LD. '
                          value={data.hambatan}
                          onChange={(event) => onChange(event)}
                        />
                      </div>
                      <div style={{ textAlign: 'right', paddingRight: 35 }}>
                        {wordLength.hambatan}/1000
                      </div>
                      <div style={{position: 'relative'}}>
                        <label>Dokumentasi</label>
                        <label
                          htmlFor="testing"
                          className="label_lampiran"
                          style={{ marginLeft: '100px' }}
                        >
                          <span style={{ marginRight: '5px' }}>+</span> PILIH BERKAS
                        </label>
                        <input
                          id="testing"
                          className="gnrm-penjelasan"
                          style={{
                            height: '42px',
                            marginLeft: '28px',
                            width: '767px',
                          }}
                          onChange={onChangeDokumentasi}
                          type="file"
                          accept=".jpg,.png,.jpeg , application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.presentationml.slideshow , text/plain, application/pdf"
                          name="media"
                          multiple
                        />
                        <h1 className="penjelasan_lampiran_doc">
                          (Ukuran maksimal berkas 25MB)
                        </h1>
                      </div>

                      <div>
                        {dokumentasi && dokumentasi.length > 0 ? (
                          <div
                            style={{
                              height: 'fit-content',
                              marginLeft: '208px',
                              width: '767px',
                              border: '1px solid #ACACAC',
                              borderRadius: '5px',
                              padding: '10px',
                              display: 'flex',
                              flexWrap: 'wrap',
                              overflow: 'hidden',
                            }}
                          >
                            {dokumentasi.map((lampiran, index) => {
                              const fileType = isFileImage(lampiran);
                              const objectURL = URL.createObjectURL(lampiran);
                              return (
                                <div key={index} style={{ marginBottom: '0px' }}>
                                  <div
                                    style={{
                                      width: '150px',
                                      height: '150px',
                                      marginRight: '35px',
                                      position: 'relative',
                                    }}
                                    className="d-flex align-items-center justify-content-center"
                                  >
                                    <div
                                      style={{
                                        width: '150px',
                                        height: '150px',
                                        overflow: 'hidden',
                                        position: 'absolute',
                                        top: 0,
                                      }}
                                    >
                                      {!fileType ? (
                                        <img
                                          src={imgFile}
                                          alt={lampiran.name}
                                          style={{
                                            width: '150px',
                                            height: '150px',
                                          }}
                                          className="gnrm-media--image"
                                        />
                                      ) : (
                                        <img
                                          src={objectURL}
                                          alt={lampiran.name}
                                          className="gnrm-media--image"
                                        />
                                      )}
                                    </div>
                                    <div
                                      style={{
                                        position: 'absolute',
                                        backgroundColor: '#C04B3E',
                                        width: '25px',
                                        height: '25px',
                                        borderRadius: '50%',
                                        top: '-7px',
                                        right: '-7px',
                                        lineHeight: '25px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        color: 'white',
                                      }}
                                      onClick={(e) =>
                                        onDeleteDokumentasi(true, lampiran.name, lampiran)
                                      }
                                    >
                                      {' '}
                                      X{' '}
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      marginTop: '10px',
                                      width: '150px',
                                      height: '20px',
                                      wordWrap: 'break-word',
                                      lineHeight: '20px',
                                      textAlign: 'center',
                                      marginBottom: '0px',
                                    }}
                                  >
                                    <p className="gnrm-media--name">
                                      {lampiran.name.length > 18
                                        ? `${lampiran.name.substr(0, 15)}...`
                                        : lampiran.name}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div
                            style={{
                              height: 'fit-content',
                              marginLeft: '208px',
                              width: '767px',
                              border: '1px solid #ACACAC',
                              borderRadius: '5px',
                              padding: '10px',
                              display: 'flex',
                              flexWrap: 'wrap',
                              overflow: 'hidden',
                            }}
                          >
                            {dokumentasi.map((url, index) => {
                              const fileType = isFileImageUrl(url);
                              // console.log(fileType)
                              return (
                                <div key={index} style={{ marginBottom: '0px' }}>
                                  <div
                                    style={{
                                      width: '150px',
                                      height: '150px',
                                      marginRight: '35px',
                                      position: 'relative',
                                    }}
                                    className="d-flex align-items-center justify-content-center"
                                  >
                                    <div
                                      style={{
                                        width: '150px',
                                        height: '150px',
                                        overflow: 'hidden',
                                        position: 'absolute',
                                        top: 0,
                                      }}
                                    >
                                      {!fileType ? (
                                        <img
                                          src={imgFile}
                                          alt={getFileName(url)}
                                          style={{
                                            width: '150px',
                                            height: '150px',
                                          }}
                                          className="gnrm-media--image"
                                        />
                                      ) : (
                                        <img
                                          src={url}
                                          alt={getFileName(url)}
                                          className="gnrm-media--image"
                                        />
                                      )}
                                    </div>
                                    <div
                                      style={{
                                        position: 'absolute',
                                        backgroundColor: '#C04B3E',
                                        width: '25px',
                                        height: '25px',
                                        borderRadius: '50%',
                                        top: '-7px',
                                        right: '-7px',
                                        lineHeight: '25px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        color: 'white',
                                      }}
                                      onClick={(e) => onDeleteDokumentasi(false, getFileName(url))}
                                    >
                                      {' '}
                                      X{' '}
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      marginTop: '10px',
                                      width: '150px',
                                      height: '20px',
                                      wordWrap: 'break-word',
                                      lineHeight: '20px',
                                      textAlign: 'center',
                                      marginBottom: '0px',
                                    }}
                                  >
                                    <p className="gnrm-media--name">{getFileName(url)}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="gnrm-navigation-button">
                      <Link
                        to="penanggung_jawab"
                        spy={true}
                        smooth={true}
                        duration={500}
                        offset={-30}
                      >
                        <button className="forward tes1">
                          <i
                            className="material-icons"
                            style={{
                              fontSize: '36px',
                            }}
                          >
                            expand_more
                          </i>
                        </button>
                      </Link>
                    </div>
                  </div>
                </Element>

                <Element id="penanggung_jawab" name="penanggung_jawab">
                  <div className="monev-container-off" style={{ marginBottom: '296px' }}>
                    <div className="monev-title">PENANGGUNG JAWAB</div>
                    <div className="form-monev">
                      <div>
                        <label>Nama</label>
                        <input
                          className="monev-nama"
                          style={{
                            height: '42px',
                            width: '403px',
                            marginLeft: '164px',
                          }}
                          type="text"
                          name="nama"
                          value={penanggung_jawab.nama}
                          onChange={(event) => onChange(event, 'penanggung_jawab')}
                        />
                      </div>
                      <div>
                        <label>Jabatan</label>
                        <input
                          className="monev-jabatan"
                          style={{
                            height: '42px',
                            width: '403px',
                            marginLeft: '150px',
                          }}
                          type="text"
                          name="jabatan"
                          value={penanggung_jawab.jabatan}
                          onChange={(event) => onChange(event, 'penanggung_jawab')}
                        />
                      </div>
                      <div>
                        <label>NIP</label>
                        <input
                          className="monev-nip"
                          style={{
                            height: '42px',
                            width: '403px',
                            marginLeft: '184px',
                          }}
                          type="text"
                          name="nip"
                          value={penanggung_jawab.nip}
                          onChange={(event) => onChange(event, 'penanggung_jawab')}
                        />
                      </div>
                      <div>
                        <label>Instansi</label>
                        <input
                          className="monev-nip"
                          style={{
                            height: '42px',
                            width: '767px',
                            marginLeft: '149px',
                          }}
                          type="text"
                          name="instansi"
                          value={penanggung_jawab.instansi}
                          onChange={(event) => onChange(event, 'penanggung_jawab')}
                        />
                      </div>
                    </div>
                    <div className="monev-navigation-button" style={{ marginTop: '162px' }}>
                      <Link to="identitas" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="previous-last-11">
                          <i className="material-icons">expand_less</i>
                        </button>
                      </Link>

                      <button className="simpan-monev" type="submit">
                        SIMPAN PERUBAHAN
                      </button>

                      <button className="preview-monev" onClick={setPreview}>
                        PRATINJAU LAPORAN
                      </button>
                    </div>
                  </div>
                </Element>
              </form>
            )}
          </div>
        )}
      </div>
      {/* -------------------------- FORM SECTION END HERE ---------------------------------*/}

      {/* -------------------------- PREVIEW SECTION START HERE ---------------------------------*/}
      <div className={isPreviewing ? 'preview-page' : 'd-none'}>
        <div className="title-preview-page">PRATINJAU LAPORAN MONITORING DAN EVALUASI GNRM</div>
        {loading ? (
          <div style={{ marginLeft: '68px' }}>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                width: '100%',
                height: '60vh',
                overflow: 'hidden',
              }}
            >
              <Spinner />
            </div>
          </div>
        ) : (
          <div
            style={{
              width: 'fit-content',
              height: 'fit-content',
              margin: 'auto',
            }}
          >
            <div
              style={
                sidebar
                  ? {
                      marginLeft: '188px',
                      marginRight: '20px',
                      transition: 'all 0.3s ease-in-out',
                    }
                  : { transition: 'all 0.3s ease-in-out' }
              }
            >
              <div
                className="preview-picture"
                style={{
                  padding: '43px 98px',
                  marginLeft: '84px',
                  marginRight: '20px',
                  fontSize: '16px',
                }}
              >
                <div className="preview-header">
                  <table>
                    <thead>
                      <tr>
                        <th width="105px"></th>
                        <th width="800px"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {instansiDocumentDetail ? (
                        <tr
                          style={{
                            height: 'fit-content',
                          }}
                        >
                          <td
                            style={{
                              position: 'relative',
                              width: '105px',
                              textAlign: 'center',
                            }}
                          >
                            <img
                              src={`http://api.simonev.revolusimental.go.id:8882${
                                instansiDocumentDetail && instansiDocumentDetail.logo
                              }`}
                              style={{
                                maxWidth: '93%',
                                height: '100%',
                                position: 'absolute',
                                left: '0',
                                objectFit: 'contain',
                              }}
                            />
                          </td>
                          <td>
                            <h1
                              style={{
                                lineHeight: '16px',
                                fontWeight: 'bold',
                              }}
                            >
                              Gerakan Nasional Revolusi Mental
                            </h1>
                            <h1
                              style={{
                                lineHeight: '16px',
                                fontWeight: 'bold',
                              }}
                            >
                              {instansiDocumentDetail && instansiDocumentDetail.nama}
                            </h1>
                            <h1
                              style={{
                                lineHeight: '16px',
                                width: '750px',
                              }}
                            >
                              {instansiDocumentDetail && instansiDocumentDetail.alamat}
                              <br />
                              Telp {instansiDocumentDetail && instansiDocumentDetail.kontak}; Fax{' '}
                              {instansiDocumentDetail && instansiDocumentDetail.fax}
                              ; <br />
                              website : {instansiDocumentDetail && instansiDocumentDetail.website},
                              email: {instansiDocumentDetail && instansiDocumentDetail.email}
                            </h1>
                          </td>
                        </tr>
                      ) : (
                        <tr
                          style={{
                            height: 'fit-content',
                          }}
                        >
                          <td
                            style={{
                              position: 'relative',
                              width: '105px',
                              textAlign: 'center',
                            }}
                          >
                            <img
                              src={`http://api.simonev.revolusimental.go.id:8882${
                                instansiDetail && instansiDetail.logo
                              }`}
                              style={{
                                maxWidth: '93%',
                                height: '100%',
                                position: 'absolute',
                                objectFit: 'contain',
                                left: '0',
                              }}
                            />
                          </td>
                          <td>
                            <h1
                              style={{
                                lineHeight: '16px',
                                fontWeight: 'bold',
                              }}
                            >
                              Gerakan Nasional Revolusi Mental
                            </h1>
                            <h1
                              style={{
                                lineHeight: '16px',
                                fontWeight: 'bold',
                              }}
                            >
                              {instansiDetail && instansiDetail.nama}
                            </h1>
                            <h1
                              style={{
                                lineHeight: '16px',
                                width: '750px',
                              }}
                            >
                              {instansiDetail && instansiDetail.alamat}
                              <br />
                              Telp {instansiDetail && instansiDetail.kontak}; Fax{' '}
                              {instansiDetail && instansiDetail.fax}
                              ; <br />
                              website : {instansiDetail && instansiDetail.website}, email:{' '}
                              {instansiDetail && instansiDetail.email}
                            </h1>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <hr style={{ backgroundColor: 'black' }} />
                  <br />
                  <div
                    className="judul-preview"
                    style={{
                      textAlign: 'center',
                    }}
                  >
                    <h1
                      style={{
                        lineHeight: '25px',
                        fontWeight: 'bold',
                      }}
                    >
                      LAPORAN MONITORING DAN EVALUASI
                    </h1>
                    <h1
                      style={{
                        lineHeight: '25px',
                        fontWeight: 'bold',
                      }}
                    >
                      GERAKAN NASIONAL REVOLUSI MENTAL Tahun {data.tahun}
                    </h1>
                    <h1 style={{lineHeight: '25px'}}>Periode Laporan Program/Kegiatan: {data.periode === 'Jan-Mei' ? 'Januari-Mei' : 'Juli-November'}</h1>
                  </div>
                </div>

                <div
                  className="preview-body"
                  style={{
                    margin: '100px auto 0',
                    lineHeight: '16px',
                  }}
                >
                  <table>
                    <thead>
                      <tr>
                        <th width="54px"></th>
                        <th width="997px"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ fontWeight: 'bold', textAlign: 'justify' }}>
                        <td>1.</td>
                        <td>Judul Kegiatan</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td
                          style={{
                            paddingTop: '12px',
                            paddingBottom: '32px',
                            textAlign: 'justify',
                          }}
                        >
                          <pre>{data?.kegiatan?.nama_program ?? ''}</pre>
                        </td>
                      </tr>
                      <tr style={{ fontWeight: 'bold', textAlign: 'justify' }}>
                        <td>2.</td>
                        <td>Pemilihan 5 Gerakan</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td
                          style={{
                            paddingTop: '12px',
                            paddingBottom: '32px',
                            textAlign: 'justify',
                          }}
                        >
                          {data.gerakan ?? ''}
                        </td>
                      </tr>
                      <tr style={{ fontWeight: 'bold', textAlign: 'justify' }}>
                        <td>3.</td>
                        <td>
                          Identifikasi Kondisi sebelum mental negative/ sebelum implementasi
                          program/ Kegiatan Aksi Nyata, Program yang sedang berjalan di K/L/D
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td
                          style={{
                            paddingTop: '12px',
                            paddingBottom: '32px',
                            textAlign: 'justify',
                          }}
                        >
                          <pre>{data.identifikasi_kondisi ?? ''}</pre>
                        </td>
                      </tr>
                      <tr style={{ fontWeight: 'bold', textAlign: 'justify' }}>
                        <td>4.</td>
                        <td>Pihak Terkait</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td
                          style={{
                            paddingTop: '12px',
                            paddingBottom: '32px',
                            textAlign: 'justify',
                          }}
                        >
                          <pre>{data.pihak_terkait ?? ''}</pre>
                        </td>
                      </tr>
                      <tr style={{ fontWeight: 'bold', textAlign: 'justify' }}>
                        <td>5.</td>
                        <td>Jumlah Peserta Kegiatan</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td
                          style={{
                            paddingTop: '12px',
                            paddingBottom: '32px',
                            textAlign: 'justify',
                          }}
                        >
                          <pre>{data.jumlah_peserta ?? ''}</pre>
                        </td>
                      </tr>
                      <tr style={{ fontWeight: 'bold', textAlign: 'justify' }}>
                        <td>6.</td>
                        <td>Hasil Capaian/ Dampak setelah Pelaksanaan Program</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td
                          style={{
                            paddingTop: '12px',
                            paddingBottom: '32px',
                            textAlign: 'justify',
                          }}
                        >
                          <pre>{data.ketercapaian ?? ''}</pre>
                        </td>
                      </tr>
                      <tr style={{ fontWeight: 'bold', textAlign: 'justify' }}>
                        <td>7.</td>
                        <td>Kendala/Hambatan</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td
                          style={{
                            paddingTop: '12px',
                            paddingBottom: '32px',
                            textAlign: 'justify',
                          }}
                        >
                          <pre>{data.hambatan ?? ''}</pre>
                        </td>
                      </tr>
                      <tr style={{ fontWeight: 'bold', textAlign: 'justify' }}>
                        <td>8.</td>
                        <td>Dokumentasi</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td
                          style={{
                            paddingTop: '12px',
                            paddingBottom: '32px',
                            textAlign: 'justify',
                          }}
                        >
                          <div
                            style={{
                              height: 'fit-content',
                              width: '955px',
                              borderRadius: '5px',
                              padding: '10px',
                              display: 'flex',
                              flexWrap: 'wrap',
                              overflow: 'hidden',
                            }}
                          >
                            {dokumentasi &&
                              dokumentasi
                                .filter((lampiran) => isFileImage(lampiran) === true)
                                .map((lampiran, index) => {
                                  const objectURL = URL.createObjectURL(lampiran);
                                  return (
                                    <div key={index}>
                                      <div
                                        style={{
                                          width: '420px',
                                          height: '420px',
                                          marginRight: '35px',
                                          position: 'relative',
                                        }}
                                        className="d-flex align-items-center justify-content-center"
                                      >
                                        <div
                                          style={{
                                            width: '420px',
                                            height: '420px',
                                            overflow: 'hidden',
                                            position: 'relative',
                                          }}
                                        >
                                          <img
                                            src={objectURL}
                                            alt={lampiran.name}
                                            style={{
                                              width: '420px',
                                              height: '420px',
                                              objectFit: 'contain',
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <div
                                        style={{
                                          marginTop: '10px',
                                          width: '420px',
                                          height: '20px',
                                          wordWrap: 'break-word',
                                          lineHeight: '20px',
                                        }}
                                      >
                                        <p
                                          className="gnrm-media--name"
                                          style={{
                                            textAlign: 'center',
                                          }}
                                        >
                                          {lampiran.name.length > 40
                                            ? `${lampiran.name.substr(0, 37)}...`
                                            : lampiran.name}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td
                          style={{
                            paddingTop: '20px',
                          }}
                        >
                          Demikian laporan monitoring dan evaluasi {data.id_laporan} GNRM ini
                          disampaikan, <br />
                          atas perhatian dan kerja samanya diucapkan terimakasih.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div
                  className="preview-ttd"
                  style={{
                    marginTop: '10px',
                    textAlign: 'right',
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <h1 style={{ marginLeft: '840px' }}>Pengesahan Laporan</h1>
                    <h1 style={{ marginLeft: '840px' }}>Jakarta, {str2}</h1>
                    <h1 style={{ marginLeft: '840px' }}>{data.penanggung_jawab.jabatan}</h1>
                    <br />
                    <br />
                    <br />
                    <h1 style={{ marginLeft: '840px' }}>TTD</h1>
                    <br />
                    <br />
                    <br />
                    <h1 style={{ marginLeft: '840px' }}>{data.penanggung_jawab.nama}</h1>
                    <h1 style={{ marginLeft: '840px' }}>NIP. {data.penanggung_jawab.nip}</h1>
                  </div>
                </div>
                <hr
                  style={{
                    backgroundColor: 'black',
                    marginTop: '64px',
                  }}
                />
                <div className="preview-footer" style={{ marginBottom: '119px' }}>
                  <div style={{ textAlign: 'left' }}>
                    <img src={logo_footer} />
                  </div>
                  <div style={{ margin: '0px 30px' }}>
                    Waktu Unggah : {str}
                    <h1 style={{ marginTop: '10px' }}>
                      Dilarang menyalin, menyimpan, memperbanyak sebagian atau seluruh isi laporan
                      ini dalam bentuk <br /> apapun kecuali oleh Koordinator Pelaksana Gerakan
                      (KPG) dan Sekretariat Revolusi Mental
                    </h1>
                  </div>
                  <div className="spacer"></div>
                  <div style={{ textAlign: 'right' }}>
                    <img src={logo_footer} />
                  </div>
                </div>

                <button className="button-edit-kembali" onClick={setPreview}>
                  SUNTING KEMBALI
                </button>

                <button className="button-unggah" type="submit" form="form-monev">
                  UNGGAH LAPORAN
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* -------------------------- PREVIEW SECTION START HERE ---------------------------------*/}
    </Fragment>
  );
};

export default FormMonev;
