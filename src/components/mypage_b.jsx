//사업자 유저 마이페이지
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import eximage from '../personicon.png';
import axios from 'axios';

import Practice from './practice'


const AmountItem = ({ label, amount }) => (
  <div className="border border-dark border-3 rounded-pill d-flex justify-content-between fw-bolder" 
  style={{ overflow: 'hidden', width: '300px', margin: '0 3'}}>
    {/* 왼쪽 영역 */}
    <div style={{ width: '30%', height: '40px', background: '#7ed957', padding: '10px', alignItems: 'center' }} 
      className="rounded-start text-white">
      <span style={{ padding: '0px', borderRadius: '5px' }}>{label}</span>
    </div>

    {/* 오른쪽 영역 */}
    <div style={{ width: '70%', height: '30px', background: 'white', padding: '10px', alignItems: 'center' }}>
      <span style={{ background: 'white', padding: '0px', borderRadius: '5px' }}>{amount}</span>
    </div>
  </div>
);

//보통휘발유, 신용카드...
const CategoryItem = ({ label }) => (
  <div className="bg-secondary rounded-pill" 
  style={{ 
    height: '50px', 
    width: '120px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    margin: '20px'}}>
    <div style={{ padding: '10px' }}>
      <h4 className="text-light">{label}</h4>
    </div>
  </div>
);

//휘발유 하는거 오른쪽에
const DataItem = ({ label, amount }) => (
  <div className="border border-dark border-3 rounded-pill d-flex fw-bolder" 
  style={{ overflow: 'hidden', margin: '20px' }}>
    {/* 왼쪽 영역 */}
    <div style={{ width: '50%', background: '#7ed957', padding: '10px', alignItems: 'center' }} 
    className="rounded-start text-white">
      <span style={{ padding: '5px', borderRadius: '5px' }}>{label}</span>
    </div>

    {/* 오른쪽 영역 */}
    <div style={{ width: '50%', background: 'white', padding: '10px', alignItems: 'center' }}>
      <span style={{ background: 'white', padding: '5px', borderRadius: '5px' }}>{amount}</span>
    </div>
  </div>
);

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






const MyPageB = () => {
  // 상태 및 변수 정의
  const [selectedSection, setSelectedSection] = useState('option1');
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [fuelData, setFuelData] = useState(null);
  const [filteredData, setFilteredData] = useState(null); // 가솔린 manager_businesscode
  const [highestIdFuel, setHighestIdFuel] = useState('');
  const [username, setUsername] = useState(localStorage.getItem('username') || null);
  const updatedUserData = {};
  const [editableData, setEditableData] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [managercode, setManagercode] = useState(null);
  const [manmodels, setManmodels] = useState([]);
  const [formattedStartDate, setFormattedStartDate] = useState('');
  const [formattedEndDate, setFormattedEndDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  //회원정보
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const managercode = localStorage.getItem('managercode');
        const _comcode = localStorage.getItem('comcode') === 'true';
  
        // Fetch user data
        const userResponse = await axios.get(`http://34.22.80.43:8000/users/${username}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = userResponse.data;
        setUsername(userData.username);
  
        setEditableData([
          { title: '사업자번호', content: userData.managercode },
          { title: '아이디', content: userData.username },
          { title: '이메일', content: userData.email },
          { title: '주소', content: userData.address },
          { title: '비밀번호 확인', content: userData.password },
        ]);
  
        setFormattedStartDate();
        setFormattedEndDate();

      } catch (error) {
        console.error('데이터를 불러오는 중 오류:', error);
  
        if (axios.isAxiosError(error)) {
          console.error('AxiosError 응답 데이터:', error.response.data);
        }
      }
    };
  
    fetchData();
  }, [username, formattedStartDate, formattedEndDate]);
  

  //차량주유금액
  useEffect(() => {
    const fetchFuelData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const managercode = localStorage.getItem('managercode');
  
        // Fetch address data
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch fuel data between formattedStartDate and formattedEndDate
        const response = await axios.get(
          `http://34.22.80.43:8000/api/image-with-text/?start_date=${formattedStartDate}&end_date=${formattedEndDate}&order_by=-id`,
         config);
  
        if (response.data) {
          const fuelDataArray = response.data;
  
        const highestIdFuel  = fuelDataArray.reduce((prev, current) =>
          prev.id > current.id ? prev : current
        );

          // Filter fuel data based on managercode
          const setHighestIdFuel = fuelDataArray.filter(data => data.managercode === managercode);
  
          if (setHighestIdFuel.length > 0) {
            setFuelData(highestIdFuel);
            console.log('차량주유금액 최신 데이터', highestIdFuel);
          } else {
            console.warn('일치하는 FUEL_DATA가 없습니다.');
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
  }, [managercode, formattedStartDate, formattedEndDate, setFuelData]);
  

  //가솔린 가격
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const managercode = localStorage.getItem('managercode');
  
        // Fetch business codes data
        const businessCodesResponse = await axios.get(`http://34.22.80.43:8000/businesscodes/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (businessCodesResponse.data) {
          const businessCodesArray = businessCodesResponse.data;
  
          // Find the business code based on managercode
          const matchingBusinessCode = businessCodesArray.find(data => data.managercode === managercode);
  
          if (matchingBusinessCode) {
            // Update filteredData state with gasoline_price
            setFilteredData(matchingBusinessCode.gasoline_price);
  
            // 여기에서 필요한 로직을 추가할 수 있습니다.
            console.log('가솔린 가격:', matchingBusinessCode.gasoline_price);
  
            // 예시로 다른 상태에 값을 저장하지 않고, 필요한 로직 추가
            // yourAdditionalLogic(matchingBusinessCode.gasoline_price);
  
          } else {
            console.warn('일치하는 BUSINESS_CODE가 없습니다.');
          }
        } else {
          console.error('businessCodesResponse.data 또는 BUSINESS_CODE가 정의되지 않았습니다.');
        }
      } catch (error) {
        console.error('Business Codes를 불러오는 중 오류:', error);
  
        if (axios.isAxiosError(error)) {
          console.error('AxiosError 응답 데이터:', error.response.data);
        }
      }
    };
  
    // fetchData 함수 호출
    fetchData();
  }, []); // 두 번째 매개변수를 빈 배열로 두어 최초 렌더링 시에만 실행되도록 함

  
  

  //탄소세금계산
  const handleSearch = async () => {
    console.log('handleSearch 함수가 호출되었습니다.');
    const token = localStorage.getItem('accessToken');
    const managercode = localStorage.getItem('managercode');
    const userId = localStorage.getItem('userId'
    );
    console.log('값:', username, userId);
    
    try {
      if (token && managercode && userId) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
  
        const searchData = {
          managercode: managercode,
          start_date: startDate,
          end_date: endDate,
          username: userId,
        };
        
  
        // POST request to create new data
        const postResponse = await axios.post('http://34.22.80.43:8000/manmodels/', searchData, config);
  
        // Check if the POST request was successful
        if (postResponse.status === 201) {
          // Update the state with the created data
          setManmodels([postResponse.data]);
        } else {
          console.error('Failed to create data.');
        }
      }
    } catch (error) {
      alert("Please select a date");
      console.error('Error while fetching data:', error);
    }
  };
  
  
  

    const handleStartDateChange = (e) => {
      const newStartDate = e.target.value;
      setStartDate(newStartDate);
    };
    
    const handleEndDateChange = (e) => {
      const newEndDate = e.target.value;
      setEndDate(newEndDate);
    };

  const categories = ['보통 휘발유', '신용카드', '5B 리터', '주유'];


  // 마이페이지 좌측 사이드바 스타일
  const linkStyle = {
    textDecorationLine: 'none',
    color: 'black',
    padding: '10px',
    cursor: 'pointer',
  };

  // 사람모양 아이콘 클릭시 이미지 업로드 기능
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
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  

  const handleSectionClick = (sectionId) => {
    setSelectedSection(sectionId);
    setIsEditMode(false);
  };

  const handleInputChange = (index, value) => {
    const updatedData = [...editableData];
    updatedData[index].content = value;
    setEditableData(updatedData);
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
        } else if (lowercaseTitle === '주소') {
          updatedUserData['address'] = item.content;
        } else if (lowercaseTitle === '사업자번호') {
          updatedUserData['managercode'] = item.content;
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


  return (
    <div>
      {/* 전체영역 */}
      <div style={{ padding: '100px' }}>
        <div className="col-md-3">
          <div
            className="border-end"
            style={{
              width: '200px',
              height: '85%',
              display: 'flex',
              justifyContent: 'center',
              background: '#d9d9d9',
            }}
          >

            {/* 좌측 사이드바 */}
            <ul className="nav navbar-nav ml-auto" style={{ listStyle: 'none', padding: 0 }}>
              <h1 className="m-5">마이페이지</h1>
              <li>
                <div
                  onClick={() => handleSectionClick('option1')}
                  className={`my-page-link ${selectedSection === 'option1' ? 'active' : ''}`}
                  style={{ ...linkStyle, backgroundColor: selectedSection === 'option1' ? '#f6f6f6' : '' }}
                >
                  <h4>지점 확인 서비스</h4>
                </div>
              </li>
              <li>
                <div
                  onClick={() => handleSectionClick('option2')}
                  className={`my-page-link ${selectedSection === 'option2' ? 'active' : ''}`}
                  style={{ ...linkStyle, backgroundColor: selectedSection === 'option2' ? '#f6f6f6' : '' }}
                >
                  <h4>회원 정보</h4>
                </div>
              </li>
              <li>
                <div
                  onClick={() => handleSectionClick('option3')}
                  className={`my-page-link ${selectedSection === 'option3' ? 'active' : ''}`}
                  style={{ ...linkStyle, backgroundColor: selectedSection === 'option3' ? '#f6f6f6' : '' }}
                >
                  <h4>서비스 한눈에 보기</h4>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* 오른쪽 영역 상단고정 아이콘 + 사용자명란 */}
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
                <span><strong>{username}</strong></span> <span>님, 어서오세요</span>
              </div>
            </div>
          </div>
        </div>
      
  
      {/* 지점 확인 서비스 */}
      <div className="col-md-8 row-md-10">
        {selectedSection === 'option1' && (
          <div id="option1">
            <div className="row my-3">
              <div className="col-sm-6">
                <div className="p-3" style={{ width: '100%', background: '#7ed957', display: 'flex', alignItems: 'center' }}>
                  <h1 className="ms-5 text-light">차량 주유 금액</h1>
                </div>

                <div className="row">
                {fuelData  && (
                <div key={fuelData.id} className="col-md-4 h4 d-flex" style={{ width: '100%', padding: '10' }}>
                  <AmountItem label="차종" amount={getCarType(fuelData.carcode)} />
                  <AmountItem label="번호" amount={fuelData.bunho_text} />
                  <AmountItem label="시간" amount={fuelData.date.substring(11,19)} />
                </div>
              )}
                </div>

                {/* 가운데 영역 */}
                <div className="border border-dark border-2 rounded-3 d-flex" style={{ height: '300px' }}>
                  <div className="col-md-4">
                    {/* 보통 휘발유, 신용카드, 5B리터... */}
                    {categories.map((category, index) => (
                      <CategoryItem key={index} label={category} />
                    ))}
                  </div>

                  <div className="col-md-9 h4">
                  {fuelData && (
                    <div key={fuelData.id} className="col-md-4 h4" style={{ padding: '10px 20px', width: '100%' }}>
                      {filteredData && (
                      <DataItem label="단가" amount={filteredData} />
                      )}
                      <DataItem label="리터" amount={fuelData.fuel_consumed} />
                      <DataItem label="탄소세" amount={fuelData.carbon_tax} />
                      <DataItem label="금액" amount={fuelData.refuel_amount} />
                    </div>
                  )}
                  </div>
                </div>

                <div>
                {/* <div className="border bg-light rounded-3 d-flex my-3" style={{ height: '300px' }}>
                {fuelData && (
                  <div key={fuelData.id} className="col-md-4 h4 d-flex">
                    <div style={{ flex: 1, borderRight: '2px solid white', display: 'flex', alignItems: 'center' }}>
                      <img alt="번호판 이미지" src={fuelData.bunho_img} style={{ width: '200px' }} />
                    </div>
                    <div style={{ flex: 1, paddingLeft: '10px', display: 'flex', alignItems: 'center' }}>
                      <img alt="차 이미지" src={fuelData.car_img} style={{ width: '300px' }} />
                    </div>
                  </div>
                )}
              </div> */}
                </div>
              </div>

                {/* 오른쪽 영역 */}
                <div className="col-sm-5 ms-5">
                  <div className="p-3" style={{ width: '100%', background: '#6cd23e', display: 'flex', alignItems: 'center' }}>
                    <h1 className="ms-5 text-light">탄소 세금 계산</h1>
                  </div>
                  <div>
                  <div key={manmodels.id} style={{ margin: '0', paddingTop: '10px' }}>
                    <div className="d-flex">
                      <div className="me-3">
                        <label htmlFor="startDatePicker">시작 날짜:</label>
                        <input
                          type="date"
                          id="startDatePicker"
                          name="startDate"
                          className="form-control"
                          value={startDate}
                          onChange={handleStartDateChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="endDatePicker">끝나는 날짜:</label>
                        <input
                          type="date"
                          id="endDatePicker"
                          name="endDate"
                          className="form-control"
                          value={endDate}
                          onChange={handleEndDateChange}
                        />
                      </div>
                      <button
                        className="btn btn-primary"
                        style={{ width: '100px', height: '33px', margin: '23px 10px' }}
                        type="button"
                        onClick={handleSearch}
                      >
                        <h5>검색하기</h5>
                      </button>
                    </div>
                    
                    <div className="h4">
                      {manmodels.length > 0 && (
                        <div key={manmodels.id} style={{ margin: '0', paddingTop: '10px' }}>
                          <div style={{ width: '100%' }}>
                            <DataItem label="총 기름 L" amount={(parseFloat(manmodels[0].total_gas) || 0).toFixed(2)} />
                            <DataItem label="총 탄소세" amount={(parseFloat(manmodels[0].total_carbon) || 0).toFixed(2)} />
                          </div>
                        </div>
                      )}
                      {manmodels.length === 0 && (
                        <div key="noData" style={{ margin: '0', paddingTop: '10px' }}>
                          <div style={{ width: '100%' }}>
                            <DataItem label="총 기름 L" amount="0.00" />
                            <DataItem label="총 탄소세" amount="0.00" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  </div>
                </div>
            </div>
          </div> 
        )}
        
        
  
        {/* 회원정보 */}
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
          <div id="option3" style={{ display: 'flex', width: '1400px' }}>
            <Practice />
          </div>
        )}
      </div></div></div>
  )};

export default MyPageB;
