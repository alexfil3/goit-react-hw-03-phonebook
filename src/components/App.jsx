import React, { Component } from 'react';
import { ContactForm } from './ContactForm/ContactForm';
import { ContactList } from './ContactList/ContactList';
import { Filter } from './Filter/Filter';
import { v4 as uuidv4 } from 'uuid';
import css from './App.module.css';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  formSubmitHandler = data => {
    const dataWithId = {
      id: uuidv4(),
      ...data,
    };

    this.state.contacts
      .map(({ name }) => name.toLocaleLowerCase())
      .includes(dataWithId.name.toLocaleLowerCase())
      ? alert(`${dataWithId.name} is already in contacts`)
      : this.setState(prevState => ({
          contacts: [dataWithId, ...prevState.contacts],
        }));
  };

  filterHandler = e => {
    const { name, value } = e.currentTarget;
    this.setState({ [name]: value });
  };

  onFilterChange = () =>
    this.state.contacts.filter(({ name }) =>
      name
        .split(' ')
        .join('')
        .toLocaleLowerCase()
        .includes(this.state.filter.toLocaleLowerCase())
    );

  deleteHandler = e => {
    const filter = this.state.contacts.filter(
      contact => contact.id !== e.currentTarget.parentNode.id
    );
    this.setState({ contacts: filter });
  };

  componentDidMount() {
    const items = localStorage.getItem('contacts');

    if (items) {
      this.setState({ contacts: JSON.parse(items) });
    }
  }

  componentDidUpdate() {
    const { contacts } = this.state;
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }

  render() {
    const {
      formSubmitHandler,
      filterHandler,
      onFilterChange,
      deleteHandler,
      state,
    } = this;
    const { container, title } = css;

    return (
      <div className={container}>
        <h1 className={title}>Phonebook</h1>
        <ContactForm onSubmit={formSubmitHandler} />
        <h2 className={title}>Contacts</h2>
        <Filter onChange={filterHandler} value={state.filter} />
        <ContactList contacts={onFilterChange()} onDelete={deleteHandler} />
      </div>
    );
  }
}
