import Main_Layout from "../../components/layout/main_layout";
import React, {Component,useEffect, useState} from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import ls from "local-storage";
import * as Constants from "../../components/config/constant";
import * as Api from "../../components/config/api";
import * as Session from "../../components/config/session";
import Link from "next/link";
import NProgress from 'nprogress';
import Swal from "sweetalert2";



export default function Homepage(props) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState([]);


    // signup changes
    const handleSignUpChange = e =>
        setUser({ ...user, [e.target.name]: e.target.value });

    // submit signup form
    const signUpSubmit = async e => {
        e.preventDefault();
        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });


            const res = await fetch(Api.signup, {
                method: 'POST',
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json',
                    'ip' : ls.get('ip'),
                    'device' : ls.get('device'),
                }
            });

            const json = await res.json();

            if (json.status === 'successful') {
                NProgress.done();
                Swal.fire({
                    title: 'Success!',
                    text: json.msg + '. Please wait',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });

                setTimeout(function(){ window.location.href= '/access/login' }, 3000);

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
                title: 'Connection Error!',
                text: 'The connection was disrupted. Please try again',
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

                    <form onSubmit={signUpSubmit}>
                        <h2 className="text-start mb-2 fs-3">Create a new account</h2>
                        <p className="mb-4 font-gray">Fill in the required information below to create an account and
                            start trading.</p>

                        <div className="form-floating mb-3">
                            <input onChange={handleSignUpChange} type="text" className="form-control" name="username" placeholder="Username" required="required"/>
                            <label>Username</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input onChange={handleSignUpChange} type="email" className="form-control" name="email" placeholder="Email" required="required"/>
                            <label>Email</label>
                        </div>
                        <div className="form-floating">
                            <input onChange={handleSignUpChange} type="password" className="form-control" name="password" placeholder="Password"
                                       required="required"/>
                            <label>Password</label>
                        </div>
                        <div className="mb-3 mt-3">
                            <button type="submit" className="btn btn-primary btn-lg w-100 btn-block">Create Account</button>
                        </div>


                    </form>
                    <p className="text-center"><Link href="login"><a>Continue to Login</a></Link></p>

                </section>
            )}
        </Main_Layout>

    )
}

