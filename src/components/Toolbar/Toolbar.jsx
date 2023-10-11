import React from 'react';
import { useState } from 'react';
import { useDrag } from 'react-dnd';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as TextIcon } from "../../assets/icons/tools/text.svg";
import { ReactComponent as ImgIcon } from "../../assets/icons/tools/image.svg";
import { ReactComponent as VideoIcon } from "../../assets/icons/tools/video.svg";
import { ReactComponent as BackIcon } from "../../assets/icons/back.svg";
import { ReactComponent as ArrowIcon } from "../../assets/icons/tools/arrow.svg";

function Tool({ type }) {
  const [, ref] = useDrag({
    type: 'TOOL',
    item: { toolType: type },
  });

  return (
    <div ref={ref} style={{width: "100%", color: "white"}}>
      <div className='tool-icon'>
        {
          type === "text" && <span><TextIcon /></span>
        }
        {
          type === "image" && <span><ImgIcon /></span>
        }
        {
          type === "video" && <span><VideoIcon /></span>
        }
        {
          type === "arrow" && <span className="arrow-tool">
                                <ArrowIcon />
                              </span>
        }
      </div>
      {/* <div className='tool-content'>
        {type}
      </div> */}
    </div>
  );
}

function Toolbar() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  }

  return (
    <div className='app-toolbar'>
      <span onClick={handleBack}>
        <BackIcon />
      </span>
      <Tool type="text" />
      <Tool type="image" />
      <Tool type="video" />
      <Tool type="arrow" />
      {/* ... */}
    </div>
  );
}

export default Toolbar;