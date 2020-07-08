export default (state, action) => {
    switch (action.type) {
        case 'GET_ALL_REMINDER_TOTAL':
            return {
                ...state,
                reminder: action.payload,
            }

        case 'GET_ALL_REMINDER':
            return {
                ...state,
                allReminder: action.payload,
            }
        case 'RESET_NOTIFICATION':
            localStorage.removeItem('token')
            return{
                reminder: null,
                allReminder: []
            }
        
        case 'SET_NOTIF':
            return{
                ...state,
                notifNew: action.payload
            }

        case 'DELETE_NOTIF':
            return{
                ...state,
                notifNew: []
            }

        default :
            return state;
    }
}