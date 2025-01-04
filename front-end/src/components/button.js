import React from 'react';

const Button = ({ text, onClick }) => {
  return (
    <button onClick={onClick} style={{ padding: '10px', margin: '5px' }}>
      {text}
    </button>
  );
};

export default Button;
