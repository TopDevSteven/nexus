import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import Arrow from '../Toolbar/Arrow';
import { useRef } from 'react';

const ArrowArea = () => {
    const areaRef = useRef(null); 
    const [{ isOver }, drop] = useDrop({
        accept: 'TOOL',
        drop: (item, monitor) => {
            const offset = monitor.getClientOffset();
            if (item.toolType === "arrow") {
                setArrows(arrows => [...arrows, { start: offset, middle: {x: offset.x + 50, y: offset.y}, end: {x: offset.x + 100, y: offset.y} }]);
            }
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    });

    const [arrows, setArrows] = useState([]);

    return (
        <div ref={drop}  style={{width: '100%', height: '100%', backgroundColor: isOver ? 'green' : 'red'}}>
            Arrow Area
            {
                arrows.map((arrow, index) => <Arrow key={index} points={arrow} />)
            }
        </div>
    );
};

export default ArrowArea;