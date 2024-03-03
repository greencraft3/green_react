import React from "react";
import download1 from '../google1.svg';
import download2 from'../google2.svg';
import bg from '../bg_wave.svg';
import phone_wave from'../phone_wave.png';

const Introduce = (props) => {
  return (
    <div id="introduce" style={{ paddingTop: '250px', paddingBottom: '500px'}}>
      <div className="container" >
        <img src={bg} alt="Background Wave" style={{ position: 'absolute', bottom: '150', left: '200' }} />
        <div style={{ paddingTop: '100px' }}>
          <div style={{ position: 'absolute' }}>
            <h1 className="display-1">Our small efforts <br></br>reshape the <br></br>Earth.</h1><br></br>
            {/* 우리의 작은 노력이 지구를 새롭게 만듭니다. */}
            <h5 className="fw-lighter">With the belief that small individual actions <br></br> for the environment can make a significant impact,<br></br>
              GreenCraft welcomes all users who are eager<br></br> to join the journey towards creating a sustainable future together</h5>
            {/* 환경을 위한 나만의 작은 행동이 큰 차이를 만든다는 생각과 함께, GreenCraft는 지속 가능한 미래를 함께 만들어가고자 하는 여정에 함께 참여하는 모든 이용자들을 환영합니다 */}

            {/* 구글플레이 */}
            <a href="https://play.google.com/store/search?q=github&c=apps&hl=ko-KR" target="_blank" rel="noopener noreferrer">
              <img src={download1} alt="Download 1" style={{ position: 'relative', top: '100', right: '30' }} />
            </a>

            {/* 애플 앱스토어 */}
            <a href="https://apps.apple.com/kr/app/github/id1477376905" target="_blank" rel="noopener noreferrer">
              <img src={download2} alt="Download 2" style={{ position: 'relative', top: '100', right: '20' }} />
            </a>
          </div>

          {/* 배경 이미지 및 다운로드 버튼 */}
          <img src={phone_wave} alt="phone_wave" style={{ position: 'absolute', bottom: '150', left: '1000' }} />

          <button
            type="button"
            className="btn btn-success col-2"
            style={{
              position: 'relative',
              top: '380',
              left: '500',
              fontSize: '2em',
              padding: '10px',
              background: '#80d038',
              border: 'none'
            }}
            onClick={() => {
              // 다운로드 버튼 연결
              window.location.href = "https://drive.google.com/file/d/15mg8773Wz-2TxpOdUrXyMTYdd-qpPnDM/view?usp=sharing";
            }}
          >
            DOWNLOAD
          </button>
        </div>
      </div>
    </div>
  );
};

export default Introduce;
