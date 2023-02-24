import React, { Fragment, useState, useContext, useEffect } from 'react';
import './FormGNRM.css';
import logo_kemenko from '../../assets/logo_kemenko.png';
import images from '../../assets/image.png';
import logo_footer from '../../assets/logo_link_terkait_1.png';
import SideBarOff from '../../component/SideBarOff/SideBarOff';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import objectToFormData from '../../objectToFormDataUtil';
import imgFile from '../../assets/file.png';
import { AuthContext } from '../../context/Auth/AuthContext';
import { ArtikelContext } from '../../context/Artikel/artikelContext';
import Scroll, { Element } from 'react-scroll';
import Popup from '../../component/Popup/Popup';
import plus2 from '../../assets/plus2.png';
import Spinner from '../../component/Spinner/Spinner';
import bg_1 from '../../assets/decoration/bg_1.png';
import bg_2 from '../../assets/decoration/bg_2.png';
import bg_3 from '../../assets/decoration/bg_3.png';
import bg_4 from '../../assets/decoration/bg_4.png';
import { LayoutContext } from '../../context/Layout/LayoutContext';
import { totalWordInSentenceCounter } from '../../utils/totalWordInSentenceCounter';

const FormGNRM = (props) => {
  const {
    documentDetail,
    getDocumentDetail,
    resetDocument,
    user,
    isEditing,
    instansiDocumentDetail,
    editDocumentFalse,
    editDocument,
    isPreviewing,
    preview,
    setLoadingTrue,
    setLoadingFalse,
    loading,
  } = useContext(ArtikelContext);
  const { userDetail, token } = useContext(AuthContext);
  const { sidebar } = useContext(LayoutContext);
  const Link = Scroll.Link;
  const history = useHistory();
  const [panjang, setPanjang] = useState(1);
  const id = props.match.params.id;
  const type = 'gnrm';

  const [instansiDetail, setInstansiDetail] = useState({});

  const [data, setData] = useState({
    tahun: '',
    id_program: '',
    periode: '',
    instansi: '',
    kp: '',
    prop: '',
    gerakan: '',
    sk_status: '',
    sk_no: '',
    sk_kendala: '',
    kegiatan: {
      nama_program: '',
      penjelasan_kegiatan: '',
    },
    output: {
      indikator_capaian: '',
      sasaran: '',
      target: '',
    },
    kondisi_awal: '',
    anggaran: {
      sumber_dana: '',
      besar_anggaran: '',
    },
    proses: '',
    pihak_terkait: {
      0: {
        lembaga: '',
        peran: '',
        penjelasan_pihak_terkait: '',
      },
    },
    penanggung_jawab: {
      nama: '',
      jabatan: '',
      nip: '',
      instansi: '',
    },
    lokasi: '',
    deleted_media: [],
    deleted_proses: [],
    deleted_kondisi: [],
  });

  const [wordLength, setWordLength] = useState({
    sk_kendala: 0,
    penjelasan_kegiatan: 0,
    indikator_capaian: 0,
    sasaran: 0,
    target: 0,
    kondisi_awal: 0,
  });

  const pilihanTahun = [];
  const todaysYear = new Date().getFullYear();
  for (let year = todaysYear; year >= 2020; year--) {
    pilihanTahun.push(year);
  }

  const pilihanPeriode = ['Jan-Mei', 'Jul-Nov'];
  const {
    tahun,
    id_program,
    instansi,
    kp,
    prop,
    gerakan,
    kegiatan,
    nama_program,
    penjelasan_kegiatan,
    output,
    indikator_capaian,
    sasaran,
    target,
    kondisi_awal,
    pihak_terkait,
    anggaran,
    sumber_dana,
    besar_anggaran,
    proses,
    penanggung_jawab,
    nama,
    lokasi,
    jabatan,
    nip,
  } = data;

  const [media, setMedia] = useState([]);
  const [mediaUrl, setMediaUrl] = useState([]);

  const [lampiranProses, setLampiranProses] = useState([]);
  const [lampiranProsesUrl, setLampiranProsesUrl] = useState([]);

  const [lampiranKondisi, setLampiranKondisi] = useState([]);
  const [lampiranKondisiUrl, setLampiranKondisiUrl] = useState([]);

  const [form, setForm] = useState([]);
  const [formGerakan, setFormGerakan] = useState([]);
  const [proyek, setProyek] = useState([]);
  const [kpOptions, setKpOptions] = useState([]);
  const [propOptions, setPropOptions] = useState([]);
  const [gerakanOptions, setGerakanOptions] = useState([]);
  const [selectedKp, setSelectedKp] = useState(false);
  const [selectedGerakan, setSelectedGerakan] = useState({});
  const [deletedMedia, setDeletedMedia] = useState([]);
  const [deletedLampiranProses, setDeletedLampiranProses] = useState([]);
  const [deletedLampiranKondisi, setDeletedLampiranKondisi] = useState([]);

  const [loadingDocument, setLoadingDocument] = useState(false);
  const [loadingDokumentasi, setLoadingDokumentasi] = useState(false);

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

  const setPreview = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    preview();
  };
  const addForm = (e) => {
    e.preventDefault();
    let forms = form.concat(['']);
    setForm(forms);
  };

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

  const [prosesSize, setProsesSize] = useState();
  const [kondisiSize, setKondisiSize] = useState();
  const [SKSize, setSKSize] = useState();

  useEffect(() => {
    let size = 0;
    for (let i = 0; i < lampiranProses.length; i++) {
      size += lampiranProses[i] && lampiranProses[i].size;
    }
    setProsesSize(size);
  }, [lampiranProses]);

  useEffect(() => {
    let size = 0;
    for (let i = 0; i < lampiranKondisi.length; i++) {
      size += lampiranKondisi[i] && lampiranKondisi[i].size;
    }
    setKondisiSize(size);
  }, [lampiranKondisi]);

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

  const [sk, setSk] = useState({
    sk_status: '',
    sk_no: '',
    sk_kendala: '',
  });

  const onChangeButton = (e) => {
    return setData({ ...data, sk_status: true });
  };

  const onChangeButtonFalse = (e) => {
    return setData({ ...data, sk_status: false, sk_no: '' });
  };

  const onChangeSK = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setWordLength({ ...wordLength, [e.target.name]: totalWordInSentenceCounter(e.target.value) });
  };

  const onChangeSKFile = (event) => {
    setSKFile([...event.target.files]);
    event.target.value = null;
  };

  const onChangeFiles = (event) => {
    setMedia([...media, ...event.target.files]);
    event.target.value = null;
  };

  const onChangeFilesProses = (event) => {
    setLampiranProses([...lampiranProses, ...event.target.files]);
    event.target.value = null;
  };

  const onChangeFilesKondisi = (event) => {
    setLampiranKondisi([...lampiranKondisi, ...event.target.files]);
    event.target.value = null;
  };

  const onChange = (event, property, array = false, index, isWordCount) => {
    if (isWordCount) {
      setWordLength({
        ...wordLength,
        [event.target.name]: !array
          ? totalWordInSentenceCounter(event.target.value)
          : {
              ...wordLength[event.target.name],
              [index]: totalWordInSentenceCounter(event.target.value),
            },
      });
    }

    if (event.target.name === 'kp') setSelectedKp(event.target.value);

    if (property)
      setData({
        ...data,
        [property]: array
          ? {
              ...data[property],
              [index]: {
                ...data[property][index],
                [event.target.name]: event.target.value,
              },
            }
          : {
              ...data[property],
              [event.target.name]: event.target.value,
            },
      });
    else setData({ ...data, [event.target.name]: event.target.value });
  };

  const onSubmitSK = async (event) => {
    setLoadingTrue();

    const formData = objectToFormData(sk);

    if (skFile.length > 0) {
      for (let i = 0; i < skFile.length; i++) {
        formData.append(`sk`, skFile[i]);
      }
    } else {
      formData.append('sk', new File([null], 'blob'));
    }

    // for (let pair of formData.entries()) {
    //     console.log(pair[0] + ', ' + pair[1])
    // }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Auth-Token': `Bearer ${token}`,
      },
    };
    const res = await axios.put(
      `http://api.simonev.revolusimental.go.id:8882/api/v1/instansi/${
        userDetail.instansi && userDetail.instansi._id
      }`,
      formData,
      config,
    );
    history.push(
      `/${
        userDetail && userDetail.role === 'owner' ? 'super-admin' : 'admin'
      }/rencana-dan-laporan?active=rencana-pelaksanaan-program`,
    );
    setLoadingFalse();
  };

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
    let errorAnggaran = false;

    for (let key in wordLength) {
      if (Number(wordLength[key]) < 50 || Number(wordLength[key]) > 1000) error = true;
    }

    if (data.anggaran.sumber_dana === '') errorAnggaran = true;
    if (data.anggaran.besar_anggaran === '') errorAnggaran = true;

    if (error) {
      alert(
        'Jumlah kata harus lebih dari 50 dan kurang dari 1000 kata. Harap perbaiki kembali perencanaan!',
      );
      event.preventDefault();
    } else if (errorAnggaran) {
      alert('Anggaran harus diisi, harap perbaiki kembali perencanaan!');
      event.preventDefault();
    } else {
      event.preventDefault();
      setLoadingTrue();
      const formData = objectToFormData(data);

      for (let i = 0; i < media.length; i++) {
        formData.append(`media`, media[i]);
      }
      for (let i = 0; i < lampiranProses.length; i++) {
        formData.append(`lampiran_proses`, lampiranProses[i]);
      }
      for (let i = 0; i < lampiranKondisi.length; i++) {
        formData.append(`lampiran_kondisi_awal`, lampiranKondisi[i]);
      }
      for (let i = 0; i < skFile.length; i++) {
        formData.append(`sk`, skFile[i]);
      }

      // for (let pair of formData.entries()) {
      //     console.log(pair[0] + ', ' + pair[1])
      // }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Auth-Token': `Bearer ${token}`,
        },
      };

      try {
        const res = await axios.post(
          'http://api.simonev.revolusimental.go.id:8882/api/v1/document?type=gnrm',
          formData,
          config,
        );
        history.push(
          `/${
            userDetail && userDetail.role === 'owner' ? 'super-admin' : 'admin'
          }/rencana-dan-laporan?active=rencana-pelaksanaan-program`,
        );
        alert(res.data.message);
        resetDocument();
        setLoadingFalse();
      } catch (err) {
        alert(err.response.data.message);
        setLoadingFalse();
      }
    }
  };

  const getFIleExtension = (filename) => {
    let ext = /^.+\.([^.]+)$/.exec(filename);
    return ext == null ? '' : ext[1];
  };

  const onEdit = async (event) => {
    let error = false;
    let errorAnggaran = false;

    for (let key in wordLength) {
      if (Number(wordLength[key]) < 50 || Number(wordLength[key]) > 1000) error = true;
    }

    if (data.anggaran.sumber_dana === '') errorAnggaran = true;
    if (data.anggaran.besar_anggaran === '') errorAnggaran = true;

    if (error) {
      alert(
        'Jumlah kata harus lebih dari 50 dan kurang dari 1000 kata. Harap perbaiki kembali perencanaan!',
      );
      event.preventDefault();
    } else if (errorAnggaran) {
      alert('Anggaran harus diisi, harap perbaiki kembali perencanaan!');
      event.preventDefault();
    } else {
      event.preventDefault();
      setLoadingTrue();

      const formData = objectToFormData(data);

      if (lampiranProses.length > 0) {
        for (let i = 0; i < lampiranProses.length; i++) {
          formData.append(`lampiran_proses`, lampiranProses[i]);
        }
      } else {
        formData.append('lampiran_proses', new File([null], 'blob'));
      }

      if (media.length > 0) {
        for (let i = 0; i < media.length; i++) {
          formData.append(`media`, media[i]);
        }
      } else {
        formData.append('media', new File([null], 'blob'));
      }

      if (lampiranKondisi.length > 0) {
        for (let i = 0; i < lampiranKondisi.length; i++) {
          formData.append(`lampiran_kondisi_awal`, lampiranKondisi[i]);
        }
      } else {
        formData.append('lampiran_kondisi_awal', new File([null], 'blob'));
      }

      if (skFile.length > 0) {
        formData.append(`sk`, skFile[0]);
      }

      // for (letaa pair of formData.entries()) {
      //     console.log(pair[0] + ', ' + pair[1])
      // }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Auth-Token': `Bearer ${token}`,
        },
      };

      try {
        const res = await axios.put(
          `http://api.simonev.revolusimental.go.id:8882/api/v1/document/${props.match.params.id}?type=gnrm`,
          formData,
          config,
        );
        history.push(
          `/${
            userDetail && userDetail.role === 'owner' ? 'super-admin' : 'admin'
          }/rencana-dan-laporan?active=rencana-pelaksanaan-program`,
        );
        alert(res.data.message);
        resetDocument();
        editDocumentFalse();
      } catch (err) {
        alert(err.response.data.message);
      }
      setLoadingFalse();
    }
  };

  useEffect(() => {
    (async () => {
      const proyekData = await axios.get(
        'http://api.simonev.revolusimental.go.id:8882/api/v1/proyek',
      );

      const { proyek, gerakan } = proyekData.data;

      setProyek(proyek);
      setGerakanOptions(gerakan);
      setKpOptions(proyek && proyek.map((proyek) => proyek.kp));
    })();
  }, []);

  useEffect(() => {
    if (props.match.params.id) {
      editDocument();
      setLoadingDocument(true);
      getDocumentDetail({ id, type });
      if (isPreviewing) {
        preview();
      }
      setLoadingDocument(false);
    } else {
      editDocumentFalse();
    }
  }, [props.match.params.id]);

  useEffect(() => {
    const getInstansiDetail = async () => {
      const config = {
        headers: {
          'X-Auth-Token': `Bearer ${token}`,
        },
      };
      try {
        if (props.match.params.id) {
          const res = await axios.get(
            `http://api.simonev.revolusimental.go.id:8882/api/v1/document/${props.match.params.id}?type=gnrm`,
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
    };
    getInstansiDetail();
  }, [userDetail, props.match.params.id]);

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

      setWordLength({
        ...wordLength,
        sk_kendala: instansiDetail?.sk && totalWordInSentenceCounter(instansiDetail?.sk?.kendala),
      });

      const gambar = `http://api.simonev.revolusimental.go.id:8882${
        instansiDetail.sk && instansiDetail.sk.foto
      }`;
      const fileExt = getFIleExtension(gambar);
      setSkGambar(gambar);
      setSkExtension(fileExt);
    }

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
  }, [instansiDetail]);

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
      setLoadingDokumentasi(true);
      setData(documentDetail && documentDetail.form);
      setMedia(documentDetail.form.lampiran.media);
      // setLampiranKondisi(documentDetail.form.lampiran.kondisi_awal);
      setLampiranProses(documentDetail.form.lampiran.proses);
      setPanjang(documentDetail && documentDetail.form.pihak_terkait.length);
      setSelectedKp(documentDetail.form.kp);
      setWordLength({
        ...wordLength,
        penjelasan_kegiatan: totalWordInSentenceCounter(
          documentDetail && documentDetail?.form.kegiatan.penjelasan_kegiatan,
        ),
        indikator_capaian: totalWordInSentenceCounter(
          documentDetail && documentDetail?.form.output.indikator_capaian,
        ),
        sasaran: totalWordInSentenceCounter(documentDetail && documentDetail?.form.output.sasaran),
        target: totalWordInSentenceCounter(documentDetail && documentDetail?.form.output.target),
        kondisi_awal: totalWordInSentenceCounter(
          documentDetail && documentDetail?.form.kondisi_awal,
        ),
      });

      const gerakanArray = documentDetail?.form.gerakan.split(',');
      const gerakanObj = {};

      gerakanArray.forEach((gerakan, i) => {
        gerakanObj[`gerakan-${i}`] = gerakan;
      });

      setSelectedGerakan(gerakanObj);
      setFormGerakan(new Array(gerakanArray.length - 1));

      const mediaFileUrl =
        documentDetail &&
        documentDetail.form.lampiran.media.map(
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
        documentDetail.form.lampiran.kondisi_awal.map(
          (kondisi_awal) => `http://api.simonev.revolusimental.go.id:8882${kondisi_awal.path}`,
        );
      const files2 = [];
      // mediaFileUrl2.forEach((url) => {
      //   fetch(url)
      //     .then((res) => res.blob())
      //     .then((blob) => {
      //       const objectURL = URL.createObjectURL(blob);
      //       blob.name = getFileName(url);
      //       files2.push(blob);
      //       setLoadingDokumentasi(false);
      //     });
      // });

      const readerPromises = mediaFileUrl2.map((url) => {
        return new Promise((resolve) => {
          fetch(url)
            .then((res) => res.blob())
            .then((blob) => {
              const objectURL = URL.createObjectURL(blob);
              blob.name = getFileName(url);
              resolve(blob);
            });
        });
      });

      Promise.all(readerPromises).then((results) => {
        setLampiranKondisi(results);
        setLoadingDokumentasi(false);
      });

      const mediaFileUrl3 =
        documentDetail &&
        documentDetail.form.lampiran.proses.map(
          (proses) => `http://api.simonev.revolusimental.go.id:8882${proses.path}`,
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

      setMedia(files);
      // setLampiranKondisi(files2);
      setLampiranProses(files3);
      setMediaUrl(mediaFileUrl);
      setLampiranKondisiUrl(mediaFileUrl2);
      setLampiranProsesUrl(mediaFileUrl3);
    }
  }, [documentDetail]);

  const onDeleteMedia = (isFile, filename, data) => {
    setMediaUrl(mediaUrl.filter((media) => getFileName(media) !== filename));
    if (isFile) setMedia(media.filter((media) => media !== data));
    else setMedia(media.filter((media) => media.name !== filename));
    const deleted = [...deletedMedia, filename];
    setDeletedMedia(deleted);
  };

  const onDeleteProses = (isFile, filename, data) => {
    setLampiranProsesUrl(lampiranProsesUrl.filter((media) => getFileName(media) !== filename));
    if (isFile) setLampiranProses(lampiranProses.filter((media) => media !== data));
    else setLampiranProses(lampiranProses.filter((media) => media.name !== filename));
    const deleted = [...deletedLampiranProses, filename];
    setDeletedLampiranProses(deleted);
  };

  const onDeleteKondisi = (isFile, filename, data) => {
    setLampiranKondisiUrl(lampiranKondisiUrl.filter((media) => getFileName(media) !== filename));
    if (isFile) setLampiranKondisi(lampiranKondisi.filter((media) => media !== data));
    else setLampiranKondisi(lampiranKondisi.filter((media) => media.name !== filename));
    const deleted = [...deletedLampiranKondisi, filename];
    setDeletedLampiranKondisi(deleted);
  };

  useEffect(() => {
    setData({
      ...data,
      deleted_media: deletedMedia,
      deleted_kondisi: deletedLampiranKondisi,
      deleted_proses: deletedLampiranProses,
    });
  }, [deletedMedia, deletedLampiranKondisi, deletedLampiranProses]);

  // const onChangeFilesSK = (e) => {
  //     setLampiranProses([...lampiranProses , ...event.target.files])
  //         event.target.value = null
  // }

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
          <h1> FORMULIR RENCANA PELAKSANAAN PROGRAM</h1>
        </div>

        {loading || loadingDocument || loadingDokumentasi ? (
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
                id="form-gnrm"
                onSubmit={isEditing ? onEdit : onSubmit}
              >
                <Element id="identitas" name="identitas">
                  <div className="gnrm-container">
                    <div className="form-gnrm">
                      <div>
                        <label>Tahun</label>
                        {documentDetail && documentDetail.form.tahun ? (
                          <select
                            onChange={(event) => onChange(event)}
                            className="gnrm-tahun"
                            name="tahun"
                          >
                            {pilihanTahun.map((tahun, i) => (
                              <option
                                key={i}
                                selected={documentDetail.form.tahun === tahun && true}
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
                        {documentDetail && documentDetail.form.periode ? (
                          <select
                            onChange={(event) => onChange(event)}
                            className="monev-id-program"
                            name="periode"
                            style={{
                              marginLeft: '150px',
                            }}
                          >
                            {pilihanPeriode.map((periode, i) => (
                              <option
                                key={i}
                                selected={documentDetail.form.periode === periode && true}
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
                              marginLeft: '150px',
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
                      {/* <div>
                                            <label>Instansi</label>
                                            <input 
                                                className="gnrm-instansi" 
                                                type="text" 
                                                name="instansi" 
                                                value={instansi}
                                                onChange={(event) => onChange(event)}    
                                            />
                                        </div> */}
                    </div>

                    <div className="gnrm-navigation-button">
                      <Link to="gugus_tugas" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="forward tes">
                          <i className="material-icons">expand_more</i>
                        </button>
                      </Link>
                    </div>
                  </div>
                </Element>

                <Element id="gugus_tugas" name="gugus_tugas">
                  <div className="gnrm-container">
                    <div className="gnrm-title">GUGUS TUGAS GNRM</div>
                    <div className="form-gnrm">
                      {isEditing ? (
                        <Fragment>
                          <div>
                            <label
                              style={{
                                textAlign: 'left',
                                clear: 'both',
                                float: 'left',
                              }}
                            >
                              Sudah Terbentuk <br /> Gugus Tugas?
                            </label>
                            <div
                              style={{
                                marginLeft: '210px',
                              }}
                            >
                              {data.sk_status ? (
                                <Fragment>
                                  <label
                                    htmlFor="sudah"
                                    className="label-radio"
                                    style={{
                                      marginRight: '65px',
                                    }}
                                  >
                                    Sudah
                                    <input
                                      type="radio"
                                      id="sudah"
                                      name="sk_status"
                                      className="input-radio"
                                      value={data.sk_status}
                                      checked={true}
                                      onChange={onChangeButton}
                                    />
                                    <span className="checked-radio"></span>
                                  </label>
                                  <label htmlFor="belum" className="label-radio">
                                    Belum
                                    <input
                                      type="radio"
                                      id="belum"
                                      name="sk_status"
                                      className="input-radio"
                                      value={data.sk_status}
                                      onChange={onChangeButtonFalse}
                                    />
                                    <span className="checked-radio"></span>
                                  </label>
                                </Fragment>
                              ) : (
                                <Fragment>
                                  <label
                                    htmlFor="sudah"
                                    className="label-radio"
                                    style={{
                                      marginRight: '65px',
                                    }}
                                  >
                                    Sudah
                                    <input
                                      type="radio"
                                      id="sudah"
                                      name="sk_status"
                                      className="input-radio"
                                      value={data.sk_status}
                                      onChange={onChangeButton}
                                    />
                                    <span className="checked-radio"></span>
                                  </label>
                                  <label htmlFor="belum" className="label-radio">
                                    Belum
                                    <input
                                      type="radio"
                                      id="belum"
                                      name="sk_status"
                                      className="input-radio"
                                      value={data.sk_status}
                                      checked={true}
                                      onChange={onChangeButtonFalse}
                                    />
                                    <span className="checked-radio"></span>
                                  </label>
                                </Fragment>
                              )}
                            </div>
                          </div>
                          {data.sk_status ? (
                            <Fragment>
                              <div>
                                <label>Input Nomor SK</label>
                                <input
                                  className="gnrm-sasaran"
                                  style={{
                                    height: '42px',
                                    marginLeft: '84px',
                                    width: '955px',
                                    fontWeight: '700',
                                  }}
                                  type="text"
                                  name="sk_no"
                                  placeholder="Tuliskan Nomor Surat Keterangan  (SK) pembentukan Gerakan Nasional Revolusi Mental (GNRM)"
                                  value={data.sk_no}
                                  onChange={onChangeSK}
                                  required
                                />
                              </div>
                              <div className="div_lampiran">
                                <label>Lampiran SK</label>
                                <label
                                  htmlFor="testing10"
                                  className="label_lampiran"
                                  style={{
                                    marginLeft: '110px',
                                  }}
                                >
                                  <span
                                    style={{
                                      marginRight: '5px',
                                    }}
                                  >
                                    +
                                  </span>{' '}
                                  UNGGAH DOKUMEN/FOTO
                                </label>
                                <input
                                  id="testing10"
                                  className="gnrm-penjelasan"
                                  style={{
                                    height: '42px',
                                    marginLeft: '30px',
                                    width: '955px',
                                  }}
                                  onChange={onChangeSKFile}
                                  type="file"
                                  accept=".jpg,.png,.jpeg , application/pdf"
                                  name="media"
                                />
                                <h1 className="penjelasan_lampiran_doc">
                                  (Ukuran maksimal berkas 25MB)
                                </h1>
                              </div>
                              <div>
                                {skFile && skFile.length > 0 ? (
                                  <div
                                    style={{
                                      height: 'fit-content',
                                      marginLeft: '210px',
                                      width: '955px',
                                      border: '1px solid #ACACAC',
                                      borderRadius: '5px',
                                      padding: '10px',
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                    }}
                                  >
                                    {skFile.map((lampiran, index) => {
                                      const fileExt = getFIleExtension(lampiran.name);
                                      const objectURL = URL.createObjectURL(lampiran);
                                      // cekEkstension(fileExt)
                                      return (
                                        <div key={index}>
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
                                              }}
                                            >
                                              {fileExt === 'pdf' ? (
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
                                          </div>
                                          <div
                                            style={{
                                              marginTop: '10px',
                                              width: '150px',
                                              height: '20px',
                                              wordWrap: 'break-word',
                                              lineHeight: '20px',
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
                                      marginLeft: '210px',
                                      width: '955px',
                                      border: '1px solid #ACACAC',
                                      borderRadius: '5px',
                                      padding: '10px',
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                    }}
                                  >
                                    {skFileUrl.map((url, index) => {
                                      const fileExt = getFIleExtension(getFileName(url));
                                      // cekEkstension(fileExt)
                                      return (
                                        <div key={index}>
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
                                              }}
                                            >
                                              {fileExt === 'pdf'.toLowerCase() ? (
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
                                          </div>
                                          <div
                                            style={{
                                              marginTop: '10px',
                                              width: '150px',
                                              height: '20px',
                                              wordWrap: 'break-word',
                                              lineHeight: '20px',
                                            }}
                                          >
                                            <p className="gnrm-media--name">
                                              {getFileName(url).length > 18
                                                ? `${getFileName(url).substr(0, 15)}...`
                                                : getFileName(url)}
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                              <div>
                                {SKSize > 26214400 ? (
                                  <div
                                    style={{
                                      marginLeft: '217px',
                                      color: 'red',
                                    }}
                                  >
                                    Ukuran berkas melebihi ukuran maksimal (25MB)!
                                  </div>
                                ) : (
                                  ''
                                )}
                              </div>
                            </Fragment>
                          ) : (
                            <>
                              <div>
                                <label
                                  style={{
                                    textAlign: 'right',
                                    clear: 'both',
                                    float: 'left',
                                  }}
                                >
                                  Kendala
                                </label>
                                <textarea
                                  className="gnrm-nama-program"
                                  style={{
                                    height: '300px',
                                    marginLeft: '140px',
                                    width: '955px',
                                  }}
                                  type="text"
                                  name="sk_kendala"
                                  value={data.sk_kendala}
                                  onChange={onChangeSK}
                                />
                              </div>
                              <div style={{ textAlign: 'right', paddingRight: 35 }}>
                                {wordLength.sk_kendala}/1000
                              </div>
                            </>
                          )}
                        </Fragment>
                      ) : (
                        <Fragment>
                          {instansiDetail.sk && instansiDetail.sk.status ? (
                            <Fragment>
                              <div>
                                <label
                                  style={{
                                    textAlign: 'left',
                                    clear: 'both',
                                    float: 'left',
                                  }}
                                >
                                  Input Nomor SK
                                </label>
                                <div
                                  className="gnrm-sasaran"
                                  style={{
                                    height: '42px',
                                    marginLeft: '230px',
                                    fontWeight: '700',
                                  }}
                                >
                                  {data.sk_no}
                                </div>
                              </div>
                              <div>
                                <label
                                  style={{
                                    textAlign: 'left',
                                    clear: 'both',
                                    float: 'left',
                                  }}
                                >
                                  Lampiran Berkas
                                </label>
                                <div
                                  style={{
                                    width: 'fit-content',
                                    height: 'fit-content',
                                    marginLeft: '230px',
                                  }}
                                >
                                  {skExtension === 'pdf' ? (
                                    ''
                                  ) : (
                                    <Fragment>
                                      <img
                                        src={skGambar}
                                        alt={getFileName(
                                          instansiDetail.sk && instansiDetail.sk.foto,
                                        )}
                                        style={{
                                          width: '500px',
                                          height: 'auto',
                                        }}
                                      />
                                      <br />
                                    </Fragment>
                                  )}
                                  <div
                                    className="gnrm-sasaran"
                                    style={{
                                      height: '42px',
                                      width: '955px',
                                      fontWeight: '700',
                                    }}
                                  >
                                    {getFileName(instansiDetail.sk && instansiDetail.sk.foto)}
                                  </div>
                                </div>
                              </div>
                            </Fragment>
                          ) : (
                            <Fragment>
                              <div>
                                <label
                                  style={{
                                    textAlign: 'left',
                                    clear: 'both',
                                    float: 'left',
                                  }}
                                >
                                  Sudah Terbentuk <br /> Gugus Tugas?
                                </label>
                                <div
                                  style={{
                                    marginLeft: '210px',
                                  }}
                                >
                                  {data.sk_status ? (
                                    <Fragment>
                                      <label
                                        htmlFor="sudah"
                                        className="label-radio"
                                        style={{
                                          marginRight: '65px',
                                        }}
                                      >
                                        Sudah
                                        <input
                                          type="radio"
                                          id="sudah"
                                          name="sk_status"
                                          className="input-radio"
                                          value={data.sk_status}
                                          checked={true}
                                          onChange={onChangeButton}
                                        />
                                        <span className="checked-radio"></span>
                                      </label>
                                      <label htmlFor="belum" className="label-radio">
                                        Belum
                                        <input
                                          type="radio"
                                          id="belum"
                                          name="sk_status"
                                          className="input-radio"
                                          value={data.sk_status}
                                          onChange={onChangeButtonFalse}
                                        />
                                        <span className="checked-radio"></span>
                                      </label>
                                    </Fragment>
                                  ) : (
                                    <Fragment>
                                      <label
                                        htmlFor="sudah"
                                        className="label-radio"
                                        style={{
                                          marginRight: '65px',
                                        }}
                                      >
                                        Sudah
                                        <input
                                          type="radio"
                                          id="sudah"
                                          name="sk_status"
                                          className="input-radio"
                                          value={data.sk_status}
                                          onChange={onChangeButton}
                                        />
                                        <span className="checked-radio"></span>
                                      </label>
                                      <label htmlFor="belum" className="label-radio">
                                        Belum
                                        <input
                                          type="radio"
                                          id="belum"
                                          name="sk_status"
                                          className="input-radio"
                                          value={data.sk_status}
                                          checked={true}
                                          onChange={onChangeButtonFalse}
                                        />
                                        <span className="checked-radio"></span>
                                      </label>
                                    </Fragment>
                                  )}
                                </div>
                              </div>
                              {data.sk_status ? (
                                <Fragment>
                                  <div>
                                    <label>Input Nomor SK</label>
                                    <input
                                      className="gnrm-sasaran"
                                      style={{
                                        height: '42px',
                                        marginLeft: '84px',
                                        width: '955px',
                                        fontWeight: '700',
                                      }}
                                      type="text"
                                      name="sk_no"
                                      placeholder="Tuliskan Nomor Surat Keterangan  (SK) pembentukan Gerakan Nasional Revolusi Mental (GNRM)"
                                      value={data.sk_no}
                                      onChange={onChangeSK}
                                      required
                                    />
                                  </div>
                                  <div className="div_lampiran">
                                    <label>Lampiran SK</label>
                                    <label
                                      htmlFor="testing10"
                                      className="label_lampiran"
                                      style={{
                                        marginLeft: '110px',
                                      }}
                                    >
                                      <span
                                        style={{
                                          marginRight: '5px',
                                        }}
                                      >
                                        +
                                      </span>{' '}
                                      UNGGAH DOKUMEN/FOTO
                                    </label>
                                    <input
                                      id="testing10"
                                      className="gnrm-penjelasan"
                                      style={{
                                        height: '42px',
                                        marginLeft: '30px',
                                        width: '955px',
                                      }}
                                      onChange={onChangeSKFile}
                                      type="file"
                                      accept=".jpg,.png,.jpeg , application/pdf"
                                      name="media"
                                    />
                                    <h1 className="penjelasan_lampiran_doc">
                                      (Ukuran maksimal berkas 25MB)
                                    </h1>
                                  </div>
                                  <div>
                                    <div
                                      style={{
                                        height: 'fit-content',
                                        marginLeft: '210px',
                                        width: '955px',
                                        border: '1px solid #ACACAC',
                                        borderRadius: '5px',
                                        padding: '10px',
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                      }}
                                    >
                                      {skFile.map((lampiran, index) => {
                                        const fileExt = getFIleExtension(lampiran.name);
                                        const objectURL = URL.createObjectURL(lampiran);
                                        // cekEkstension(fileExt)
                                        return (
                                          <div key={index}>
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
                                                }}
                                              >
                                                {fileExt === 'pdf' ? (
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
                                            </div>
                                            <div
                                              style={{
                                                marginTop: '10px',
                                                width: '150px',
                                                height: '20px',
                                                wordWrap: 'break-word',
                                                lineHeight: '20px',
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
                                  </div>
                                  <div>
                                    {SKSize > 26214400 ? (
                                      <div
                                        style={{
                                          marginLeft: '217px',
                                          color: 'red',
                                        }}
                                      >
                                        Ukuran berkas melebihi ukuran maksimal (25MB)!
                                      </div>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                </Fragment>
                              ) : (
                                <>
                                  <div>
                                    <label
                                      style={{
                                        textAlign: 'right',
                                        clear: 'both',
                                        float: 'left',
                                      }}
                                    >
                                      Kendala
                                    </label>
                                    <textarea
                                      className="gnrm-nama-program"
                                      style={{
                                        height: '300px',
                                        marginLeft: '140px',
                                        width: '955px',
                                      }}
                                      type="text"
                                      name="sk_kendala"
                                      value={data.sk_kendala}
                                      onChange={onChangeSK}
                                    />
                                  </div>
                                  <div style={{ textAlign: 'right', paddingRight: 35 }}>
                                    {wordLength.sk_kendala}/1000
                                  </div>
                                </>
                              )}
                            </Fragment>
                          )}
                        </Fragment>
                      )}
                    </div>

                    <div className="gnrm-navigation-button">
                      <Link to="identitas" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="previous">
                          <i className="material-icons">expand_less</i>
                        </button>
                      </Link>
                      <Link to="kegiatan" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="forward">
                          <i className="material-icons">expand_more</i>
                        </button>
                      </Link>
                    </div>
                  </div>
                </Element>

                <Element id="kegiatan" name="kegiatan">
                  <div className="gnrm-container">
                    <div className="gnrm-title">KEGIATAN</div>
                    <div className="form-gnrm">
                      <div>
                        <label>Nama Program</label>
                        <input
                          className="gnrm-nama-program"
                          style={{
                            height: '42px',
                            marginLeft: '93px',
                            width: '955px',
                          }}
                          type="text"
                          name="nama_program"
                          // placeholder='Tuliskan nama kegiatan sesuai dengan matriks pembangunan RPJMN 2020-2024/Renstra K/LD. '
                          value={kegiatan.nama_program}
                          onChange={(event) => onChange(event, 'kegiatan')}
                        />
                      </div>
                      <Fragment>
                        {/* <div>
                          <label>Kegiatan Prioritas</label>
                          {documentDetail && documentDetail.form.kp ? (
                            <select
                              onChange={onChange}
                              className="gnrm-select"
                              name="kp"
                              style={{
                                marginLeft: '70px',
                                width: '955px',
                                height: '42px',
                              }}
                            >
                              {kpOptions &&
                                kpOptions.map((kp, i) => (
                                  <option
                                    key={i}
                                    selected={documentDetail.form.kp === kp && true}
                                    title={kp}
                                    value={kp}
                                  >
                                    {kp.length > 113 ? `${kp.substr(0, 110)}...` : kp}
                                  </option>
                                ))}
                            </select>
                          ) : (
                            <select
                              onChange={onChange}
                              className={
                                kp === '' ? 'gnrm-select test-select1' : 'gnrm-select test-select2'
                              }
                              name="kp"
                              style={{
                                marginLeft: '70px',
                                width: '955px',
                                height: '42px',
                              }}
                            >
                              <option selected={true} hidden>
                                Tuliskan Kegiatan Prioritas (KP) sesuai dengan program/kegiatan
                                Kementerian/Lembaga/Daerah sesuai RPJMN 2020-2024
                              </option>
                              {kpOptions &&
                                kpOptions.map((kp, i) => (
                                  <option key={i} title={kp} value={kp}>
                                    {kp.length > 113 ? `${kp.substr(0, 110)}...` : kp}
                                  </option>
                                ))}
                            </select>
                          )}
                        </div>
                        <div>
                          <label>Proyek Prioritas</label>
                          {documentDetail && selectedKp && propOptions ? (
                            <select
                              onChange={onChange}
                              className="gnrm-select selectpicker"
                              name="prop"
                              style={{
                                marginLeft: '85px',
                                width: '955px',
                              }}
                            >
                              {propOptions &&
                                propOptions.map((prop, i) => (
                                  <option
                                    key={i}
                                    selected={documentDetail.form.prop === prop && true}
                                    title={prop}
                                    value={prop}
                                  >
                                    {prop.length > 113 ? `${prop.substr(0, 110)}...` : prop}
                                  </option>
                                ))}
                              {!selectedKp && (
                                <option>{'Pilih Kegiatan Prioritas\n\nterlebih dahulu'}</option>
                              )}
                            </select>
                          ) : (
                            <select
                              onChange={onChange}
                              className={
                                prop === ''
                                  ? 'gnrm-select test-select1'
                                  : 'gnrm-select test-select2'
                              }
                              name="prop"
                              style={{
                                marginLeft: '85px',
                                width: '955px',
                              }}
                            >
                              <option selected={true} hidden>
                                Tuliskan Proyek Prioritas (PP) sesuai dengan program/kegiatan
                                Kementerian/Lembaga/Daerah sesuai RPJMN 2020-2024
                              </option>
                              {propOptions &&
                                propOptions.map((prop, i) => (
                                  <option key={i} title={prop} value={prop}>
                                    {prop.length > 113 ? `${prop.substr(0, 110)}...` : prop}
                                  </option>
                                ))}
                              {!selectedKp && (
                                <option>{'Pilih Kegiatan Prioritas\n\nterlebih dahulu'}</option>
                              )}
                            </select>
                          )}
                        </div> */}

                        {/* {selectedKp === 'Pusat-pusat Perubahan Revolusi Mental' && ( */}
                        <Fragment>
                          <div>
                            <label>Gerakan</label>
                            {isEditing &&
                            documentDetail?.form.gerakan &&
                            Object.values(selectedGerakan).length > 0 ? (
                              <select
                                onChange={onChange}
                                className="gnrm-select"
                                name="gerakan-0"
                                style={{
                                  marginLeft: '145px',
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
                                  marginLeft: '145px',
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
                                      <label>Gerakan</label>
                                      <select
                                        onChange={onChangeGerakan}
                                        className="gnrm-select"
                                        name={`gerakan-${index + 1}`}
                                        style={{
                                          marginLeft: '145px',
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
                                    <label>Gerakan</label>
                                    <select
                                      onChange={onChangeGerakan}
                                      className="gnrm-select"
                                      name={`gerakan-${index + 1}`}
                                      style={{
                                        marginLeft: '145px',
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
                        {/* )} */}
                      </Fragment>
                      <div>
                        <label
                          style={{
                            textAlign: 'right',
                            clear: 'both',
                            float: 'left',
                          }}
                        >
                          Penjelasan
                        </label>
                        <textarea
                          className="gnrm-penjelasan"
                          style={{
                            height: '283px',
                            marginLeft: '127px',
                            width: '955px',
                          }}
                          type="text"
                          name="penjelasan_kegiatan"
                          placeholder="Tuliskan penjabaran program K/L/D yang akan dilaksanakan sesuai dengan gerakan yang telah dipilih "
                          value={kegiatan.penjelasan_kegiatan}
                          onChange={(event) => onChange(event, 'kegiatan', false, 0, true)}
                        />
                      </div>
                      <div style={{ textAlign: 'right', paddingRight: 35 }}>
                        {wordLength.penjelasan_kegiatan}/1000
                      </div>
                    </div>

                    <div className="gnrm-navigation-button">
                      <Link to="gugus_tugas" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="previous">
                          <i className="material-icons">expand_less</i>
                        </button>
                      </Link>
                      <Link to="output" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="forward">
                          <i className="material-icons">expand_more</i>
                        </button>
                      </Link>
                    </div>
                  </div>
                </Element>

                <Element id="output" name="output">
                  <div className="gnrm-container">
                    <div className="gnrm-title">OUTPUT</div>
                    <div className="form-gnrm">
                      <div>
                        <label
                          style={{
                            textAlign: 'right',
                            clear: 'both',
                            float: 'left',
                          }}
                        >
                          Indikator Capaian
                        </label>
                        <textarea
                          className="gnrm-indikator"
                          style={{
                            height: '150px',
                            marginLeft: '70px',
                            width: '955px',
                          }}
                          type="text"
                          name="indikator_capaian"
                          placeholder="Tuliskan indikator capaian yang menggambarkan output dan outcome dalam program/kegiatan K/L/D terkait dengan GNRM. Capaian outcome juga harus berkolerasi terhadap lima dimensi GNRM yang sifatnya terukur dan berkontribusi pada peningkatan hasil Indeks Capaian Revolusi Mental (ICRM)"
                          value={output.indikator_capaian}
                          onChange={(event) => onChange(event, 'output', false, 0, true)}
                        />
                      </div>
                      <div style={{ textAlign: 'right', paddingRight: 35 }}>
                        {wordLength.indikator_capaian}/1000
                      </div>
                      <div>
                        <label
                          style={{
                            textAlign: 'right',
                            clear: 'both',
                            float: 'left',
                          }}
                        >
                          Sasaran
                        </label>
                        <textarea
                          className="gnrm-sasaran"
                          style={{
                            height: '130px',
                            marginLeft: '149px',
                            width: '955px',
                          }}
                          type="text"
                          placeholder="Tuliskan sasaran yang akan dicapai dalam setiap pelaksanaan program/kegiatan dari masing-masing K/L/D."
                          name="sasaran"
                          value={output.sasaran}
                          onChange={(event) => onChange(event, 'output', false, 0, true)}
                        />
                      </div>
                      <div style={{ textAlign: 'right', paddingRight: 35 }}>
                        {wordLength.sasaran}/1000
                      </div>
                      <div>
                        <label
                          style={{
                            textAlign: 'right',
                            clear: 'both',
                            float: 'left',
                          }}
                        >
                          Target
                        </label>
                        <textarea
                          className="gnrm-target"
                          style={{
                            height: '130px',
                            marginLeft: '161px',
                            width: '955px',
                          }}
                          placeholder="Tuliskan target yang akan dicapai dalam setiap program/kegiatan dari masing-masing K/L/D"
                          type="text"
                          name="target"
                          value={output.target}
                          onChange={(event) => onChange(event, 'output', false, 0, true)}
                        />
                      </div>
                      <div style={{ textAlign: 'right', paddingRight: 35 }}>
                        {wordLength.target}/1000
                      </div>
                    </div>

                    <div className="gnrm-navigation-button">
                      <Link to="kegiatan" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="previous">
                          <i className="material-icons">expand_less</i>
                        </button>
                      </Link>
                      <Link to="kondisi_awal" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="forward">
                          <i className="material-icons">expand_more</i>
                        </button>
                      </Link>
                    </div>
                  </div>
                </Element>

                <Element id="kondisi_awal" name="kondisi_awal">
                  <div className="gnrm-container">
                    <div className="gnrm-title">KONDISI AWAL</div>
                    <div className="form-gnrm">
                      <div>
                        <label
                          style={{
                            textAlign: 'right',
                            clear: 'both',
                            float: 'left',
                          }}
                        >
                          Penjelasan
                        </label>
                        <textarea
                          className="gnrm-penjelasan"
                          style={{
                            height: '300px',
                            marginLeft: '127px',
                            width: '955px',
                          }}
                          type="text"
                          placeholder="Tuliskan informasi dasar yang dihimpun sebelum suatu program dari masing-masing K/L/D dilaksanaan bisa berupa data baseline jika program tersebut berupa program lanjutan dan komplementer atau penggambaran kondisi eksisting apabila program/kegiatan K/LD merupakan program/kegiatan baru dan belum pernah di intervensi. Data ini dapat digunakan sebagai acuan untuk meningkatan capaian target program/kegiatan K/L/D secara maksimal"
                          name="kondisi_awal"
                          value={kondisi_awal}
                          onChange={(event) => onChange(event, '', false, 0, true)}
                        />
                      </div>
                      <div style={{ textAlign: 'right', paddingRight: 35 }}>
                        {wordLength.kondisi_awal}/1000
                      </div>
                      <div className="div_lampiran">
                        <label>Data Dukung</label>
                        <label htmlFor="testing2" className="label_lampiran">
                          <span
                            style={{
                              marginRight: '5px',
                            }}
                          >
                            +
                          </span>{' '}
                          UNGGAH DOKUMEN/FOTO
                        </label>
                        <input
                          id="testing2"
                          className="gnrm-penjelasan"
                          style={{
                            height: '42px',
                            marginLeft: '28px',
                            width: '955px',
                          }}
                          onChange={onChangeFilesKondisi}
                          type="file"
                          accept=".jpg,.png,.jpeg , application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.presentationml.slideshow , text/plain, application/pdf"
                          name="media"
                          multiple
                        />
                        <h1 className="penjelasan_lampiran_doc">(Ukuran maksimal berkas 25MB)</h1>
                      </div>
                      <div>
                        {lampiranKondisi && lampiranKondisi.length > 0 ? (
                          <div
                            style={{
                              height: 'fit-content',
                              marginLeft: '213px',
                              width: '955px',
                              border: '1px solid #ACACAC',
                              borderRadius: '5px',
                              padding: '10px',
                              display: 'flex',
                              flexWrap: 'wrap',
                              overflow: 'hidden',
                            }}
                          >
                            {lampiranKondisi &&
                              lampiranKondisi.map((lampiran, index) => {
                                const fileType = isFileImage(lampiran);
                                const objectURL = URL.createObjectURL(lampiran);
                                return (
                                  <div key={index}>
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
                                          onDeleteKondisi(true, lampiran.name, lampiran)
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
                              marginLeft: '213px',
                              width: '955px',
                              border: '1px solid #ACACAC',
                              borderRadius: '5px',
                              padding: '10px',
                              display: 'flex',
                              flexWrap: 'wrap',
                              overflow: 'hidden',
                            }}
                          >
                            {lampiranKondisiUrl &&
                              lampiranKondisiUrl.map((url, index) => {
                                const fileType = isFileImageUrl(url);
                                return (
                                  <div key={index}>
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
                                        {/* <img src={url} alt={getFileName(url)} className="gnrm-media--image" /> */}
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
                                        onClick={(e) => onDeleteKondisi(false, getFileName(url))}
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
                      <div>
                        {kondisiSize > 26214400 ? (
                          <div
                            style={{
                              marginLeft: '217px',
                              color: 'red',
                            }}
                          >
                            Ukuran berkas melebihi ukuran maksimal (25MB)!
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>

                    <div className="gnrm-navigation-button">
                      <Link to="output" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="previous">
                          <i className="material-icons">expand_less</i>
                        </button>
                      </Link>
                      <Link to="anggaran" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="forward">
                          <i className="material-icons">expand_more</i>
                        </button>
                      </Link>
                    </div>
                  </div>
                </Element>

                <Element id="anggaran" name="anggaran">
                  <div className="gnrm-container">
                    <div className="gnrm-title">ANGGARAN*</div>
                    <div className="form-gnrm">
                      <div>
                        <label>
                          Sumber Anggaran<span style={{ color: '#D4362E' }}>*</span>
                        </label>
                        <input
                          className="gnrm-pendanaan"
                          style={{
                            height: '42px',
                            marginLeft: '72px',
                            width: '955px',
                          }}
                          type="text"
                          placeholder="Tuliskan rencana anggaran periodik yang disusun berdasarkan program/kegiatan yang telah disusun/disahkan berdasarkan dokumen perencanaan K/L/D"
                          name="sumber_dana"
                          value={anggaran.sumber_dana}
                          onChange={(event) => onChange(event, 'anggaran')}
                        />
                      </div>
                      <div>
                        <label>
                          Besaran Anggaran<span style={{ color: '#D4362E' }}>*</span>{' '}
                          <span
                            style={{
                              marginLeft: '36px',
                            }}
                          >
                            Rp.
                          </span>
                        </label>
                        <input
                          className="gnrm-anggaran"
                          style={{
                            height: '42px',
                            marginLeft: '4px',
                            width: '955px',
                          }}
                          placeholder="Rencana anggaran ini harus memuat sumber anggaran, besaran anggaran dan peruntukan anggaran"
                          type="text"
                          name="besar_anggaran"
                          value={anggaran.besar_anggaran}
                          onChange={(event) => onChange(event, 'anggaran')}
                        />
                      </div>
                    </div>

                    <div className="gnrm-navigation-button">
                      <Link to="kondisi_awal" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="previous">
                          <i className="material-icons">expand_less</i>
                        </button>
                      </Link>
                      <Link to="pihak_terkait" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="forward">
                          <i className="material-icons">expand_more</i>
                        </button>
                      </Link>
                    </div>
                  </div>
                </Element>

                {/* <Element id="proses" name="proses">
                  <div className="gnrm-container">
                    <div className="gnrm-title">PERKEMBANGAN PELAKSANAAN KEGIATAN</div>
                    <div className="form-gnrm">
                      <div>
                        <label
                          style={{
                            textAlign: 'left',
                            clear: 'both',
                            float: 'left',
                          }}
                        >
                          Proses Pelaksanaan <br /> Kegiatan
                        </label>
                        <textarea
                          className="gnrm-penjelasan"
                          style={{
                            height: '400px',
                            marginLeft: '55px',
                            width: '955px',
                          }}
                          type="text"
                          placeholder="Tuliskan seluruh proses dan mekanisme pelaksanaan program/kegiatan K/L/D yang meliputi tahap perencanaan, pelaksanaan sampai dengan monitoring dan evaluasi berserta kebutuhan dan sumberdaya yang diperlukan, proses koordinasi, serta prihal lain yang mendukung pelaksanaan program/kegiatan K/L/D yang terkait dengan pelaksanaan GNRM. Proses pelaksanaan kegiatan ini juga harus memuat rangkaian kegiatan tindak lanjut perencanaan program atau langkah yang strategis maupun operasional atau kebijakan sebagai bentuk penguatan pencapaian target dan sasaran berbasis outcome. "
                          name="proses"
                          value={proses}
                          onChange={(event) => onChange(event)}
                        />
                      </div>
                      <div className="div_lampiran">
                        <label>Data Dukung</label>
                        <label htmlFor="testing3" className="label_lampiran">
                          <span
                            style={{
                              marginRight: '5px',
                            }}
                          >
                            +
                          </span>{' '}
                          UNGGAH DOKUMEN/FOTO
                        </label>
                        <input
                          id="testing3"
                          className="gnrm-penjelasan"
                          style={{
                            height: '42px',
                            marginLeft: '28px',
                            width: '955px',
                          }}
                          onChange={onChangeFilesProses}
                          type="file"
                          accept=".jpg,.png,.jpeg , application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.presentationml.slideshow , text/plain, application/pdf"
                          name="media"
                          multiple
                        />
                        <h1 className="penjelasan_lampiran_doc">(Ukuran maksimal berkas 25MB)</h1>
                      </div>
                      <div>
                        {lampiranProses && lampiranProses.length > 0 ? (
                          <div
                            style={{
                              height: 'fit-content',
                              marginLeft: '213px',
                              width: '955px',
                              border: '1px solid #ACACAC',
                              borderRadius: '5px',
                              padding: '10px',
                              display: 'flex',
                              flexWrap: 'wrap',
                              overflow: 'hidden',
                            }}
                          >
                            {lampiranProses &&
                              lampiranProses.map((lampiran, index) => {
                                const fileType = isFileImage(lampiran);
                                const objectURL = URL.createObjectURL(lampiran);
                                return (
                                  <div key={index}>
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
                                          onDeleteProses(true, lampiran.name, lampiran)
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
                              marginLeft: '213px',
                              width: '955px',
                              border: '1px solid #ACACAC',
                              borderRadius: '5px',
                              padding: '10px',
                              display: 'flex',
                              flexWrap: 'wrap',
                              overflow: 'hidden',
                            }}
                          >
                            {lampiranProsesUrl &&
                              lampiranProsesUrl.map((url, index) => {
                                const fileType = isFileImageUrl(url);
                                return (
                                  <div key={index}>
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
                                        onClick={(e) => onDeleteProses(false, getFileName(url))}
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
                      <div>
                        {prosesSize > 26214400 ? (
                          <div
                            style={{
                              marginLeft: '217px',
                              color: 'red',
                            }}
                          >
                            Ukuran berkas melebihi ukuran maksimal (25MB)!
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>

                    <div className="gnrm-navigation-button">
                      <Link to="anggaran" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="previous">
                          <i className="material-icons">expand_less</i>
                        </button>
                      </Link>
                      <Link to="pihak_terkait" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="forward">
                          <i className="material-icons">expand_more</i>
                        </button>
                      </Link>
                    </div>
                  </div>
                </Element> */}

                <Element name="pihak_terkait" id="pihak_terkait">
                  <div className="gnrm-container">
                    <div className="gnrm-title">PIHAK TERKAIT</div>
                    <div className="form-gnrm">
                      {!documentDetail ? (
                        <Fragment>
                          {/* <div>
                                                                <label>Peran Pihak Terkait</label>
                                                                <input
                                                                    className="gnrm-terkait"
                                                                    style={{
                                                                        height: "42px",
                                                                        marginLeft: "57px",
                                                                        width: "955px"
                                                                    }}
                                                                    type="text"
                                                                    name="peran"
                                                                    value={data.pihak_terkait.peran}
                                                                    onChange={(event) => onChange(event, 'pihak_terkait', true, 0)}
                                                                />
                                                            </div> */}
                          <div>
                            <label>K/L/D/Pihak Lainnya</label>
                            <input
                              className="gnrm-terkait"
                              style={{
                                height: '42px',
                                marginLeft: '49px',
                                width: '955px',
                              }}
                              placeholder="Tuliskan semua pihak yang terlibat dalam pelaksanaan program K/L/D."
                              type="text"
                              name="lembaga"
                              value={data.pihak_terkait.lembaga}
                              onChange={(event) => onChange(event, 'pihak_terkait', true, 0)}
                            />
                          </div>
                          <div>
                            <label
                              style={{
                                textAlign: 'right',
                                clear: 'both',
                                float: 'left',
                              }}
                            >
                              Penjelasan
                            </label>
                            <textarea
                              className="gnrm-penjelasan"
                              style={{
                                height: '400px',
                                marginLeft: '127px',
                                width: '955px',
                              }}
                              placeholder="Tuliskan mengenai kontribusi dari masing-masing pihak yang terlibat dalam mencapai hasil yang diharapkan"
                              type="text"
                              name="penjelasan_pihak_terkait"
                              value={data.pihak_terkait.penjelasan_pihak_terkait}
                              onChange={(event) => onChange(event, 'pihak_terkait', true, 0, true)}
                            />
                          </div>
                        </Fragment>
                      ) : (
                        documentDetail &&
                        documentDetail.form &&
                        documentDetail.form?.pihak_terkait.map((pihak, index) => {
                          return (
                            <Fragment key={index}>
                              {/* <div>
                                                                        <label>Peran Pihak Terkait</label>
                                                                        <input
                                                                            className="gnrm-terkait"
                                                                            style={{
                                                                                height: "42px",
                                                                                marginLeft: "57px",
                                                                                width: "955px"
                                                                            }}
                                                                            type="text"
                                                                            name="peran"
                                                                            value={data.pihak_terkait[index] && data.pihak_terkait[index].peran}
                                                                            onChange={(event) => onChange(event, 'pihak_terkait', true, index)}
                                                                        />
                                                                    </div> */}
                              <div>
                                <label>K/L/D/Pihak Lainnya</label>
                                <input
                                  className="gnrm-terkait"
                                  style={{
                                    height: '42px',
                                    marginLeft: '49px',
                                    width: '955px',
                                  }}
                                  type="text"
                                  placeholder="Tuliskan semua pihak yang terlibat dalam pelaksanaan program K/L/D."
                                  name="lembaga"
                                  value={
                                    data.pihak_terkait[index] && data.pihak_terkait[index].lembaga
                                  }
                                  onChange={(event) =>
                                    onChange(event, 'pihak_terkait', true, index)
                                  }
                                />
                              </div>
                              <div>
                                <label
                                  style={{
                                    textAlign: 'right',
                                    clear: 'both',
                                    float: 'left',
                                  }}
                                >
                                  Penjelasan
                                </label>
                                <textarea
                                  className="gnrm-penjelasan"
                                  style={{
                                    height: '400px',
                                    marginLeft: '127px',
                                    width: '955px',
                                  }}
                                  placeholder="Tuliskan mengenai kontribusi dari masing-masing pihak yang terlibat dalam mencapai hasil yang diharapkan"
                                  type="text"
                                  name="penjelasan_pihak_terkait"
                                  value={
                                    data.pihak_terkait[index] &&
                                    data.pihak_terkait[index].penjelasan_pihak_terkait
                                  }
                                  onChange={(event) =>
                                    onChange(event, 'pihak_terkait', true, index, true)
                                  }
                                />
                              </div>
                            </Fragment>
                          );
                        })
                      )}
                      {form.map((form, index) => {
                        return (
                          <Fragment key={index + panjang}>
                            {/* <div>
                                                                    <label>Peran Pihak Terkait</label>
                                                                    <input
                                                                        className="gnrm-terkait"
                                                                        style={{
                                                                            height: "42px",
                                                                            marginLeft: "57px",
                                                                            width: "955px"
                                                                        }}
                                                                        type="text"
                                                                        name="peran"
                                                                        value={data.pihak_terkait.peran}
                                                                        onChange={(event) => onChange(event, 'pihak_terkait', true, index + panjang)}
                                                                    />
                                                                </div> */}
                            <div>
                              <label>K/L/D/Pihak Lainnya</label>
                              <input
                                className="gnrm-terkait"
                                style={{
                                  height: '42px',
                                  marginLeft: '49px',
                                  width: '955px',
                                }}
                                placeholder="Tuliskan semua pihak yang terlibat dalam pelaksanaan program K/L/D."
                                type="text"
                                name="lembaga"
                                value={data.pihak_terkait.lembaga}
                                onChange={(event) =>
                                  onChange(event, 'pihak_terkait', true, index + panjang)
                                }
                              />
                            </div>
                            <div>
                              <label
                                style={{
                                  textAlign: 'right',
                                  clear: 'both',
                                  float: 'left',
                                }}
                              >
                                Penjelasan
                              </label>
                              <textarea
                                className="gnrm-penjelasan"
                                style={{
                                  height: '400px',
                                  marginLeft: '127px',
                                  width: '955px',
                                }}
                                type="text"
                                placeholder="Tuliskan mengenai kontribusi dari masing-masing pihak yang terlibat dalam mencapai hasil yang diharapkan"
                                name="penjelasan_pihak_terkait"
                                value={data.pihak_terkait.penjelasan_pihak_terkait}
                                onChange={(event) =>
                                  onChange(event, 'pihak_terkait', true, index + panjang, true)
                                }
                              />
                            </div>
                          </Fragment>
                        );
                      })}
                    </div>
                    <div>
                      <label className="tambah-lembaga">Tambah K/L/D/Pihak Lainnya</label>
                      <img
                        src={plus2}
                        style={{
                          position: 'absolute',
                          marginTop: '-3px',
                          marginLeft: '20px',
                          cursor: 'pointer',
                        }}
                        onClick={addForm}
                      />
                    </div>

                    <div className="gnrm-navigation-button">
                      <Link to="anggaran" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="previous">
                          <i
                            className="material-icons"
                            style={{
                              fontSize: '36px',
                            }}
                          >
                            expand_less
                          </i>
                        </button>
                      </Link>

                      <Link
                        to="penanggung_jawab"
                        spy={true}
                        smooth={true}
                        duration={500}
                        offset={-30}
                      >
                        <button className="forward">
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
                {/* 
                                    <Element id='lampiran' name='lampiran'>
                                        <div className="gnrm-container">
                                            <div className="gnrm-title">
                                                LAMPIRAN MEDIA
                                        </div>
                                            <div className="form-gnrm">
                                                <div>
                                                    <label>Lampiran Media</label>
                                                    <label htmlFor='testing' className='label_lampiran'><span style={{ marginRight: '15px' }}>+</span> UNGGAH DOKUMEN/FOTO</label>
                                                    <input
                                                        id="testing"
                                                        className="gnrm-penjelasan"
                                                        style={{
                                                            height: "42px",
                                                            marginLeft: "28px",
                                                            width: "955px"
                                                        }}
                                                        onChange={onChangeFiles}
                                                        type="file"
                                                        accept=".jpg,.png,.jpeg"
                                                        name="media"
                                                        multiple
                                                    />
                                                </div>
                                                <div>
                                                    {
                                                        media && media.length > 0 ? (
                                                            <div style={{
                                                                height: "fit-content",
                                                                marginLeft: "213px",
                                                                width: "955px",
                                                                border: '1px solid #ACACAC',
                                                                borderRadius: '5px',
                                                                padding: '10px',
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                                overflow: 'hidden'
                                                            }}
                                                            >
                                                                {
                                                                    media && media.map((media, index) => {
                                                                        const objectURL = URL.createObjectURL(media)
                                                                        return (
                                                                            <div key={index}>
                                                                                <div style={{
                                                                                    width: '150px',
                                                                                    height: '150px',
                                                                                    backgroundColor: 'pink',
                                                                                    marginRight: '35px',
                                                                                    position: 'relative'
                                                                                }}
                                                                                    className="d-flex align-items-center justify-content-center"
                                                                                >
                                                                                    <div style={{ width: '150px', height: '150px', overflow: 'hidden', position: 'absolute' }}>
                                                                                        <img src={objectURL} alt={media.name} className="gnrm-media--image" />
                                                                                    </div>
                                                                                    <div style={{
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
                                                                                        color: 'white'
                                                                                    }}
                                                                                        onClick={(e) => onDeleteMedia(true, media.name, media)}> X </div>
                                                                                </div>
                                                                                <div style={{
                                                                                    marginTop: '10px',
                                                                                    width: '150px',
                                                                                    height: '20px',
                                                                                    wordWrap: 'break-word',
                                                                                    lineHeight: '20px',
                                                                                }}
                                                                                >
                                                                                    <p className="gnrm-media--name">
                                                                                        {media.name.length > 18 ? `${media.name.substr(0, 15)}...` : media.name}
                                                                                    </p>
                                                                                </div>

                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        ) : (
                                                                <div style={{
                                                                    height: "fit-content",
                                                                    marginLeft: "213px",
                                                                    width: "955px",
                                                                    border: '1px solid #ACACAC',
                                                                    borderRadius: '5px',
                                                                    padding: '10px',
                                                                    display: 'flex',
                                                                    flexWrap: 'wrap',
                                                                    overflow: 'hidden'
                                                                }}
                                                                >
                                                                    {
                                                                        mediaUrl && mediaUrl.map((url, index) => {
                                                                            return (
                                                                                <div key={index}>
                                                                                    <div style={{
                                                                                        width: '150px',
                                                                                        height: '150px',
                                                                                        backgroundColor: 'pink',
                                                                                        marginRight: '35px',
                                                                                        position: 'relative'
                                                                                    }}
                                                                                        className="d-flex align-items-center justify-content-center"
                                                                                    >
                                                                                        <div style={{ width: '150px', height: '150px', overflow: 'hidden', position: 'absolute' }}>
                                                                                            <img src={url} alt={getFileName(url)} className="gnrm-media--image" />
                                                                                        </div>
                                                                                        <div style={{
                                                                                            position: 'absolute',
                                                                                            backgroundColor: '#C04B3E',
                                                                                            width: '25px',
                                                                                            height: '25px',
                                                                                            borderRadius: '50%',
                                                                                            top: '-7px',
                                                                                            right: '-7px',
                                                                                            lineHeight: '25px',
                                                                                            textAlign: 'center',
                                                                                            cursor: 'pointer'
                                                                                        }}
                                                                                            onClick={(e) => onDeleteMedia(false, getFileName(url))}> X </div>
                                                                                    </div>
                                                                                    <div style={{
                                                                                        marginTop: '10px',
                                                                                        width: '150px',
                                                                                        height: '20px',
                                                                                        wordWrap: 'break-word',
                                                                                        lineHeight: '20px'
                                                                                    }}
                                                                                    >
                                                                                        <p className="gnrm-media--name">
                                                                                            {getFileName(url)}
                                                                                        </p>
                                                                                    </div>

                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            )
                                                    }
                                                </div>
                                            </div>

                                            <div className="gnrm-navigation-button">
                                                <Link
                                                    to="pihak_terkait"
                                                    spy={true}
                                                    smooth={true}
                                                    duration={500}
                                                    offset={-30}
                                                >
                                                    <button className="previous"><i className="material-icons">expand_less</i></button>
                                                </Link>
                                                <Link
                                                    to="penanggung_jawab"
                                                    spy={true}
                                                    smooth={true}
                                                    duration={500}
                                                    offset={-30}
                                                >
                                                    <button className="forward"><i className="material-icons">expand_more</i></button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Element> */}

                <Element id="penanggung_jawab" name="penanggung_jawab">
                  <div className="gnrm-container" style={{ marginBottom: '130px' }}>
                    <div className="monev-title">PENANGGUNG JAWAB</div>
                    <div className="form-gnrm">
                      <div>
                        <label>Nama</label>
                        <input
                          className="gnrm-eselon"
                          style={{
                            height: '42px',
                            marginLeft: '164px',
                            width: '403px',
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
                          className="gnrm-nip"
                          style={{
                            height: '42px',
                            marginLeft: '150px',
                            width: '403px',
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
                          className="gnrm-lampiran"
                          style={{
                            height: '42px',
                            marginLeft: '184px',
                            width: '403px',
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

                    <div className="gnrm-navigation-button">
                      <Link to="pihak_terkait" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="previous-last-1">
                          <i className="material-icons">expand_less</i>
                        </button>
                      </Link>

                      <button className="simpan-gnrm" type="submit">
                        SIMPAN PERUBAHAN
                      </button>

                      <button className="preview-gnrm" onClick={setPreview}>
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
                id="form-gnrm"
                onSubmit={isEditing ? onEdit : onSubmit}
              >
                <Element id="identitas" name="identitas">
                  <div className="gnrm-container-off">
                    <div className="form-gnrm">
                      <div>
                        <label>Tahun</label>
                        {documentDetail && documentDetail.form.tahun ? (
                          <select
                            onChange={(event) => onChange(event)}
                            className="gnrm-tahun"
                            name="tahun"
                          >
                            {pilihanTahun.map((tahun, i) => (
                              <option
                                key={i}
                                selected={documentDetail.form.tahun === tahun && true}
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
                        {documentDetail && documentDetail.form.id_program ? (
                          <select
                            onChange={(event) => onChange(event)}
                            className="monev-id-program"
                            name="periode"
                            style={{
                              marginLeft: '150px',
                            }}
                          >
                            {pilihanPeriode.map((periode, i) => (
                              <option
                                key={i}
                                selected={documentDetail.form.periode === periode && true}
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
                              marginLeft: '150px',
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
                      {/* <div>
                                            <label>Instansi</label>
                                            <input 
                                                className="gnrm-instansi" 
                                                type="text" 
                                                name="instansi" 
                                                value={instansi}
                                                onChange={(event) => onChange(event)}    
                                            />
                                        </div> */}
                    </div>

                    <div className="gnrm-navigation-button">
                      <Link to="gugus_tugas" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="forward tes1">
                          <i className="material-icons">expand_more</i>
                        </button>
                      </Link>
                    </div>
                  </div>
                </Element>

                <Element id="gugus_tugas" name="gugus_tugas">
                  <div className="gnrm-container-off">
                    <div className="gnrm-title">GUGUS TUGAS GNRM</div>
                    <div className="form-gnrm">
                      {isEditing ? (
                        <Fragment>
                          <div>
                            <label
                              style={{
                                textAlign: 'left',
                                clear: 'both',
                                float: 'left',
                              }}
                            >
                              Sudah Terbentuk <br /> Gugus Tugas?
                            </label>
                            <div
                              style={{
                                marginLeft: '210px',
                              }}
                            >
                              {data.sk_status ? (
                                <Fragment>
                                  <label
                                    htmlFor="sudah"
                                    className="label-radio"
                                    style={{
                                      marginRight: '65px',
                                    }}
                                  >
                                    Sudah
                                    <input
                                      type="radio"
                                      id="sudah"
                                      name="sk_status"
                                      className="input-radio"
                                      value={data.sk_status}
                                      checked={true}
                                      onChange={onChangeButton}
                                    />
                                    <span className="checked-radio"></span>
                                  </label>
                                  <label htmlFor="belum" className="label-radio">
                                    Belum
                                    <input
                                      type="radio"
                                      id="belum"
                                      name="sk_status"
                                      className="input-radio"
                                      value={data.sk_status}
                                      onChange={onChangeButtonFalse}
                                    />
                                    <span className="checked-radio"></span>
                                  </label>
                                </Fragment>
                              ) : (
                                <Fragment>
                                  <label
                                    htmlFor="sudah"
                                    className="label-radio"
                                    style={{
                                      marginRight: '65px',
                                    }}
                                  >
                                    Sudah
                                    <input
                                      type="radio"
                                      id="sudah"
                                      name="sk_status"
                                      className="input-radio"
                                      value={data.sk_status}
                                      onChange={onChangeButton}
                                    />
                                    <span className="checked-radio"></span>
                                  </label>
                                  <label htmlFor="belum" className="label-radio">
                                    Belum
                                    <input
                                      type="radio"
                                      id="belum"
                                      name="sk_status"
                                      className="input-radio"
                                      value={data.sk_status}
                                      checked={true}
                                      onChange={onChangeButtonFalse}
                                    />
                                    <span className="checked-radio"></span>
                                  </label>
                                </Fragment>
                              )}
                            </div>
                          </div>
                          {data.sk_status ? (
                            <Fragment>
                              <div>
                                <label>Input Nomor SK</label>
                                <input
                                  className="gnrm-sasaran"
                                  style={{
                                    height: '42px',
                                    marginLeft: '84px',
                                    width: '767px',
                                    fontWeight: '700',
                                  }}
                                  type="text"
                                  placeholder="Tuliskan Nomor Surat Keterangan  (SK) pembentukan Gerakan Nasional Revolusi Mental (GNRM)"
                                  name="sk_no"
                                  value={data.sk_no}
                                  onChange={onChangeSK}
                                  required
                                />
                              </div>
                              <div className="div_lampiran">
                                <label>Lampiran SK</label>
                                <label
                                  htmlFor="testing10"
                                  className="label_lampiran"
                                  style={{
                                    marginLeft: '110px',
                                  }}
                                >
                                  <span
                                    style={{
                                      marginRight: '5px',
                                    }}
                                  >
                                    +
                                  </span>{' '}
                                  UNGGAH DOKUMEN/FOTO
                                </label>
                                <input
                                  id="testing10"
                                  className="gnrm-penjelasan"
                                  style={{
                                    height: '42px',
                                    marginLeft: '30px',
                                    width: '767px',
                                  }}
                                  onChange={onChangeSKFile}
                                  type="file"
                                  accept=".jpg,.png,.jpeg , application/pdf"
                                  name="media"
                                />
                                <h1 className="penjelasan_lampiran_doc">
                                  (Ukuran maksimal berkas 25MB)
                                </h1>
                              </div>
                              <div>
                                {skFile && skFile.length > 0 ? (
                                  <div
                                    style={{
                                      height: 'fit-content',
                                      marginLeft: '210px',
                                      width: '767px',
                                      border: '1px solid #ACACAC',
                                      borderRadius: '5px',
                                      padding: '10px',
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                    }}
                                  >
                                    {skFile.map((lampiran, index) => {
                                      const fileExt = getFIleExtension(lampiran.name);
                                      const objectURL = URL.createObjectURL(lampiran);
                                      // cekEkstension(fileExt)
                                      return (
                                        <div key={index}>
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
                                              }}
                                            >
                                              {fileExt === 'pdf' ? (
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
                                          </div>
                                          <div
                                            style={{
                                              marginTop: '10px',
                                              width: '150px',
                                              height: '20px',
                                              wordWrap: 'break-word',
                                              lineHeight: '20px',
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
                                      marginLeft: '210px',
                                      width: '767px',
                                      border: '1px solid #ACACAC',
                                      borderRadius: '5px',
                                      padding: '10px',
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                    }}
                                  >
                                    {skFileUrl.map((url, index) => {
                                      const fileExt = getFIleExtension(getFileName(url));
                                      // cekEkstension(fileExt)
                                      return (
                                        <div key={index}>
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
                                              }}
                                            >
                                              {fileExt === 'pdf' ? (
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
                                          </div>
                                          <div
                                            style={{
                                              marginTop: '10px',
                                              width: '150px',
                                              height: '20px',
                                              wordWrap: 'break-word',
                                              lineHeight: '20px',
                                            }}
                                          >
                                            <p className="gnrm-media--name">
                                              {getFileName(url).length > 18
                                                ? `${getFileName(url).substr(0, 15)}...`
                                                : getFileName(url)}
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                              <div>
                                {SKSize > 26214400 ? (
                                  <div
                                    style={{
                                      marginLeft: '217px',
                                      color: 'red',
                                    }}
                                  >
                                    Ukuran berkas melebihi ukuran maksimal (25MB)!
                                  </div>
                                ) : (
                                  ''
                                )}
                              </div>
                            </Fragment>
                          ) : (
                            <>
                              <div>
                                <label
                                  style={{
                                    textAlign: 'right',
                                    clear: 'both',
                                    float: 'left',
                                  }}
                                >
                                  Kendala
                                </label>
                                <textarea
                                  className="gnrm-nama-program"
                                  style={{
                                    height: '300px',
                                    marginLeft: '140px',
                                    width: '767px',
                                  }}
                                  type="text"
                                  name="sk_kendala"
                                  value={data.sk_kendala}
                                  onChange={onChangeSK}
                                />
                              </div>
                              <div style={{ textAlign: 'right', paddingRight: 35 }}>
                                {wordLength.sk_kendala}/1000
                              </div>
                            </>
                          )}
                        </Fragment>
                      ) : (
                        <Fragment>
                          {instansiDetail.sk && instansiDetail.sk.status ? (
                            <Fragment>
                              <div>
                                <label
                                  style={{
                                    textAlign: 'left',
                                    clear: 'both',
                                    float: 'left',
                                  }}
                                >
                                  Input Nomor SK
                                </label>
                                <div
                                  className="gnrm-sasaran"
                                  style={{
                                    height: '42px',
                                    marginLeft: '230px',
                                    fontWeight: '700',
                                  }}
                                >
                                  {data.sk_no}
                                </div>
                              </div>
                              <div>
                                <label
                                  style={{
                                    textAlign: 'left',
                                    clear: 'both',
                                    float: 'left',
                                  }}
                                >
                                  Lampiran Berkas
                                </label>
                                <div
                                  style={{
                                    width: 'fit-content',
                                    height: 'fit-content',
                                    marginLeft: '230px',
                                  }}
                                >
                                  {skExtension === 'pdf' ? (
                                    ''
                                  ) : (
                                    <Fragment>
                                      <img
                                        src={skGambar}
                                        alt={getFileName(
                                          instansiDetail.sk && instansiDetail.sk.foto,
                                        )}
                                        style={{
                                          width: '500px',
                                          height: 'auto',
                                        }}
                                      />
                                      <br />
                                    </Fragment>
                                  )}
                                  <div
                                    className="gnrm-sasaran"
                                    style={{
                                      height: '42px',
                                      width: '767px',
                                      fontWeight: '700',
                                    }}
                                  >
                                    {getFileName(instansiDetail.sk && instansiDetail.sk.foto)}
                                  </div>
                                </div>
                              </div>
                            </Fragment>
                          ) : (
                            <Fragment>
                              <div>
                                <label
                                  style={{
                                    textAlign: 'left',
                                    clear: 'both',
                                    float: 'left',
                                  }}
                                >
                                  Sudah Terbentuk <br /> Gugus Tugas?
                                </label>
                                <div
                                  style={{
                                    marginLeft: '210px',
                                  }}
                                >
                                  {data.sk_status ? (
                                    <Fragment>
                                      <label
                                        htmlFor="sudah"
                                        className="label-radio"
                                        style={{
                                          marginRight: '65px',
                                        }}
                                      >
                                        Sudah
                                        <input
                                          type="radio"
                                          id="sudah"
                                          name="sk_status"
                                          className="input-radio"
                                          value={data.sk_status}
                                          checked={true}
                                          onChange={onChangeButton}
                                        />
                                        <span className="checked-radio"></span>
                                      </label>
                                      <label htmlFor="belum" className="label-radio">
                                        Belum
                                        <input
                                          type="radio"
                                          id="belum"
                                          name="sk_status"
                                          className="input-radio"
                                          value={data.sk_status}
                                          onChange={onChangeButtonFalse}
                                        />
                                        <span className="checked-radio"></span>
                                      </label>
                                    </Fragment>
                                  ) : (
                                    <Fragment>
                                      <label
                                        htmlFor="sudah"
                                        className="label-radio"
                                        style={{
                                          marginRight: '65px',
                                        }}
                                      >
                                        Sudah
                                        <input
                                          type="radio"
                                          id="sudah"
                                          name="sk_status"
                                          className="input-radio"
                                          value={data.sk_status}
                                          onChange={onChangeButton}
                                        />
                                        <span className="checked-radio"></span>
                                      </label>
                                      <label htmlFor="belum" className="label-radio">
                                        Belum
                                        <input
                                          type="radio"
                                          id="belum"
                                          name="sk_status"
                                          className="input-radio"
                                          value={data.sk_status}
                                          checked={true}
                                          onChange={onChangeButtonFalse}
                                        />
                                        <span className="checked-radio"></span>
                                      </label>
                                    </Fragment>
                                  )}
                                </div>
                              </div>
                              {data.sk_status ? (
                                <Fragment>
                                  <div>
                                    <label>Input Nomor SK</label>
                                    <input
                                      className="gnrm-sasaran"
                                      style={{
                                        height: '42px',
                                        marginLeft: '84px',
                                        width: '767px',
                                        fontWeight: '700',
                                      }}
                                      type="text"
                                      placeholder="Tuliskan Nomor Surat Keterangan  (SK) pembentukan Gerakan Nasional Revolusi Mental (GNRM)"
                                      name="sk_no"
                                      value={data.sk_no}
                                      onChange={onChangeSK}
                                      required
                                    />
                                  </div>
                                  <div className="div_lampiran">
                                    <label>Lampiran SK</label>
                                    <label
                                      htmlFor="testing10"
                                      className="label_lampiran"
                                      style={{
                                        marginLeft: '110px',
                                      }}
                                    >
                                      <span
                                        style={{
                                          marginRight: '5px',
                                        }}
                                      >
                                        +
                                      </span>{' '}
                                      UNGGAH DOKUMEN/FOTO
                                    </label>
                                    <input
                                      id="testing10"
                                      className="gnrm-penjelasan"
                                      style={{
                                        height: '42px',
                                        marginLeft: '30px',
                                        width: '767px',
                                      }}
                                      onChange={onChangeSKFile}
                                      type="file"
                                      accept=".jpg,.png,.jpeg , application/pdf"
                                      name="media"
                                    />
                                    <h1 className="penjelasan_lampiran_doc">
                                      (Ukuran maksimal berkas 25MB)
                                    </h1>
                                  </div>
                                  <div>
                                    <div
                                      style={{
                                        height: 'fit-content',
                                        marginLeft: '210px',
                                        width: '767px',
                                        border: '1px solid #ACACAC',
                                        borderRadius: '5px',
                                        padding: '10px',
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                      }}
                                    >
                                      {skFile.map((lampiran, index) => {
                                        const fileExt = getFIleExtension(lampiran.name);
                                        const objectURL = URL.createObjectURL(lampiran);
                                        // cekEkstension(fileExt)
                                        return (
                                          <div key={index}>
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
                                                }}
                                              >
                                                {fileExt === 'pdf' ? (
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
                                            </div>
                                            <div
                                              style={{
                                                marginTop: '10px',
                                                width: '150px',
                                                height: '20px',
                                                wordWrap: 'break-word',
                                                lineHeight: '20px',
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
                                  </div>
                                  <div>
                                    {SKSize > 26214400 ? (
                                      <div
                                        style={{
                                          marginLeft: '217px',
                                          color: 'red',
                                        }}
                                      >
                                        Ukuran berkas melebihi ukuran maksimal (25MB)!
                                      </div>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                </Fragment>
                              ) : (
                                <>
                                  <div>
                                    <label
                                      style={{
                                        textAlign: 'right',
                                        clear: 'both',
                                        float: 'left',
                                      }}
                                    >
                                      Kendala
                                    </label>
                                    <textarea
                                      className="gnrm-nama-program"
                                      style={{
                                        height: '300px',
                                        marginLeft: '140px',
                                        width: '767px',
                                      }}
                                      type="text"
                                      name="sk_kendala"
                                      value={data.sk_kendala}
                                      onChange={onChangeSK}
                                    />
                                  </div>
                                  <div style={{ textAlign: 'right', paddingRight: 35 }}>
                                    {wordLength.sk_kendala}/1000
                                  </div>
                                </>
                              )}
                            </Fragment>
                          )}
                        </Fragment>
                      )}
                    </div>

                    <div className="gnrm-navigation-button">
                      <Link to="identitas" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="previous1">
                          <i className="material-icons">expand_less</i>
                        </button>
                      </Link>
                      <Link to="kegiatan" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="forward1">
                          <i className="material-icons">expand_more</i>
                        </button>
                      </Link>
                    </div>
                  </div>
                </Element>

                <Element id="kegiatan" name="kegiatan">
                  <div className="gnrm-container-off">
                    <div className="gnrm-title">KEGIATAN</div>
                    <div className="form-gnrm">
                      <div>
                        <label>Nama Program</label>
                        <input
                          className="gnrm-nama-program"
                          style={{
                            height: '42px',
                            marginLeft: '93px',
                            width: '767px',
                          }}
                          type="text"
                          name="nama_program"
                          // placeholder='Tuliskan nama kegiatan sesuai dengan matriks pembangunan RPJMN 2020-2024/Renstra K/LD. '
                          value={kegiatan.nama_program}
                          onChange={(event) => onChange(event, 'kegiatan')}
                        />
                      </div>
                      <Fragment>
                        {/* <div>
                          <label>Kegiatan Prioritas</label>
                          {documentDetail && documentDetail.form.kp ? (
                            <select
                              onChange={onChange}
                              className="gnrm-select"
                              name="kp"
                              style={{
                                marginLeft: '70px',
                                width: '767px',
                                height: '42px',
                              }}
                            >
                              {kpOptions &&
                                kpOptions.map((kp, i) => (
                                  <option
                                    key={i}
                                    selected={documentDetail.form.kp === kp && true}
                                    title={kp}
                                    value={kp}
                                  >
                                    {kp.length > 90 ? `${kp.substr(0, 87)}...` : kp}
                                  </option>
                                ))}
                            </select>
                          ) : (
                            <select
                              onChange={onChange}
                              className={
                                kp === '' ? 'gnrm-select test-select1' : 'gnrm-select test-select2'
                              }
                              name="kp"
                              style={{
                                marginLeft: '70px',
                                width: '767px',
                                height: '42px',
                              }}
                            >
                              <option selected={true} hidden>
                                Tuliskan Kegiatan Prioritas (KP) sesuai dengan program/kegiatan
                                Kementerian/Lembaga/Daerah sesuai RPJMN 2020-2024
                              </option>
                              {kpOptions &&
                                kpOptions.map((kp, i) => (
                                  <option key={i} title={kp} value={kp}>
                                    {kp.length > 90 ? `${kp.substr(0, 87)}...` : kp}
                                  </option>
                                ))}
                            </select>
                          )}
                        </div>
                        <div>
                          <label>Proyek Prioritas</label>
                          {documentDetail && selectedKp && propOptions ? (
                            <select
                              onChange={onChange}
                              className="gnrm-select selectpicker"
                              name="prop"
                              style={{
                                marginLeft: '85px',
                                width: '767px',
                              }}
                            >
                              {propOptions &&
                                propOptions.map((prop, i) => (
                                  <option
                                    key={i}
                                    selected={documentDetail.form.prop === prop && true}
                                    title={prop}
                                    value={prop}
                                  >
                                    {prop.length > 90 ? `${prop.substr(0, 87)}...` : prop}
                                  </option>
                                ))}
                              {!selectedKp && (
                                <option>{'Pilih Kegiatan Prioritas\n\nterlebih dahulu'}</option>
                              )}
                            </select>
                          ) : (
                            <select
                              onChange={onChange}
                              className={
                                prop === ''
                                  ? 'gnrm-select test-select1'
                                  : 'gnrm-select test-select2'
                              }
                              name="prop"
                              style={{
                                marginLeft: '85px',
                                width: '767px',
                              }}
                            >
                              <option className="test-red" selected={true} hidden>
                                Tuliskan Proyek Prioritas (PP) sesuai dengan program/kegiatan
                                Kementerian/Lembaga/Daerah sesuai RPJMN 2020-2024
                              </option>
                              {propOptions &&
                                propOptions.map((prop, i) => (
                                  <option key={i} title={prop} value={prop}>
                                    {prop.length > 90 ? `${prop.substr(0, 87)}...` : prop}
                                  </option>
                                ))}
                              {!selectedKp && (
                                <option>{'Pilih Kegiatan Prioritas\n\nterlebih dahulu'}</option>
                              )}
                            </select>
                          )}
                        </div> */}

                        {/* {selectedKp === 'Pusat-pusat Perubahan Revolusi Mental' && ( */}
                        <Fragment>
                          <div>
                            <label>Gerakan</label>
                            {isEditing &&
                            documentDetail?.form.gerakan &&
                            Object.values(selectedGerakan).length > 0 ? (
                              <select
                                onChange={onChange}
                                className="gnrm-select"
                                name="gerakan-0"
                                style={{
                                  marginLeft: '145px',
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
                                  marginLeft: '145px',
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
                                      <label>Gerakan</label>
                                      <select
                                        onChange={onChangeGerakan}
                                        className="gnrm-select"
                                        name={`gerakan-${index + 1}`}
                                        style={{
                                          marginLeft: '145px',
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
                                    <label>Gerakan</label>
                                    <select
                                      onChange={onChangeGerakan}
                                      className="gnrm-select"
                                      name={`gerakan-${index + 1}`}
                                      style={{
                                        marginLeft: '145px',
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
                                    {/* <span
                                        className="remove-form"
                                        onClick={() => onDeleteGerakanForm(index)}
                                      >
                                        <i className=""> x </i>
                                      </span> */}
                                  </div>
                                );
                              })}
                          {/* {formGerakan.length < 4 ? (
                              <div>
                                <label className="tambah-lembaga">Tambah Gerakan</label>
                                <img
                                  src={plus2}
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
                        {/* )} */}
                      </Fragment>
                      <div>
                        <label
                          style={{
                            textAlign: 'right',
                            clear: 'both',
                            float: 'left',
                          }}
                        >
                          Penjelasan
                        </label>
                        <textarea
                          className="gnrm-penjelasan"
                          style={{
                            height: '283px',
                            marginLeft: '127px',
                            width: '767px',
                          }}
                          type="text"
                          placeholder="Tuliskan penjabaran program K/L/D yang akan dilaksanakan sesuai dengan gerakan yang telah dipilih "
                          name="penjelasan_kegiatan"
                          value={kegiatan.penjelasan_kegiatan}
                          onChange={(event) => onChange(event, 'kegiatan', false, 0, true)}
                        />
                      </div>
                      <div style={{ textAlign: 'right', paddingRight: 35 }}>
                        {wordLength.penjelasan_kegiatan}/1000
                      </div>
                    </div>

                    <div className="gnrm-navigation-button">
                      <Link to="gugus_tugas" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="previous1">
                          <i className="material-icons">expand_less</i>
                        </button>
                      </Link>
                      <Link to="output" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="forward1">
                          <i className="material-icons">expand_more</i>
                        </button>
                      </Link>
                    </div>
                  </div>
                </Element>

                <Element id="output" name="output">
                  <div className="gnrm-container-off">
                    <div className="gnrm-title">OUTPUT</div>
                    <div className="form-gnrm">
                      <div>
                        <label
                          style={{
                            textAlign: 'right',
                            clear: 'both',
                            float: 'left',
                          }}
                        >
                          Indikator Capaian
                        </label>
                        <textarea
                          className="gnrm-indikator"
                          style={{
                            height: '150px',
                            marginLeft: '70px',
                            width: '767px',
                          }}
                          type="text"
                          name="indikator_capaian"
                          placeholder="Tuliskan indikator capaian yang menggambarkan output dan outcome dalam program/kegiatan K/L/D terkait dengan GNRM. Capaian outcome juga harus berkolerasi terhadap lima dimensi GNRM yang sifatnya terukur dan berkontribusi pada peningkatan hasil Indeks Capaian Revolusi Mental (ICRM)"
                          value={output.indikator_capaian}
                          onChange={(event) => onChange(event, 'output', false, 0, true)}
                        />
                      </div>
                      <div style={{ textAlign: 'right', paddingRight: 35 }}>
                        {wordLength.indikator_capaian}/1000
                      </div>
                      <div>
                        <label
                          style={{
                            textAlign: 'right',
                            clear: 'both',
                            float: 'left',
                          }}
                        >
                          Sasaran
                        </label>
                        <textarea
                          className="gnrm-sasaran"
                          style={{
                            height: '130px',
                            marginLeft: '149px',
                            width: '767px',
                          }}
                          type="text"
                          name="sasaran"
                          placeholder="Tuliskan sasaran yang akan dicapai dalam setiap pelaksanaan program/kegiatan dari masing-masing K/L/D."
                          value={output.sasaran}
                          onChange={(event) => onChange(event, 'output', false, 0, true)}
                        />
                      </div>
                      <div style={{ textAlign: 'right', paddingRight: 35 }}>
                        {wordLength.sasaran}/1000
                      </div>
                      <div>
                        <label
                          style={{
                            textAlign: 'right',
                            clear: 'both',
                            float: 'left',
                          }}
                        >
                          Target
                        </label>
                        <textarea
                          className="gnrm-target"
                          style={{
                            height: '130px',
                            marginLeft: '161px',
                            width: '767px',
                          }}
                          placeholder="Tuliskan target yang akan dicapai dalam setiap program/kegiatan dari masing-masing K/L/D"
                          type="text"
                          name="target"
                          value={output.target}
                          onChange={(event) => onChange(event, 'output', false, 0, true)}
                        />
                      </div>
                      <div style={{ textAlign: 'right', paddingRight: 35 }}>
                        {wordLength.target}/1000
                      </div>
                    </div>

                    <div className="gnrm-navigation-button">
                      <Link to="kegiatan" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="previous1">
                          <i className="material-icons">expand_less</i>
                        </button>
                      </Link>
                      <Link to="kondisi_awal" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="forward1">
                          <i className="material-icons">expand_more</i>
                        </button>
                      </Link>
                    </div>
                  </div>
                </Element>

                <Element id="kondisi_awal" name="kondisi_awal">
                  <div className="gnrm-container-off">
                    <div className="gnrm-title">KONDISI AWAL</div>
                    <div className="form-gnrm">
                      <div>
                        <label
                          style={{
                            textAlign: 'right',
                            clear: 'both',
                            float: 'left',
                          }}
                        >
                          Penjelasan
                        </label>
                        <textarea
                          className="gnrm-penjelasan"
                          style={{
                            height: '300px',
                            marginLeft: '127px',
                            width: '767px',
                          }}
                          type="text"
                          name="kondisi_awal"
                          placeholder="Tuliskan informasi dasar yang dihimpun sebelum suatu program dari masing-masing K/L/D dilaksanaan bisa berupa data baseline jika program tersebut berupa program lanjutan dan komplementer atau penggambaran kondisi eksisting apabila program/kegiatan K/LD merupakan program/kegiatan baru dan belum pernah di intervensi. Data ini dapat digunakan sebagai acuan untuk meningkatan capaian target program/kegiatan K/L/D secara maksimal"
                          value={kondisi_awal}
                          onChange={(event) => onChange(event, '', false, 0, true)}
                        />
                      </div>
                      <div style={{ textAlign: 'right', paddingRight: 35 }}>
                        {wordLength.kondisi_awal}/1000
                      </div>
                      <div className="div_lampiran">
                        <label>Data Dukung</label>
                        <label htmlFor="testing2" className="label_lampiran">
                          <span
                            style={{
                              marginRight: '5px',
                            }}
                          >
                            +
                          </span>{' '}
                          UNGGAH DOKUMEN/FOTO
                        </label>
                        <input
                          id="testing2"
                          className="gnrm-penjelasan"
                          style={{
                            height: '42px',
                            marginLeft: '28px',
                            width: '767px',
                          }}
                          onChange={onChangeFilesKondisi}
                          type="file"
                          accept=".jpg,.png,.jpeg , application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.presentationml.slideshow , text/plain, application/pdf"
                          name="media"
                          multiple
                        />
                        <h1 className="penjelasan_lampiran_doc">(Ukuran maksimal berkas 25MB)</h1>
                      </div>
                      <div>
                        {lampiranKondisi && lampiranKondisi.length > 0 ? (
                          <div
                            style={{
                              height: 'fit-content',
                              marginLeft: '213px',
                              width: '767px',
                              border: '1px solid #ACACAC',
                              borderRadius: '5px',
                              padding: '10px',
                              display: 'flex',
                              flexWrap: 'wrap',
                              overflow: 'hidden',
                            }}
                          >
                            {lampiranKondisi &&
                              lampiranKondisi.map((lampiran, index) => {
                                const fileType = isFileImage(lampiran);
                                const objectURL = URL.createObjectURL(lampiran);
                                return (
                                  <div key={index}>
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
                                        {/* <img src={objectURL} alt={lampiran.name} className="gnrm-media--image" /> */}
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
                                          onDeleteKondisi(true, lampiran.name, lampiran)
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
                              marginLeft: '213px',
                              width: '767px',
                              border: '1px solid #ACACAC',
                              borderRadius: '5px',
                              padding: '10px',
                              display: 'flex',
                              flexWrap: 'wrap',
                              overflow: 'hidden',
                            }}
                          >
                            {lampiranKondisiUrl &&
                              lampiranKondisiUrl.map((url, index) => {
                                const fileType = isFileImageUrl(url);
                                return (
                                  <div key={index}>
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
                                        {/* <img src={url} alt={getFileName(url)} className="gnrm-media--image" /> */}
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
                                        onClick={(e) => onDeleteKondisi(false, getFileName(url))}
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
                      <div>
                        {kondisiSize > 26214400 ? (
                          <div
                            style={{
                              marginLeft: '217px',
                              color: 'red',
                            }}
                          >
                            Ukuran berkas melebihi ukuran maksimal (25MB)!
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>

                    <div className="gnrm-navigation-button">
                      <Link to="output" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="previous1">
                          <i className="material-icons">expand_less</i>
                        </button>
                      </Link>
                      <Link to="anggaran" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="forward1">
                          <i className="material-icons">expand_more</i>
                        </button>
                      </Link>
                    </div>
                  </div>
                </Element>

                <Element id="anggaran" name="anggaran">
                  <div className="gnrm-container-off">
                    <div className="gnrm-title">ANGGARAN*</div>
                    <div className="form-gnrm">
                      <div>
                        <label>
                          Sumber Anggaran<span style={{ color: '#D4362E' }}>*</span>
                        </label>
                        <input
                          className="gnrm-pendanaan off"
                          style={{
                            height: '42px',
                            marginLeft: '72px',
                            width: '767px',
                          }}
                          type="text"
                          placeholder="Tuliskan rencana anggaran periodik yang disusun berdasarkan program/kegiatan yang telah disusun/disahkan berdasarkan dokumen perencanaan K/L/D"
                          name="sumber_dana"
                          value={anggaran.sumber_dana}
                          onChange={(event) => onChange(event, 'anggaran')}
                        />
                      </div>
                      <div>
                        <label>
                          Besaran Anggaran<span style={{ color: '#D4362E' }}>*</span>{' '}
                          <span
                            style={{
                              marginLeft: '36px',
                            }}
                          >
                            Rp.
                          </span>
                        </label>
                        <input
                          className="gnrm-anggaran off"
                          style={{
                            height: '42px',
                            marginLeft: '4px',
                            width: '767px',
                          }}
                          placeholder="Rencana anggaran ini harus memuat sumber anggaran, besaran anggaran dan peruntukan anggaran"
                          type="text"
                          name="besar_anggaran"
                          value={anggaran.besar_anggaran}
                          onChange={(event) => onChange(event, 'anggaran')}
                        />
                      </div>
                    </div>

                    <div className="gnrm-navigation-button">
                      <Link to="kondisi_awal" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="previous1">
                          <i className="material-icons">expand_less</i>
                        </button>
                      </Link>
                      <Link to="pihak_terkait" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="forward1">
                          <i className="material-icons">expand_more</i>
                        </button>
                      </Link>
                    </div>
                  </div>
                </Element>

                {/* <Element id="proses" name="proses">
                  <div className="gnrm-container-off">
                    <div className="gnrm-title">PERKEMBANGAN PELAKSANAAN KEGIATAN</div>
                    <div className="form-gnrm">
                      <div>
                        <label
                          style={{
                            textAlign: 'left',
                            clear: 'both',
                            float: 'left',
                          }}
                        >
                          Proses Pelaksanaan <br /> Kegiatan
                        </label>
                        <textarea
                          className="gnrm-penjelasan"
                          style={{
                            height: '400px',
                            marginLeft: '55px',
                            width: '767px',
                          }}
                          type="text"
                          placeholder="Tuliskan seluruh proses dan mekanisme pelaksanaan program/kegiatan K/L/D yang meliputi tahap perencanaan, pelaksanaan sampai dengan monitoring dan evaluasi berserta kebutuhan dan sumberdaya yang diperlukan, proses koordinasi, serta prihal lain yang mendukung pelaksanaan program/kegiatan K/L/D yang terkait dengan pelaksanaan GNRM. Proses pelaksanaan kegiatan ini juga harus memuat rangkaian kegiatan tindak lanjut perencanaan program atau langkah yang strategis maupun operasional atau kebijakan sebagai bentuk penguatan pencapaian target dan sasaran berbasis outcome. "
                          name="proses"
                          value={proses}
                          onChange={(event) => onChange(event)}
                        />
                      </div>
                      <div className="div_lampiran">
                        <label>Data Dukung</label>
                        <label htmlFor="testing3" className="label_lampiran">
                          <span
                            style={{
                              marginRight: '5px',
                            }}
                          >
                            +
                          </span>{' '}
                          UNGGAH DOKUMEN/FOTO
                        </label>
                        <input
                          id="testing3"
                          className="gnrm-penjelasan"
                          style={{
                            height: '42px',
                            marginLeft: '28px',
                            width: '767px',
                          }}
                          onChange={onChangeFilesProses}
                          type="file"
                          accept=".jpg,.png,.jpeg , application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.presentationml.slideshow , text/plain, application/pdf"
                          name="media"
                          multiple
                        />
                        <h1 className="penjelasan_lampiran_doc">(Ukuran maksimal berkas 25MB)</h1>
                      </div>
                      <div>
                        {lampiranProses && lampiranProses.length > 0 ? (
                          <div
                            style={{
                              height: 'fit-content',
                              marginLeft: '213px',
                              width: '767px',
                              border: '1px solid #ACACAC',
                              borderRadius: '5px',
                              padding: '10px',
                              display: 'flex',
                              flexWrap: 'wrap',
                              overflow: 'hidden',
                            }}
                          >
                            {lampiranProses &&
                              lampiranProses.map((lampiran, index) => {
                                const fileType = isFileImage(lampiran);
                                const objectURL = URL.createObjectURL(lampiran);
                                return (
                                  <div key={index}>
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
                                          onDeleteProses(true, lampiran.name, lampiran)
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
                              marginLeft: '213px',
                              width: '767px',
                              border: '1px solid #ACACAC',
                              borderRadius: '5px',
                              padding: '10px',
                              display: 'flex',
                              flexWrap: 'wrap',
                              overflow: 'hidden',
                            }}
                          >
                            {lampiranProsesUrl &&
                              lampiranProsesUrl.map((url, index) => {
                                const fileType = isFileImageUrl(url);
                                return (
                                  <div key={index}>
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
                                        onClick={(e) => onDeleteProses(false, getFileName(url))}
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
                      <div>
                        {prosesSize > 26214400 ? (
                          <div
                            style={{
                              marginLeft: '217px',
                              color: 'red',
                            }}
                          >
                            Ukuran berkas melebihi ukuran maksimal (25MB)!
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>

                    <div className="gnrm-navigation-button">
                      <Link to="anggaran" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="previous1">
                          <i className="material-icons">expand_less</i>
                        </button>
                      </Link>
                      <Link to="pihak_terkait" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="forward1">
                          <i className="material-icons">expand_more</i>
                        </button>
                      </Link>
                    </div>
                  </div>
                </Element> */}

                <Element name="pihak_terkait" id="pihak_terkait">
                  <div className="gnrm-container-off">
                    <div className="gnrm-title">PIHAK TERKAIT</div>
                    <div className="form-gnrm">
                      {!documentDetail ? (
                        <Fragment>
                          {/* <div>
                                                                <label>Peran Pihak Terkait</label>
                                                                <input
                                                                    className="gnrm-terkait"
                                                                    style={{
                                                                        height: "42px",
                                                                        marginLeft: "57px",
                                                                        width: "767px"
                                                                    }}
                                                                    type="text"
                                                                    name="peran"
                                                                    value={data.pihak_terkait.peran}
                                                                    onChange={(event) => onChange(event, 'pihak_terkait', true, 0)}
                                                                />
                                                            </div> */}
                          <div>
                            <label>K/L/D/Pihak Lainnya</label>
                            <input
                              className="gnrm-terkait"
                              style={{
                                height: '42px',
                                marginLeft: '49px',
                                width: '767px',
                              }}
                              type="text"
                              placeholder="Tuliskan semua pihak yang terlibat dalam pelaksanaan program K/L/D."
                              name="lembaga"
                              value={data.pihak_terkait.lembaga}
                              onChange={(event) => onChange(event, 'pihak_terkait', true, 0)}
                            />
                          </div>
                          <div>
                            <label
                              style={{
                                textAlign: 'right',
                                clear: 'both',
                                float: 'left',
                              }}
                            >
                              Penjelasan
                            </label>
                            <textarea
                              className="gnrm-penjelasan"
                              style={{
                                height: '400px',
                                marginLeft: '127px',
                                width: '767px',
                              }}
                              type="text"
                              placeholder="Tuliskan mengenai kontribusi dari masing-masing pihak yang terlibat dalam mencapai hasil yang diharapkan"
                              name="penjelasan_pihak_terkait"
                              value={data.pihak_terkait.penjelasan_pihak_terkait}
                              onChange={(event) => onChange(event, 'pihak_terkait', true, 0, true)}
                            />
                          </div>
                        </Fragment>
                      ) : (
                        documentDetail &&
                        documentDetail.form &&
                        documentDetail.form?.pihak_terkait.map((pihak, index) => {
                          return (
                            <Fragment key={index}>
                              {/* <div>
                                                                        <label>Peran Pihak Terkait</label>
                                                                        <input
                                                                            className="gnrm-terkait"
                                                                            style={{
                                                                                height: "42px",
                                                                                marginLeft: "57px",
                                                                                width: "767px"
                                                                            }}
                                                                            type="text"
                                                                            name="peran"
                                                                            value={data.pihak_terkait[index] && data.pihak_terkait[index].peran}
                                                                            onChange={(event) => onChange(event, 'pihak_terkait', true, index)}
                                                                        />
                                                                    </div> */}
                              <div>
                                <label>K/L/D/Pihak Lainnya</label>
                                <input
                                  className="gnrm-terkait"
                                  style={{
                                    height: '42px',
                                    marginLeft: '49px',
                                    width: '767px',
                                  }}
                                  type="text"
                                  placeholder="Tuliskan semua pihak yang terlibat dalam pelaksanaan program K/L/D."
                                  name="lembaga"
                                  value={
                                    data.pihak_terkait[index] && data.pihak_terkait[index].lembaga
                                  }
                                  onChange={(event) =>
                                    onChange(event, 'pihak_terkait', true, index)
                                  }
                                />
                              </div>
                              <div>
                                <label
                                  style={{
                                    textAlign: 'right',
                                    clear: 'both',
                                    float: 'left',
                                  }}
                                >
                                  Penjelasan
                                </label>
                                <textarea
                                  className="gnrm-penjelasan"
                                  style={{
                                    height: '400px',
                                    marginLeft: '127px',
                                    width: '767px',
                                  }}
                                  placeholder="Tuliskan mengenai kontribusi dari masing-masing pihak yang terlibat dalam mencapai hasil yang diharapkan"
                                  type="text"
                                  name="penjelasan_pihak_terkait"
                                  value={
                                    data.pihak_terkait[index] &&
                                    data.pihak_terkait[index].penjelasan_pihak_terkait
                                  }
                                  onChange={(event) =>
                                    onChange(event, 'pihak_terkait', true, index, true)
                                  }
                                />
                              </div>
                            </Fragment>
                          );
                        })
                      )}
                      {form.map((form, index) => {
                        return (
                          <Fragment key={index + panjang}>
                            {/* <div>
                                                                    <label>Peran Pihak Terkait</label>
                                                                    <input
                                                                        className="gnrm-terkait"
                                                                        style={{
                                                                            height: "42px",
                                                                            marginLeft: "57px",
                                                                            width: "767px"
                                                                        }}
                                                                        type="text"
                                                                        name="peran"
                                                                        value={data.pihak_terkait.peran}
                                                                        onChange={(event) => onChange(event, 'pihak_terkait', true, index + panjang)}
                                                                    />
                                                                </div> */}
                            <div>
                              <label>K/L/D/Pihak Lainnya</label>
                              <input
                                className="gnrm-terkait"
                                style={{
                                  height: '42px',
                                  marginLeft: '49px',
                                  width: '767px',
                                }}
                                placeholder="Tuliskan semua pihak yang terlibat dalam pelaksanaan program K/L/D."
                                type="text"
                                name="lembaga"
                                value={data.pihak_terkait.lembaga}
                                onChange={(event) =>
                                  onChange(event, 'pihak_terkait', true, index + panjang)
                                }
                              />
                            </div>
                            <div>
                              <label
                                style={{
                                  textAlign: 'right',
                                  clear: 'both',
                                  float: 'left',
                                }}
                              >
                                Penjelasan
                              </label>
                              <textarea
                                className="gnrm-penjelasan"
                                style={{
                                  height: '400px',
                                  marginLeft: '127px',
                                  width: '767px',
                                }}
                                placeholder="Tuliskan mengenai kontribusi dari masing-masing pihak yang terlibat dalam mencapai hasil yang diharapkan"
                                type="text"
                                name="penjelasan_pihak_terkait"
                                value={data.pihak_terkait.penjelasan_pihak_terkait}
                                onChange={(event) =>
                                  onChange(event, 'pihak_terkait', true, index + panjang, true)
                                }
                              />
                            </div>
                          </Fragment>
                        );
                      })}
                    </div>
                    <div>
                      <label className="tambah-lembaga">Tambah K/L/D/Pihak Lainnya</label>
                      <img
                        src={plus2}
                        style={{
                          position: 'absolute',
                          marginTop: '-3px',
                          marginLeft: '20px',
                          cursor: 'pointer',
                        }}
                        onClick={addForm}
                      />
                    </div>

                    <div className="gnrm-navigation-button">
                      <Link to="anggaran" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="previous1">
                          <i
                            className="material-icons"
                            style={{
                              fontSize: '36px',
                            }}
                          >
                            expand_less
                          </i>
                        </button>
                      </Link>

                      <Link
                        to="penanggung_jawab"
                        spy={true}
                        smooth={true}
                        duration={500}
                        offset={-30}
                      >
                        <button className="forward1">
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
                {/* 
                                    <Element id='lampiran' name='lampiran'>
                                        <div className="gnrm-container-off">
                                            <div className="gnrm-title">
                                                LAMPIRAN MEDIA
                                        </div>
                                            <div className="form-gnrm">
                                                <div>
                                                    <label>Lampiran Media</label>
                                                    <label htmlFor='testing' className='label_lampiran'><span style={{ marginRight: '15px' }}>+</span> UNGGAH DOKUMEN/FOTO</label>
                                                    <input
                                                        id="testing"
                                                        className="gnrm-penjelasan"
                                                        style={{
                                                            height: "42px",
                                                            marginLeft: "28px",
                                                            width: "767px"
                                                        }}
                                                        onChange={onChangeFiles}
                                                        type="file"
                                                        accept=".jpg,.png,.jpeg"
                                                        name="media"
                                                        multiple
                                                    />
                                                </div>
                                                <div>
                                                    {
                                                        media && media.length > 0 ? (
                                                            <div style={{
                                                                height: "fit-content",
                                                                marginLeft: "213px",
                                                                width: "767px",
                                                                border: '1px solid #ACACAC',
                                                                borderRadius: '5px',
                                                                padding: '10px',
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                                overflow: 'hidden'
                                                            }}
                                                            >
                                                                {
                                                                    media && media.map((media, index) => {
                                                                        const objectURL = URL.createObjectURL(media)
                                                                        return (
                                                                            <div key={index}>
                                                                                <div style={{
                                                                                    width: '150px',
                                                                                    height: '150px',
                                                                                    backgroundColor: 'pink',
                                                                                    marginRight: '35px',
                                                                                    position: 'relative'
                                                                                }}
                                                                                    className="d-flex align-items-center justify-content-center"
                                                                                >
                                                                                    <div style={{ width: '150px', height: '150px', overflow: 'hidden', position: 'absolute' }}>
                                                                                        <img src={objectURL} alt={media.name} className="gnrm-media--image" />
                                                                                    </div>
                                                                                    <div style={{
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
                                                                                        color: 'white'
                                                                                    }}
                                                                                        onClick={(e) => onDeleteMedia(true, media.name, media)}> X </div>
                                                                                </div>
                                                                                <div style={{
                                                                                    marginTop: '10px',
                                                                                    width: '150px',
                                                                                    height: '20px',
                                                                                    wordWrap: 'break-word',
                                                                                    lineHeight: '20px',
                                                                                }}
                                                                                >
                                                                                    <p className="gnrm-media--name">
                                                                                        {media.name.length > 18 ? `${media.name.substr(0, 15)}...` : media.name}
                                                                                    </p>
                                                                                </div>

                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        ) : (
                                                                <div style={{
                                                                    height: "fit-content",
                                                                    marginLeft: "213px",
                                                                    width: "767px",
                                                                    border: '1px solid #ACACAC',
                                                                    borderRadius: '5px',
                                                                    padding: '10px',
                                                                    display: 'flex',
                                                                    flexWrap: 'wrap',
                                                                    overflow: 'hidden'
                                                                }}
                                                                >
                                                                    {
                                                                        mediaUrl && mediaUrl.map((url, index) => {
                                                                            return (
                                                                                <div key={index}>
                                                                                    <div style={{
                                                                                        width: '150px',
                                                                                        height: '150px',
                                                                                        backgroundColor: 'pink',
                                                                                        marginRight: '35px',
                                                                                        position: 'relative'
                                                                                    }}
                                                                                        className="d-flex align-items-center justify-content-center"
                                                                                    >
                                                                                        <div style={{ width: '150px', height: '150px', overflow: 'hidden', position: 'absolute' }}>
                                                                                            <img src={url} alt={getFileName(url)} className="gnrm-media--image" />
                                                                                        </div>
                                                                                        <div style={{
                                                                                            position: 'absolute',
                                                                                            backgroundColor: '#C04B3E',
                                                                                            width: '25px',
                                                                                            height: '25px',
                                                                                            borderRadius: '50%',
                                                                                            top: '-7px',
                                                                                            right: '-7px',
                                                                                            lineHeight: '25px',
                                                                                            textAlign: 'center',
                                                                                            cursor: 'pointer'
                                                                                        }}
                                                                                            onClick={(e) => onDeleteMedia(false, getFileName(url))}> X </div>
                                                                                    </div>
                                                                                    <div style={{
                                                                                        marginTop: '10px',
                                                                                        width: '150px',
                                                                                        height: '20px',
                                                                                        wordWrap: 'break-word',
                                                                                        lineHeight: '20px'
                                                                                    }}
                                                                                    >
                                                                                        <p className="gnrm-media--name">
                                                                                            {getFileName(url)}
                                                                                        </p>
                                                                                    </div>

                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            )
                                                    }
                                                </div>
                                            </div>

                                            <div className="gnrm-navigation-button">
                                                <Link
                                                    to="pihak_terkait"
                                                    spy={true}
                                                    smooth={true}
                                                    duration={500}
                                                    offset={-30}
                                                >
                                                    <button className="previous1"><i className="material-icons">expand_less</i></button>
                                                </Link>
                                                <Link
                                                    to="penanggung_jawab"
                                                    spy={true}
                                                    smooth={true}
                                                    duration={500}
                                                    offset={-30}
                                                >
                                                    <button className="forward1"><i className="material-icons">expand_more</i></button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Element> */}

                <Element id="penanggung_jawab" name="penanggung_jawab">
                  <div className="gnrm-container-off" style={{ marginBottom: '130px' }}>
                    <div className="monev-title">PENANGGUNG JAWAB</div>
                    <div className="form-gnrm">
                      <div>
                        <label>Nama</label>
                        <input
                          className="gnrm-eselon"
                          style={{
                            height: '42px',
                            marginLeft: '164px',
                            width: '403px',
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
                          className="gnrm-nip"
                          style={{
                            height: '42px',
                            marginLeft: '150px',
                            width: '403px',
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
                          className="gnrm-lampiran"
                          style={{
                            height: '42px',
                            marginLeft: '184px',
                            width: '403px',
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

                    <div className="gnrm-navigation-button">
                      <Link to="pihak_terkait" spy={true} smooth={true} duration={500} offset={-30}>
                        <button className="previous-last-11">
                          <i className="material-icons">expand_less</i>
                        </button>
                      </Link>

                      <button className="simpan-gnrm" type="submit">
                        SIMPAN PERUBAHAN
                      </button>

                      <button className="preview-gnrm" onClick={setPreview}>
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
        <div className="title-preview-page">PRATINJAU RENCANA PELAKSANAAN PROGRAM</div>
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
                      PROGRAM PELAKSANAAN
                    </h1>
                    <h1
                      style={{
                        lineHeight: '25px',
                        fontWeight: 'bold',
                      }}
                    >
                      GERAKAN NASIONAL REVOLUSI MENTAL Tahun {data.tahun}
                    </h1>
                    <h1 style={{ lineHeight: '25px' }}>
                      Periode Perencanaan Program:{' '}
                      {data.periode === 'Jan-Mei' ? 'Januari-Mei' : 'Juli-November'}
                    </h1>
                  </div>
                </div>

                <div
                  className="preview-body"
                  style={{
                    margin: '100px auto 0',
                    width: '1042px',
                    textAlign: 'justify',
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
                      <tr style={{ fontWeight: 'bold' }}>
                        <td>1.</td>
                        <td>Gugus Tugas GNRM</td>
                      </tr>
                      {data.sk_no ? (
                        <>
                          <tr>
                            <td></td>
                            <td
                              style={{
                                paddingTop: '12px',
                                paddingBottom: '32px',
                              }}
                            >
                              Nomor SK: {data.sk_no}
                            </td>
                          </tr>
                          <tr>
                            <td></td>
                            <td
                              style={{
                                paddingTop: '12px',
                                paddingBottom: '32px',
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
                                {skFile &&
                                  skFile
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
                        </>
                      ) : (
                        <tr>
                          <td></td>
                          <td
                            style={{
                              paddingTop: '12px',
                              paddingBottom: '32px',
                            }}
                          >
                            Belum ada
                          </td>
                        </tr>
                      )}
                      <tr style={{ fontWeight: 'bold' }}>
                        <td>2.</td>
                        <td>Kegiatan</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td
                          style={{
                            paddingTop: '12px',
                            paddingBottom: '32px',
                          }}
                        >
                          <div>Nama Kegiatan : {data.kegiatan.nama_program}</div>
                          <br />
                          <div>Pemilihan 5 Gerakan : {data.gerakan}</div>
                          <br />
                          <pre>{data.kegiatan.penjelasan_kegiatan}</pre>
                        </td>
                      </tr>
                      <tr style={{ fontWeight: 'bold' }}>
                        <td>3.</td>
                        <td>Output</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td
                          style={{
                            paddingTop: '12px',
                            paddingBottom: '32px',
                          }}
                        >
                          <div>Indikator Capaian:</div>
                          <pre>{data.output.indikator_capaian}</pre>
                          <br />
                          <div>Sasaran:</div>
                          <pre>{data.output.sasaran}</pre>
                          <br />
                          <div>Target:</div>
                          <pre>{data.output.target}</pre>
                        </td>
                      </tr>
                      <tr style={{ fontWeight: 'bold' }}>
                        <td>4.</td>
                        <td>Kondisi Awal</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td
                          style={{
                            paddingTop: '12px',
                            paddingBottom: '32px',
                          }}
                        >
                          <pre>{data.kondisi_awal}</pre>
                          <br />
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td
                          style={{
                            paddingTop: '12px',
                            paddingBottom: '32px',
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
                            {lampiranKondisi &&
                              lampiranKondisi
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
                            paddingTop: '12px',
                            paddingBottom: '32px',
                          }}
                        >
                          {lampiranKondisi &&
                            lampiranKondisi
                              .filter((lampiran) => isFileImage(lampiran) === false)
                              .map((lampiran, index) => {
                                const objectURL = URL.createObjectURL(lampiran);
                                return (
                                  <p
                                    className="gnrm-media--name"
                                    style={{
                                      textAlign: 'left',
                                    }}
                                  >
                                    {lampiran.name}
                                  </p>
                                );
                              })}
                        </td>
                      </tr>
                      <tr style={{ fontWeight: 'bold' }}>
                        <td>5.</td>
                        <td>Anggaran</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td
                          style={{
                            paddingTop: '12px',
                          }}
                        >
                          {' '}
                          <div>Sumber Pendanaan:</div>
                          <pre>{data.anggaran.sumber_dana}</pre>
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td
                          style={{
                            paddingTop: '12px',
                            paddingBottom: '32px',
                          }}
                        >
                          <pre>Besaran Anggaran: Rp. {data.anggaran.besar_anggaran}</pre>
                        </td>
                      </tr>
                      <tr style={{ fontWeight: 'bold' }}>
                        <td>6.</td>
                        <td>Pihak Terkait</td>
                      </tr>
                      {documentDetail
                        ? (documentDetail && documentDetail.form.pihak_terkait).map(
                            (pihak, index) => {
                              return (
                                <tr key={index}>
                                  <td></td>
                                  <td
                                    style={{
                                      paddingTop: '12px',
                                      paddingBottom: '32px',
                                    }}
                                  >
                                    K/L/D/Pihak Lainnya :{' '}
                                    {data.pihak_terkait[index] && data.pihak_terkait[index].lembaga}{' '}
                                    <br />
                                    Penjelasan :{' '}
                                    {data.pihak_terkait[index] &&
                                      data.pihak_terkait[index].penjelasan_pihak_terkait}
                                  </td>
                                </tr>
                              );
                            },
                          )
                        : ''}
                      {/* <tr style={{ fontWeight: 'bold' }}>
                                    <td>8.</td>
                                    <td>Lampiran Media</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td style={{ paddingTop: '12px', paddingBottom: '32px' }}>
                                        <div style={{
                                            height: "fit-content",
                                            width: "955px",
                                            borderRadius: '5px',
                                            padding: '10px',
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            overflow: 'hidden'
                                        }}
                                        >
                                            {
                                                media && media.map((lampiran,index) => {
                                                const objectURL = URL.createObjectURL(lampiran)
                                                return(
                                                    <div key={index}>
                                                        <div style={{
                                                            width: '420px',
                                                            height: '420px',
                                                            marginRight: '35px',
                                                            position: 'relative'
                                                        }}
                                                            className="d-flex align-items-center justify-content-center"
                                                        >
                                                            <div style={{ width: '420px', height: '420px', overflow: 'hidden', position: 'relative' }}>
                                                                <img src={objectURL} alt={lampiran.name} style={{ width: '420px', height: '420px' , objectFit:'contain'}} />
                                                            </div>
                                                        </div>
                                                        <div style={{
                                                            marginTop: '10px',
                                                            width: '420px',
                                                            height: '20px',
                                                            wordWrap: 'break-word',
                                                            lineHeight: '20px',
                                                        }}
                                                        >
                                                            <p className="gnrm-media--name" style={{textAlign:'center'}}>
                                                                {lampiran.name.length > 40 ? `${lampiran.name.substr(0, 37)}...` : lampiran.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )  
                                                })
                                            }
                                        </div>
                                    </td>
                                </tr> */}
                      <tr>
                        <td></td>
                        <td
                          style={{
                            paddingTop: '20px',
                          }}
                        >
                          Demikian program ini disampaikan dan dapat dikoordinasikan untuk
                          dilaksanakan sebagaimana mestinya, <br />
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
                    <img src={logo_footer} style={{ width: 120 }} />
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
                    <img src={logo_footer} style={{ width: 120 }} />
                  </div>
                </div>

                <button className="button-edit-kembali" onClick={setPreview}>
                  SUNTING KEMBALI
                </button>

                <button className="button-unggah" type="submit" form="form-gnrm">
                  UNGGAH LAPORAN
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* -------------------------- PREVIEW SECTION END HERE ---------------------------------*/}
    </Fragment>
  );
};

export default FormGNRM;
