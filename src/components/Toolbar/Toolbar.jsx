import React from 'react';
import { useDrag } from 'react-dnd';

function Tool({ type }) {
  const [, ref] = useDrag({
    type: 'TOOL',
    item: { toolType: type },
  });

  return (
    <div ref={ref} style={{width: "100%"}}>
      {type}
    </div>
  );
}

function Toolbar() {
  return (
    <div className='app-toolbar'>
      <Tool type="text" />
      <Tool type="image" />
      <Tool type="video" />
      {/* ... */}
    </div>
  );
}

export default Toolbar;