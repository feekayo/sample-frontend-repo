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



export default function App(props) {
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(false);


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

                    <div className="bg-gray shadow-sm border p-4">
                        <h2 className="text-start mb-2 fs-3">Account Activated</h2>
                        <p className="mb-4 font-gray">Your account has been activated. Now you can proceed to update
                        your profile with your information before you can start trading.</p>

                        <Link href="login"><a className="btn btn-primary w-100 btn-block">Continue to Login</a></Link>

                    </div>


                </section>
            )}
        </Main_Layout>

    )
}

