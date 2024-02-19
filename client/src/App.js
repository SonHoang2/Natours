import { Routes, Route} from 'react-router-dom';
import { useEffect, useState } from 'react';

import { TOURS_URL } from "./customValue"
import Home from './Home';
import Tour from './Tour';
import Login from './Login';
import Signup from './Signup';
import Me from './Me';
import ForgotPassword from './ForgotPassword'
import ResetPassword from './ResetPassword';

function App() {
  const [tours, setTours] = useState([]);
  const getTours = async () => {
    try {
      const res = await fetch(TOURS_URL + "/", {
        method: "GET",
    })
      const {data} = await res.json();
      if (data) {
        setTours(data.doc)
      }
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
      {
        tours.map(tour => (
          <Route
            path={'/tour/' + tour.slug}
            element={
              <Tour 
                key={tour.id}
                tour={tour}
              />
            }
          />
        ))
      }
      <Route 
        path='/user/login'
        element={<Login />}
      />
      <Route 
        path='/user/signup'
        element={<Signup />}
      />
      <Route 
        path='/user/me'
        element={<Me />}
      />
      <Route 
        path='/user/forgotPassword'
        element={<ForgotPassword />}
      />
      <Route 
        path='/user/resetPassword/:token'
        element={<ResetPassword />}
      />
    </Routes>
  );
}

export default App;