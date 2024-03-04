import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../CREENCRAFT.png"; 
import Green from "../green2.png"
import axios from 'axios';

const SignUp = () => {
  const [userDetails, setUserDetails] = useState({
    membershipType: '',
    comcode: true,
    managercode: '',
    id: '',
    password: '',
    confirmPassword: '',
    address: '',
    username: '',
    email: '',
    birthDate: {
      year: '',
      month: '',
      day: ''
    },
    phone: '',
    gender: '',
  });

  const navigate = useNavigate();

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    const startYear = currentYear - 100;

    for (let i = currentYear; i >= startYear; i--) {
      years.push(<option key={i} value={i}>{i}</option>);
    }
    return years;
  };

  const getMonths = () => {
    const months = [];
    for (let i = 1; i <= 12; i++) {
      months.push(<option key={i} value={i}>{i}</option>);
    }
    return months;
  };

  const getDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(<option key={i} value={i}>{i}</option>);
    }
    return days;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (['year', 'month', 'day'].includes(name)) {
      setUserDetails(prevDetails => ({
        ...prevDetails,
        birthDate: {
          ...prevDetails.birthDate,
          [name]: value
        }
      }));
    } else if (name === 'membershipType') {
      setUserDetails(prevDetails => ({
        ...prevDetails,
        membershipType: value,
        comcode: value === 'basic' ? false : true // 일반 회원이면 comcode를 false로, 기업 회원이면 true로 설정
      }));
    } else {
      setUserDetails(prevDetails => ({
        ...prevDetails,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // 회원을 선택하지 않은 경우
    if (!userDetails.membershipType) {
      alert('회원을 선택하세요.');
      return;
    }

    const isValidManagerCode = userDetails.managercode.length === 10;

    if (!isValidManagerCode) {
      alert('사업자 번호는 10자리여야 합니다.');
      return;
    }

    try {
      const response = await axios.post("http://34.22.80.43:8000/users/", userDetails, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200 || response.status === 201) {
        // 회원가입 성공
        alert(`${userDetails.username}님 반갑습니다! 회원가입이 완료되었습니다.`);
  
        // 로그인 성공 시 comcode 값을 localStorage에 저장
        localStorage.setItem('comcode', userDetails.comcode);
  
        navigate('/');
      } else {
        // 서버가 성공 이외의 상태 코드를 반환한 경우
        alert(`회원가입에 실패했습니다.`);
      }
    } catch (error) {
      // 요청 실패 (네트워크 오류, 서버 오류 등)
      console.error('회원가입 실패:');
      // alert(`회원가입에 실패했습니다. ${error.response ? '에러: ' + JSON.stringify(error.response.data) : '다시 시도해주세요.'}`);
      alert(`회원가입에 실패했습니다. 다시 시도해주세요.`);
    }
  };


  // 스타일 객체, Login 컴포넌트의 스타일을 참조
  const containerStyle = { display: 'flex',  width: '100vw', height: '100vh' };
  const pageStyle = { display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' };
  const textSectionStyle = { textAlign: 'center', maxWidth: '600px', flex: 1, marginRight: '-400px' };
  const formContainerStyle = { background: 'white', padding: '4rem', borderRadius: '15px', boxShadow: '0 7px 8px rgba(0, 0, 0, 0.1)', flex: 3, maxWidth: '600px' };
  const inputGroupStyle = { marginBottom: '1rem' };
  const rightStyle = { flex: 1.5, display: 'flex', height: '100vh', justifyContent: 'center', 
  alignItems: 'center', backgroundImage: `url(${Green})` , backgroundSize: 'cover'};
  const leftStyle = { flex: 1, display: 'flex', height: '100vh', alignItems: 'center', position: 'relative', right: '-70px', };

  const inputStyle = { width: '100%', padding: '1rem',margin: '0 0 1rem 0',borderRadius: '20px',backgroundColor: '#f0f0f0', textAlign: 'center', fontSize: '14px', border: 'none' };
  const buttonStyle = { width: '100%', padding: '1rem', margin: '1rem 0', borderRadius: '20px', border: 'none', color: 'white', backgroundColor: '#3853D1', cursor: 'pointer', fontSize: '14px'};
  const signupStyle = { width: '100%', padding: '1rem', margin: '1rem 0', borderRadius: '5px', border: 'none', color: 'black', border: '1px solid gray', cursor: 'pointer', fontSize: '14px'}
  const errorMessageStyle = {color: 'red',fontSize: '12px'};





  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
      <div style={leftStyle}>
      <div style={textSectionStyle}>
        <img src={logo} alt="GreenCraft Logo" style={{ marginBottom: '1rem' }} />
        {/* <p className="display-6 fw-bolder">안녕하세요. 2050년 차량 탄소 절감 서비스입니다.</p>
        <p>2050년까지 차량으로 인한 탄소 배출을 '넷 제로(Net-Zero)' 만들기 위한 목표를 실현하기 위해 노력합니다.</p> */}
        <p className="display-5 fw-bolder">안녕하세요! <br></br>"2050년 차량 탄소 절감 서비스"<br></br>GreenCraft입니다. </p><br></br>
        <p>저희는 지속 가능한 미래를 위해 노력하며,<br></br> 차량으로 인한 탄소 배출을 최소화하여 환경 보전에 기여하고자 합니다. <br></br>
            2050년까지의 비전은 '넷 제로(Net-Zero)'를 실현하며,<br></br> 혁신적인 기술과 협력으로 더욱 그 가치를 높여가고 있습니다. <br></br>
            함께하는 모든 분들의 지지와 협력에 감사드리며, <br></br>더 나은 미래를 향해 함께 나아가겠습니다.</p>
      </div>
      </div>

      
      <div style={rightStyle}>
      <div style={formContainerStyle}>
        <form onSubmit={handleSubmit}>
          <h2 className="d-flex justify-content-center display-5 fw-bold my-5">회원가입</h2>
          <div style={inputGroupStyle}>
            <select name="membershipType" style={signupStyle} onChange={handleChange} value={userDetails.membershipType}>
              <option value="">회원 선택</option>
              <option value="basic">일반 회원</option>
              <option value="premium">기업 회원</option>
            </select>
          </div>
  
          {userDetails.membershipType === 'premium' && (
            <>
              <div style={inputGroupStyle}>
                <input
                  type="text"
                  name="managercode"
                  style={inputStyle}
                  placeholder="사업자 번호 (10자리)"
                  value={userDetails.managercode}
                  onChange={handleChange}
                  required={userDetails.membershipType === 'premium'}
                />
              </div>


              <div style={inputGroupStyle}>
                <input
                  type="text"
                  name="username"
                  style={inputStyle}
                  placeholder="이름"
                  value={userDetails.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={inputGroupStyle}>
                <input
                  type="password"
                  name="password"
                  style={inputStyle}
                  placeholder="비밀번호"
                  value={userDetails.password}
                  onChange={handleChange}
                  required={userDetails.membershipType === 'premium'}
                />
              </div>
              <div style={inputGroupStyle}>
                <input
                  type="password"
                  name="confirmPassword"
                  style={inputStyle}
                  placeholder="비밀번호 확인"
                  value={userDetails.confirmPassword}
                  onChange={handleChange}
                  required={userDetails.membershipType === 'premium'}
                />
              </div>
              <div style={inputGroupStyle}>
                <input
                  type="text"
                  name="address"
                  style={inputStyle}
                  placeholder="주소"
                  value={userDetails.address}
                  onChange={handleChange}
                  required={userDetails.membershipType === 'premium'}
                />
              </div>
              <div style={inputGroupStyle}>
                <input
                  type="email"
                  name="email"
                  style={inputStyle}
                  placeholder="이메일"
                  value={userDetails.email}
                  onChange={handleChange}
                  required={userDetails.membershipType === 'premium'}
                />
              </div>
            </>
          )}
  
          {/* 기업 회원이 아닐 때 보여주는 필드들 */}
          {userDetails.membershipType === 'basic' && (
            <>
              <div style={inputGroupStyle}>
                <input
                  type="text"
                  name="username"
                  style={inputStyle}
                  placeholder="이름"
                  value={userDetails.name}
                  onChange={handleChange}
                  required
                />
              </div>
  
              <div style={inputGroupStyle}>
                <input
                  type="email"
                  name="email"
                  style={inputStyle}
                  placeholder="이메일"
                  value={userDetails.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={inputGroupStyle}>
                <input
                  type="password"
                  name="password"
                  style={inputStyle}
                  placeholder="비밀번호"
                  value={userDetails.password}
                  onChange={handleChange}
          
                />
              </div>
              <div style={inputGroupStyle}>
                <input
                  type="password"
                  name="confirmPassword"
                  style={inputStyle}
                  placeholder="비밀번호 확인"
                  value={userDetails.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <select name="year" style={inputStyle} onChange={handleChange} value={userDetails.birthDate.year}>
                  {getYears()}
                </select>
                <select name="month" style={inputStyle} onChange={handleChange} value={userDetails.birthDate.month}>
                  {getMonths()}
                </select>
                <select name="day" style={inputStyle} onChange={handleChange} value={userDetails.birthDate.day}>
                  {getDays()}
                </select>
              </div>
  
              <div style={inputGroupStyle}>
                <input
                  type="text"
                  name="phone"
                  style={inputStyle}
                  placeholder="전화번호"
                  value={userDetails.phone}
                  onChange={handleChange}
                  required
                />
              </div>
  
              <div style={inputGroupStyle}>
                <input
                  type="text"
                  name="sex"
                  style={inputStyle}
                  placeholder="성별"
                  value={userDetails.sex}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
  
          <button type="submit" style={buttonStyle} className="fw-bolder">회원가입</button>
        </form>
      </div>
      </div>
      </div>
    </div>
  );
};
  export default SignUp; 