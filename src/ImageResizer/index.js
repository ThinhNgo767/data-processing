import React, { useState, useRef } from "react";
import Pica from "pica";

const ImageResizer = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [resizedImage, setResizedImage] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [ratio, setRatio] = useState(false);
  const [selected, setSelected] = useState("jpg");
  const inputFileRef = useRef(null);
  const canvasRef = useRef(null);
  const resizedCanvasRef = useRef(null);

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setSelected(value);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      const image = new Image();
      image.src = url;
      image.onload = () => {
        const newWidth = image.width;
        const newHeight = image.height;
        setImageSize({ width: newWidth, height: newHeight });
        setRatio(newWidth > newHeight);
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
    const resizedCanvas = resizedCanvasRef.current;
    const pica = new Pica();

    canvas.width = image.width;
    canvas.height = image.height;

    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    resizedCanvas.width = imageSize.width;
    resizedCanvas.height = imageSize.height;

    try {
      await pica.resize(canvas, resizedCanvas, {
        filter: "mks2013",
        unsharpRadius: 1.0,
        unsharpThreshold: 10,
      });

      const resizedBlob = await pica.toBlob(
        resizedCanvas,
        `image/${selected}`,
        0.9
      );

      setResizedImage(URL.createObjectURL(resizedBlob));
    } catch (error) {
      console.error("Resize failed: ", error);
    }
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

      <div className="final_boss box_flex">
        <canvas ref={canvasRef} style={{ display: "none" }} />
        {imageSrc && (
          <div className="box_image_upscaler_item box_flex">
            <img
              src={imageSrc}
              alt="Uploaded"
              className={ratio ? "img_upload-height" : "img_upload-width"}
            />
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
            <div className="box_select-type-img box_flex gap">
              <label>
                <input
                  type="checkbox"
                  value="jpg"
                  checked={selected === "jpg"}
                  onChange={handleCheckboxChange}
                />
                JPG
              </label>

              <label>
                <input
                  type="checkbox"
                  value="jpeg"
                  checked={selected === "jpeg"}
                  onChange={handleCheckboxChange}
                />
                JPEG
              </label>

              <label>
                <input
                  type="checkbox"
                  value="png"
                  checked={selected === "png"}
                  onChange={handleCheckboxChange}
                />
                PNG
              </label>
              <label>
                <input
                  type="checkbox"
                  value="tiff"
                  checked={selected === "tiff"}
                  onChange={handleCheckboxChange}
                />
                TIFF
              </label>
              <label>
                <input
                  type="checkbox"
                  value="bmp"
                  checked={selected === "bmp"}
                  onChange={handleCheckboxChange}
                />
                BMP
              </label>
            </div>
            <button onClick={resizeImage} className="resize_download">
              Resize Image
            </button>
          </div>
        )}
        <canvas ref={resizedCanvasRef} style={{ display: "none" }} />
        {resizedImage && (
          <div className="box_image_upscaler_item box_flex">
            <h3>Image after resizing</h3>
            <img
              src={resizedImage}
              alt="Resized"
              className={ratio ? "image_resize-height" : "image_resize-width"}
            />
            <button className="resize_download btn_rz">
              <a
                href={resizedImage}
                download={`image_resize-${imageSize.width}-${imageSize.height}.${selected}`}
              >
                Download Resized Image
              </a>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageResizer;
