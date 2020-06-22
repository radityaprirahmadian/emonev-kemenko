export default (state, action) => {
    switch (action.type) {
        case 'SET_INFOGRAFIS':
            return {
                ...state,
                ...action.payload,
                infografisDetail: action.payload,
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

            default :
            return state;
    }
}