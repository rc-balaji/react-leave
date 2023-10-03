import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';




export const NotFound = () => {
    const navigate = useNavigate()

    useEffect(()=>{
        const time = setTimeout(()=>{
            navigate('/')

        },2000)
       return ()=> clearTimeout(time)
    },[navigate])
  const notFoundStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontSize: '24px',
    fontFamily: 'Arial, sans-serif',
  };

  const buttonStyles = {
    marginTop: '20px',
    padding: '10px 20px',
    background: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background 0.3s ease',
  };

  const handleButtonClick = () => {
    navigate('/')
  };

  return (
    <div style={notFoundStyles}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for doesn't exist.</p>
      <button style={buttonStyles} onClick={handleButtonClick}>
        Go to Sign in Page
      </button>
    </div>
  );
};

// export default NotFound;
