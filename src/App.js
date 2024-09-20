import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Conteiner from './components/conteiner';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Conteiner />} />
      </Routes>
    </Router>
  );
}

export default App;




/*
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Home from './components/home';
import Search from './components/searchpage';
import Login from './components/login';
import Registro from './components/registro';
import Conteiner from './components/conteiner';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/*"
          element={
            <>
              <Conteiner />
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/registro" element={<Registro />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
*/