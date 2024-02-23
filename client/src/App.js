import { Routes, Route} from 'react-router-dom';
import { useState } from 'react';

import Home from './Home';
import Tour from './Tour';
import Login from './Login';
import Signup from './Signup';
import Me from './Me';
import ForgotPassword from './ForgotPassword'
import ResetPassword from './ResetPassword';
import MyTours from './MyTours';
import Admin from './Admin';

function App() {
  const [tours, setTours] = useState({
    data: [],
    length: ""
  });

  return (
    <Routes>
      <Route 
        path='/'
        element={
          <Home 
            tours={tours}
            setTours={setTours}
          />}
      />
      {
        tours.data.map(tour => (
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
      <Route
        path='/user/my-tours'
        element={<MyTours />}
      />
      <Route
        path='/user/admin'
        element={<Admin />}
      />
    </Routes>
  );
}

export default App;
