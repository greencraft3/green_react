import React, { useState } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // 라이트박스의 스타일을 가져옵니다.

// 이미지 파일들을 임포트합니다.
import Image1 from "../image1.jpg";
import Image2 from "../image2.jpg";
import Image3 from "../image3.jpg";

const Gallery = () => {
  const images = [Image1, Image2, Image3];
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div id="gallery" className="text-center" style={{ paddingTop: '100px'}}>
      <div className="container">
        <div className="section-title">
          <h2>Gallery</h2>
          <p>
          greencraft의 최종 프로젝트 수행 사진
          </p>
        </div>
        <div className="row">
          <div className="portfolio-items">
            {images.map((image, index) => (
              <div key={index} className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
                <div className="portfolio-item">
                  <div className="hover-bg" onClick={() => { setPhotoIndex(index); setIsOpen(true); }}>
                    <img
                      src={image}
                      className="img-responsive"
                      alt={`푸바오${index + 1}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isOpen && (
        <Lightbox
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
        />
      )}
    </div>
  );
};
export default Gallery