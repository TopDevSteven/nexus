import React, { useRef, useState, useEffect } from 'react';
import Arrow from './Arrow';
import { pointToLineDistance } from './Arrow';

function Node({ type, position, onMove, onTextFocus, onTextBlur, textRef, nodeId, content, imgSrc, videoSrc}) {
    const [textContent, setTextContent] = useState(content === "" ? "Start Typing..." : content);
    const [imgsrc, setImgsrc] = useState(imgSrc);
    const [videosrc, setVideosrc] = useState(videoSrc);

    const [aspectRatio, setAspectRatio] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const nodeRef = useRef(null);
    const [isResizing, setIsResizing] = useState(false);
    const [size, setSize] = useState({ width: 250, height: 50 });

    // arrow properties
    const [isDrawingArrow, setIsDrawingArrow] = useState(false);

    // Text Handlers

    const handleTextChange = (event) => {
        setTextContent(event.target.textContent);
        let existingNodes = JSON.parse(localStorage.getItem("nodes") || '[]');
        const nodeIndex = existingNodes.findIndex(node => node.id === nodeId);  // Assuming you passed nodeId as a prop to Node component

        if (nodeIndex !== -1) {
            existingNodes[nodeIndex].content = event.target.textContent;
            localStorage.setItem("nodes", JSON.stringify(existingNodes));
        }
    }

    const handleTextFocus = () => {
        if (textContent === "") {
            setTextContent('Start Typing...')
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
            let existingNodes = JSON.parse(localStorage.getItem("nodes") || '[]');
            const nodeIndex = existingNodes.findIndex(node => node.id === nodeId);

            if (nodeIndex !== -1) {
                existingNodes[nodeIndex].imgsrc = render.result;
                localStorage.setItem("nodes", JSON.stringify(existingNodes));
            }
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

            // let existingNodes = JSON.parse(localStorage.getItem("nodes") || '[]');
            // const nodeIndex = existingNodes.findIndex(node => node.id === nodeId);

            // if (nodeIndex !== -1) {
            //     existingNodes[nodeIndex].videosrc = render.result;
            //     localStorage.setItem("nodes", JSON.stringify(existingNodes));
            // }
        }

        if(file) {
            render.readAsDataURL(file);
        }    
    }

    // Dragging Handlers

    // localStorage.clear()

    const handleDragMouseDown = (e) => {

        if (e.target.tagName === 'INPUT' || e.target === textRef.current || isDrawingArrow) {
            return; // Exit early if it's an input, the contentEditable div, or if we're drawing an arrow
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
        if (nodeElement && type !== "arrow") {
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

    // arrow handlers

    let isArrowType = type === "arrow";

    const handleArrowMouseDown = (e) => {
        if (!isArrowType) return;
        handleDragMouseDown(e);
    };

    const handleArrowMouseUp = (e) => {
        if (!isArrowType) return;
        handleDragMouseUp(e);
    };

    const handleArrowMouseMove = (e) => {
        if (!isArrowType) return;
        
        handleDragMouseMove(e);
    };

    // localStorage.clear();

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
                        className='text-box'
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                        onBlur={handleTextChange}                        
                        onFocus={handleTextFocus}
                        style={{ cursor: 'text', minHeight: '20px', color: textContent === "Start Typing..." ? '#939393' : 'black'}}
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
                case 'arrow':
                    return (
                        <Arrow 
                            startX={0} 
                            startY={0} 
                            endX={size.width} 
                            endY={size.height} 
                            onArrowMouseDown={handleArrowMouseDown}
                            onArrowMouseUp={handleArrowMouseUp}
                            onArrowMouseMove={handleArrowMouseMove}
                        />
                    );
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
        backgroundColor:  type !== "arrow" ? 'white' : "transparent",
        width: `${size.width}px`,
        boxShadow: type !== "arrow" && `0px 0px 6px rgba(255, 255, 255, 0.8)`,
    };
    // localStorage.clear()

    

  return (
    <div ref={nodeRef} style={styles}>
        {renderContent()}
        {
            type !==  "arrow" &&
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        cursor: 'nwse-resize',
                        width: '0',
                        height: '0',
                        borderRight: '7px solid #888',
                        borderTop: '7px solid transparent',
                    }}
                    onMouseDown={handleResizeMouseDown}
                ></div>
        }
    </div>
  );
}

export default Node;