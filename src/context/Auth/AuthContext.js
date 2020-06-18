import React, {createContext, useReducer, useEffect , useState, useContext} from 'react';
import AuthReducer from './AuthReducer';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import setAuthToken from './SetAuthToken'
import { NotifContext } from '../Notifikasi/NotifContext';


export const AuthContext =  createContext();


const AuthState = (props) => {
    const initialState = {
        token: localStorage.getItem('token'),
        isAuthenticated: false,
        loading: true,
        user: null,
        userDetail: null,
        error: null,
        fail: false,
        remember: false
    };
    
    const [state, dispatch] = useReducer(AuthReducer,initialState)

    let ingat = 'no'
    if (state.remember === true ) {
        ingat = 'yes'
    }

    console.log(ingat)

    const loadUser = async () => {
        const config= {
            headers: {
                'X-Auth-Token': `aweuaweu ${state.token}`
            }
        }
        try {
            const res = await axios.get('https://api.simonev.revolusimental.go.id/api/v1/auth', config)
            dispatch({
                type: 'USER_LOADED',
                payload: res.data.user
            })
            getUserDetail(res.data.user._id) 
        }
        catch (err) {
            dispatch({
                type: 'AUTH_ERROR'
            })
            console.log(err.response.data.message)
            alert(err.response.data.message)      
        }
    }
    
    const getUserDetail = async (id) => {
        const config = {
            headers: {
                'X-Auth-Token': `aweuaweu ${state.token}`
            }
        }
        try {
            const res = await axios.get(`https://api.simonev.revolusimental.go.id/api/v1/user/${id}`,config)
            dispatch({
                type: 'GET_USER_DETAIL',
                payload: res.data.user
            })
        }
        catch (err) {
            console.log(err)
            // alert(err.response.data.message)
        }
    }

    const login = async (formData) => {
        const config= {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.post(`https://api.simonev.revolusimental.go.id/api/v1/auth?remember=${ingat}`,formData,config)
            dispatch({
                    type: 'LOGIN',
                    payload: res.data
                })    
            } 
        catch(err){
			dispatch({
				type: 'LOGIN_FAIL',
				payload: err.response.data
            })
           alert(err.response.data.message)
        }
    }

    const logout = () => {
        dispatch({
            type: 'LOGOUT'
        })
    }

    const rememberToken = () => {
        dispatch({
            type: 'REMEMBER_TOKEN'
        })
    }

    return (
        <AuthContext.Provider
            value={{ 
                isAuthenticated: state.isAuthenticated,
                fail: state.fail,
                token: state.token,
                loading: state.loading,
                user: state.user,
                error: state.error,
                userDetail: state.userDetail,
                remember: state.remember,
                rememberToken,
                logout,
                login,
                loadUser,
                getUserDetail
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthState;
