import React from 'react';

// 개별 팀 멤버의 이미지 파일을 임포트합니다.
import member1 from "../조완우.png";
import member2 from "../박상일.jpg";
import member3 from "../추민승.png";
import member4 from "../윤지민.png";
import member5 from "../전수연.png";
import member6 from "../오은채.jpg";

const Team = () => {
  const members = [
    { image: member1, name: '조완우' },
    { image: member2, name: '박상일' },
    { image: member3, name: '추민승' },
    { image: member4, name: '윤지민' },
    { image: member5, name: '전수연' },
    { image: member6, name: '오은채' },
  ];

  return (
    <div id="team" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>MEET THE TEAM</h2>
          <dt><p>The Talented and Diverse Team of Greencraft</p></dt>
        </div>
        <div className="row">
          {members.map((member, index) => (
            <div key={index} className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
              <div className="hover-bg">
                <img src={member.image} alt="Team Member" style={{ maxWidth: '50%', height: 'auto', display: 'block', margin: '0 auto 30px' }} />
                {/* 글씨 크기를 늘려서 팀 멤버의 이름을 표시합니다. */}
                <div style={{ fontSize: '20px', marginTop: '-10px', width: '50%', margin: '0 auto', backgroundColor: '#a4ffaf',
              fontWeight: 'bold', WebkitFontSmoothing: 'antialiased' }}>{member.name}</div><br></br>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Team