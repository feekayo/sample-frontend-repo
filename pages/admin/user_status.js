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
import {role} from "../../components/config/session";


export default class userStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            requests: [],
            activationRequests: [],
        };


    }



    fetchDeactivatedRequest() {

        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });


            fetch(Api.fetchDeactivatedRequest,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + Session.token,
                        'Content-type': 'application/json'
                    }
                }).then((res) => res.json())
                .then((json) => {
                    NProgress.done();
                    console.log(json);

                    this.setState({requests : json.data});

                })


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

    fetchActivationRequest() {

        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });


            fetch(Api.fetchActivatedRequest,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + Session.token,
                        'Content-type': 'application/json'
                    }
                }).then((res) => res.json())
                .then((json) => {
                    NProgress.done();
                    console.log(json);

                    this.setState({activationRequests : json.data});

                })


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


    updateStatus(id, status) {

        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });


            fetch(Api.adminUpdateUserStatus,
                {
                    method: 'POST',
                    body : JSON.stringify({
                        userId : id,
                        status : status
                    }),
                    headers: {
                        'Authorization': 'Bearer ' + Session.token,
                        'Content-type': 'application/json',
                        'ip' : ls.get('ip'),
                        'device' : ls.get('device'),
                    }
                }).then((res) => res.json())
                .then((json) => {
                    NProgress.done();
                    console.log(json);

                    if (json.status === 'successful') {
                        NProgress.done();
                        Swal.fire({
                            title: 'Success!',
                            text: json.msg,
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        });

                        this.fetchDeactivatedRequest();

                    } else {
                        NProgress.done();
                        Swal.fire({
                            title: 'Failed!',
                            text: json.err,
                            icon: 'error',
                            confirmButtonText: 'Ok'
                        });
                    }

                })


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

    enableStatus(id, status) {

        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });


            fetch(Api.adminEnableUserStatus,
                {
                    method: 'POST',
                    body : JSON.stringify({
                        userId : id,
                        status : status
                    }),
                    headers: {
                        'Authorization': 'Bearer ' + Session.token,
                        'Content-type': 'application/json',
                        'ip' : ls.get('ip'),
                        'device' : ls.get('device'),
                    }
                }).then((res) => res.json())
                .then((json) => {
                    NProgress.done();
                    console.log(json);

                    if (json.status === 'successful') {
                        NProgress.done();
                        Swal.fire({
                            title: 'Success!',
                            text: json.msg,
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        });

                        this.fetchDeactivatedRequest();

                    } else {
                        NProgress.done();
                        Swal.fire({
                            title: 'Failed!',
                            text: json.err,
                            icon: 'error',
                            confirmButtonText: 'Ok'
                        });
                    }

                })


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

        this.fetchDeactivatedRequest();

        this.fetchActivationRequest();

        this.setState({loading : false})
    }

    render(){
        return(
            <Dashboard_Layout title="User Status Request">

                <section className="col-lg-12 mx-auto">

                    {this.state.loading ? (
                        <div className="row ">

                            <div className="bg-skyblue border_radius mb-4 border p-3">
                                <div className="row">
                                    <div className="col">
                                        <Skeleton height="200px" className=" mb-3"/>
                                    </div>
                                    <div className="col">
                                        <Skeleton height="200px" className=" mb-3"/>
                                    </div>
                                    <div className="col">
                                        <Skeleton height="200px" className=" mb-3"/>
                                    </div>
                                </div>
                            </div>

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

                        <div className="row ">

                            <div className="">

                                        <div className="accordion fancy_accordion" id="accordionExample">
                                            <div className="accordion-item trade_accordion">
                                                <div className="bg-primary accordion-header clearfix" id="headingOne">
                                                    <ul className="nav nav-pills" id="pills-tab" role="tablist">
                                                        <li className="nav-item" role="presentation">
                                                            <a className="nav-link active" id="pills-home-tab" data-bs-toggle="pill"
                                                               href="#pills-pending" role="tab" aria-controls="pills-home"
                                                               aria-selected="true">Disable User Request <badge className="badge bg-danger font-white">{this.state.requests.length}</badge></a>
                                                        </li>
                                                        <li className="nav-item" role="presentation">
                                                            <a className="nav-link" id="pills-profile-tab" data-bs-toggle="pill"
                                                               href="#pills-approved" role="tab" aria-controls="pills-profile"
                                                               aria-selected="false">Enable User Request <badge className="badge bg-danger font-white">{this.state.activationRequests.length}</badge></a>
                                                        </li>

                                                    </ul>

                                                </div>
                                                <div id="collapseOne" className="accordion-collapse collapse show"
                                                     aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                    <div className="accordion-body">


                                                        <div className="tab-content" id="pills-tabContent">
                                                            <div className="tab-pane table-responsive fade show active" id="pills-pending" role="tabpanel"
                                                                 aria-labelledby="pills-home-tab">

                                                                    <table className="table table-striped table-hover font-xs d_table">
                                                                        <thead className="bg-warning">
                                                                        <th className="p-3 shadow-sm">S/N</th>
                                                                        <th className="p-3 shadow-sm">User</th>
                                                                        <th className="p-3 shadow-sm">Disable Request By</th>
                                                                        <th className="p-3 shadow-sm">Reason</th>
                                                                        <th className="p-3 shadow-sm">Date </th>
                                                                        {
                                                                            Session.role === 'admin' || Session.role === 'superAdmin' ? (
                                                                                <th className="p-3 shadow-sm">Options</th>
                                                                            ) : (null)
                                                                        }
                                                                        </thead>
                                                                        <tbody>
                                                                        {
                                                                            this.state.requests.map((request,index) => {
                                                                                if(request.disableRequest.status === 'pending') {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td>{index + 1}</td>
                                                                                            <td className="text-capitalize">{request.username}</td>
                                                                                            <td className="text-capitalize">{request.disableRequest.customerServiceName}</td>
                                                                                            <td>{request.disableRequest.comment}</td>
                                                                                            <td>{moment(request.disableRequest.created).format('ddd MMM DD, YYYY')}</td>
                                                                                            {
                                                                                                Session.role === 'admin' || Session.role === 'superAdmin' ? (
                                                                                            <td>
                                                                                                            <a href={'admin/view_user?us=' + request._id} className="btn me-3 btn-sm btn-warning">View Profile</a>
                                                                                                            <button onClick={() => this.updateStatus(request._id, 'inactive')} className="btn me-3 btn-sm btn-success">Approve Request</button>
                                                                                                <button onClick={() => this.updateStatus(request._id, 'active')} className="btn me-3 btn-sm btn-danger">Deny Request</button>
                                                                                            </td>
                                                                                                ) : (null)
                                                                                            }

                                                                                        </tr>
                                                                                    )
                                                                                }
                                                                            })
                                                                        }
                                                                        </tbody>

                                                                    </table>

                                                            </div>

                                                            <div className="tab-pane  fade" id="pills-approved" role="tabpanel"
                                                                 aria-labelledby="pills-profile-tab">
                                                                <div className="table-responsive">

                                                                    <table className="table table-striped table-hover font-xs d_table">
                                                                        <thead className="bg-warning">
                                                                        <th className="p-3 shadow-sm">S/N</th>
                                                                        <th className="p-3 shadow-sm">User</th>
                                                                        <th className="p-3 shadow-sm">Disable Request By</th>
                                                                        <th className="p-3 shadow-sm">Reason</th>
                                                                        <th className="p-3 shadow-sm">Date</th>
                                                                        {
                                                                            Session.role === 'admin' || Session.role === 'superAdmin' ? (
                                                                                <th className="p-3 shadow-sm">Options</th>
                                                                            ) : (null)
                                                                        }
                                                                        </thead>
                                                                        <tbody>
                                                                        {
                                                                            this.state.activationRequests.map((request,index) => {
                                                                                if(request.enableRequest.status === 'pending') {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td>{index + 1}</td>
                                                                                            <td>{request.username}</td>
                                                                                            <td>{request.enableRequest.customerServiceName}</td>
                                                                                            <td>{request.enableRequest.comment}</td>
                                                                                            <td>{moment(request.enableRequest.created).format('ddd MMM DD, YYYY')}</td>
                                                                                            {
                                                                                                Session.role === 'admin' || Session.role === 'superAdmin' ? (
                                                                                                    <td>
                                                                                                        <a href={'admin/view_user?us=' + request._id} className="btn me-3 btn-sm btn-warning">View Profile</a>
                                                                                                        <button onClick={() => this.enableStatus(request._id, 'active')} className="btn me-3 btn-sm btn-success">Approve Request</button>
                                                                                                        <button onClick={() => this.enableStatus(request._id, 'inactive')} className="btn me-3 btn-sm btn-danger">Deny Request</button>
                                                                                                    </td>
                                                                                                ) : (null)
                                                                                            }


                                                                                        </tr>
                                                                                    )
                                                                                }
                                                                            })
                                                                        }
                                                                        </tbody>

                                                                    </table>

                                                                </div>
                                                            </div>


                                                        </div>

                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                            </div>



                        </div>

                    )}
                </section>






            </Dashboard_Layout>
        )
    }

}


