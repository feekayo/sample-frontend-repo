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



export default function Homepage(props) {
    const [loading, setLoading] = useState(true);
    const [login_user, setLoginUser] = useState([]);
    const assets = ls.get('assets');


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

            const res = await fetch(Api.forgotPassword, {
                method: 'POST',
                body: JSON.stringify(login_user),
                headers: { 'Content-Type': 'application/json',
                    'ip' : ls.get('ip'),
                    'device' : ls.get('device'),}
            });

            const json = await res.json();

            console.log(json);
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

    }, []);




    return (
        <Main_Layout title="Trade">
            { loading ? (
                <Constants.loading />
            ) : (
                <section className="margin_100-top col-lg-3 col-md-6 col-sm-10 mx-auto login-form">
                    <h1 className="text-center mb-4">Forgot Password</h1>
                    <form onSubmit={loginSubmit}>

                      <p>Enter the link address linked to your account below:</p>

                            <div>
                        <div className="form-floating">
                            <input type="email" name="email" onChange={handleLoginChange} className="form-control" placeholder="Email" required="required"/>
                            <label>Email</label>
                        </div>

                        <div className="mb-3 mt-3">
                            <button type="submit" className="btn btn-success btn-lg w-100 btn-block">Continue</button>
                        </div>

                        <div className="bottom-action clearfix">
                            <Link href="/access/login"><a className="float-end">Sign In</a></Link>
                            <Link href="/access/signup"><a>Create an Account</a></Link>

                        </div>
                            </div>

                    </form>

                </section>
            )}
        </Main_Layout>

    )
}

