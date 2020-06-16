import axios from 'axios'

const setAuthToken = token => {
	if (token) {
        console.log('wow')
		axios.defaults.headers.common['Authorization'] = `aweuaweu ${token}`
	} else {
        console.log('wew')
		delete axios.defaults.headers.common['Authorization']
	}
}

export default setAuthToken