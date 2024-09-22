import React, { createContext, useReducer, useContext, useEffect } from 'react';

const ContactContext = createContext();

const initialState = {
  contacts: [],
  currentContact: {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  },
  isEditing: false,
  searchTerm: '',
  alert: '',
  showList: false,
};

function contactReducer(state, action) {
  switch (action.type) {
    case 'SET_CONTACTS':
      return { ...state, contacts: action.payload };
    case 'ADD_CONTACT':
      return { ...state, contacts: [...state.contacts, action.payload] };
    case 'DELETE_CONTACT':
      return { ...state, contacts: state.contacts.filter(contact => contact.id !== action.payload) };
    case 'SET_CURRENT_CONTACT':
      return { ...state, currentContact: action.payload };
    case 'CLEAR_CURRENT_CONTACT':
      return { ...state, currentContact: initialState.currentContact };
    case 'SET_EDITING':
      return { ...state, isEditing: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_ALERT':
      return { ...state, alert: action.payload };
    case 'TOGGLE_SHOW_LIST':
      return { ...state, showList: !state.showList };
    default:
      return state;
  }
}

export const ContactProvider = ({ children }) => {
  const [state, dispatch] = useReducer(contactReducer, initialState);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('http://localhost:3001/contacts');
      const data = await response.json();
      dispatch({ type: 'SET_CONTACTS', payload: data });
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  return (
    <ContactContext.Provider value={{ state, dispatch, fetchContacts }}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
};