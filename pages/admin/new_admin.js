import Dashboard_Layout from "../../components/layout/dashboard_layout";
import React, {Component, useEffect, useState} from "react";
import * as Api from "../../components/config/api";
import * as Session from "../../components/config/session";
import * as Strings from "../../components/config/string";
import * as Constant from "../../components/config/constant";
import * as Constants from "../../components/config/constant";
import Link from "next/link";
import Swal from "sweetalert2";
import ls from "local-storage";
import Skeleton from "react-loading-skeleton";
var QRCode = require('qrcode.react');
import NProgress from 'nprogress';
import { Facebook as Loader } from 'react-content-loader';
import Countdown from "react-countdown";
import createSale from "../trade/create_sale";
import viewTrade from "../trade/view_trade";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default class users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            user: [],

        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = e => {
            this.setState({...this.state, user: {...this.state.user, [e.target.name]: e.target.value}});
    }

    handleSubmit = async e => {
        e.preventDefault();

        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });


            const res = await fetch(Api.createAdmin, {
                method: 'POST',
                body: JSON.stringify(this.state.user),
                headers: {
                    'Authorization': 'Bearer ' + Session.token,
                    'Content-type': 'application/json',
                    'ip' : ls.get('ip'),
                    'device' : ls.get('device'),
                }
            });

            //console.log(sale);

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

                //setTimeout(function(){ window.location.reload(); }, 3000);

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
                text: 'An error occurred while submitting the form',
                icon: 'error',
                confirmButtonText: 'Ok'
            });

        }
    };


    componentDidMount() {

        this.setState({loading : false})
    }

    render(){
        return(
            <Dashboard_Layout title="Users">

                <section className="col-lg-12 mx-auto">

                    <h3 className="font-weight-300">Create Admin Profile</h3>

                    {this.state.loading ? (
                        <div className="row ">

                            <div className="col-lg-8 border_right">
                                <div className="row">

                                    <Skeleton height="20px" width="200px" className="mb-3"/>
                                    <Skeleton height="50px" className="mb-3"/>
                                    <Skeleton height="50px" className="mb-3"/>
                                    <Skeleton height="50px" className="mb-3"/>
                                    <Skeleton height="50px" className="mb-3"/>
                                </div>

                            </div>
                            <div className="col-lg-4 ">
                                <Skeleton height="100%" className="mb-3"/>
                            </div>

                        </div>
                    ):(

                        <div className="col-lg-8">
                            <form onSubmit={this.handleSubmit}>
                        <div className="row ">

                       <div className="col-lg-6">
                           <div className="form-floating">
                               <input onChange={this.handleChange} type="text" className="form-control" name="email" placeholder="Email Address"
                                      required="required"/>
                               <label>Email address</label>
                           </div>

                       </div>

                            <div className="col-lg-6">
                                <div className="form-floating mb-3">
                                    <input onChange={this.handleChange} type="text" className="form-control" name="username" placeholder="Username"
                                           required="required"/>
                                    <label>Username</label>
                                </div>

                            </div>

                            <div className="col-lg-6">
                                <div className="form-floating mb-3">
                                    <input onChange={this.handleChange} type="password" className="form-control" name="password" placeholder="Password"
                                           required="required"/>
                                    <label>Password</label>
                                </div>

                            </div>

                            <div className="col-lg-6">
                                <div className="form-floating mb-3">
                                    <select required onChange={this.handleChange} name="role" className="form-control" placeholder="role">
                                        <option selected disabled value="">-- Select a role --</option>
                                        <option value="admin">Admin</option>
                                        <option value="customerService">Customer Service</option>
                                    </select>
                                    <label>Customer service</label>
                                </div>

                            </div>


                        </div>

                            <button className="btn btn-lg btn-success">Create Admin</button>

                            </form>
                        </div>

                    )}
                </section>






            </Dashboard_Layout>
        )
    }

}


