import React, {
	useReducer,
	createContext,
	useState,
	useLayoutEffect
} from 'react'

const reducer = (state, action) => {
	switch (action.type) {
		case 'SET_SIDEBAR':
			return {
				...state,
				sidebar: !state.sidebar
			}
        default:
			return state
	}
}

const initialState = {
    sidebar: false,
	loading: true,
	active: true,
}

export const LayoutContext = createContext(initialState);

const LayoutState = (props) => {
    
    const [state, dispatch] = useReducer(reducer, initialState)
    
    const setSidebar = () => {
		dispatch({ type: 'SET_SIDEBAR' })
	}
	
    return (
		<LayoutContext.Provider
			value={{
				sidebar: state.sidebar,
				loading: state.loading,
				setSidebar,
			}}
		>
			{props.children}
		</LayoutContext.Provider>
	)
}

export default LayoutState;