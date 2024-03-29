import React from 'react';
import styles from './Logo.module.css';
import PropTypes from 'prop-types';

const Logo = ({ width, align }) => {
  return (
    <div
      className={`${styles.container} margin-align-${align}`}
      style={{ width: `${width}px` }}
    >
      <h2 style={{color:"#37e137",fontSize:"26px",marginTop:"10px",textAlign:"center"}}>TRIPS</h2>
    </div>
  );
};

Logo.propTypes = {
  width: PropTypes.number.isRequired,
  align: PropTypes.string.isRequired
};

export default Logo;
