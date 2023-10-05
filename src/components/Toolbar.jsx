import React from 'react';
import { useDrag } from 'react-dnd';

function Tool({ type }) {
  const [, ref] = useDrag({
    type: 'TOOL',
    item: { toolType: type },
  });

  return (
    <div ref={ref}>
      {type}
    </div>
  );
}

function Toolbar() {
  return (
    <div>
      <Tool type="text" />
      <Tool type="image" />
      <Tool type="video" />
      {/* ... */}
    </div>
  );
}

export default Toolbar;