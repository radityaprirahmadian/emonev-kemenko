import React, { Component, Fragment, useContext, useState, useEffect } from "react"
import "./TabelMonev.css"
import { ArtikelContext } from "../../context/Artikel/artikelContext"
import { AuthContext } from "../../context/Auth/AuthContext"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { useHistory } from "react-router-dom"
import axios from "axios"
import download from "../../assets/download.png"
import DownloadMonev from "../Download/DownloadMonev"
import edit from "../../assets/edit.png"
import hapus from "../../assets/delete.png"

const TabelMonev = (props) => {
    const { getDocumentDetail, documentDetail, resetDocument, editDocument } = useContext(ArtikelContext)
    const { userDetail, user } = useContext(AuthContext)
    const history = useHistory()
    const [hapuss, setHapus] = useState(false)

    const id = props.id
    const type = "monev"
    const token = localStorage.getItem("token")

    const [document, setDocument] = useState({
        document1: "",
        instansi: "",
    })
    const [show, setHide] = useState(false)

    useEffect(() => {
        const getDocumentDetail = async () => {
            const config = {
                headers: {
                    "X-Auth-Token": `Bearer ${token}`,
                },
            }
            try {
                const res = await axios.get(
                    `https://api.simonev.revolusimental.go.id/api/v1/document/${id}?type=${type}`,
                    config
                )
                setDocument({
                    document1: res.data.document,
                    instansi: res.data.instansi,
                })
                setHide(true)
            } catch (err) {
                console.log(err)
            }
        }
        getDocumentDetail()
    }, [])

    const onClickEdit = () => {
        history.push(
            `/${userDetail && userDetail.role === "owner" ? "super-admin" : "admin"}/formulir-monev-edit/${props.id}`
        )
    }

    const onDelete = (e) => {
        e.preventDefault()
        setHapus(true)
    }

    const onHapus = (e) => {
        e.preventDefault()
        props.delete(props.id)
        setHapus(false)
    }

    const onTidakHapus = (e) => {
        e.preventDefault()
        setHapus(false)
    }

    return (
        <Fragment>
            {hapuss ? (
                <div
                    style={{
                        position: "fixed",
                        top: "0",
                        bottom: "0",
                        left: "0",
                        right: "0",
                        zIndex: "9998",
                        backgroundColor: "rgba(0,0,0,0.4)",
                    }}
                >
                    <div
                        className="popup_delete"
                        style={{
                            width: "400px",
                            height: "300px",
                            borderRadius: "10px",
                            padding: "28px",
                            zIndex: "9998",
                            backgroundColor: "white",
                            position: "fixed",
                            top: "20%",
                            left: "40%",
                        }}
                    >
                        <h1
                            style={{
                                textAlign: "center",
                                fontWeight: "700",
                                marginBottom: "32px",
                                fontSize: "18px",
                            }}
                        >
                            Konfirmasi
                        </h1>
                        <br />
                        <h1
                            style={{
                                fontSize: "18px",
                                textAlign: "center",
                                fontWeight: "normal",
                                lineHeight: "20px",
                            }}
                        >
                            Apakah anda yakin akan menghapus <br /> laporan ini?
                        </h1>
                        <div style={{ marginTop: "30px", textAlign: "center" }}>
                            <button
                                onClick={onHapus}
                                className="preview-gnrm"
                                style={{
                                    width: "294px",
                                    fontSize: "24px",
                                    height: "50px",
                                    borderRadius: "20px",
                                    backgroundColor: "#D4362E",
                                    color: "white",
                                    marginBottom: "16px",
                                    boxShadow: "none",
                                }}
                            >
                                Ya
                            </button>
                            <br />
                            <button
                                onClick={onTidakHapus}
                                className="preview-gnrm"
                                style={{
                                    width: "294px",
                                    fontSize: "24px",
                                    height: "50px",
                                    borderRadius: "20px",
                                    backgroundColor: "#E9E9E9",
                                    color: "#656A6A",
                                    boxShadow: "none",
                                }}
                            >
                                Tidak
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}
            <tr>
                <td>{props.tahun}</td>
                <td>{props.kp.length > 78 ? `${props.kp.substr(0, 75)}...` : props.kp}</td>
                <td>{props.prop.length > 78 ? `${props.prop.substr(0, 75)}...` : props.prop}</td>
                <td className={user && user.role === "owner" ? "" : "d-none"}>{props.instansi}</td>
                <td>{props.periode}</td>
                <td>{props.penanggung_jawab}</td>
                <td>
                    {show ? (
                        <PDFDownloadLink
                            document={<DownloadMonev data={document} />}
                            fileName={`${document.document1.form.kegiatan.nama_program}.pdf`}
                        >
                            <button className="button-download">
                                <img src={download} />
                            </button>
                        </PDFDownloadLink>
                    ) : (
                        ""
                    )}
                </td>
                <td>
                    <button className="button-download">
                        <img src={edit} onClick={onClickEdit} />
                    </button>
                </td>
                <td>
                    <button className="button-download">
                        <img src={hapus} onClick={onDelete} />
                    </button>
                </td>
            </tr>
        </Fragment>
    )
}

export default TabelMonev
