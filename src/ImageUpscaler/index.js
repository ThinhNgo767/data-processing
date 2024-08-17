import "./style.css";

import React, { useRef, useState } from "react";
import Pica from "pica";

function ImageUpscaler() {
  const [imageSrc, setImageSrc] = useState(null);
  const [resizedImage, setResizedImage] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const inputFileRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      const image = new Image();
      image.src = url;
      image.onload = () => {
        setImageSize({ width: image.width, height: image.height });
      };
    }
    event.target.value = "";
  };

  const handleUnSelect = () => {
    if (!imageSrc) return;
    setImageSrc(null);
    setResizedImage(null);
    inputFileRef.current.src = "";
  };

  const resizeImage = async () => {
    if (!imageSrc) return;

    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = canvasRef.current;
    const pica = new Pica();

    canvas.width = imageSize.width;
    canvas.height = imageSize.height;

    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const resizedBlob = await pica.toBlob(canvas, "image/jpeg", 0.9);
    setResizedImage(URL.createObjectURL(resizedBlob));
  };

  return (
    <div className="box_image_upscaler box_flex">
      <div className="box_flex select_img">
        <label
          htmlFor="unselect_img"
          className="unselect"
          onClick={handleUnSelect}
        >
          Bỏ chọn ảnh
        </label>
        <label htmlFor="upload_img" className="selected">
          Chọn ảnh
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={inputFileRef}
          id="upload_img"
        />
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="final_boss box_flex">
        {imageSrc && (
          <div className="box_image_upscaler_item box_flex">
            <img src={imageSrc} alt="Uploaded" className="img_upload" />
            <sub>
              <i>Please enter width and height</i>
            </sub>
            <div className="box_custom_size box_flex">
              <label>
                Width
                <input
                  type="number"
                  value={imageSize.width}
                  name="size-img"
                  onChange={(e) =>
                    setImageSize({ ...imageSize, width: e.target.value })
                  }
                />
              </label>
              <label>
                Height
                <input
                  type="number"
                  value={imageSize.height}
                  name="size-img"
                  onChange={(e) =>
                    setImageSize({ ...imageSize, height: e.target.value })
                  }
                />
              </label>
            </div>
            <button onClick={resizeImage} className="resize_download">
              Resize Image
            </button>
          </div>
        )}

        {resizedImage && (
          <div className="box_image_upscaler_item box_flex">
            <h3>Image after resizing</h3>
            <img src={resizedImage} alt="Resized" className="image_resize" />
            <button className="resize_download btn_rz">
              <a
                href={resizedImage}
                download={`image_resize-${imageSize.width}-${imageSize.height}`}
              >
                Download Resized Image
              </a>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUpscaler;
