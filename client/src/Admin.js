import Header from "./component/Header"
import { useEffect, useState } from "react"
import { USER_IMAGE_URL, USERS_URL } from "./customValue"
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";


export default function Admin() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("token"));

  const [dataChange, setDataChange] = useState(false);
  const [image, setImage] = useState({ preview: '', data: '' });
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const navigate = useNavigate();

  const uploadImg = e => {
    setDataChange(true);
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    }
    setImage(img)
  }

  console.log(image.data);
  
  const handleSubmitInfo = async e => {
    try {
      e.preventDefault();
      let formData = new FormData();
      formData.append('photo', image.data);
      formData.append('name', name);
      formData.append('email', email);

      const res = await fetch(
        USERS_URL + "/updateMe", {
          method: "PATCH",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const data = await res.json();
      
      console.log(data);
      if (data.status == "error") {
        alert(data.message);
      } else if (data.status == "success") {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/")
      }

    } catch(err) {
      console.log(err);
    }
  }

  const handleSubmitPassword = async e => {
    try {
      e.preventDefault();
      const res = await fetch(
        USERS_URL + "/updateMyPassword", {
          method: "PATCH",
          body: JSON.stringify({passwordCurrent, password, passwordConfirm}),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )
      const data = await res.json();
      
      console.log(data);
      if (data.status == "error") {
        alert(data.message);
      } else if (data.status == "success") {
        localStorage.removeItem("user")
        navigate("/user/login")
      }
    } catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (user.role !== "admin") {
      alert("You don't have permission to access this page");
      navigate("/");
    }
  }, [])

  return (
    <div className="h-100">
      <Header />
      <motion.div 
        className="bg-body-secondary h-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{opacity: 0}}
      >
        <div className="pb-5"></div>
        <div className="pb-5"></div>
        <div className="d-flex justify-content-center bg-body-secondary pb-5">
          <div className="bg-success p-5 w-400 rounded-start">
            <div className="d-flex align-items-center pb-4">
              <span className="material-symbols-outlined pe-3 text-white">settings</span>
              <p className="text-white">SETTINGS</p>
            </div>
          </div>
          <div className="bg-white w-500 rounded-end">
            <form onSubmit={handleSubmitInfo} className="p-5 pb-3 border-bottom">
              <p className="text-success fw-bold pb-4">YOUR ACCOUNT SETTINGS</p>
              <div className="d-flex flex-column pb-3">
                <label className="form-label fw-bold" htmlFor="name">Your name</label>
                <input 
                  className="form-control border-0 bg-body-secondary shadow-none" 
                  id="name"
                  type="text"
                  value={name}
                  onChange={e => {
                    setDataChange(true);
                    setName(e.target.value);
                  }}
                  required
                />
              </div>
              <div className="d-flex flex-column pb-3">
                <label className="form-label fw-bold" htmlFor="email">Email address</label>
                <input 
                  className="form-control border-0 bg-body-secondary shadow-none" 
                  id="email"
                  type="text" 
                  value={email}
                  onChange={e => {
                    setDataChange(true);
                    setEmail(e.target.value);
                  }}
                  required
                />
              </div>
              <div className="d-flex align-items-center">
                <div className="pe-2">
                  <img 
                    className="user-avatar rounded-circle"
                    src={
                      image.preview || (USER_IMAGE_URL + user.photo)
                    }
                  />
                </div>
                <div className="d-flex justify-content-start">
                  <motion.label
                    role="button"
                    whileHover={{ opacity: 0.8}}
                    whileTap={{ scale: 0.95 }}
                    htmlFor="avatar" 
                    className="text-success"
                  >
                    Choose new photo
                  </motion.label>
                  <input 
                    type="file"
                    id="avatar"
                    name="filename"
                    className="d-none"
                    accept="image/*"
                    onChange={uploadImg}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <button 
                  type="submit" 
                  className="btn btn-success h-100 rounded-pill text-uppercase mt-4 text-white" 
                  disabled={!dataChange}
                >
                  Save settings
                </button>
              </div>
            </form>
            <form onSubmit={handleSubmitPassword} className="p-5">
              <p className="text-success fw-bold pb-4">PASSWORD CHANGE</p>
              <div className="d-flex flex-column pb-3">
                <label className="form-label fw-bold" htmlFor="Current password">Current password</label>
                <input 
                  className="form-control border-0 bg-body-secondary shadow-none" 
                  id="Current password"
                  type="password" 
                  placeholder="••••••••"
                  onChange={e => setPasswordCurrent(e.target.value)}
                  required
                />
              </div>
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
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-success h-100 rounded-pill text-uppercase mt-4 text-white">Save password</button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}