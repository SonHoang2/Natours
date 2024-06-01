import Header from "./component/Header"
import { USERS_URL } from "./customValue"
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      const res = await fetch(
        USERS_URL + "/signup", {
          method: "POST",
          body: JSON.stringify({name, email, password, passwordConfirm}),
          headers: {'Content-Type': 'application/json'},
        }
      )
      const data = await res.json();
      
      if (data.status == "fail") {
        setError(data.message)
      } else if (data.status == "success") {
        localStorage.setItem("user", JSON.stringify(data.data.user));
        localStorage.setItem("token", JSON.stringify(data.token));
        navigate("/");
      }
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <div className="h-100">
      <Header />
      <motion.div 
        className="d-flex justify-content-center align-items-center w-100 h-100 bg-body-secondary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{opacity: 0}}
      >
        <form onSubmit={handleSubmit} className="shadow border px-5 py-4 bg-white rounded w-400">
          <h1 className="text-success pb-4 fs-3 fw-bold text-center">CREATE YOUR ACCOUNT!</h1>
          {
            error && 
            <div className="alert alert-danger fw-bold" role="alert">{error}. Try again.</div>
          }
          <div className="d-flex flex-column pb-3">
            <label className="form-label fw-bold" htmlFor="name">Your name</label>
            <input 
              className="form-control border-0 bg-body-secondary shadow-none" 
              id="name"
              type="text" 
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="d-flex flex-column pb-3">
            <label className="form-label fw-bold" htmlFor="email">Email address</label>
            <input 
              className="form-control border-0 bg-body-secondary shadow-none" 
              id="email"
              type="text" 
              placeholder="you@example.com"
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="d-flex flex-column pb-3">
            <label className="form-label fw-bold" htmlFor="password">Password</label>
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
              value="Sign up"
              className="bg-success text-white border-0 rounded-pill px-5 py-2"
            />
          </div>
        </form>
      </motion.div>
    </div>
  )
}