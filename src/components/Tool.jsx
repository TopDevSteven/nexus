import React, { useRef, useState, useEffect } from 'react';

function Node({ type, position }) {
    const [textContent, setTextContent] = useState("Click to edit...");
    const [imgsrc, setImgsrc] = useState(null);
    const [videosrc, setVideosrc] = useState(null);
    const textRef = useRef(null);

    const [aspectRatio, setAspectRatio] = useState(null);

    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const nodeRef = useRef(null);
    const [isResizing, setIsResizing] = useState(false);
    const [size, setSize] = useState({ width: 150, height: 150 });

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
            
            // Calculate the aspect ratio of the image when it's loaded
            const image = new Image();
            image.src = render.result;
            image.onload = () => {
                setAspectRatio(image.height / image.width);
                setSize({ width: 150, height: 150 * image.height / image.width });
            };

            
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
            const video = document.createElement('video');
            video.src = render.result;
            video.onloadedmetadata = () => {
                setAspectRatio(video.videoHeight / video.videoWidth);
            };
        }

        if(file) {
            render.readAsDataURL(file);
        }
    }

    // 

    const handleResizeMouseDown = (e) => {
        setIsResizing(true);
    };

    const handleResizeMouseUp = () => {
        setIsResizing(false);
    };

    const handleResizeMouseMove = (e) => {
        if (isResizing) {
            const newWidth = e.clientX - position.x;
            
            // Calculate new height based on the aspect ratio
            const newHeight = aspectRatio ? newWidth * aspectRatio : e.clientY - position.y;
            
            setSize({ width: newWidth, height: newHeight });
        }
    };


    useEffect(() => {
        window.addEventListener('mousemove', handleResizeMouseMove);
        window.addEventListener('mouseup', handleResizeMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleResizeMouseMove);
            window.removeEventListener('mouseup', handleResizeMouseUp);
        };
    }, [isResizing]);


    const handleDragMouseDown = (e) => {
        // Prevent both dragging and resizing at the same time
        if (!isResizing) {
            setIsDragging(true);
            setDragStart({ x: e.clientX, y: e.clientY });
        }
    };
    
    const handleDragMouseMove = (e) => {
        if (isDragging) {
            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;
            nodeRef.current.style.left = `${position.x + dx}px`;
            nodeRef.current.style.top = `${position.y + dy}px`;
        }
    };
    
    const handleDragMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        const nodeElement = nodeRef.current;
        if (nodeElement) {
            nodeElement.addEventListener('mousedown', handleDragMouseDown);
            document.addEventListener('mousemove', handleDragMouseMove);
            document.addEventListener('mouseup', handleDragMouseUp);
    
            return () => {
                nodeElement.removeEventListener('mousedown', handleDragMouseDown);
                document.removeEventListener('mousemove', handleDragMouseMove);
                document.removeEventListener('mouseup', handleDragMouseUp);
            };
        }
    }, [isDragging, dragStart]);

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
                    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                        {
                            videosrc ? (
                                <video controls width="100%" height="auto">
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
        width: `${size.width}px`,
        height: `${size.height}px`,
        overflow: 'hidden',
    };

  return (
    <div ref={nodeRef} style={styles}>
            {renderContent()}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '15px',
                    height: '15px',
                    background: 'red',
                    cursor: 'nwse-resize',
                }}
                onMouseDown={handleResizeMouseDown}
            ></div>
        </div>
  );
}

export default Node;