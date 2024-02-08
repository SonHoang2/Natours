import { Routes, Route} from 'react-router-dom';
import { useEffect, useState } from 'react';

import Home from './Home';

function App() {
  const [tours, setTours] = useState({});

  const getTours = async () => {
    try {
      const res = await fetch(process.env.REACT_APP_BASE_URL + '/api/v1/tours/', {
        method: "GET",
    })
      const data = await res.json();
      setTours(data)
    } catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getTours();
  }, [])

  return (
    <Routes>
      <Route 
        path='/'
        element={
          <Home 
            tours={tours}
          />}
      />
    </Routes>
  );
}

export default App;
