import { useState } from "react";
import emailjs from "emailjs-com"; // emailjs 라이브러리를 임포트합니다.
import React from "react";

// 초기 상태를 설정하는 변수입니다. 폼 필드들을 초기화하는 데 사용됩니다.
const initialState = {
  name: "",
  email: "",
  message: "",
};

const Contact = (props) => {
  // useState를 사용하여 폼의 상태를 관리합니다.
  const [{ name, email, message }, setState] = useState(initialState);
  const [isSubmitted, setIsSubmitted] = useState(false); // 추가: 메시지 전송 상태를 추적하는 상태 변수


  // 폼 입력이 변경될 때 호출되는 함수입니다. 각 입력값을 상태에 업데이트합니다.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  // 폼의 상태를 초기화하는 함수입니다.
  const clearState = () => setState({ ...initialState });

  // 폼을 제출할 때 호출되는 함수입니다. 이메일 전송을 처리합니다.
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, email, message);
    
    // // emailjs를 사용하여 이메일을 전송합니다. 서비스 ID, 템플릿 ID, 공개 키를 설정해야 합니다.
    // // 활성화 하면 사용 가능
    // emailjs
    //   .sendForm("service_tol4dhj", "template_0dw14rm", e.target, "AVcyIm54rv95bhZGM")
    //   .then(
    //     (result) => {
    //       console.log(result.text);
    //       clearState();
    //       setIsSubmitted(true); // 메시지 전송 성공 시 상태 업데이트
    //       setTimeout(() => {
    //         window.location.reload(); // 5초 후 페이지 새로고침
    //       }, 1000);
    //     },
    //     (error) => {
    //       console.log(error.text);
    //     }
    //   );
  };

  // 컴포넌트의 JSX를 반환합니다. 여기서는 폼과 연락처 정보, 소셜 미디어 링크 등을 렌더링합니다.
  return (
    <div>
      <div id="contact">
        <div className="container">
          <div className="col-md-8">
            <div className="row">
              <div className="section-title">
                <h2>Get In Touch</h2>
                <p>
                  Please fill out the form below to send us an email and we will
                  get back to you as soon as possible.
                </p>
              </div>
              <form name="sentMessage" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      {/* 이름 입력 필드 */}
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        placeholder="Name"
                        required
                        onChange={handleChange}
                      />
                      <p className="help-block text-danger"></p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      {/* 이메일 입력 필드 */}
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        placeholder="Email"
                        required
                        onChange={handleChange}
                      />
                      <p className="help-block text-danger"></p>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  {/* 메시지 입력 필드 */}
                  <textarea
                    name="message"
                    id="message"
                    className="form-control"
                    rows="4"
                    placeholder="Message"
                    required
                    onChange={handleChange}
                  ></textarea>
                  <p className="help-block text-danger"></p>
                </div>
                <div id="success"></div>
                {/* 전송 버튼 */}
                <button type="submit" className="btn btn-custom btn-lg">
                    Send Message
                      </button>
                      {isSubmitted && <div>메시지가 성공적으로 보내졌습니다.</div>} {/* 메시지 전송 성공 알림 */}
              </form>
            </div>
          </div>
          <div className="col-md-3 col-md-offset-1 contact-info">
            {/* 연락처 정보 */}
            <div className="contact-item">
              <h1>Contact Info.</h1>
              <p>
                <span>
                  <i className="fa fa-map-marker pt-5"></i> Address
                  </span>{"대전광역시 서구 계룡로491번길 86"}
                {props.data ? props.data.phone : ""}
              </p>
            </div>
            <div className="contact-item">
              <p>
                <span>
                  <i className="fa fa-phone"></i> Phone
                </span>{"123-456-789"}
                {props.data ? props.data.phone : ""}
              </p>
            </div>
            <div className="contact-item">
              <p>
                <span>
                  <i className="fa fa-envelope-o"></i> Email
                  </span>{"greencraft@naver.com"}
                {props.data ? props.data.phone : ""}
              </p>
            </div>
          </div>
          <div className="col-md-12">
            <div className="row">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contact;