import React, { useRef, useState } from 'react';

function Node({ type, position }) {
    const [textContent, setTextContent] = useState("Click to edit...");
    const [imgsrc, setImgsrc] = useState(null);
    const [videosrc, setVideosrc] = useState(null);
    const textRef = useRef(null);

    const handleTextChange = (event) => {
        setTextContent(event.target.textContent);
    }

    const handleTextFocus = () => {
        if (textContent === "Click to edit") {
            setTextContent('')
        }
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const render = new FileReader();

        render.onloadend = () => {
            setImgsrc(render.result);
        }

        if(file) {
            render.readAsDataURL(file);
        }
    }

    const handleVideoChange = (event) => {
        const file = event.target.files[0];
        const render = new FileReader();

        render.onloadend = () => {
            setVideosrc(render.result);
        }

        if(file) {
            render.readAsDataURL(file);
        }
    }

    const renderContent = () => {
        switch (type) {
            case 'image':
                return (
                    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                        {
                            imgsrc ? (
                                <img src={imgsrc} alt='Uploaded' style={{ width: '100%', height: 'auto'}}/>
                            ) : (
                                <input type='file' onChange={handleImageChange}/>
                            )
                        }
                    </div>
                )
            case 'text':
                return (
                    <div
                        ref={textRef}
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onBlur={handleTextChange}                        
                        onFocus={handleTextFocus}
                        style={{ cursor: 'text', minHeight: '20px'}}
                    >
                        {textContent}
                    </div>
                )
            case 'video':
                return (
                    <div>
                        {
                            videosrc ? (
                                <video controls width="100%" height="100%">
                                    <source src={videosrc} type="video/mp4"/>
                                </video>
                            ) : (
                                <input type='file' onChange={handleVideoChange}/>
                            )
                        }
                    </div>
                )
            default:
                return null;
        }
    }

    const styles = {
        position: 'absolute',
        left: position.x,
        top: position.y,
        padding: '10px',
        border: '1px solid gray',
        backgroundColor: 'white',
        width: '150px',
        overflow: 'hidden',
      };

  return (
    <div style={styles}>
      {renderContent()}
    </div>
  );
}

export default Node;