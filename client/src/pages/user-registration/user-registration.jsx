import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserRegistration = () => {
  const [user, setUser] = useState({
    username: '',
    password: '',
    email: '',
    profile_picture: null
  });
  const input_picture = useRef(null);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_picture") {
      setUser({ ...user, [name]: files[0] })
    }
    else {
      setUser({ ...user, [name]: value });
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('profile_picture', user.profile_picture);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`, formData);
      console.log(response.data);
      if (response.data.status) {
        alert(`${response.data.message}`);
        navigate('/');
      }
      else if (response.data.status === false) {
        alert(`${response.data.message}`);
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response);
        alert(error.response.data.message || 'Registration failed');
      } else {
        console.error('Error', error);
        alert('An error occurred while registering the user');
      }
    }
  }
  return (
    <>
      <section className="vh-100" style={{ backgroundColor: '#508bfc' }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
                <div className="card-body p-5 text-center">
                  <h3 className="mb-5">Register</h3>
                  <form onSubmit={handleSubmit}>
                    <div data-mdb-input-init className="form-outline mb-4">
                      <input type="text"
                        className="form-control form-control-lg"
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                        required />
                      <label className="form-label">UserName</label>
                    </div>
                    <div data-mdb-input-init className="form-outline mb-4">
                      <input type="email"
                        className="form-control form-control-lg"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        required />
                      <label className="form-label" >Email</label>
                    </div>
                    <div data-mdb-input-init className="form-outline mb-4">
                      <input type="password"
                        className="form-control form-control-lg"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        required />
                      <label className="form-label">Password</label>
                    </div>
                    <div data-mdb-input-init className="form-outline mb-4">
                      <input type="file"
                        className="form-control form-control-lg"
                        name="profile_picture"
                        ref={input_picture}
                        onChange={handleChange}
                        required />
                      <label className="form-label">Profile Picture</label>
                    </div>
                    <button type="submit" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-lg btn-block">Register</button>
                  </form>
                  <hr className="my-4" />
                  <Link to={'/'} className="btn btn-lg btn-block btn-primary" style={{ backgroundColor: '#dd4b39' }} type="submit"><i className="fab fa-google me-2" />already have an account </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}

export default UserRegistration