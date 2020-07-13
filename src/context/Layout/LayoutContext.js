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
				sidebar: !state.sidebar,
			}

		case 'SET_MEGAMENU_HIDE':
			return{
				state,
				megamenu: false
			}

			case 'SET_MEGAMENU_SHOW':
				return{
					state,
					megamenu: true
				}
        default:
			return state
	}
}

const initialState = {
    sidebar: false,
	loading: true,
	active: true,
	megamenu: false
}

export const LayoutContext = createContext(initialState);

const LayoutState = (props) => {
    
    const [state, dispatch] = useReducer(reducer, initialState)
    
    const setSidebar = () => {
		dispatch({ type: 'SET_SIDEBAR' })
	}

	const setMegamenuHide = () => {
		dispatch({ type: 'SET_MEGAMENU_HIDE' })
	}

	const setMegamenuShow = () => {
		dispatch({ type: 'SET_MEGAMENU_SHOW' })
	}
	
    return (
		<LayoutContext.Provider
			value={{
				sidebar: state.sidebar,
				loading: state.loading,
				megamenu: state.megamenu,
				setMegamenuHide,
				setMegamenuShow,
				setSidebar,
			}}
		>
			{props.children}
		</LayoutContext.Provider>
	)
}

export default LayoutState;