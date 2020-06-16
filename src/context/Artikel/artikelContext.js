import React , {useState, useReducer , createContext} from 'react';
import axios from 'axios'
import artikelReducer from './artikelReducer'

export const ArtikelContext = createContext();

const ArtikelState = props => {
    const intialState = {
        token: localStorage.getItem('token'),
        documentDetail: null,
        isEditing: false,
        isPreviewing : false,
    }

    const [state , dispatch] = useReducer(artikelReducer,intialState)
    console.log(state.isPreviewing)

    const getDocumentDetail = async (data) => {
        const config = {
            headers: {
                'X-Auth-Token': `aweuaweu ${state.token}`
            }
        }
        try {
            const res = await axios.get(`https://test.bariqmbani.me/api/v1/document/${data.id}?type=${data.type}`,config)
            dispatch({
                type: 'GET_DOCUMENT_DETAIL',
                payload: res.data.document
            })
            console.log(res.data.document)
        }
        catch (err) {
            console.log(err)
        }
    }

    const resetDocument = () => {
        dispatch({
            type: 'RESET_DOCUMENT'
        })
    }

    const editDocument = () => {
        dispatch({
            type: 'EDIT_DOCUMENT'
        })
    }

    const editDocumentFalse = () => {
        dispatch({
            type: 'EDIT_DOCUMENT_FALSE'
        })
    }

    const preview = () => {
        dispatch({
            type: 'SET_PREVIEW'
        })
    }
    return(
        <ArtikelContext.Provider 
            value={{
                documentDetail: state.documentDetail,
                isEditing: state.isEditing,
                isPreviewing: state.isPreviewing,
                getDocumentDetail,
                resetDocument,
                editDocument,
                editDocumentFalse,
                preview
            }}
            >
            {props.children}
        </ArtikelContext.Provider>
    )
}

export default ArtikelState