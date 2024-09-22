import React from 'react'
import styles from './Header.module.css'

function Header() {
  return (
    <div className={styles.container}>
        <h1>Contact App</h1>
        <p>
            <a href='khalaty.ir'>Save your contacts with form</a>
        </p>
    </div>
  );
}

export default Header;