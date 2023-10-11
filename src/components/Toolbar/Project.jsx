import React from "react";
import { useState, useRef , useEffect} from "react";
import { useDrag } from "react-dnd";
import { useNavigate } from 'react-router-dom';
import { ReactComponent as ProjectBoxIcon } from "../../assets/icons/tools/project.svg";

const Project = (props) => {
    const navigate = useNavigate();
    const [projectName, setProjectName] = useState("New Project");
    const textareaRef = useRef(null);

    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ x: props.style.left, y: props.style.top });
    const [lastPosition, setLastPosition] = useState(null);

    const handleIconMouseDown = (e) => {
        e.preventDefault();
        setDragging(true);
        setLastPosition({ x: e.clientX, y: e.clientY });
    };

    const handleIconMouseMove = (e) => {
        if (!dragging || !lastPosition) return;
        
        const dx = e.clientX - lastPosition.x;
        const dy = e.clientY - lastPosition.y;

        setPosition(prevPosition => ({
            x: prevPosition.x + dx,
            y: prevPosition.y + dy
        }));

        setLastPosition({ x: e.clientX, y: e.clientY });
    };

    const handleIconMouseUp = () => {
        setDragging(false);
        if (props.onMove) {
            props.onMove(props.id, position);
        }
    };

    useEffect(() => {
        if (dragging) {
            document.addEventListener('mousemove', handleIconMouseMove);
            document.addEventListener('mouseup', handleIconMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleIconMouseMove);
            document.removeEventListener('mouseup', handleIconMouseUp);
        };
    }, [dragging, handleIconMouseMove, handleIconMouseUp]);

    const handleProjectClick = () => {
        navigate(`/${props.id}/project`);
    }


    const handleContentChange = (e) => {
        setProjectName(e.target.value);
        adjustTextareaHeight();
    };

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // reset the height
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // adjust to the content's height
        }
    };

    // Initial height adjustment
    useEffect(() => {
        adjustTextareaHeight();
    }, []);

    return (
        <div
            // onMouseDown={handleMouseDown}
            style={{ ...props.style, top: position.y + 'px', left: position.x + 'px' }} 
            onDoubleClick={handleProjectClick}
            className="project-box"
        >
            <div className="project-icon"  onMouseDown={handleIconMouseDown}>
                <span>
                    <ProjectBoxIcon />
                </span>
            </div>
            <div className="project-content">
                <textarea
                    ref={textareaRef}
                    value={projectName}
                    onChange={handleContentChange}
                    className="editable-content"
                    rows="1"
                />
            </div>
        </div>
    );
}

export default Project;