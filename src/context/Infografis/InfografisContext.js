import React , { createContext, useReducer } from 'react'
import InfografisReducer from './InfografikReducer'
import axios from 'axios'

export const InfografisContext = createContext()

const InfografisState = (props) => {
    const initialState = {
        infografisDetail: null,
        isEditing: false
    };

    const [ state, dispatch] = useReducer(InfografisReducer , initialState)

    const setInfografis = async (id) => {
        const config = {
            headers: {
                'X-Auth-Token': `aweuaweu ${state.token}`
            }
        }
        try {
            const res = await axios.get(`https://test.bariqmbani.me/api/v1/kabar/${id}`,config)
            dispatch({
                type: 'SET_INFOGRAFIS',
                payload: res.data.kabar
            })
            console.log(res.data.kabar)
        }
        catch (err) {
            console.log(err)
        }
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
    return(
        <InfografisContext.Provider
            value={{
                infografisDetail: state.infografisDetail,
                isEditing: state.isEditing,
                setInfografis,
                editDocument,
                editDocumentFalse
            }}
        >
            {props.children}
        </InfografisContext.Provider>
    )
}

export default InfografisState;