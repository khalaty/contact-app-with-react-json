import React, { useEffect } from 'react';
import ContactsList from './ContactsList.jsx';
import { v4 } from 'uuid';
import styles from "./Contacts.module.css";
import { useContacts } from '../ContactContext';

const inputs = [
  { type: "text", name: "firstName", placeholder: "Firstname" },
  { type: "text", name: "lastName", placeholder: "Lastname" },
  { type: "email", name: "email", placeholder: "Email" },
  { type: "number", name: "phone", placeholder: "Phone" },
];

function Contacts() {
  const { state, dispatch, fetchContacts } = useContacts();
  const { contacts, currentContact, isEditing, alert, showList, searchTerm } = state;

  useEffect(() => {
    fetchContacts();
  }, []);

  const isValidForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return requiredFields.every((field) => {
      if (!currentContact[field]) {
        return false;
      }

      if (field === 'email' && !emailRegex.test(currentContact[field])) {
        return false;
      }

      return true;
    });
  };

  const changeHandler = (event) => {
    const { name, value } = event.target;
    dispatch({ type: 'SET_CURRENT_CONTACT', payload: { ...currentContact, [name]: value } });
  };

  const addHandler = () => {
    if (!isValidForm()) {
      dispatch({ type: 'SET_ALERT', payload: "Please fill in all required fields and ensure email is valid." });
      return;
    }
    dispatch({ type: 'SET_ALERT', payload: "" });
    const newContact = { ...currentContact, id: v4() };
    dispatch({ type: 'ADD_CONTACT', payload: newContact });
    dispatch({ type: 'CLEAR_CURRENT_CONTACT' });
  };

  const deleteHandler = (id) => {
    dispatch({ type: 'DELETE_CONTACT', payload: id });
  };

  const editHandler = (id) => {
    const editingContact = contacts.find((contact) => contact.id === id);
    dispatch({ type: 'SET_CURRENT_CONTACT', payload: editingContact });
    dispatch({ type: 'SET_EDITING', payload: true });
  };

  const saveEditHandler = () => {
    if (!isValidForm()) {
      dispatch({ type: 'SET_ALERT', payload: "Please fill in all required fields and ensure email is valid." });
      return;
    }
    dispatch({ type: 'SET_ALERT', payload: "" });
    const updatedContacts = contacts.map((c) =>
      c.id === currentContact.id ? currentContact : c
    );
    dispatch({ type: 'SET_CONTACTS', payload: updatedContacts });
    dispatch({ type: 'SET_EDITING', payload: false });
    dispatch({ type: 'CLEAR_CURRENT_CONTACT' });
  };

  const toggleShowList = () => {
    dispatch({ type: 'TOGGLE_SHOW_LIST' });
  };

  const handleSearch = (event) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: event.target.value });
  };

  const filteredContacts = contacts.filter((contact) =>
    Object.values(contact).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        {inputs.map((input, index) => (
          <input
            key={index}
            type={input.type}
            placeholder={input.placeholder}
            name={input.name}
            value={currentContact[input.name]}
            onChange={changeHandler}
          />
        ))}
        {isEditing ? (
          <button onClick={saveEditHandler}>Save Edit</button>
        ) : (
          <button onClick={addHandler}>Add Contact</button>
        )}
      </div>
      <div className={styles.alert}>{alert && <p>{alert}</p>}</div>
      <button className={styles.showbutton} onClick={toggleShowList}>
        {showList ? "Hide Contacts" : "Show Contacts"}
      </button>
      {showList && (
        <>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={handleSearch}
            className={styles.searchInput}
          />
          <ContactsList
            contacts={filteredContacts}
            deleteHandler={deleteHandler}
            editHandler={editHandler}
          />
        </>
      )}
    </div>
  );
}

export default Contacts;