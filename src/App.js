import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Toolbar from './components/Toolbar';
import Workspace from './components/WorkingArea';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Toolbar />
      <Workspace />
    </DndProvider>
  );
}

export default App;