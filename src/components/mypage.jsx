import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import eximage from '../personicon.png';
import axios from 'axios';

import Mypage_option3 from './mypage_option3'

function getCarType(carcode) {
  switch (carcode) {
    case 0:
    case 1:
      return "경차";
    case 2:
    case 3:
      return "승용차";
    case 4:
      return "화물차";
    case 5:
      return "승합차";
    case 6:
      return "건설차량";
    default:
      return "분류불가"; 
  }
}

const MyPage = () => {
  const [selectedSection, setSelectedSection] = useState('option1');
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [editableData, setEditableData] = useState([]);
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('username') || null);
  const updatedUserData = {};
  const [fuelData, setFuelData] = useState(null);

  const [latestImageResults, setLatestImageResults] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`http://34.22.80.43:8000/users/${username}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const userData = response.data;
        setUsername(userData.username);

        setEditableData([
          { title: '아이디', content: userData.username },
          { title: '이메일', content: userData.email },
          { title: '전화번호', content: userData.phone },
          { title: '성별', content: userData.sex },
          { title: '비밀번호 확인', content: userData.password },
        ]);
      } catch (error) {
        console.error('사용자 정보를 가져오는 중 오류:', error);
      }
    };

    fetchUserData();
  }, [username]);

  const handleSectionClick = (sectionId) => {
    setSelectedSection(sectionId);
    setIsEditMode(false);
  };

  const handleInputChange = (index, value) => {
    const updatedData = [...editableData];
    updatedData[index].content = value;
    setEditableData(updatedData);
  };

  const fetchLatestImageResult = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('토큰이 없습니다.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`http://34.22.80.43:8000/api/process-image2/`, config);

      console.log('서버 응답 (process-image2):', response.data);

      const responseData = response.data;
      setLatestImageResults(responseData);
    } catch (error) {
      console.error('오류 발생:', error);
    }
  };


  const handleSave = async () => {
    try {

      editableData.forEach(item => {
        const lowercaseTitle = item.title.toLowerCase();
    
        if (lowercaseTitle === '비밀번호 확인') {
          updatedUserData['password'] = item.content;
        } else if (lowercaseTitle === '아이디') {
          updatedUserData['username'] = item.content;
        } else if (lowercaseTitle === '이메일') {
          updatedUserData['email'] = item.content;
        } else if (lowercaseTitle === '전화번호') {
          updatedUserData['phone'] = item.content;
        } else if (lowercaseTitle === '성별') {
          updatedUserData['sex'] = item.content;
        }
      });

      const token = localStorage.getItem('accessToken');
      const passwordContent = editableData.find(item => item.title.toLowerCase() === '비밀번호 확인').content;
      const userDataPassword = editableData.find(item => item.title.toLowerCase() === '비밀번호 확인').content;
  
      if (passwordContent !== userDataPassword) {
        alert('비밀번호가 일치하지 않습니다. 수정이 허용되지 않습니다.');
        return;
      }
  
      // 요청 페이로드를 구성합니다.
      const requestData = {
        password: passwordContent,
        ...updatedUserData,
      };
  
      // 사용자 정보를 업데이트하기 위한 PUT 요청을 보냅니다.
      const response = await axios.put(
        `http://34.22.80.43:8000/users/${username}/`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        alert('정보가 성공적으로 수정되었습니다.');
        setIsEditMode(false);
      } else {
        console.error('정보 수정 실패:', response);
        alert('정보 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('정보 수정 중 오류:', error);
      alert('정보 수정에 실패했습니다.');
    }
  };


  useEffect(() => {
    const fetchFuelData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        
        // Fetch address data
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
  
        // Fetch fuel data between formattedStartDate and formattedEndDate
        const response = await axios.get(`http://34.22.80.43:8000/api/image-with-text/`, config);
  
        if (response.data) {
          const fuelDataArray = response.data;
  
          // Check if there is any fuel data
          if (fuelDataArray.length > 0) {
            // Take the latest fuel data
            const firstfuel = fuelDataArray[fuelDataArray.length - 1];
            setFuelData(firstfuel);
            console.log('차량주유금액 최신 데이터', firstfuel);
          } else {
            console.warn('FUEL_DATA가 없습니다.');
          }
        } else {
          console.error('response.data 또는 FUEL_DATA가 정의되지 않았습니다.');
        }
      } catch (error) {
        console.error('연료 데이터를 불러오는 중 오류:', error);
  
        if (axios.isAxiosError(error)) {
          console.error('AxiosError 응답 데이터:', error.response.data);
        }
      }
    };
  
    // fetchFuelData 함수 호출
    fetchFuelData();
  }, [setFuelData]);
  



  const linkStyle = {
    textDecorationLine: 'none',
    color: 'black',
    padding: '10px',
    cursor: 'pointer',
  };

 // 이미지 업로드 핸들러
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

   // 이미지 업로드 버튼 클릭 핸들러
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

    // 이미지 취소 핸들러
  const handleCancelImage = () => {
    setUploadedImage(null);
  }

  const handleConfirm = () => {

    const deleteUserAccount = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
          // Access Token이 없으면 로그인이 되어있지 않은 상태
          alert('로그인이 필요합니다.');
          return;
        }

        const response = await axios.delete(`http://34.22.80.43:8000/users/${username}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.status === 204) {
          // 계정 삭제 성공
          alert('그동안 감사했습니다.');
          // 로그아웃 
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          // 이동할 경로
          navigate('/');
        } else {
          // 서버 응답 처리
          console.error('회원탈퇴 실패:', response);
          alert('회원탈퇴에 실패했습니다.');
        }
      } catch (error) {
        // 오류 처리
        console.error('회원탈퇴 중 오류:', error);
        alert('회원탈퇴에 실패했습니다.');
      }
    };

    // 계정 삭제 함수 호출
    deleteUserAccount();
  };


    // 차량 정보 데이터 배열...이쪽 수정해야하는디
  // const cardata = [
  //   { title: 'VEHICLE TYPE', content: '등급' },
  //   { title: '차종', content: '차종' },
  //   { title: 'CO2 배출량(g/km)', content: '배출량' },
  //   { title: '주소', content: '주소' },
  //   { title: '차량 코드', content: 'asd' },
  // ];


  return (
    <div>
      <div style={{ padding: '100px' }}>
        <div className="col-md-3">
          <div
            className="border-end"
            style={{
              width: '200px',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              background: '#d9d9d9',
            }}
          >
            {/* 사이드바 */}
            <ul className="nav navbar-nav ml-auto" style={{ listStyle: 'none', padding: 0 }}>
              <h1 className="m-5">마이페이지</h1>
              {['option2', 'option3'].map((section) => (
                <li key={section}>
                  <div
                    onClick={() => handleSectionClick(section)}
                    className={`my-page-link ${selectedSection === section ? 'active' : ''}`}
                    style={{
                      ...linkStyle,
                      backgroundColor: selectedSection === section ? '#f6f6f6' : '',
                    }}
                  >
                    {/* 사이드바 메뉴 배열 */}
                    {/* <h4>{section === 'option1' ? '설정' : section === 'option2' ? '회원 정보' : section === 'option3' ? '기록': ''}</h4> */}
                    <h4>{section === 'option2' ? '회원 정보' : section === 'option3' ? '기록': ''}</h4>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 사용자명 */}
        <div className="col-md-9 row-md-3">
          <div id="option1" style={{ height: '10%', width: '100%', background: '#E5F4D2', display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '80px', height: '70px', overflow: 'hidden', borderRadius: '50%', margin: '10px' }}>
              {uploadedImage && (
                <img
                  src={uploadedImage}
                  onClick={handleImageClick}
                  alt="Uploaded Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
  
              {!uploadedImage && (
                <>
                  <input type="file" onChange={handleImageUpload} ref={fileInputRef} style={{ display: 'none' }} />
                  <img
                    src={eximage}
                    alt="Example Image"
                    style={{ width: '100%', height: '100%', borderRadius: '50%', cursor: 'pointer', objectFit: 'cover' }}
                    onClick={handleImageClick}
                  />
                </>
              )}
            </div>
            <div style={{ padding: '0px', width: '100%' }}>
              <div className="fs-1" style={{ display: 'flex', alignItems: 'center' }}>
              <span><strong>{username}</strong></span> <span>님 어서오세요.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 내 차량 정보 */}
        <div className="col-md-8 row-md-10">
          {/* {selectedSection === 'option1' && (
            <div id="option1" style={{ height: '50%', background: '#ffffff' }}>
              <div className="col-md-3">
                <div style={{
                  border: uploadedImage ? 'none' : '2px dashed #ccc',
                  borderRadius: '5px',
                  padding: '10px',
                  marginBottom: '10px',
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '400px',
                  width: '400px',
                  marginTop: '20px',
                }}>

                  {uploadedImage && (
                    <div style={{ position: 'relative', textAlign: 'center' }}>
                      <img
                        src={uploadedImage}
                        alt="Uploaded"
                        style={{ width: '100%', height: 'auto', objectFit: 'contain', marginBottom: '10px' }}
                      />
                      <div style={{ marginTop: '10px' }}>
                        <button type="button" className="btn btn-dark" onClick={handleCancelImage}>
                          다시 업로드
                        </button>
                      </div>
                    </div>
                  )}

                  {!uploadedImage && (
                    <>
                      <input
                        type="file"
                        onChange={handleImageUpload}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                      />
                      <div
                        onClick={handleImageClick}
                        style={{
                          cursor: 'pointer',
                          color: '#ccc',
                          fontSize: '16px',
                        }}
                      >
                        Click to upload image
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="col-sm-6">
                <div className="h4" style={{ position: 'relative', top: '20px', left: '48%', width: '100%' }}>
                {fuelData  && (
                  <div key={fuelData.id} className="col-sm-12 border-bottom p-3 mx-5 mt-3" style={{ padding: '15px', fontSize: '15px' }}>
                    <div>
                      <label>차종:</label> <span>{fuelData.vehicle_type}</span>
                    </div>
                    <div>
                      <label>번호:</label> <span>{fuelData.g_print}</span>
                    </div>
                  </div>
                  )}
                </div>
              </div>
            </div>
          )} */}

                {/* {cardata.map((data, index) => (
                    <div key={index} className="col-sm-12 border-bottom p-3 mx-5 mt-3" style={{ padding: '15px', fontSize: '15px' }}>
                    <dt className="col-sm-6">{data.title}</dt>
                    <dd className="col-sm-6">
                    {data.content}
                    </dd>
                    </div>
                ))}
                 */}
            {selectedSection === 'option2' && (
              <div id="option2" style={{ height: '20px' }}>
                <dl className="row">
                  {editableData.map((item, index) => (
                    <div key={index} className="col-sm-12 border-bottom" style={{ padding: '15px', fontSize: '15px' }}>
                      <dt className="col-sm-3">{item.title}</dt>
                      <dd className="col-sm-9">
                        {item.title.toLowerCase() === '아이디' ? (
                          <span>{item.content}</span>
                        ) : (
                          isEditMode ? (
                            <input
                              type="text"
                              value={item.content}
                              onChange={(e) => handleInputChange(index, e.target.value)}
                            />
                          ) : (
                            item.content
                          )
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
                {isEditMode ? (
                  <>
                    <button className="btn btn-primary mx-3" style={{ fontSize: '16px' }} onClick={handleSave}>
                      저장하기
                    </button>
                  </>
                ) : (
                  <button className="btn btn-primary mx-3" style={{ fontSize: '16px' }} onClick={() => setIsEditMode(true)}>
                    수정하기
                  </button>
                )}
                <h1 className="btn btn-danger" style={{fontSize: '16px'}} onClick={(handleConfirm)}>
                  회원탈퇴
                </h1>
              </div>
            )}

            {selectedSection === 'option3' && (
              <Mypage_option3 />
            )}


        </div>
      </div>
    </div>
  );
};

export default MyPage;