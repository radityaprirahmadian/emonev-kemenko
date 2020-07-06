export default (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            localStorage.setItem('token', action.payload.token)
            return {
                ...state,
                ...action.payload,
                loading: false,
                isAuthenticated: true,
            }
        
        case 'USER_LOADED':
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload,
            }    

        case 'GET_USER_DETAIL':
            return{
                ...state,
                userDetail : action.payload
            }

        case 'AUTH_ERROR':
            localStorage.removeItem('token')
            return{
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                loadings: false,
                user: null,
                userDetail: null,
            }

        case 'LOGIN_FAIL':
			return {
                ...state,
                fail: action.payload
			}
        

        case 'LOGOUT':
            localStorage.removeItem('token')
            return {
                ...state,
				token: null,
				isAuthenticated: false,
                loading: false,
                loadings: false,
                user: null,
                userDetail: null,
                fail: false,
				error: action.payload
            }

        case 'REMEMBER_TOKEN':
            return {
                ...state,
                remember: !state.remember
            }
        case 'SET_LOADING_TRUE':
            return {
                ...state,
                loading: true,
            }
        case 'SET_LOADING_FALSE':
            return {
                ...state,
                loading: false,
            }

        default :
            return state;
    }
}