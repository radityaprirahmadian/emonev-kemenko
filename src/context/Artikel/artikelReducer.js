export default (state, action) => {
    switch (action.type) {
        case 'GET_DOCUMENT_DETAIL':
            return {
                ...state,
                isEditing: true,
                documentDetail: action.payload
            }
        
        case 'RESET_DOCUMENT':
            return {
                ...state,
                documentDetail: null,
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
                isPreviewing: !state.isPreviewing
            }
        default :
            return state;
    }
}