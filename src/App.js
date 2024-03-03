// App.js
import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import FAQ from './components/faq';
import Contact from './components/contact';
import Introduce from './components/introduce';
import Gallery from './components/gallery';
import Services from './components/services';
import Team from './components/Team';
import Navigation from './components/navigation';

import Login from './components/login';
import Signup from './components/signup';
import MyPageB from './components/mypage_b';
import MyPage from './components/mypage';
import Practice from './components/practice';

import { GoogleOAuthProvider } from "@react-oauth/google";

const MainContent = () => {
  const data = {
    // 데이터 정의
  };

  return (
    <div>
      <Introduce data={data.introduce} />
      <Gallery data={data.gallery} />
      <Team data={data.team} />
      <Contact data={data.contact} />
    </div>
  );
};

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isCompanyMember, setCompanyMember] = useState(false);

  const handleLogin = () => {
    // 로그인 로직을 여기에 구현합니다.
    setLoggedIn(true);

    const isCompanyMember = /* 서버에서 받아온 데이터에서 companyMember 정보 추출 */

    setCompanyMember(isCompanyMember);
    // 사용자 유형을 확인하고 그에 따라 isCompanyMember를 설정합니다.
    // setCompanyMember(true) 또는 setCompanyMember(false)
  };

  const handleLogout = () => {
    // 로그아웃 로직을 여기에 구현합니다.
    setLoggedIn(false);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}
      onScriptLoadError={() => console.log("실패")}
      onScriptLoadSuccess={() => console.log("성공")}>
      <BrowserRouter>
        <div>
        <Navigation isLoggedIn={isLoggedIn} isCompanyMember={isCompanyMember} handleLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/services" element={<Services />} />
            <Route path="/practice" element={<Practice />} />
            <Route
              path="/login"
              element={<Login handleLogin={handleLogin} />}
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/mypage_b" element={<MyPageB />} />
            <Route path="/mypage" element={<MyPage />} />

          </Routes>
        </div>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
  };

export default App;
