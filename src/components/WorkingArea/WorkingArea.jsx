import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import Node from '../Toolbar/Tool';// Assuming you have this component from our previous explanation.

function Workspace({onTextFocus,  onTextBlur, textRef}) {
  const [nodes, setNodes] = useState([]);

  const [, ref] = useDrop({
    accept: 'TOOL',
    drop: (item, monitor) => {
      const position = monitor.getClientOffset();
      position.x = position.x - 100;
      position.y = position.y - 100;
      setNodes(prev => [...prev, { type: item.toolType, position: {...position} }]);
      return undefined;
    }
  });

  const handleNodeMove = (index, newPosition) => {
    setNodes(prev => {
      const newNodes = [...prev];
      newNodes[index].position = newPosition;
      return newNodes;
    });
  };

  return (
    <div className='app-workingspace' ref={ref} style={{ position: 'relative', width: '100%',overflow: 'auto'}}>
      {nodes.map((node, index) => (
        <Node
          key={index}
          type={node.type} 
          position={node.position} 
          onMove={newPosition => handleNodeMove(index, newPosition)}
          onTextFocus={onTextFocus}
          onTextBlur={onTextBlur}
          textRef={textRef}
        />
      ))}
    </div>
  );
}

export default Workspace;
