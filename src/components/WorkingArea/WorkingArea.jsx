import React, { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import Node from '../Toolbar/Tool';// Assuming you have this component from our previous explanation.
import { v4 as uuidv4 } from 'uuid';
import { json, useParams } from 'react-router-dom';


function Workspace({onTextFocus,  onTextBlur, textRef, projectId}) {
  const [nodes, setNodes] = useState([]);

  const [, ref] = useDrop({
    accept: 'TOOL',
    drop: (item, monitor) => {
      if (!monitor.canDrop()) return;

      const position = monitor.getClientOffset();
      position.x = position.x - 100;
      position.y = position.y - 100;
      const nodeId = uuidv4();

      let content = "";
      let imgsrc = null;
      let videosrc = null;

      let width = 0;
      let height = 0;
      if (item.toolType === "arrow") {
        width = 100;
        height = 100;
      }

      const newNode = {
        id: nodeId,
        projectId,
        type: item.toolType, 
        position: {...position},
        content: content,
        imgsrc,
        videosrc,
        size: {width, height}
      }

      let existingNodes = JSON.parse(localStorage.getItem("nodes") || '[]');
      let updatedNodes = [...existingNodes, newNode];
      localStorage.setItem("nodes", JSON.stringify(updatedNodes));

      setNodes(updatedNodes.filter(node => node.projectId === projectId));
    }
  });

  const handleNodeMove = (index, newPosition) => {
    setNodes(prev => {
      const newNodes = [...prev];
      newNodes[index].position = newPosition;

      const existingNodes = JSON.parse(localStorage.getItem("nodes") || '[]');
      const changedNodeId = existingNodes.findIndex(node => node.id === newNodes[index].id && node.projectId === newNodes[index].projectId);
      if (changedNodeId !== -1) {
        existingNodes[changedNodeId].position = newPosition;
        localStorage.setItem('nodes', JSON.stringify(existingNodes));
      }
      return newNodes;
    });
  };

  useEffect(() => {
    const savedNodes = localStorage.getItem('nodes');
    if (savedNodes) {
        const allNodes = JSON.parse(savedNodes);
        const filteredNodes = allNodes.filter(node => node.projectId === projectId);
        setNodes(filteredNodes);
    }
  }, []);

  

  return (
    <div className='app-workingspace' ref={ref} style={{ position: 'relative', width: '100%', overflow: 'auto'}}>
      {nodes.map((node, index) => (
        <Node
          key={index}
          type={node.type} 
          position={node.position} 
          onMove={newPosition => handleNodeMove(index, newPosition)}
          onTextFocus={onTextFocus}
          onTextBlur={onTextBlur}
          textRef={textRef}
          nodeId={node.id}
          content={node.content}
          imgSrc={node.imgsrc}
          videoSrc={node.videosrc}
        />
      ))}
    </div>
  );
}

export default Workspace;
