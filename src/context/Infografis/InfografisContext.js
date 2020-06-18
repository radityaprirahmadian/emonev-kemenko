import React , { createContext, useReducer } from 'react'
import InfografisReducer from './InfografikReducer'
import axios from 'axios'

export const InfografisContext = createContext()

const InfografisState = (props) => {
    const initialState = {
        infografisDetail: null
    };

    const [ state, dispatch] = useReducer(InfografisReducer , initialState)

    const setInfografis = async (id) => {
        const config = {
            headers: {
                'X-Auth-Token': `aweuaweu ${state.token}`
            }
        }
        try {
            const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/infografis/${id}`,config)
            dispatch({
                type: 'SET_INFOGRAFIS',
                payload: res.data.infografis
            })
            console.log(res.data.infografis)
        }
        catch (err) {
            console.log(err)
        }
    }


    return(
        <InfografisContext.Provider
            value={{
                infografisDetail: state.infografisDetail,
                setInfografis
            }}
        >
            {props.children}
        </InfografisContext.Provider>
    )
}

export default InfografisState;