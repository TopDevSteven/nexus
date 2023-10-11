import React, { useState } from 'react';

function Arrow({ points }) {
    const [start, setStart] = useState(points.start);
    const [middle, setMiddle] = useState({
        x: (points.start.x + points.end.x) / 2,
        y: (points.start.y + points.end.y) / 2
    });
    const [end, setEnd] = useState(points.end);
    const [draggingPoint, setDraggingPoint] = useState(null);

    // Calculate control point based on middle point
    const controlPoint = {
        x: 2*middle.x - 0.5*start.x - 0.5*end.x,
        y: 2*middle.y - 0.5*start.y - 0.5*end.y
    };

    const handleMouseDown = (pointName) => {
        setDraggingPoint(pointName);
    };

    const handleMouseUp = () => {
        setDraggingPoint(null);
    };

    const handleMouseMove = (e) => {
        if (draggingPoint) {
            const newPos = { x: e.clientX - 88, y: e.clientY - 138};
            if (draggingPoint === 'start') setStart(newPos);
            if (draggingPoint === 'middle') setMiddle(newPos);
            if (draggingPoint === 'end') setEnd(newPos);
        }
    };

    return (
        <svg width="100%" height="100%" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <path 
                d={`M${start.x} ${start.y} Q${controlPoint.x} ${controlPoint.y} ${end.x} ${end.y}`}
                stroke="black"
                fill="none"
            />
            <circle cx={start.x} cy={start.y} r="5" fill="black" onMouseDown={() => handleMouseDown('start')} />
            <circle cx={middle.x} cy={middle.y} r="5" fill="black" onMouseDown={() => handleMouseDown('middle')} />
            <circle cx={end.x} cy={end.y} r="5" fill="black" onMouseDown={() => handleMouseDown('end')} />
        </svg>
    );
}

export default Arrow;