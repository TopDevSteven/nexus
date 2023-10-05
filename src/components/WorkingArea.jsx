import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import Node from './Tool';// Assuming you have this component from our previous explanation.

function Workspace() {
  const [nodes, setNodes] = useState([]);

  const [, ref] = useDrop({
    accept: 'TOOL',
    drop: (item, monitor) => {
      const position = monitor.getClientOffset();
      setNodes(prev => [...prev, { type: item.toolType, position }]);
      return undefined;
    }
  });

  return (
    <div ref={ref} style={{ position: 'relative', width: '70%', height: '90vh', border: '1px solid black' }}>
      {nodes.map((node, index) => (
        <Node key={index} type={node.type} position={node.position} />
      ))}
    </div>
  );
}

export default Workspace;
