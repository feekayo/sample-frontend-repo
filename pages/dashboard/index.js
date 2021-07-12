import Dashboard_Layout from "../../components/layout/dashboard_layout";
import React, {Component, useEffect, useState} from "react";
import * as Api from "../../components/config/api";
import * as Session from "../../components/config/session";
import * as Constant from "../../components/config/constant";
import * as Constants from "../../components/config/constant";
import Link from "next/link";
import Swal from "sweetalert2";
import NProgress from 'nprogress';
import { Facebook } from 'react-content-loader';

export default function app() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState([]);
    const [countries, setCountries] = useState([]);
    const [userDetails, setUserDetails] = useState([]);


    // Update details
    const handleFormChange = e =>
        setUserDetails({...userDetails, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            const res = await fetch(Api.signup, {
                method: 'PUT',
                body: JSON.stringify(userDetails),
                'headers': {
                    'Authorization': 'Bearer ' + Session.token,
                    'Content-type': 'application/json'
                }
            });

            const json = await res.json();

            if (json.status === 'successful') {
                NProgress.done();
                Swal.fire({
                    title: 'Success!',
                    text: json.msg,
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });

                window.location.reload();

            } else {
                NProgress.done();
                Swal.fire({
                    title: 'Failed!',
                    text: json.err,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
        } catch (e) {
            NProgress.done();
            console.log('An error occurred', e);
            Swal.fire({
                title: 'Error!',
                text: 'An error occured while submitting the form',
                icon: 'error',
                confirmButtonText: 'Ok'
            });

        }
    };

    useEffect(() =>
    {
        Session.validateUser()

        async function loadUser() {
            const response = await fetch(Api.fetchUser,
                {
                    method: 'GET',
                    'headers': {
                        'Authorization': 'Bearer ' + Session.token
                    }
                });
            const user_data = await response.json();
            setUser(user_data.data);

            //console.log(user_data)

            const country_api = await fetch("https://restcountries.eu/rest/v2/all", {
                method: 'GET',
            });

            const country_data = await country_api.json();
            setCountries(country_data);

            setLoading(false);
        }
        loadUser();

        // get countries



    }, []);


    return(
      <Dashboard_Layout title="My Account">


              <section className="col-lg-6 mx-auto">
                  <h5 className="text-center mb-4">My Information</h5>

                  {loading ? (
                      <div>
                          <Facebook />
                          <Facebook />

                      </div>
                  ):(
                  <div>

                  <form onSubmit={handleSubmit}>

                      <div className="row g-2">
                          <div className="form-group col-6 mb-3 form-floating">
                              <input type="text" onChange={handleFormChange} placeholder="firstname" name="firstName" className="form-control"  defaultValue={user.firstName}/>
                              <label className="font-gray">First name</label>
                          </div>
                          <div className="form-group col-6 mb-3 form-floating">
                              <input type="text" onChange={handleFormChange} placeholder="lastname" name="lastName" className="form-control" defaultValue={user.lastName}/>
                              <label className="font-gray">Last Name</label>
                          </div>

                      </div>

                      <div className="form-group form-floating mb-3">

                          <input disabled type="text" placeholder="username" className="form-control"
                                 defaultValue={user.username}/>
                          <label className="font-gray">Username</label>
                      </div>

                      <div className="form-group mb-3 form-floating">
                          <input type="email" onChange={handleFormChange} name="email" placeholder="email" className="form-control"
                                 defaultValue={user.email}/>
                          <label className="font-gray">Email address</label>
                      </div>


                      <div className="form-group mb-3 form-floating">
                          <input type="text" onChange={handleFormChange} placeholder="address" name="address" className="form-control" defaultValue={user.address}/>
                          <label className="font-gray">Address</label>
                      </div>

                      <div className="row g-2">
                          <div className="form-group col-6 mb-3 form-floating">
                              <input type="text" onChange={handleFormChange} placeholder="state" name="state" className="form-control" defaultValue={user.state}/>
                              <label className="font-gray">State</label>
                          </div>

                          <div className="form-group col-6 mb-3 form-floating">
                              <input type="text" onChange={handleFormChange} name="city" placeholder="city" className="form-control" defaultValue={user.city}/>
                              <label className="font-gray">City</label>
                          </div>

                      </div>

                      <div className="form-group form-floating">

                          <select  onChange={handleFormChange} placeholder="country" className="form-select" name="country">
                              {
                                  countries.map((country,index) => {

                                      if(country.name === user.country){
                                          return <option selected> {country.name}</option>;
                                      }else{
                                          return <option> {country.name}</option>;
                                      }
                                  })
                              }
                          </select>
                          <label className="font-gray">Country of residence</label>
                      </div>

                      <div className="text-center mt-3">
                      <button className="btn btn-success ">Save changes</button>
                          {
                              Session.role === 'regular' ? (

                                  <Link href="/dashboard/security">
                                      <a className="ms-3 btn btn-warning ">
                                          Next <i className="fa fa-caret-right"></i> </a>
                                  </Link>
                              ) : (null)
                          }
                      </div>

                  </form>
                  </div>
                  )}
              </section>






      </Dashboard_Layout>
  )
}