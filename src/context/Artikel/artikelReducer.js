export default (state, action) => {
    switch (action.type) {
        case 'GET_DOCUMENT_DETAIL':
            return {
                ...state,
                isEditing: true,
                loading: false,
                documentDetail: action.payload
            }
        
        case 'RESET_DOCUMENT':
            return {
                ...state,
                documentDetail: null,
                loading: false,
                isEditing: false
            }
        case 'EDIT_DOCUMENT':
            return{
                ...state,
                isEditing: true
            }
        case 'EDIT_DOCUMENT_FALSE':
            return{
                ...state,
                isEditing: false
            }
        case 'SET_PREVIEW':
            return {
                ...state,
                loading: false,
                isPreviewing: !state.isPreviewing
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