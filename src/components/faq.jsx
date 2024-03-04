import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const FAQ = () => {
  const [faqData, setFaqData] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get('http://34.22.80.43:8080/api/faq', config);
      setFaqData(response.data);
    } catch (error) {
      console.error('FAQ 데이터를 불러오는데 오류', error);
    }
  };

  return (
    <div>
      <div style={{ padding: '200px' }} className="position-relative">
        <div className="container" style={{ height: '700px' }}>
          <div id="faq">
            <center>
              <h1 className="fw-bolder">자주 묻는 질문</h1>
              <div className="p-4 w-25 m-5 bg-dark text-white rounded-pill text-center">
                <h2>FAQ</h2>
              </div>
              <div>
                {faqData.map((item, index) => (
                  <div key={index} className="mb-3">
                    <div className="row">
                      <div className="col">
                        <div className="border p-3 bg-light" style={{ display: 'flex', alignItems: 'center' }}>
                          <div className="text-white rounded-circle text-center" style={{ backgroundColor: '#0d6efd', marginRight: '10px', width: '25px', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <h4 className="m-0">Q</h4>
                          </div>
                          {editingId === item.no ? (
                            <input
                              type="text"
                              value={newQuestion || item.question}
                              onChange={(e) => setNewQuestion(e.target.value)}
                            />
                          ) : (
                            <p>{item.question}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="border p-3" style={{ display: 'flex', alignItems: 'center' }}>
                          <div className="text-white rounded-circle text-center" style={{ backgroundColor: '#dc3545', marginRight: '10px', width: '25px', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <h4 className="m-0">A</h4>
                          </div>
                          {editingId === item.no ? (
                            <input
                              type="text"
                              value={newAnswer || item.answer} // 수정: 새로운 답변 또는 기존 답변 표시
                              onChange={(e) => setNewAnswer(e.target.value)}
                            />
                          ) : (
                            <p>{item.answer}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </center>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;