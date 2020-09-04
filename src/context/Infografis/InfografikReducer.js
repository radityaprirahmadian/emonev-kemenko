export default (state, action) => {
    switch (action.type) {
        case "SET_INFOGRAFIS":
            return {
                ...state,
                ...action.payload,
                infografisDetail: action.payload,
            };
        case "EDIT_DOCUMENT":
            return {
                ...state,
                isEditing: true,
            };
        case "EDIT_DOCUMENT":
            return {
                ...state,
                infografisDetail: null,
            };
        case "EDIT_DOCUMENT_FALSE":
            return {
                ...state,
                isEditing: false,
            };
        case "SET_LOADING_TRUE":
            return {
                ...state,
                loading: true,
            };
        case "SET_LOADING_FALSE":
            return {
                ...state,
                loading: false,
            };

        default:
            return state;
    }
};
