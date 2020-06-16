export default (state, action) => {
    switch (action.type) {
        case 'SET_INFOGRAFIS':
            return {
                ...state,
                ...action.payload,
                infografisDetail: action.payload,
            }

            default :
            return state;
    }
}