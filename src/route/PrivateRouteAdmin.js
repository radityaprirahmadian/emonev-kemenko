import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from '../context/Auth/AuthContext'

const PrivateRouteAdmin = ({ component: Component, setId , notif, ...rest }) => {
	const { isAuthenticated, loading, user } = useContext(AuthContext)
	return (
		<Route
			{...rest}
			render={props =>
				user && user.role === 'admin' ? (
					<Redirect to={`/admin/dashboard`} />
				) : (
					<Component {...props} notif={notif} setId={setId}/>
				)
			}
		/>
	)
}

export default PrivateRouteAdmin