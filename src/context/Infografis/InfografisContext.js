import React, { createContext, useReducer } from "react";
import InfografisReducer from "./InfografikReducer";
import axios from "axios";

export const InfografisContext = createContext();

const InfografisState = (props) => {
    const initialState = {
        infografisDetail: null,
        isEditing: false,
        loading: false,
    };

    const [state, dispatch] = useReducer(InfografisReducer, initialState);

    const setInfografis = async (id) => {
        setLoadingTrue();
        const config = {
            headers: {
                "X-Auth-Token": `Bearer ${state.token}`,
            },
        };
        try {
            const res = await axios.get(
                `https://api.simonev.revolusimental.go.id/api/v1/kabar/${id}`,
                config
            );
            dispatch({
                type: "SET_INFOGRAFIS",
                payload: res.data.kabar,
            });
            setLoadingFalse();
        } catch (err) {
            console.log(err);
            setLoadingFalse();
        }
    };

    const editDocument = () => {
        dispatch({
            type: "EDIT_DOCUMENT",
        });
    };

    const editDocumentFalse = () => {
        dispatch({
            type: "EDIT_DOCUMENT_FALSE",
        });
    };

    const setLoadingTrue = () => {
        dispatch({
            type: "SET_LOADING_TRUE",
        });
    };

    const setLoadingFalse = () => {
        dispatch({
            type: "SET_LOADING_FALSE",
        });
    };

    const resetInfografis = () => {
        dispatch({
            type: "RESET_DOCUMENT",
        });
    };

    return (
        <InfografisContext.Provider
            value={{
                infografisDetail: state.infografisDetail,
                isEditing: state.isEditing,
                loading: state.loading,
                resetInfografis,
                setLoadingFalse,
                setLoadingTrue,
                setInfografis,
                editDocument,
                editDocumentFalse,
            }}
        >
            {props.children}
        </InfografisContext.Provider>
    );
};

export default InfografisState;
