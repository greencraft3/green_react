import { GoogleLogin } from "@react-oauth/google";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleAuthLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initGoogleSignIn = () => {
      window.gapi.load('auth2', () => {
        const auth2 = window.gapi.auth2.init({
          client_id: "YOUR_GOOGLE_API_CLIENT_ID",
        });
        auth2.attachClickHandler(document.getElementById('googleLoginButton'), {},
          (googleUser) => onSignIn(googleUser),
          (error) => console.error(error)
        );
      });
    };

    const onSignIn = (googleUser) => {
      console.log("Google 로그인 성공!");
      setIsLoggedIn(true);
      navigate('/');
    };

    initGoogleSignIn();

    // Clean up the Google API library when the component unmounts
    return () => {
      window.gapi.auth2.getAuthInstance().signOut();
    };
  }, [navigate]);

  return (
    <div style={{ padding: '200px' }}>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log("실패");
        }}
        width={'300px'}
        useOneTap
        id="googleLoginButton"
      />
    </div>
  );
};

export default GoogleAuthLogin;
