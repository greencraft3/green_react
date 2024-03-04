import React, { useState, useEffect } from 'react';
import logo from "../CREENCRAFT.png";
import Green from "../green2.png"
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
<link rel="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css"></link>


const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const [loginMessage, setLoginMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.src = "https://apis.google.com/js/platform.js";
  //   script.onload = initGoogleSignIn;
  //   document.body.appendChild(script);

  //   return () => document.body.removeChild(script);
  // }, []);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 서버에 로그인 요청 보내기
      const response = await axios.post("http://34.22.80.43:8000/login/", credentials);
      
      if (response.status === 200) {
        
        const { access: accessToken, refresh: refreshToken, comcode, managercode, is_superuser, userId} = response.data;
        
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', credentials.username);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('comcode', comcode);
        localStorage.setItem('managercode', managercode);
        localStorage.setItem('is_superuser', is_superuser);
        localStorage.setItem('userId', userId);

        console.log(response.data);
        console.log('Logged in as:', credentials.username); 

        alert(`${credentials.username}님 반갑습니다!`);
        navigate('/');
      } else {
        alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.');
      }

    } catch (error) {
      // 요청 실패 (네트워크 오류, 서버 오류 등)
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다.');
    }
  };
    
    const handleLogout = () => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('comcode');
      navigate('/login'); // 로그아웃 후 로그인 페이지로 리디렉션
    };

  // const initGoogleSignIn = () => {
  //   window.gapi.load('auth2', () => {
  //     const auth2 = window.gapi.auth2.init({
  //       client_id: "96305256265-v600so04sskmlfd2bhalp60tblnd0ffr.apps.googleusercontent.com",
  //     });
  //     auth2.attachClickHandler(document.getElementById('googleLoginButton'), {},
  //       googleUser => onSignIn(googleUser),
  //       error => console.error(error)
  //     );
  //   });
  // };

  // const onSignIn = (googleUser) => {
  //   console.log("Google 로그인 성공!");
  //   setIsLoggedIn(true);
  //   // Google 사용자 정보에 접근하는 예시
  //   const profile = googleUser.getBasicProfile();
  //   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  //   console.log('Name: ' + profile.getName());
  //   console.log('Image URL: ' + profile.getImageUrl());
  //   console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  
  //   // 로그인 성공 후 메인 페이지로 리디렉션
  //   window.location.href = '/';
  // };

  const pageStyle = { display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' };
  const textSectionStyle = { textAlign: 'center', maxWidth: '600px', flex: 1, marginRight: '-400px' };
  const formContainerStyle = { background: 'white', padding: '4rem', borderRadius: '15px', boxShadow: '0 7px 8px rgba(0, 0, 0, 0.1)', 
  flex: 3, maxWidth: '600px'};

  const leftStyle = { flex: 1, display: 'flex', height: '100vh', alignItems: 'center', position: 'relative', right: '-70px' };
  const rightStyle = { flex: 1.5, display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundImage: `url(${Green})`, backgroundSize: 'cover' };


  return (
    <div style={pageStyle}>
      <div style={leftStyle}>
        <div style={textSectionStyle}>
          <img src={logo} alt="GreenCraft Logo" style={{ marginBottom: '1rem' }} />
          <p className="display-5 fw-bolder">안녕하세요! <br></br>"2050년 차량 탄소 절감 서비스"<br></br>GreenCraft입니다. </p><br></br>
          <p>저희는 지속 가능한 미래를 위해 노력하며,<br></br> 차량으로 인한 탄소 배출을 최소화하여 환경 보전에 기여하고자 합니다. <br></br>
            2050년까지의 비전은 '넷 제로(Net-Zero)'를 실현하며,<br></br> 혁신적인 기술과 협력으로 더욱 그 가치를 높여가고 있습니다. <br></br>
            함께하는 모든 분들의 지지와 협력에 감사드리며, <br></br>더 나은 미래를 향해 함께 나아가겠습니다.</p>
        </div>
      </div>
      <div style={rightStyle}>
        <div style={formContainerStyle}>
        <form onSubmit={handleSubmit}>
          <h2 className="d-flex justify-content-center display-5 fw-bold">User Login</h2><br></br>

          <style>
          {`
            /* ::placeholder 선택자를 사용하여 스타일을 적용 */
            input::placeholder {
              font-weight: bold;
            }
          `}
        </style>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="username" className="fw-bolder">아이디</label>
            <input
              type="text"
              name="username"
              style={{
                width: '100%',
                padding: '1rem',
                margin: '0 0 1rem 0',
                borderRadius: '20px',
                backgroundColor: '#f0f0f0',
                textAlign: 'center', // 중앙 정렬
                fontSize: '14px', // 폰트 크기 설정
                border: 'none', // 테두리 없애기
              }}
              placeholder="Username"
              value={credentials.name}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password" className="fw-bolder">비밀번호</label>
            <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              style={{
                width: '100%',
                padding: '1rem',
                margin: '0 0 1rem 0',
                borderRadius: '20px',
                backgroundColor: '#f0f0f0',
                textAlign: 'center', 
                fontSize: '14px', 
                border: 'none',
              }}
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            <i
              className={`fa fa-eye${showPassword ? '-slash' : ''} fa-lg`}
              style={{ position: 'absolute', top: '60%', right: '2rem', transform: 'translateY(-50%)', cursor: 'pointer' }}
              onClick={togglePasswordVisibility}
            />
          </div>
        </div>

          <button type="submit" 
          style={{ width: '100%', 
          padding: '1rem', 
          margin: '1rem 0', 
          borderRadius: '20px', 
          border: 'none', 
          color: 'white', 
          backgroundColor: '#80d038', 
          cursor: 'pointer', 
          fontSize: '14px',
          }}
          className="fw-bolder">
          로그인
          </button>

          <Link to="/signup">
          <button type="submit" 
          style={{ width: '100%', 
          padding: '1rem', 
          margin: '1rem 0', 
          borderRadius: '20px', 
          border: 'none', 
          color: 'white', 
          backgroundColor: '#3853D1', 
          cursor: 'pointer', 
          fontSize: '14px',
          }}
          className="fw-bolder">
          회원가입
          </button>
          </Link>
          {/* <div id="googleLoginButton" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 20px', backgroundColor: '#FFFFFF', cursor: 'pointer', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', margin: '10px 0', border: 'none', fontSize: '16px', color: 'black', fontWeight: 'bold' }} onClick={initGoogleSignIn}>
            <img src={google} alt="Google Logo" style={{ marginRight: '10px', width: '20px', height: '20px' }} />
            Log in with Google
          </div> */}
        </form>
        {loginMessage && <div style={{ marginTop: '20px', textAlign: 'center' }}>{loginMessage}</div>}
      </div>
    </div></div>
  );
};

export default Login;