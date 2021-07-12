import Dashboard_Layout from "../../components/layout/dashboard_layout";
import React, {Component, useEffect, useState} from "react";
import * as Api from "../../components/config/api";
import * as Session from "../../components/config/session";
import * as Constant from "../../components/config/constant";
import * as Constants from "../../components/config/constant";
import Link from "next/link";
import Swal from "sweetalert2";
import NProgress from 'nprogress';
import { Facebook } from 'react-content-loader'
import ls from "local-storage";
var QRCode = require('qrcode.react');


export default function app() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState([]);
    const [phone, setPhone] = useState({
        'phone' : ''
    });
    let newPhone;
    const [password, setPassword] = useState([]);
    const [qrCode, setQrCode] = useState('');
    const [verify2fa, setVerify2fa] = useState({
        userId : Session.id
    });

    // Update details
    const handlePhoneChange = e =>
        setPhone({ ...phone, [e.target.name]: e.target.value });

    const handle2faChange = e =>
        setVerify2fa({ ...verify2fa, [e.target.name]: e.target.value });

    const handlePhoneSubmit = async e => {
        e.preventDefault();


        if(phone.phone.indexOf('234') >= 0)
        {
             newPhone = phone;
        }else {
             newPhone = {"phone": "234" + phone.phone};
        }

        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            const res = await fetch(Api.signup + '/phone', {
                method: 'POST',
                body: JSON.stringify(newPhone),
                headers: {
                    'Authorization': 'Bearer ' + Session.token,
                    'Content-type': 'application/json',
                    'ip' : ls.get('ip'),
                    'device' : ls.get('device'),
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

                setTimeout(function(){ window.location.reload(); }, 3000);

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


    function activate2fa() {
        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            fetch(Api.activate2fa,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + Session.token,
                        'Content-type': 'application/json',
                        'ip' : ls.get('ip'),
                        'device' : ls.get('device'),
                    }
                }).then((res) => res.json())
                .then((response109) => {
                    NProgress.done();

                    console.log(response109);


                  //  ls.set('128303002', '100OOO001O0O000OO00O0O010O0O011O00O00');

                    if (response109.status === 'successful') {

                        setQrCode(response109.data);

                        // Swal.fire({
                        //     title: 'Success!',
                        //     text: response109.message,
                        //     icon: 'success',
                        //     confirmButtonText: 'Ok'
                        // });

                    } else {
                        Swal.fire({
                            title: 'Failed!',
                            text: response109.message,
                            icon: 'error',
                            confirmButtonText: 'Ok'
                        });
                    }

                });

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
    }

    function deactivate2fa() {
        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            fetch(Api.deactivate2fa,
                {
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + Session.token,
                        'Content-type': 'application/json',
                        'ip' : ls.get('ip'),
                        'device' : ls.get('device'),
                    }
                }).then((res) => res.json())
                .then((response109) => {
                    NProgress.done();

                    console.log(response109);

                    if (response109.status === 'successful') {


                        Swal.fire({
                            title: 'Success!',
                            text: response109.message,
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        });

                    } else {
                        Swal.fire({
                            title: 'Failed!',
                            text: response109.message,
                            icon: 'error',
                            confirmButtonText: 'Ok'
                        });
                    }

                });

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
    }

    function confirmActivate2fa() {
        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            fetch(Api.verify2fa,
                {
                    method: 'POST',
                    body: JSON.stringify(verify2fa),
                    headers: {
                        Authorization: 'Bearer ' + Session.token,
                        'Content-type': 'application/json',
                        'ip' : ls.get('ip'),
                        'device' : ls.get('device'),
                    }
                }).then((res) => res.json())
                .then((response109) => {
                    NProgress.done();

                    //console.log(verify2fa);

                    if (response109.status === 'successful') {

                        ls.set('128303002', '100OOO001O0O000OO00O0O010O0O011O00O00');

                        Swal.fire({
                            title: 'Success!',
                            text: response109.msg,
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        });

                        window.location.reload();

                    } else {
                        Swal.fire({
                            title: 'Failed!',
                            text: response109.msg,
                            icon: 'error',
                            confirmButtonText: 'Ok'
                        });
                    }

                });

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
    }



    // Update password
    const handlePasswordChange = e =>
        setPassword({ ...password, [e.target.name]: e.target.value });

    const handlePasswordSubmit = async e => {
        e.preventDefault();

        if(password.newPassword === password.confirmNewPassword) {
            try {
                NProgress.start();
                NProgress.inc();
                NProgress.configure({ease: 'ease', speed: 500});

                const res = await fetch(Api.updatePassword, {
                    method: 'PUT',
                    body: JSON.stringify({ oldPassword : password.oldPassword, newPassword : password.newPassword}),
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
        }else{
            NProgress.done();
            console.log('An error occurred', e);
            Swal.fire({
                title: 'Error!',
                text: 'New passwords do not match',
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

            if(user_data.data.phone) {
                setPhone({'phone': user_data.data.phone});
            }

            //console.log(user_data.data.twoFA)
            setLoading(false);
        }
        loadUser();

        // get countries



    }, []);


    return(
      <Dashboard_Layout title="Security">

              <section className="col-lg-10">

                  <div className="row">

                      <div className="col-lg-6">

                          {
                              Session.role === 'regular' ?(

                          <div className="bg-gray mb-4 p-4 rounded">
                              {loading ? (
                                  <Facebook />
                                  ):(
                                      <div>
                              <h5 className="mb-3">Mobile Verification</h5>

                              <form onSubmit={handlePhoneSubmit} className="row g-3 align-items-center">

                                  <p className="font-gray mb-0 fs-6">Phone number</p>
                                  <div className="col-8 mt-0">

                                      <div className="input-group">
                                          <span className="input-group-text" id="basic-addon1">+234</span>
                                          {
                                              user.phone ? (
                                                  <input type="text" className="form-control" onChange={handlePhoneChange}
                                                         placeholder="Phone Number" name="phone" defaultValue={user.phone.replace('+234','')}/>
                                              ) :(
                                                  <input type="text" className="form-control" onChange={handlePhoneChange}
                                                         placeholder="Phone Number" name="phone" />
                                              )
                                          }

                                      </div>

                                  </div>

                                  <div className="col-4 mt-0">
                                      <button className="btn btn-primary w-100 ">Update</button>

                                  </div>

                              </form>
                                      </div>
                                  )}
                          </div>

                              ):(null)
                          }


                          <div className="bg-gray p-4 mb-3 rounded">
                              {loading ? (
                                  <Facebook />
                              ):(
                                  <div>
                              <h5 className="mb-3">Password</h5>

                              <form onSubmit={handlePasswordSubmit}>


                                  <div className="form-group form-floating mb-3">

                                      <input type="password" onChange={handlePasswordChange} placeholder="password" name="oldPassword" className="form-control"/>
                                      <label className="font-gray">Current Password</label>
                                  </div>

                                  <div className="form-group mb-3 form-floating">
                                      <input type="password" onChange={handlePasswordChange} name="newPassword" placeholder="new password" className="form-control"/>
                                      <label className="font-gray">New Password</label>
                                  </div>

                                  <div className="form-group mb-3 form-floating">
                                      <input type="password" onChange={handlePasswordChange} name="confirmNewPassword" placeholder="confirm new password" className="form-control"/>
                                      <label className="font-gray">Confirm New Password</label>
                                  </div>

                                  <div className="col-4 mt-0">
                                      <button className="btn btn-primary w-100 ">Change Password</button>

                                  </div>

                              </form>
                                  </div>
                                  )}
                          </div>

                      </div>

                      <div className="col-lg-6">
                          <div className="bg-gray mb-4 p-4 rounded">
                              {loading ? (
                                  <Facebook />
                              ):(
                                  <div>
                              <h5 className="mb-3 fw-bold">2 Factor Authentication</h5>

                              <p>Activate extra layer of security to protect your account.</p>

                              <div className="row mt-4 align-items-center">
                                  <div className="col-6">
                                      <h6 className="fw-bold"><i className="fab fa-google font-sm-3"></i> Google Authenticator</h6>
                                      <p>An OTP code (which will be generated on the app) every time you withdraw money or release a transaction to protect your account</p>
                                  </div>
                                  <div className="col-6">
                                      {
                                          user.twoFA === false ?(
                                              <a href="#" onClick={() => activate2fa()} className="btn btn-success w-100">Activate</a>
                                          ):(
                                              <a href="#" onClick={() => deactivate2fa()} className="btn btn-danger w-100">Deactivate</a>
                                          )
                                      }

                                  </div>
                              </div>


                                      {
                                          qrCode ? (
                                              <div className="bg-white p-2 border border_radius">
                                              <div className="row">
                                                  <div className="col-4">
                                                  <QRCode value={qrCode}  />
                                                  </div>
                                                  <div className="col-8 p-2">
                                                      <label>Scan the QR Code using Google Authenticator and enter the generated code below:</label>
                                                      <input type="text" onChange={handle2faChange} className="form-control" name="twoFAToken"/>
                                                      <button onClick={() => confirmActivate2fa()} className="btn btn-success">Activate 2-FA</button>
                                                  </div>
                                              </div>
                                              </div>
                                          ) : null
                                      }

                                  </div>
                                  )}
                              <div className="p-1 bg-white"></div>

                                  {loading ? (
                                      <Facebook />
                                  ):(
                                      <div className="row mt-4 align-items-center">
                                  <div className="col-6">
                                      <h6 className="fw-bold"><i className="fa fa-mobile-alt font-sm-3"></i> Sms Authenticator</h6>
                                      <p>An OTP code (which would be sent to your phone) every time you withdraw money or release a transaction to protect your account</p>
                                  </div>
                                  <div className="col-6">
                                      <a href="#" className="btn btn-primary w-100">Activate</a>
                                  </div>
                                      </div>
                                      )}

                          </div>
                      </div>

                  </div>



              </section>


      </Dashboard_Layout>
  )
}