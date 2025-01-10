import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from 'react';
import Header from "../component/Header";
import { USERS_URL } from "../customValue"

export default function ResetPassword () {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const resetPassword = async e => {
    try {
      e.preventDefault();
      const res = await fetch(USERS_URL + "/resetPassword/" + token, {
        method: "PATCH",
        body: JSON.stringify({password, passwordConfirm}),
        headers: {'Content-Type': 'application/json'},
    })
      const data = await res.json();
      if (data.status === "success") {
        alert("change password success")
        navigate("/auth/login")
      } else {
        alert(data.message)
      }
      console.log(data);

    } catch(err) {
      console.log(err);
    }
  }

  return (
    <div className="h-100">
      <Header />
      <motion.div 
        className='d-flex align-items-center justify-content-center h-100'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{opacity: 0}}
      >
        <form onSubmit={resetPassword} className='border rounded-5 shadow px-5 py-4 d-flex flex-column w-400'>
          <div className="d-flex flex-column pb-3">
            <label className="form-label fw-bold" htmlFor="password">New Password</label>
            <input 
              className="form-control border-0 bg-body-secondary shadow-none" 
              id="password"
              type="password" 
              placeholder="••••••••"
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-flex flex-column pb-3">
            <label className="form-label fw-bold" htmlFor="passwordConfirm">Confirm password</label>
            <input 
              className="form-control border-0 bg-body-secondary shadow-none" 
              id="passwordConfirm"
              type="password" 
              placeholder="••••••••"
              onChange={e => setPasswordConfirm(e.target.value)}
              required
            />
          </div>
          <div className="d-flex justify-content-center mt-3">
            <motion.input
              whileHover={{ opacity: 0.8 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              value="SUBMIT"
              className="bg-success text-white border-0 rounded-pill px-5 py-2"
            />
          </div>
        </form>
      </motion.div>
    </div>
  )
}