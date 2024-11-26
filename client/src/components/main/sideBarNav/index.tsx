import React from 'react';
import './index.css';
import { NavLink } from 'react-router-dom';

/**
 * The SideBarNav component has two menu items: "Questions" and "Tags".
 * It highlights the currently selected item based on the active page and
 * triggers corresponding functions when the menu items are clicked.
 */
const SideBarNav = () => {
  const styles = {
    container:
      'flex border-dashed border-b-2 h-full md:flex-col md:border-b-0 md:border-r-2 p-2 items-center',
  };

  return (
    <div id='sideBarNav' className={styles.container}>
      <NavLink
        to='/home'
        id='menu_questions'
        className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
        Questions
      </NavLink>
      <NavLink
        to='/tags'
        id='menu_tag'
        className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
        Tags
      </NavLink>
    </div>
  );
};

export default SideBarNav;
