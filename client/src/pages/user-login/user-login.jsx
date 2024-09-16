import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserLogin = ({setToken}) => {
  const [login, setLogin] = useState({
    email: '',
    password: ''
  })
  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/login`, login);
      if (response.data.status) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        alert(`${response.data.message}`);
        // window.location.reload();
        setToken(token);
      }
      else{
        alert(`${response.data.message}`)
      }
    } catch (error) {
      console.error('Login error:', error);
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
                  <h3 className="mb-5">Login User</h3>
                  <form onSubmit={handleSubmit}>
                    <div data-mdb-input-init className="form-outline mb-4">
                      <input type="email"
                        className="form-control form-control-lg"
                        name="email"
                        value={login.email}
                        onChange={handleChange}
                        required />
                      <label className="form-label">Email</label>
                    </div>
                    <div data-mdb-input-init className="form-outline mb-4">
                      <input type="password"
                        className="form-control form-control-lg"
                        name="password"
                        value={login.password}
                        onChange={handleChange}
                        required />
                      <label className="form-label" htmlFor="typePasswordX-2">Password</label>
                    </div>
                    <button className="btn btn-primary btn-lg btn-block" type="submit">Login</button>
                  </form>
                  <hr className="my-4" />
                  <Link to={'/user/register'} className="btn btn-lg btn-block btn-primary" style={{ backgroundColor: '#dd4b39' }}><i className="fab fa-google me-2" />Register as a User</Link>
                  <Link to={'/admin/login'} className="btn btn-lg btn-block btn-primary" style={{ backgroundColor: '#3b5998' }}>Login as a Admin</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </>
  )
}

export default UserLogin