import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Mypage_option3 = () => {
  const [latestImageResults, setLatestImageResults] = useState(null);

  useEffect(() => {
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

        const response = await axios.get(`http://34.22.80.43/api/process-image2/`, config);

        console.log('서버 응답 (process-image2):', response.data);

        const responseData = response.data;
        setLatestImageResults(responseData);
      } catch (error) {
        console.error('오류 발생:', error);
      }
    };

    fetchLatestImageResult();
  }, []);

  const renderDataColumns = () => {

    return (
        <div className="py-5">
        <div className="row" style={{ textAlign: 'center', margin: 0, padding: 20, width: '113%', backgroundColor: 'lightgray'}}>
            <div className="col-md-1">
                <p>NO.</p>
            </div>
            <div className="col-md-1">
                <p>VEHICLE TYPE</p>
            </div>
            <div className="col-md-1">
                <p>PLATE</p>
            </div>
            <div className="col-md-1">
                <p>PLATE VEHICLE TYPE</p>
            </div>
            <div className="col-md-6">
                <p>EXPLATIN</p>
            </div>
            <div className="col-md-2">
                <p>IMAGE</p>
            </div>
            </div>
            </div>

      
    );
  };

  const renderDataRows = () => {
    if (!latestImageResults || latestImageResults.length === 0) {
      return null;
    }

    return latestImageResults.map((result, rowIndex) => (
      <div key={rowIndex} className="row" style={{ textAlign: 'center', margin: 0, width: '113%' }}>
        <div className="col-md-1">
          <p>{result.id}</p>
        </div>
        <div className="col-md-1">
          <p>{result.vehicle_type}</p>
        </div>
        <div className="col-md-1">
          <p>{result.license_plate_text}</p>
        </div>
        <div className="col-md-1">
          <p>{result.LICENSE_PLATE_VEHICLE_TYPE}</p>
        </div>
        <div className="col-md-6">
          <p>{result.g_print}</p>
        </div>
        <div className="col-md-2">
          <img src={result.second_model_image_url} 
          alt="이미지"
          style={{ width: '150px' }} />
        </div>
        <hr className="my-3"></hr>
      </div>
    ));
  };

  return (
    <div>
      {renderDataColumns()}
      {renderDataRows()}
    </div>
  );
};

export default Mypage_option3;
