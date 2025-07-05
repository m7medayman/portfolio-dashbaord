import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddProjectPage from './pages/AddProjectPage';
import ProjectDetailsPage from './pages/ProjectDetailsView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/add_project' element={<AddProjectPage />} />
        <Route path="/project/:projectName" element={<ProjectDetailsPage />} />

      </Routes>
    </Router>
  );
}

export default App;