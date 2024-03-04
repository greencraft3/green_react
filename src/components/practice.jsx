import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Practice = () => {
  const [fuelData, setFuelData] = useState([]);
  const [formattedStartDate, setFormattedStartDate] = useState('');
  const [formattedEndDate, setFormattedEndDate] = useState('');

  // 차종 코드에 따라 실제 차종을 반환하는 함수
  function getCarType(carcode) {
    switch (carcode) {
      case 0:
      case 1:
        return 0;
      case 2:
      case 3:
        return 1;
      case 4:
        return 2;
      case 5:
        return 3;
      case 6:
        return 4;
      default:
        return -1; 
    }
  }
  

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      // 값 받아오기
      const fetchFuelData = async () => {
        try {
          const token = localStorage.getItem('accessToken');
          const managercode = localStorage.getItem('managercode');

          // 예제 날짜 포맷 (필요에 따라 수정)
          const currentMonth = new Date().getMonth() + 1; // Get the current month
          const formattedStartDate = `2024-${currentMonth}-01`;
          const lastDate = new Date(2024, currentMonth, 0).getDate(); // Get the last day of the current month
          const formattedEndDate = `2024-${currentMonth}-${lastDate}`;

          // Fetch fuel data between formattedStartDate and formattedEndDate
          if (managercode) {
            const config = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };

          const response = await axios.get(
            `http://34.22.80.43:8000/api/image-with-text/?start_date=${formattedStartDate}&end_date=${formattedEndDate}&managercode=${managercode}`,
            config
          );
          
          const allFuelData = response.data;
          // 실제 API 응답 형태에 따라 데이터 추출
          const fetchedFuelData = allFuelData.filter(item => item.managercode === managercode);
          setFuelData(fetchedFuelData);
          console.log('fetchedFuelData', fetchedFuelData)

            // 각 차트의 context를 정의
            var ctx1 = document.getElementById('myChart').getContext('2d');
            var ctx2 = document.getElementById('mySecondChart').getContext('2d');
            var ctx3 = document.getElementById('myThirdChart').getContext('2d');
            var ctx4 = document.getElementById('myFourthChart').getContext('2d');

            // 첫 번째 차트 생성
            new window.Chart(ctx1, {
              type: 'line',
              data: generateChartDataForAmount(fetchedFuelData),
              options: {
                title: {
                  display: true,
                  text: '일별 총 기름 가격',
                },
                scales: {
                  y: {
                    ticks: {
                      beginAtZero: true,
                      text: (ctx) => 'Point Style: ' + ctx.chart.data.datasets[0].pointStyle,
                    },
                  },
                },
                elements: {
                  point: {
                    radius: 5,
                    pointStyle: 'rectRot',
                  },
                },
              },
            });

            // 두 번째 차트 생성
            new window.Chart(ctx2, {
              type: 'line',
              data: generateChartDataForcarbon(fetchedFuelData),
              options: {
                title: {
                  display: true,
                  text: '일별 총 탄소세 가격',
                },
                scales: {
                  y: {
                    ticks: {
                      beginAtZero: true,
                      text: (ctx) => 'Point Style: ' + ctx.chart.data.datasets[0].pointStyle,
                    },
                  },
                },
                elements: {
                  point: {
                    radius: 5,
                    pointStyle: 'rectRot',
                  },
                },
              },
            });
            

            // 세 번째 차트 생성
            new window.Chart(ctx3, {
              type: 'doughnut',
              data: generateChartData(fetchedFuelData),
              options: {
                title: {
                  display: true,
                  text: '한달 차량별 비율 그래프',
                },
                maintainAspectRatio: false,
              },
            });

            // 네 번째 차트 생성
            new window.Chart(ctx4, {
              type: 'bar', // 바 차트로 변경
              data: generateChartDataForDate(fetchedFuelData),
              options: {
                scales: {
                  yAxes: [{
                    ticks: {
                      stepSize: 1,
                    },
                  }],
                },
                title: {
                  display: true,
                  text: '일별 주유 이용객 수 그래프',
                },
                maintainAspectRatio: false,
              },
            });
          }
        } catch (error) {
          console.error('Error fetching fuel data:', error);
        }
      };

      fetchFuelData();
    };
  }, []); 

  //1번째 그래프
  const generateChartDataForAmount = (fuelData) => {
    const dateAmounts = {};
  
    // fuelData에서 각 날짜에 대한 refuel_amount * fuel_consumed 계산
    fuelData.forEach((item) => {
      const fullDate = item.date;
      const daySubstring = fullDate.substring(8, 10);
      const dayOfMonth = parseInt(daySubstring, 10);
  
      if (!isNaN(dayOfMonth)) {
        const amount = item.refuel_amount * item.fuel_consumed;
        dateAmounts[dayOfMonth] = (dateAmounts[dayOfMonth] || 0) + amount;
      }
    });
  
    // 차트 데이터 구성
    const chartData = {
      labels: Array.from({ length: 29 }, (_, index) => index + 1),
      datasets: [{
        label: '합산된 기름 가격', // 새로운 데이터셋을 위한 라벨
        data: Array.from({ length: 29 }, (_, index) => dateAmounts[index + 1] || 0),
        backgroundColor: 'transparent', // 색상은 임의로 지정하셔도 됩니다.
        borderColor: '#147814',
        borderWidth: 1,
      }],
    };
  
    return chartData;
  };

  //2번째 그래프
  const generateChartDataForcarbon = (fuelData) => {
    const datecarbon = {};
  
    // fuelData에서 각 날짜에 대한 refuel_amount * fuel_consumed 계산
    fuelData.forEach((item) => {
      const fullDate = item.date;
      const daySubstring = fullDate.substring(8, 10);
      const dayOfMonth = parseInt(daySubstring, 10);
  
      if (!isNaN(dayOfMonth)) {
        // 정규표현식을 사용하여 숫자와 점만 남기고 나머지 제거
        const amountString = item.carbon_tax.replace(/[^\d.]/g, '');
        const amount = parseFloat(amountString);
  
        // 값이 NaN이 아니라면 합산
        if (!isNaN(amount)) {
          datecarbon[dayOfMonth] = (datecarbon[dayOfMonth] || 0) + amount;
        }
      }
    });
  
    // 확인을 위한 로그 추가
    console.log('datecarbon:', datecarbon);
  
    // 차트 데이터 구성
    const chartData = {
      labels: Array.from({ length: 29 }, (_, index) => index + 1),
      datasets: [{
        label: '합산된 탄소세 가격',
        data: Array.from({ length: 29 }, (_, index) => datecarbon[index + 1] || 0),
        backgroundColor: 'transparent',
        borderColor: '#6CCC65',
        borderWidth: 1,
      }],
    };
  
    return chartData;
  };
  

  const generateChartData = (fuelData) => {
    const carCounts = {
      0: 0, // 경차
      1: 0, // 경차
      2: 0, // 승용차
      3: 0, // 승용차
      4: 0, // 화물차
    };
    

    // fuelData에서 각 차종에 대한 count 계산
    fuelData.forEach((item) => {
      const carCode = getCarType(item.carcode); // getCarType 함수 사용
      if (carCode !== -1) { // 유효한 차종 코드인 경우에만 업데이트
        carCounts[carCode]++;
      }
    });

    // 차트 데이터 구성
    const chartData = {
      labels: ['경차', '승용차', '화물차', '승합차', '건설차량'],
      datasets: [{
        label: 'Dataset 3',
        data: Object.values(carCounts),
        backgroundColor: ['#445C4C', '#508068', '#8AB6A9', '#D6E2E0', '#BFC9CA' ],
        borderWidth: 1,
      }],
    };

    return chartData;
  };


  const generateChartDataForDate = (fuelData) => {
    const dateCounts = {};
  
    // fuelData에서 각 날짜에 대한 count 계산
    fuelData.forEach((item) => {
      const fullDate = item.date; // 날짜 필드에 따라 수정
      const daySubstring = fullDate.substring(8, 10); // "2024-02-21"에서 21만 추출
  
      // 추출한 부분이 숫자인 경우에만 누적
      const dayOfMonth = parseInt(daySubstring, 10);
      if (!isNaN(dayOfMonth)) {
        dateCounts[dayOfMonth] = (dateCounts[dayOfMonth] || 0) + 1;
      }
    });
  
     // 처음과 끝 사이의 색상 30개 생성
  const gradientColors = Array.from({ length: 29 }, (_, index) => {
    const progress = index / 29; // 0부터 1까지의 비율
    const color = interpolateColor('#B9D6BC', '#349B90', progress); // 시작과 끝 사이의 색상을 보간
    return color;
  });
  
    // 중복되는 날짜가 있을 경우 누적된 값을 기준으로 차트 데이터 구성
    const chartData = {
      labels: Array.from({ length: 29 }, (_, index) => index + 1), // 1부터 30까지의 배열 생성
      datasets: [{
        label: '이용객 수',
        data: Array.from({ length: 29 }, (_, index) => dateCounts[index + 1] || 0), // 해당 일자의 데이터 수를 가져오고, 없으면 0으로 처리
        backgroundColor: gradientColors,
        borderWidth: 1,
      }],
    };
  

    return chartData;
  };

  // 두 색상 사이를 비례적으로 보간하는 함수
  function interpolateColor(color1, color2, ratio) {
    const hex = (c) => {
      const value = Math.round(c);
      const stringValue = value.toString(16);
      return value < 16 ? '0' + stringValue : stringValue;
    };

    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);

    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);

    const r = Math.floor(r1 * (1 - ratio) + r2 * ratio);
    const g = Math.floor(g1 * (1 - ratio) + g2 * ratio);
    const b = Math.floor(b1 * (1 - ratio) + b2 * ratio);

    return `#${hex(r)}${hex(g)}${hex(b)}`;
  }
  

  const chartContainerStyle = {
    width: '600px',
    height: '300px',
    margin: '10px',
    padding: '10px 20px 23px 20px', // 내부 요소에 대한 패딩
    boxSizing: 'border-box',
    boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
    borderRadius: '10px',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={{ paddingTop: '30px', display: 'flex', flexWrap: 'wrap', backgroundColor: '#ffffff' }}>
      <div style={chartContainerStyle}>
        <canvas id="myChart"></canvas>
      </div>
      <div style={chartContainerStyle}>
        <canvas id="mySecondChart"></canvas>
      </div>
      <div style={chartContainerStyle}>
        <canvas id="myThirdChart"></canvas>
      </div>
      <div style={chartContainerStyle}>
        <canvas id="myFourthChart"></canvas>
      </div>
    </div>
  );
};

export default Practice;
