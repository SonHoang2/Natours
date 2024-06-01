import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { USERS_URL } from "./customValue"
import Header from "./component/Header"

export default function ForgotPassword () {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit (e) {
        try {
            e.preventDefault();
            const res = await fetch(USERS_URL + '/forgotPassword', {
                method: 'POST',
                body: JSON.stringify({email}),
                headers: {'Content-Type': 'application/json'},
            });
            const data = await res.json();
            console.log(data);
            if (data.status === "fail") {
              setError(data.message)
            } else if (data.status === "success") {
              setEmail("");
              alert(data.message);
            } else {
              alert(data.message)
            }
        } catch (err) {
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
            <form onSubmit={handleSubmit} className='border rounded shadow px-5 py-4 w-400'>
                <p className='pb-3 fw-bold fs-3 text-center'>Find your account</p>
                <p className="text-secondary pb-3">Enter the email associated with your account to change your password.</p>
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
                <div className="invalid-feedback d-block">{error}</div>
                <div className="d-flex justify-content-center mt-3">
                  <motion.input
                    whileHover={{ opacity: 0.8 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    value="NEXT"
                    className="bg-success text-white border-0 rounded-pill px-5 py-2"
                  />
                </div>
            </form>
        </motion.div>
      </div>
    )
}