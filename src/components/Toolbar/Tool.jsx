import React, { useRef, useState, useEffect } from 'react';

function Node({ type, position, onMove, onTextFocus, onTextBlur, textRef}) {
    const [textContent, setTextContent] = useState("Click to edit...");
    const [imgsrc, setImgsrc] = useState(null);
    const [videosrc, setVideosrc] = useState(null);

    const [aspectRatio, setAspectRatio] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const nodeRef = useRef(null);
    const [isResizing, setIsResizing] = useState(false);
    const [size, setSize] = useState({ width: 250, height: 50 });

    // Text handlers

    const handleTextChange = (event) => {
        setTextContent(event.target.textContent);
    }

    const handleTextFocus = () => {
        if (textContent === "Click to edit") {
            setTextContent('')
        }

        onTextFocus();
    }

    // Image Handlers

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
                setSize({ width: 250, height: 250 * image.height / image.width });
            };   
        }

        if(file) {
            render.readAsDataURL(file);
        }
    }

    //  Video Handlers

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

    // Dragging Handlers

    const handleDragMouseDown = (e) => {
        // Prevent both dragging and resizing at the same time
        if (e.target.tagName === 'INPUT' || e.target === textRef.current) {
            return; // Exit early if it's an input or the contentEditable div
        }

        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
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
        onMove({ x: parseInt(nodeRef.current.style.left), y: parseInt(nodeRef.current.style.top) });
    };

    // Resizing Handlers

    const handleResizeMouseDown = (e) => {
        setIsResizing(true);
        setIsDragging(false);
    };

    const handleResizeMouseUp = () => {
        setIsResizing(false);
    };

    const handleResizeMouseMove = (e) => {
        if (isResizing) {
            const newWidth = e.clientX - position.x - 100;
            
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
    }, [isResizing, aspectRatio, position.x, position.y]);

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

    const suppressDefaultDrag = (e) => {
        e.preventDefault();
    };

    const renderContent = () => {
        switch (type) {
            case 'image':
                return (
                    <div style={{ width: '100%', height: '100%'}}>
                        {
                            imgsrc ? (
                                <>
                                    <img 
                                        src={imgsrc} 
                                        alt='Uploaded' 
                                        style={{ width: '100%', height: 'auto'}}  
                                        onDragStart={suppressDefaultDrag} 
                                        onMouseDown={handleDragMouseDown}
                                    />
                                    <input 
                                        type="text"
                                        // value={description}
                                        // onChange={handleDescriptionChange}
                                        placeholder="Enter description for the image"
                                        style={{
                                            width: '100%'
                                        }}
                                    />
                                </>
                                
                            ) : (
                                <input 
                                    type='file' 
                                    onChange={handleImageChange}
                                />
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
                                <>
                                    <video 
                                        controls 
                                        width="100%" 
                                        height="auto"
                                        onDragStart={suppressDefaultDrag} 
                                        onMouseDown={handleDragMouseDown}
                                    >
                                        <source src={videosrc} type="video/mp4"/>
                                    </video>
                                    <input 
                                            type="text"
                                            // value={description}
                                            // onChange={handleDescriptionChange}
                                            placeholder="Enter description for the image"
                                            style={{
                                                width: '100%'
                                            }}
                                        />
                                </>
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
        // border: '1px solid gray',
        backgroundColor: 'white',
        width: `${size.width}px`,
    };

  return (
    <div ref={nodeRef} style={styles}>
        {/* {
            type === 'text' &&
            <div
                ref={textRef}
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={handleTextChange}                        
                onFocus={handleTextFocus}
                style={{ cursor: 'text', minHeight: '20px', ...textStyles }} // Apply the textStyles prop here
            >
            {textContent}
            </div>
        } */}
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