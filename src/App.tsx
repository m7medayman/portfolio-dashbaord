import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddProjectPage from './pages/AddProjectPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/add_project' element= {<AddProjectPage />} />
      </Routes>
    </Router>
  );
}

export default App;