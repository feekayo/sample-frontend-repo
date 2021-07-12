import Main_Layout from "../../components/layout/main_layout";
import React, {Component,useEffect, useState} from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import ls from "local-storage";
import * as Constants from "../../components/config/constant";
import * as Session from "../../components/config/session";
import Link from "next/link";
import {useRouter} from "next/router";
import NProgress from "nprogress";
import * as Api from "../../components/config/api";
import Swal from "sweetalert2";



export default function passwordReset(props) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const router = useRouter();
    const id = router.query['token'];


    // login changes
    const handleChange = e =>
        setUser({ ...user, [e.target.name]: e.target.value });

    // login form submit
    const handleSubmit = async e => {
        e.preventDefault();
        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });


            if(user.newPassword === user.confirm_password) {

                if(user.newPassword.length >= 6)
                {

                delete user.confirm_password;

                const res = await fetch(Api.resetPassword + "/" + id, {
                    method: 'POST',
                    body: JSON.stringify(user),
                    headers: {'Content-Type': 'application/json',
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

                    if (json.err === 'User not validated') {
                        setTimeout(function () {
                            window.location.href = '/activate'
                        }, 3000);
                    }
                }


                }else {
                    NProgress.done();
                    Swal.fire({
                        title: 'Failed!',
                        text: 'Password must be at least 6 characters',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });

                }

            }else {
                NProgress.done();
                Swal.fire({
                    title: 'Failed!',
                    text: 'New passwords do not match',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });

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
        <Main_Layout title="Password reset">
            { loading ? (
                <Constants.loading />
            ) : (
                <section className="margin_100-top col-lg-3 col-md-6 col-sm-10 mx-auto login-form">
                    <h1 className="text-center mb-4">Reset Password</h1>

                    <form onSubmit={handleSubmit}>

                        <p>Create a new password below. Your new password must be at least 6 characters long.</p>
                         <div className="form-floating">
                            <input type="password" name="newPassword" onChange={handleChange} className="form-control" placeholder="Password" required="required"/>
                            <label>New Password</label>
                        </div>
                        <div className="form-floating">
                            <input type="password" onChange={handleChange} name="confirm_password" className="form-control" placeholder="confirm password"
                                       required="required"/>
                            <label>Confirm New Password</label>
                        </div>
                        <div className="mb-3 mt-3">
                            <button type="submit" className="btn btn-primary btn-lg w-100 btn-block">Update</button>
                        </div>


                    </form>
                    <p className="text-center"><Link href="signup"><a>Create a new account</a></Link></p>

                </section>
            )}
        </Main_Layout>

    )
}

