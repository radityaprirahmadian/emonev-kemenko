import React, { useState, useReducer, createContext } from 'react';
import axios from 'axios';
import artikelReducer from './artikelReducer';

export const ArtikelContext = createContext();

const ArtikelState = (props) => {
  const intialState = {
    token: localStorage.getItem('token'),
    documentDetail: null,
    instansiDocumentDetail: null,
    isEditing: false,
    isPreviewing: false,
    loading: false,
  };

  const [state, dispatch] = useReducer(artikelReducer, intialState);

  const setLoadingTrue = () => {
    dispatch({
      type: 'SET_LOADING_TRUE',
    });
  };

  const setLoadingFalse = () => {
    dispatch({
      type: 'SET_LOADING_FALSE',
    });
  };

  const getDocumentDetail = async (data) => {
    setLoadingTrue();
    const config = {
      headers: {
        'X-Auth-Token': `Bearer ${state.token}`,
      },
    };
    try {
      const res = await axios.get(
        `http://api.simonev.revolusimental.go.id:8882/api/v1/document/${data.id}?type=${data.type}`,
        config,
      );
      dispatch({
        type: 'GET_DOCUMENT_DETAIL',
        payload: res.data,
      });
    } catch (err) {
      console.log(err);
    }
    setLoadingFalse();
  };

  const resetDocument = () => {
    dispatch({
      type: 'RESET_DOCUMENT',
    });
  };

  const editDocument = () => {
    dispatch({
      type: 'EDIT_DOCUMENT',
    });
  };

  const editDocumentFalse = () => {
    dispatch({
      type: 'EDIT_DOCUMENT_FALSE',
    });
  };

  const preview = () => {
    dispatch({
      type: 'SET_PREVIEW',
    });
  };
  return (
    <ArtikelContext.Provider
      value={{
        documentDetail: state.documentDetail,
        isEditing: state.isEditing,
        isPreviewing: state.isPreviewing,
        loading: state.loading,
        instansiDocumentDetail: state.instansiDocumentDetail,
        getDocumentDetail,
        resetDocument,
        editDocument,
        editDocumentFalse,
        preview,
        setLoadingTrue,
        setLoadingFalse,
      }}
    >
      {props.children}
    </ArtikelContext.Provider>
  );
};

export default ArtikelState;
