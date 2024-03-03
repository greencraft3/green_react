import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../CREENCRAFT.png';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Anta&family=Noto+Sans+KR:wght@100..900&display=swap');

  .anta-regular {
    font-family: "Anta", sans-serif;
    font-weight: 400;
    font-style: normal;
  }

  .gasoek-one-regular {
    font-family: "Gasoek One", sans-serif;
    font-weight: 400;
    font-style: normal;
  }

  .sunflower-light {
    font-family: "Sunflower", sans-serif;
    font-weight: 300;
    font-style: normal;
  }

  .noto-sans kr-<uniquifier> {
    font-family: "Noto Sans KR", sans-serif;
    font-optical-sizing: auto;
    font-weight: <weight>;
    font-style: normal;
  }
`;

const Navigation = () => {
  const navRef = useRef();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const comcode = localStorage.getItem('comcode') === 'true';
  const is_superuser = localStorage.getItem('is_superuser') === 'true';

  useEffect(() => {
    const handleResize = () => {
      const mediaQuery = window.matchMedia('(max-width: 991px)');
      setIsNavCollapsed(mediaQuery.matches);
    };

    // 초기 로딩 시 한 번 호출
    handleResize();

    // 리사이즈 이벤트에 리스너 등록
    window.addEventListener('resize', handleResize);

    // 컴포넌트가 언마운트될 때 리스너 해제
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // 처음에 한번만 로그인 false
    if (localStorage.getItem('isLoggedIn') === null) {
      localStorage.setItem('isLoggedIn', 'false');
    }
  }, []); // 빈 배열을 넘겨 초기 한 번만 실행되도록 함


  const handleNavToggle = () => {
    setIsNavCollapsed(prev => !prev);
  };

  // 클릭하면 nav 닫힘
  const closeNav = () => {
    setIsNavCollapsed(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); // 로그인 상태 제거 -> 로그아웃
    closeNav(); // 네비게이션 바 닫기
    navigate('/'); // 홈 페이지로 리디렉션
  };

  const handleNavigateToSection = (sectionId) => {
    navigate('/');
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      closeNav();
    }
  };

  return (
    <nav
      ref={navRef}
      id="menu"
      className="navbar navbar-default navbar-expand-lg fixed-top"
    >
      <div className="container center">
        {/* GreenCraft logo 영역 - 홈으로 가기 */}
        <Link
          style={{ display: 'flex', alignItems: 'center' }}
          className="navbar-brand"
          to="/"
          onClick={closeNav}
        >
          <img src={logo} style={{ width: '50', height: '50' }} alt="logo" />
          GreenCraft
        </Link>

        {/* 내비바 토글 부분 */}
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          onClick={handleNavToggle}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <style>
          {`
            .navbar-toggler {
              position: absolute;
              top: 0;
              right: 0;
              padding: 10px;
              margin: 20px;
            }
            
            .navbar-nav li a:hover {
              color: #80d038 !important; /* 파란색으로 변경, !important를 사용하여 우선순위 설정 */
              text-decoration: underline; /* 밑줄 추가 */
            }
        
            .navbar-nav .nav-item.active a {
              color: #80d038 !important; /* 활성화된 메뉴 항목일 때도 색상을 유지합니다. */
            }

            .navbar-default .navbar-nav > li > a {
              text-decoration: none;
            }
          `}
        </style>

        <div
          className={`navbar-collapse ${isNavCollapsed ? 'collapse' : ''}`}
          id="navbarNav"
          onClick={closeNav}
        >


          {/* 내비바 메뉴란 */}
          <ul className="nav navbar-nav ml-auto">
            {/* 구글폰트 import */}
            <style>{styles}</style>
            <li>
              <a href="#introduce" className="page-scroll" onClick={() => handleNavigateToSection('introduce')}>
              <p className="noto-sans kr-<uniquifier> h2">Introduce</p>
              </a>
            </li>
            <li>
              <a href="#gallery" className="page-scroll" onClick={() => handleNavigateToSection('gallery')}>
              <p className="noto-sans kr-<uniquifier> h2">Gallery</p>
              </a>
            </li>
            <li>
              <a href="#team" className="page-scroll" onClick={() => handleNavigateToSection('team')}>
              <p className="noto-sans kr-<uniquifier> h2">Team</p>
              </a>
            </li>
            <li>
              <a href="#contact" className="page-scroll" onClick={() => handleNavigateToSection('contact')}>
              <p className="noto-sans kr-<uniquifier> h2">Contact</p>
              </a>
            </li>

            {/* 페이지 이동 */}
            <li>
              <Link to="/faq" className="page-scroll">
              <p className="noto-sans kr-<uniquifier> h2">FAQ</p>
              </Link>
            </li>
            <li>
              <Link to="/services" className="page-scroll" onClick={closeNav}>
              <p className="noto-sans kr-<uniquifier> h2">Services</p>
              </Link>
            </li>
            {/* <li>
              <Link to="/practice" className="page-scroll" onClick={closeNav}>
                Practice 
              </Link>
            </li> */}

            {/* 마이페이지 */}
            {isLoggedIn && is_superuser ? (
              // 관리자 (is_superuser가 true인 경우)
              <li>
                <a href="http://34.22.80.43/admin/" className="page-scroll" onClick={closeNav}>
                  <p className="noto-sans kr-<uniquifier> h2">Admin Page</p>
                </a>
              </li>
            ) : isLoggedIn && comcode ? (
              // 기업 회원
              <li>
                <Link to="/mypage_b" className="page-scroll" onClick={closeNav}>
                  <p className="noto-sans kr-<uniquifier> h2">Mypage</p>
                </Link>
              </li>
            ) : isLoggedIn ? (
              // 일반 회원
              <li>
                <Link to="/mypage" className="page-scroll" onClick={closeNav}>
                  <p className="noto-sans kr-<uniquifier> h2">Mypage</p>
                </Link>
              </li>
            ) : null}


            <li style={{ marginRight: '30px' }}></li>

            {/* 로그인, 로그아웃 */}
            {isLoggedIn ? (
              <li className="nav-item">
                <a onClick={handleLogout} className="nav-link" style={{ cursor: 'pointer' }}>
                <p className="noto-sans kr-<uniquifier> h2">Logout</p></a>
              </li>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={closeNav}>
                <p className="noto-sans kr-<uniquifier> h2">Login</p></Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
