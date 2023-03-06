// import {} from '@chakra-ui/icons';
// import { Container, Heading, SimpleGrid } from '@chakra-ui/react';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import Column from './components/Column';
// import DarkModeIconButton from './components/DarkModeIconButton';
// import { ColumnType } from './utils/enums';
import { Routes, Route } from 'react-router-dom';
import Appnew from './Appnew';
import Singlepage from './Singlepage';


function App() {
  return (    
    <Routes>
          <Route path="/"  element={<Appnew />} />
          <Route path="/task/:column/:id" element={<Singlepage />}/>
    </Routes>      
  );
}

export default App;
