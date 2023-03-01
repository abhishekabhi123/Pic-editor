import React, { useState } from "react";
import "./style/main.scss";
import { GrRotateLeft, GrRotateRight } from "react-icons/gr";
import { CgMergeVertical, CgMergeHorizontal } from "react-icons/cg";
import { IoMdUndo, IoMdRedo, IoIosImage } from "react-icons/io";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const Main = () => {
  const filterElement = [
    {
      name: "brightness",
      maxValue: 200,
    },
    {
      name: "contrast",
      maxValue: 200,
    },
  ];
  const [property, setProperty] = useState({
    name: "brightness",
    maxValue: 200,
  });
  const [details, setDetails] = useState("");
  const [crop, setCrop] = useState();
  const [state, setState] = useState({
    image: "",
    brightness: 100,
    contrast: 100,
    rotate: 0,
    vertical: 1,
    horizontal: 1,
  });

  const inputHandle = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const rotateLeft = () => {
    setState({
      ...state,
      rotate: state.rotate - 90,
    });
  };
  const rotateRight = () => {
    setState({
      ...state,
      rotate: state.rotate + 90,
    });
  };
  const verticalFlip = () => {
    setState({
      ...state,
      vertical: state.vertical === 1 ? -1 : 1,
    });
  };
  const horizontalFlip = () => {
    setState({
      ...state,
      horizontal: state.horizontal === 1 ? -1 : 1,
    });
  };
  const imageHandle = (e) => {
    if (e.target.files.length !== 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setState({ ...state, image: reader.result });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const imageCrop = () => {
    const canvas = document.createElement("canvas");
    const scaleX = details.naturalWidth / details.width;
    const scaleY = details.naturalHeight / details.height;
    const width = crop.width;
    const height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      details,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
    const base64url = canvas.toDataURL("image/jpg");
    setState({
      ...state,
      image: base64url,
    });
  };
  const saveImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = details.naturalWidth;
    canvas.height = details.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.filter = `brightness(${state.brightness}%) contrast(${state.contrast}%)`;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((state.rotate * Math.PI) / 180);
    ctx.scale(state.vertical, state.horizontal);

    ctx.drawImage(
      details,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    );
    const link = document.createElement("a");
    link.download = "image_edit.jpg";
    link.href = canvas.toDataURL();
    link.click();
  };
  const handleReset = () => {
    setState({
      image: "",
      brightness: 100,
      contrast: 100,
      rotate: 0,
      vertical: 1,
      horizontal: 1,
    });
  };

  return (
    <div className="image_editor">
      <div className="card">
        <div className="card_header"></div>
        <div className="card_body">
          <div className="sidebar">
            <div className="side_body">
              <div className="filter_section">
                <span>Filters</span>
                <div className="filter_key">
                  {filterElement.map((v, i) => (
                    <button
                      className={property.name === v.name ? "active" : ""}
                      onClick={() => {
                        setProperty(v);
                      }}
                      key={i}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter_sidebar">
                <input
                  name={property.name}
                  onChange={inputHandle}
                  value={state[property.name]}
                  max={property.maxValue}
                  type="range"
                />
              </div>
              <div className="rotate">
                <label htmlFor="">Rotate and flip</label>
                <div className="icon">
                  <div onClick={rotateLeft}>
                    <GrRotateLeft />
                  </div>
                  <div onClick={rotateRight}>
                    <GrRotateRight />
                  </div>
                  <div onClick={verticalFlip}>
                    <CgMergeVertical />
                  </div>
                  <div onClick={horizontalFlip}>
                    <CgMergeHorizontal />
                  </div>
                </div>
              </div>
            </div>
            <div className="reset">
              <button onClick={handleReset}>Reset</button>
              <button onClick={saveImage} className="save">
                Save Image
              </button>
            </div>
          </div>
          <div className="image_section">
            <div className="image">
              {state.image ? (
                <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
                  <img
                    onLoad={(e) => {
                      setDetails(e.currentTarget);
                    }}
                    style={{
                      filter: `brightness(${state.brightness}%) contrast(${state.contrast}%)`,
                      transform: `rotate(${state.rotate}deg) scale(${state.vertical}, ${state.horizontal})`,
                    }}
                    src={state.image}
                    alt=""
                  />
                </ReactCrop>
              ) : (
                <label htmlFor="choose">
                  <IoIosImage />
                  <span>Choose Image</span>
                </label>
              )}
            </div>
            <div className="image_select">
              {crop && (
                <button onClick={imageCrop} className="crop">
                  Crop image
                </button>
              )}
              <label htmlFor="choose">Choose image</label>
              <input type="file" onChange={imageHandle} id="choose" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
