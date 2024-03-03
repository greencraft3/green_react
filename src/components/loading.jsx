const Loading = () => {
  const loadingBoxStyle = {
    position: 'fixed',
    left: '50%',
    top: '50%',
    zIndex: 100,
    transform: 'translate(-50%, -50%)',
    padding: '60px 40px 40px', // 패딩을 늘림
    width: '300px', // 너비를 늘림
    textAlign: 'center',
    background: '#fff',
    boxShadow: '0 3px 0 rgba(0, 0, 0, .2)',
    borderRadius: '8px',
  };

  const outBoxStyle = {
    position: 'relative',
    width: '100%',
    height: '5px',
    background: '#ddd',
    borderRadius: '3px',
    overflow: 'hidden',
  };

  const inBoxStyle = {
    position: 'absolute',
    top: '1px',
    left: '0',
    width: '40%', // 내부 바의 너비, 필요에 따라 조정 가능
    height: '3px',
    background: '#00a5e5',
    borderRadius: '3px',
    animation: 'moveBox 2s linear infinite',
  };

  const textStyle = {
    fontSize: '18px',
    marginTop: '10px', // 텍스트와의 간격
  };

  return (
    <>
      <style>
        {`
          @keyframes moveBox {
            from { left: 0; }
            to { left: calc(100% - 40%); } // 내부 바가 오른쪽으로 움직이는 범위 조정
          }
        `}
      </style>
      <div style={loadingBoxStyle}>
        <div style={outBoxStyle}>
          <i style={inBoxStyle}></i>
        </div>
        <p style={textStyle}>Loading...</p>
      </div>
    </>
  );
};

export default Loading;