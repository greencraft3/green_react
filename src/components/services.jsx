import React, { useState, useEffect } from "react";
import eximage from '../uploaded.png';
import axios from 'axios';
import Loading from './loading'; // 로딩 컴포넌트 임포트

const Services = (props) => {
  const [uploadedImage, setUploadedImage] = useState(eximage);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리를 위한 상태
  const [pricePerLiter, setPricePerLiter] = useState('');
  const [carbonTax, setCarbonTax] = useState('');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState('');
  const [c_result, c_setResult] = useState('');

  // 이미지를 base64로 변환하는 함수
  const imageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        // Base64로 변환된 이미지 데이터
        let base64Image = reader.result.split(',')[1];
        
        // 패딩 추가
        const padding = '='.repeat((4 - base64Image.length % 4) % 4);
        base64Image += padding;
  
        resolve(base64Image);
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };
  


  const handleImageClick = () => {
    const fileInput = document.getElementById('fileInput');
  
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleCancelImage = () => {
    setUploadedImage(eximage);
  };

  const handleImageUpload = async (event) => {
    setIsLoading(true); // 로딩 시작
  
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (file) {
      try {
        const base64Image = await imageToBase64(file); // 이미지를 Base64로 변환
        const token = localStorage.getItem('accessToken'); // 인증 토큰 가져오기
    
        if (!token) {
          console.error('토큰이 없습니다.');
          setIsLoading(false); // 로딩 종료
          return;
        }
    
        // 서버에 이미지 업로드를 위한 POST 요청
        const response = await axios.post(`http://34.22.80.43:8000/api/process-image/`, {
          image: base64Image,
        }, {
          headers: {
            Authorization: `Bearer ${token}`, // 인증 헤더 설정
          },
        });
    
        console.log('서버 응답:', response.data); // 서버 응답 로깅
    
        setUploadedImage(response.data.second_model_image_url); // 업로드된 이미지 URL 상태 업데이트
        setResult(response.data); // 서버 응답 전체를 결과 상태에 저장
      } catch (error) {
        console.error('오류 발생:', error); // 오류 로깅
      } finally {
        setIsLoading(false); // 작업 완료 후 로딩 상태 종료
      }
    } else {
      setIsLoading(false); // 파일이 선택되지 않은 경우 로딩 상태 종료
    }
  };
  
  
  
  
//계산기
  const calculate = () => {
    const price = parseFloat(pricePerLiter);
    const tax = parseFloat(carbonTax);
    const quantity = parseFloat(amount);

    if (isNaN(price) || isNaN(tax) || isNaN(quantity)) {
      alert('숫자를 입력하세요.');
      return;
    }

    const totalCost = (price + tax) * quantity;
    c_setResult(` ${totalCost.toFixed(2)}원`);
  };

  const resetCalculator = () => {
    setPricePerLiter('');
    setCarbonTax('');
    setAmount('');
    c_setResult('');
  };


  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        const reader = new FileReader();

        reader.onload = function (e) {
          setUploadedImage(e.target.result);
        };

        reader.readAsDataURL(file);
      } catch (error) {
        console.error('오류 발생:', error);
      }
    }
  };


  return (
    <div style={{ padding: '100px' }} className="text-center">
      <div className="container" style={{ height: '700px'}}>
        <div className="section-title"></div>

        <div className="row row-md-6">
          <div className="col-md-6 ">
            <div 
              style={{
                position: 'relative',
                overflow: 'hidden',
                width: '600',
                height: '600',
                maxWidth: '600px',
                maxHeight: '600px',
                minWidth: '200px',
                minHeight: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="업로드 된 이미지 미리보기"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    cursor: 'pointer',
                  }}
                  onClick={handleImageClick}
                />
              ) : (
                <img
                  src={eximage}
                  alt="Example Image"
                  style={{ cursor: 'pointer' }}
                  onClick={handleImageClick}
                />
              )}
              <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </div>
        </div>

          {/* 미리보기 페이지에 USERID에 해당되는 second_model_image 불러오기 */}
          <div className="col-md-6 text-left">
            <div
              style={{
                padding: '20px',
              }}
            >
              <h1 className="fw-bolder" style={{fontSize: '35'}}>차량 인식 모델</h1>
              <button
              className="btn"
              type="button"
              style={{
                background: '#9ADE7B',
                fontSize: '16px',  // 텍스트 크기 조절
                fontWeight: 'bold',  // 텍스트 두껍게
                letterSpacing: '1px',  // 글자 간격 조절
                padding: '5px 10px',  // 패딩 조절 (상하 10px, 좌우 20px)
              }}
              onClick={handleImageUpload}
            >
              모델 가동하기
            </button>
              <button type="button" 
              className="btn btn-dark mx-3 my-3" 
              style={{
                fontSize: '16px',  
                fontWeight: 'bold',  
                letterSpacing: '1px', 
                padding: '5px 10px', 
              }}
              onClick={handleCancelImage}>
                취소
              </button>
                

                <div className="my-3">
                  {uploadedImage ? (
                    <div key={result.id}>
                      <div>
                        <p>VEHICLE TYPE: {result.vehicle_type}</p>
                        <p>PLATE: {result.license_plate_text}</p>
                        <p>PLATE VEHICLE TYPE: {result.LICENSE_PLATE_VEHICLE_TYPE}</p>
                      </div>
                    </div>
                  ) : null}
                </div>


                <label>L당 기름값</label>
                <input type="text" className="form-control" value={pricePerLiter} onChange={(e) => setPricePerLiter(e.target.value)} required />
                <label>탄소세</label>
                <input type="text" className="form-control" value={carbonTax} onChange={(e) => setCarbonTax(e.target.value)} required />
                <label>L량</label>
                <input type="text" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                
                <button type="button" className="btn btn-warning my-3" 
                style={{
                  fontSize: '16px',  
                  fontWeight: 'bold',  
                  letterSpacing: '1px', 
                  padding: '5px 10px', 
                }}
                onClick={calculate}>
                  계산하기
                </button>
                <button type="button" className="btn btn-dark mx-3" 
                style={{
                  fontSize: '16px',  
                  fontWeight: 'bold',  
                  letterSpacing: '1px', 
                  padding: '5px 10px', 
                }}
                onClick={resetCalculator}>초기화</button>
                
                <div className="mt-3">
                  <h5>총 비용:</h5>
                  <h1 className="fw-bolder">{c_result}</h1>
                </div>

                
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '0px' }} className="text-center">
  {isLoading && <Loading />} {/* 로딩 상태가 true일 때 로딩 컴포넌트를 렌더링 */}
  <div className="container" style={{ height: '-20px', marginTop: '-10px' }}> {/* 상단 마진 추가 및 높이 값 수정 */}
  </div>
</div>


      <div className="my-3">
        {uploadedImage ? (
          <div key={result.id}>
            <p>{result.g_print}</p>
          </div>
        ) : null}
      </div>
      </div>




  );
  
};

export default Services;