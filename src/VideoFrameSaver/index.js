import "./style.css";

import React, { useRef, useState } from "react";
import {
  FaRegHandPointLeft,
  FaRegHandPointRight,
  FaPlay,
  FaPause,
} from "react-icons/fa6";
import { BsCaretUpFill, BsCaretDownFill } from "react-icons/bs";
import { BiSolidVolumeFull, BiSolidVolumeMute } from "react-icons/bi";
import { v4 as uuidv4 } from "uuid";

function VideoFrameSaver() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [videoFile, setVideoFile] = useState(null);
  const [frames, setFrames] = useState([]);
  const [second, setSecond] = useState(0);
  const [formatImg, setFormatImg] = useState("jpg");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(URL.createObjectURL(file));
    }
    event.target.value = "";
  };

  const handleRemoveVideo = () => {
    if (!videoFile) return;
    setVideoFile(null);
    setSecond(0);
    setFrames([]);
    videoRef.current.src = "";
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleDownloadPicture = (url, name) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `${name}`;
    link.click();
  };

  const handleDeleteFrame = (index) => {
    frames.splice(index, 1);

    setFrames([...frames]);
  };

  const previewFrame = (format) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataFrame = {
      id: uuidv4(),
      name: `${generateRandomString(8)}-by-Kenji.${format}`,
      dataURL: canvas.toDataURL(`image/${format}`),
    };

    setFrames((prevFrames) => [...prevFrames, dataFrame]);
  };

  const stepFrame = (step) => {
    const video = videoRef.current;
    video.currentTime = Math.max(0, video.currentTime + step);
  };

  const handleChangeSecond = (e) => {
    const value = Number(e.target.value);
    if (value > 0 && value <= 10) {
      setSecond(value);
    }
  };

  const increaseSecond = () => {
    if (second >= 10) return;
    setSecond((+second + 0.1).toFixed(1));
  };
  const decreaseSecond = () => {
    if (second <= 0) return;
    setSecond((+second - 0.1).toFixed(1));
  };

  function generateRandomString(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }

    return randomString;
  }

  return (
    <div className="container_frame box_flex">
      <div className="box_import_video box_flex">
        <button
          className="remove_video custom-btn-lb"
          onClick={handleRemoveVideo}
        >
          Bỏ chọn video
        </button>
        <label
          htmlFor="file-upload"
          className="custom-file-upload custom-btn-lb"
        >
          Chọn video
        </label>
        <input
          type="file"
          id="file-upload"
          accept="video/*"
          onChange={handleVideoUpload}
        />
      </div>

      {videoFile && (
        <>
          <video
            ref={videoRef}
            muted
            controlsList="nodownload noplaybackrate nofullscreen"
            className="video_file"
          >
            <source src={videoFile} type="video/mp4" />
            <source src={videoFile} type="video/mov" />
            <source src={videoFile} type="video/avi" />
            <source src={videoFile} type="video/3gp" />
          </video>
          <div className="box_preview_frame box_flex">
            <button
              onClick={() => previewFrame(formatImg)}
              className="preview_frame"
            >
              Capture Frame as
            </button>
            <select
              defaultValue={formatImg}
              className="format_image"
              onChange={(e) => setFormatImg(e.target.value)}
            >
              <option value="jpg">JPG</option>
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="tiff">TIFF</option>
              <option value="gif">GIF</option>
              <option value="bmp">BMP</option>
            </select>
          </div>
          <div className="box_flex">
            <button onClick={togglePlayPause} className="control-button">
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={toggleMute} className="control-button">
              {isMuted ? <BiSolidVolumeMute /> : <BiSolidVolumeFull />}
            </button>
          </div>
          <div className="box_btn-back--next box_flex">
            <label htmlFor="enter_seconds" className="enter_seconds box_flex">
              <span>Enter seconds</span>
              <div className="box_flex">
                <input
                  id="enter_seconds"
                  type="number"
                  min="0"
                  max="10"
                  value={second}
                  onChange={handleChangeSecond}
                />
                <div className="up-down box_flex">
                  <button onClick={decreaseSecond}>
                    <BsCaretDownFill />
                  </button>
                  <button onClick={increaseSecond}>
                    <BsCaretUpFill />
                  </button>
                </div>
              </div>
            </label>
            <div className="box_flex gap">
              <button
                onClick={() => stepFrame(-second)}
                className="box_flex btn_bn-style"
              >
                <FaRegHandPointLeft /> Back
              </button>
              <button
                onClick={() => stepFrame(+second)}
                className="box_flex btn_bn-style"
              >
                Next
                <FaRegHandPointRight />
              </button>
            </div>
          </div>

          <canvas ref={canvasRef} style={{ display: "none" }} />

          <div className="frame-gallery box_flex">
            {frames.map((frame, index) => (
              <div key={frame.id} className="box_flex box_item_img">
                <div
                  onClick={() =>
                    handleDownloadPicture(frame.dataURL, frame.name)
                  }
                  title={`${frame.name}`}
                  style={{ textAlign: "center" }}
                >
                  <img
                    src={frame.dataURL}
                    alt={`Frame ${frame.id}`}
                    className="frame_preview"
                  />
                </div>
                <div
                  className="box_flex"
                  style={{ gap: "0.5rem", marginTop: "1rem" }}
                >
                  <span className="imgname_frame">{frame.name}</span>
                  <button
                    onClick={() => handleDeleteFrame(index)}
                    className="delete_frame_btn"
                    title="Delete Frame"
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default VideoFrameSaver;
