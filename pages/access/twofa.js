import Main_Layout from "../../components/layout/main_layout";
import React, {Component,useEffect, useState} from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import ls from "local-storage";
import * as Constants from "../../components/config/constant";
import * as Api from "../../components/config/api";
import * as Session from "../../components/config/session";
import Link from "next/link";
import Swal from "sweetalert2";
import NProgress from 'nprogress';
import {redirectUser} from "../../components/config/session";
var QRCode = require('qrcode.react');



export default function Homepage(props) {
    const [loading, setLoading] = useState(true);
    const [login_user, setLoginUser] = useState({
        userId : ls.get('1102939023')
    });


    // login changes
    const handleLoginChange = e =>
        setLoginUser({ ...login_user, [e.target.name]: e.target.value });

    // login form submit
    const loginSubmit = async e => {
        e.preventDefault();
        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            const res = await fetch(Api.verify2faLogin, {
                method: 'POST',
                body: JSON.stringify(login_user),
                headers: { 'Content-Type': 'application/json',
                    'ip' : ls.get('ip'),
                    'device' : ls.get('device'),}
            });

            const json = await res.json();

            //console.log(json);
            if (json.status === 'successful') {
                NProgress.done();
                Swal.fire({
                    title: 'Success!',
                    text: json.msg + '. Please wait',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });

                const response56 = await fetch(Api.fetchUser,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + json.token
                        }
                    })

                const user_data = await response56.json();

                console.log(user_data);
                if (user_data) {

                    if(json.token !== undefined) {
                        ls.set('v_token', json.token);
                    }

                                if(user_data.data.role === 'regular')
                                {
                                    ls.set('v_role', 'd1-2H298HF-24FJ-29F9f32hf2h023-3208h2803hf283f2');
                                }else if(user_data.data.role === 'admin')
                                {
                                    ls.set('v_role', 'c2j0f-0F22F09wf23-9H2F08HF02-f2F32H083Finfo23fno2');
                                }else if(user_data.data.role === 'superAdmin')
                                {
                                    ls.set('v_role', 'v3092-30O0O00O0OOO0O0OO0O-0OO00-O0O0-02f20-230O02O0F2-2fo');
                                }else if(user_data.data.role === 'customerService')
                                {
                                    ls.set('v_role', 'di2h213f2-f2f4g395-3g-3g9329j4-23ff__e2');
                                }

                                ls.set('v_us', user_data.data.username);
                                ls.set('v_id', user_data.data._id);
                                if(ls.get('bal') == null) {
                                    ls.set('bal', 'hide');
                                };
                                ls.set('v', user_data.data.verified);
                                ls.set('vEmail', user_data.data.verifiedEmail);
                                ls.set('vPhone', user_data.data.verifiedPhone);
                                ls.set('type', 'user');

                                Session.redirectUser();
                            }


            } else {
                NProgress.done();
                Swal.fire({
                    title: 'Failed!',
                    text: json.msg,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });

                if(json.err === 'User not validated')
                {
                    setTimeout(function(){ window.location.href= '/activate' }, 3000);
                }
            }
        } catch (e) {
            NProgress.done();
            console.log('An error occurred', e);
            Swal.fire({
                title: 'Error!',
                text: e,
                icon: 'error',
                confirmButtonText: 'Ok'
            });

        }
    };



    useEffect(() =>
    {
        setLoading(false);

        if(!ls.get('1102939023'))
        {
            window.location.href = '/access/login';
        }

    }, []);




    return (
        <Main_Layout title="Trade">
            { loading ? (
                <Constants.loading />
            ) : (
                <section className="margin_100-top col-lg-3 col-md-6 col-sm-10 mx-auto login-form">
                    <h1 className="text-center mb-4">2FA Authentication</h1>
                    <form onSubmit={loginSubmit}>

                        { ls.get('token') ? (
                            <div className="text-center">
                                <h5>Already logged in as:</h5>
                                <div className="bg-white p-3 shadow-sm">
                                    <h4 className="text-success text-capitalize m-0">{ls.get('username')}</h4>
                                    <em className="font-gray">{ls.get('email')}</em>
                                </div>

                                <Link href="/trade"><a className="btn btn-warning btn-lg mt-3 w-100">Continue to dashboard <i className="fa fa-chevron-circle-right"></i></a></Link>
                            </div>
                        ):(
                            <div>

                            <div className="text-center mb-3">

                            </div>

                                <p>Enter the 6-digit Google Authenticator code:</p>
                        <div className="form-floating">
                            <input type="password" name="twoFAToken" onChange={handleLoginChange} className="form-control" placeholder="G-Authenticator Code"
                                       required="required"/>
                            <label>G-Authenticator Code</label>
                        </div>
                        <div className="mb-3 mt-3">
                            <button type="submit" className="btn btn-primary btn-lg w-100 btn-block">Verify & Login</button>
                        </div>

                        <div className="bottom-action clearfix">
                            <Link href="/access/forgot"><a className="float-end">Forgot Password?</a></Link>
                            <Link href="signup"><a>Create an Account</a></Link>

                        </div>
                            </div>
                            ) }
                    </form>

                </section>
            )}
        </Main_Layout>

    )
}

