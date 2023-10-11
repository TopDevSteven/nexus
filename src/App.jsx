import React from 'react';
import "./App.scss"
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Toolbar from './components/Toolbar/Toolbar';
import Workspace from './components/WorkingArea/WorkingArea';
import MainPage from './pages/MainPage';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<MainPage />}/>
          <Route path='/:uuid/project' element={<MainPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;