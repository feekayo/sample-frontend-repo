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


export default class wallets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            verification: [],
            filter : {
                'startDate': new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                'endDate': new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
            }

        };


    }

      loadData() {


    };

    fetchIdentities()
    {
        fetch(Api.identity_verification,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response109) => {
                this.setState({verification : response109.data});
                console.log(response109);
            })

    }

    verifyBvn(id,status) {

        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });


            fetch(Api.verifyBvn + '/' + id,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        'status' : status
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

                        this.fetchIdentities();

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
    verifyAddress(id, status) {

        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });


            fetch(Api.verifyAddress + '/' + id,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        'status' : status
                    }),
                    headers: {
                        'Authorization': 'Bearer ' + Session.token,
                        'Content-type' : 'application/json',
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

                        this.fetchIdentities();

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
    verifyFace(id,status) {

        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });


            fetch(Api.verifyFace + '/' + id,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        'status' : status
                    }),
                    headers: {
                        'Authorization': 'Bearer ' + Session.token,
                        'Content-type' : 'application/json',
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

                        this.fetchIdentities();

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
    verifyIdCard(id, status) {

        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });


            fetch(Api.verifyIdCard + '/' + id,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        'status' : status
                    }),
                    headers: {
                        'Authorization': 'Bearer ' + Session.token,
                        'Content-type' : 'application/json',
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

                        this.fetchIdentities();

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

        this.fetchIdentities();

        this.setState({loading : false})
    }

    render(){
        return(
            <Dashboard_Layout title="Identity Verification">

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

                            <div className=" text-right">

                                <ul className="nav nav-pills" id="pills-tab" role="tablist">

                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link active" id="pills-profile-tab" data-bs-toggle="pill"
                                           href="#pills-bids3" role="tab" aria-controls="pills-bids"
                                           aria-selected="false">BVN Link</a>
                                    </li>

                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link " id="pills-profile-tab" data-bs-toggle="pill"
                                           href="#pills-advert3" role="tab" aria-controls="pills-profile"
                                           aria-selected="false">Identity Card Verification</a>
                                    </li>

                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-profile-tab" data-bs-toggle="pill"
                                           href="#pills-payment3" role="tab" aria-controls="pills-payment"
                                           aria-selected="false">Face Verification</a>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-profile-tab" data-bs-toggle="pill"
                                           href="#pills-payment4" role="tab" aria-controls="pills-payment"
                                           aria-selected="false">Address Verification</a>
                                    </li>

                                </ul>

                                <div className="tab-content" id="pills-tabContent">
                                    <div className="tab-pane fade show table-responsive mt-4 active" id="pills-bids3" role="tabpanel"
                                         aria-labelledby="pills-home-tab">



                                        <div className="accordion fancy_accordion" id="accordionExample">
                                            <div className="accordion-item trade_accordion">
                                                <div className="bg-primary accordion-header clearfix" id="headingOne">
                                                    <h4>BVN Verification</h4>


                                                    <ul className="nav nav-pills" id="pills-tab" role="tablist">
                                                        <li className="nav-item" role="presentation">
                                                            <a className="nav-link active" id="pills-home-tab" data-bs-toggle="pill"
                                                               href="#pills-pending" role="tab" aria-controls="pills-home"
                                                               aria-selected="true">Pending</a>
                                                        </li>
                                                        <li className="nav-item" role="presentation">
                                                            <a className="nav-link" id="pills-profile-tab" data-bs-toggle="pill"
                                                               href="#pills-approved" role="tab" aria-controls="pills-profile"
                                                               aria-selected="false">Approved</a>
                                                        </li>
                                                        <li className="nav-item" role="presentation">
                                                            <a className="nav-link" id="pills-profile-tab" data-bs-toggle="pill"
                                                               href="#pills-denied" role="tab" aria-controls="pills-profile"
                                                               aria-selected="false">Denied</a>
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
                                                                        <th className="p-3 shadow-sm">Username</th>
                                                                        <th className="p-3 shadow-sm">Email</th>
                                                                        <th className="p-3 shadow-sm">BVN</th>
                                                                        <th className="p-3 shadow-sm">Status</th>
                                                                        <th className="p-3 shadow-sm">Date</th>
                                                                        <th className="p-3 shadow-sm">Options</th>
                                                                        </thead>
                                                                        <tbody>
                                                                        {
                                                                            this.state.verification.map((user,index) => {
                                                                                if(user.bvn.status === 'pending') {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td>{index + 1}</td>
                                                                                            <td>{user.ownerId.username}</td>
                                                                                            <td>{user.ownerId.email}</td>
                                                                                            <td>{user.bvn.no}</td>
                                                                                            <td>
                                                                                                {
                                                                                                    user.bvn.status === 'pending' ? (
                                                                                                        <span><i className="fa fa-circle text-warning"></i> Pending</span>
                                                                                                    ): user.bvn.status === 'approved' ? (
                                                                                                        <span><i className="fa fa-circle text-success"></i> Approved</span>
                                                                                                    ):(
                                                                                                        <span><i className="fa fa-circle text-danger"></i> Denied</span>
                                                                                                    )
                                                                                                }
                                                                                            </td>
                                                                                            <td>{moment(user.created).format('ddd MMM DD, YYYY')}</td>
                                                                                            <td>
                                                                                                {
                                                                                                    user.bvn.status === 'pending' ? (
                                                                                                        <div>
                                                                                                            <button onClick={() => this.verifyBvn(user.ownerId._id, 'approved')} className="btn me-3 btn-sm btn-success">Verify</button>
                                                                                                            <button onClick={() => this.verifyBvn(user.ownerId._id, 'denied')} className="btn me-3 btn-sm btn-danger">Deny</button>
                                                                                                        </div>
                                                                                                    ):(null)
                                                                                                }

                                                                                            </td>

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
                                                                            <th className="p-3 shadow-sm">Username</th>
                                                                            <th className="p-3 shadow-sm">Email</th>
                                                                            <th className="p-3 shadow-sm">BVN</th>
                                                                            <th className="p-3 shadow-sm">Status</th>
                                                                            <th className="p-3 shadow-sm">Date</th>
                                                                            <th className="p-3 shadow-sm">Options</th>
                                                                            </thead>
                                                                            <tbody>
                                                                            {
                                                                                this.state.verification.map((user,index) => {
                                                                                    if(user.bvn.status === 'approved') {
                                                                                        return (
                                                                                            <tr>
                                                                                                <td>{index + 1}</td>
                                                                                                <td>{user.ownerId.username}</td>
                                                                                                <td>{user.ownerId.email}</td>
                                                                                                <td>{user.bvn.no}</td>
                                                                                                <td>
                                                                                                    {
                                                                                                        user.bvn.status === 'pending' ? (
                                                                                                            <span><i className="fa fa-circle text-warning"></i> Pending</span>
                                                                                                        ): user.bvn.status === 'approved' ? (
                                                                                                            <span><i className="fa fa-circle text-success"></i> Approved</span>
                                                                                                        ):(
                                                                                                            <span><i className="fa fa-circle text-danger"></i> Denied</span>
                                                                                                        )
                                                                                                    }
                                                                                                </td>
                                                                                                <td>{moment(user.created).format('ddd MMM DD, YYYY')}</td>
                                                                                                <td>
                                                                                                    {
                                                                                                        user.bvn.status === 'pending' ? (
                                                                                                            <div>
                                                                                                                <button onClick={() => this.verifyBvn(user.ownerId._id, 'approved')} className="btn me-3 btn-sm btn-success">Verify</button>
                                                                                                                <button onClick={() => this.verifyBvn(user.ownerId._id, 'denied')} className="btn me-3 btn-sm btn-danger">Deny</button>
                                                                                                            </div>
                                                                                                        ):(null)
                                                                                                    }

                                                                                                </td>

                                                                                            </tr>
                                                                                        )
                                                                                    }
                                                                                })
                                                                            }
                                                                            </tbody>

                                                                        </table>

                                                                </div>
                                                            </div>

                                                            <div className="tab-pane  fade" id="pills-denied" role="tabpanel"
                                                                 aria-labelledby="pills-profile-tab">
                                                                <div className="table-responsive">
                                                                    <table className="table table-striped table-hover font-xs d_table">
                                                                        <thead className="bg-warning">
                                                                        <th className="p-3 shadow-sm">S/N</th>
                                                                        <th className="p-3 shadow-sm">Username</th>
                                                                        <th className="p-3 shadow-sm">Email</th>
                                                                        <th className="p-3 shadow-sm">BVN</th>
                                                                        <th className="p-3 shadow-sm">Status</th>
                                                                        <th className="p-3 shadow-sm">Date</th>
                                                                        <th className="p-3 shadow-sm">Options</th>
                                                                        </thead>
                                                                        <tbody>
                                                                        {
                                                                            this.state.verification.map((user,index) => {
                                                                                if(user.bvn.status === 'denied') {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td>{index + 1}</td>
                                                                                            <td>{user.ownerId.username}</td>
                                                                                            <td>{user.ownerId.email}</td>
                                                                                            <td>{user.bvn.no}</td>
                                                                                            <td>
                                                                                                {
                                                                                                    user.bvn.status === 'pending' ? (
                                                                                                        <span><i className="fa fa-circle text-warning"></i> Pending</span>
                                                                                                    ): user.bvn.status === 'approved' ? (
                                                                                                        <span><i className="fa fa-circle text-success"></i> Approved</span>
                                                                                                    ):(
                                                                                                        <span><i className="fa fa-circle text-danger"></i> Denied</span>
                                                                                                    )
                                                                                                }
                                                                                            </td>
                                                                                            <td>{moment(user.created).format('ddd MMM DD, YYYY')}</td>
                                                                                            <td>
                                                                                                {
                                                                                                    user.bvn.status === 'pending' ? (
                                                                                                        <div>
                                                                                                            <button onClick={() => this.verifyBvn(user.ownerId._id, 'approved')} className="btn me-3 btn-sm btn-success">Verify</button>
                                                                                                            <button onClick={() => this.verifyBvn(user.ownerId._id, 'denied')} className="btn me-3 btn-sm btn-danger">Deny</button>
                                                                                                        </div>
                                                                                                    ):(null)
                                                                                                }

                                                                                            </td>

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




                                    <div className="tab-pane fade table-responsive mt-4" id="pills-advert3" role="tabpanel"
                                         aria-labelledby="pills-home-tab">


                                        <div className="accordion fancy_accordion" id="accordionExample">
                                            <div className="accordion-item trade_accordion">
                                                <div className="bg-primary accordion-header clearfix" id="headingTwo">
                                                    <h4>ID Card Verification</h4>
                                                    

                                                    <ul className="nav nav-pills" id="pills-tabTwo" role="tablist">
                                                        <li className="nav-item" role="presentation">
                                                            <a className="nav-link active" id="pills-home-tab" data-bs-toggle="pill"
                                                               href="#pills-pendingTwo" role="tab" aria-controls="pills-home"
                                                               aria-selected="true">Pending</a>
                                                        </li>
                                                        <li className="nav-item" role="presentation">
                                                            <a className="nav-link" id="pills-profile-tab" data-bs-toggle="pill"
                                                               href="#pills-approvedTwo" role="tab" aria-controls="pills-profile"
                                                               aria-selected="false">Approved</a>
                                                        </li>
                                                        <li className="nav-item" role="presentation">
                                                            <a className="nav-link" id="pills-profile-tab" data-bs-toggle="pill"
                                                               href="#pills-deniedTwo" role="tab" aria-controls="pills-profile"
                                                               aria-selected="false">Denied</a>
                                                        </li>

                                                    </ul>

                                                </div>
                                                <div id="collapseTwo" className="accordion-collapse collapse show"
                                                     aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                    <div className="accordion-body">


                                                        <div className="tab-content" id="pills-tabContent">
                                                            <div className="tab-pane table-responsive fade show active" id="pills-pendingTwo" role="tabpanel"
                                                                 aria-labelledby="pills-home-tab">

                                                                <table className="table table-striped table-hover font-xs d_table">
                                                                    <thead className="bg-warning">
                                                                    <th className="p-3 shadow-sm">S/N</th>
                                                                    <th className="p-3 shadow-sm">Username</th>
                                                                    <th className="p-3 shadow-sm">ID Card</th>
                                                                    <th className="p-3 shadow-sm">Status</th>
                                                                    <th className="p-3 shadow-sm">Date</th>
                                                                    <th className="p-3 shadow-sm">Options</th>
                                                                    </thead>
                                                                    <tbody>
                                                                    {
                                                                        this.state.verification.map((user,index) => {
                                                                            if(user.id_card.status === 'pending') {
                                                                                return (
                                                                                    <tr>
                                                                                        <td>{index}</td>
                                                                                        <td>{user.ownerId.username}</td>
                                                                                        <td><a target="_blank" href={user.id_card.url}>View Image</a></td>
                                                                                        <td>
                                                                                            {
                                                                                                user.id_card.status === 'pending' ? (
                                                                                                    <span><i className="fa fa-circle text-warning"></i> Pending</span>
                                                                                                ): user.id_card.status === 'approved' ? (
                                                                                                    <span><i className="fa fa-circle text-success"></i> Approved</span>
                                                                                                ):(
                                                                                                    <span><i className="fa fa-circle text-danger"></i> Denied</span>
                                                                                                )
                                                                                            }
                                                                                        </td>
                                                                                        <td>{moment(user.created).format('ddd MMM DD, YYYY')}</td>
                                                                                        <td>
                                                                                            {
                                                                                                user.id_card.status === 'pending' ? (
                                                                                                    <div>
                                                                                                        <button
                                                                                                            onClick={() => this.verifyIdCard(user.ownerId._id, 'approved')}
                                                                                                            className="btn me-3 btn-sm btn-success">Verify</button>

                                                                                                        <button
                                                                                                            onClick={() => this.verifyIdCard(user.ownerId._id, 'denied')}
                                                                                                            className="btn me-3 btn-sm btn-danger">Deny</button>
                                                                                                    </div>
                                                                                                ):(null)
                                                                                            }
                                                                                        </td>

                                                                                    </tr>
                                                                                )
                                                                            }
                                                                        })
                                                                    }
                                                                    </tbody>

                                                                </table>

                                                            </div>

                                                            <div className="tab-pane  fade" id="pills-approvedTwo" role="tabpanel"
                                                                 aria-labelledby="pills-profile-tab">
                                                                <div className="table-responsive">
                                                                    <table className="table table-striped table-hover font-xs d_table">
                                                                        <thead className="bg-warning">
                                                                        <th className="p-3 shadow-sm">S/N</th>
                                                                        <th className="p-3 shadow-sm">Username</th>
                                                                        <th className="p-3 shadow-sm">ID Card</th>
                                                                        <th className="p-3 shadow-sm">Status</th>
                                                                        <th className="p-3 shadow-sm">Date</th>
                                                                        <th className="p-3 shadow-sm">Options</th>
                                                                        </thead>
                                                                        <tbody>
                                                                        {
                                                                            this.state.verification.map((user,index) => {
                                                                                if(user.id_card.status === 'approved') {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td>{index}</td>
                                                                                            <td>{user.ownerId.username}</td>
                                                                                            <td><a target="_blank" href={user.id_card.url}>View Image</a></td>
                                                                                            <td>
                                                                                                {
                                                                                                    user.id_card.status === 'pending' ? (
                                                                                                        <span><i className="fa fa-circle text-warning"></i> Pending</span>
                                                                                                    ): user.id_card.status === 'approved' ? (
                                                                                                        <span><i className="fa fa-circle text-success"></i> Approved</span>
                                                                                                    ):(
                                                                                                        <span><i className="fa fa-circle text-danger"></i> Denied</span>
                                                                                                    )
                                                                                                }
                                                                                            </td>
                                                                                            <td>{moment(user.created).format('ddd MMM DD, YYYY')}</td>
                                                                                            <td>
                                                                                                {
                                                                                                    user.id_card.status === 'pending' ? (
                                                                                                        <div>
                                                                                                            <button
                                                                                                                onClick={() => this.verifyIdCard(user.ownerId._id, 'approved')}
                                                                                                                className="btn me-3 btn-sm btn-success">Verify</button>

                                                                                                            <button
                                                                                                                onClick={() => this.verifyIdCard(user.ownerId._id, 'denied')}
                                                                                                                className="btn me-3 btn-sm btn-danger">Deny</button>
                                                                                                        </div>
                                                                                                    ):(null)
                                                                                                }
                                                                                            </td>

                                                                                        </tr>
                                                                                    )
                                                                                }
                                                                            })
                                                                        }
                                                                        </tbody>

                                                                    </table>

                                                                </div>
                                                            </div>

                                                            <div className="tab-pane  fade" id="pills-deniedTwo" role="tabpanel"
                                                                 aria-labelledby="pills-profile-tab">
                                                                <div className="table-responsive">

                                                                    <table className="table table-striped table-hover font-xs d_table">
                                                                        <thead className="bg-warning">
                                                                        <th className="p-3 shadow-sm">S/N</th>
                                                                        <th className="p-3 shadow-sm">Username</th>
                                                                        <th className="p-3 shadow-sm">ID Card</th>
                                                                        <th className="p-3 shadow-sm">Status</th>
                                                                        <th className="p-3 shadow-sm">Date</th>
                                                                        <th className="p-3 shadow-sm">Options</th>
                                                                        </thead>
                                                                        <tbody>
                                                                        {
                                                                            this.state.verification.map((user,index) => {
                                                                                if(user.id_card.status === 'denied') {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td>{index}</td>
                                                                                            <td>{user.ownerId.username}</td>
                                                                                            <td><a target="_blank" href={user.id_card.url}>View Image</a></td>
                                                                                            <td>
                                                                                                {
                                                                                                    user.id_card.status === 'pending' ? (
                                                                                                        <span><i className="fa fa-circle text-warning"></i> Pending</span>
                                                                                                    ): user.id_card.status === 'approved' ? (
                                                                                                        <span><i className="fa fa-circle text-success"></i> Approved</span>
                                                                                                    ):(
                                                                                                        <span><i className="fa fa-circle text-danger"></i> Denied</span>
                                                                                                    )
                                                                                                }
                                                                                            </td>
                                                                                            <td>{moment(user.created).format('ddd MMM DD, YYYY')}</td>
                                                                                            <td>
                                                                                                {
                                                                                                    user.id_card.status === 'pending' ? (
                                                                                                        <div>
                                                                                                            <button
                                                                                                                onClick={() => this.verifyIdCard(user.ownerId._id, 'approved')}
                                                                                                                className="btn me-3 btn-sm btn-success">Verify</button>

                                                                                                        <button
                                                                                                            onClick={() => this.verifyIdCard(user.ownerId._id, 'denied')}
                                                                                                            className="btn me-3 btn-sm btn-danger">Deny</button>
                                                                                                        </div>
                                                                                                    ):(null)
                                                                                                }
                                                                                            </td>

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

                                    <div className="tab-pane fade table-responsive mt-4" id="pills-payment3" role="tabpanel"
                                         aria-labelledby="pills-profile-tab">

                                        <div className="accordion fancy_accordion" id="accordionExample">
                                            <div className="accordion-item trade_accordion">
                                                <div className="bg-primary accordion-header clearfix" id="headingThree">
                                                    <h4>Face Verification</h4>
                                                  

                                                    <ul className="nav nav-pills" id="pills-tabThree" role="tablist">
                                                        <li className="nav-item" role="presentation">
                                                            <a className="nav-link active" id="pills-home-tab" data-bs-toggle="pill"
                                                               href="#pills-pendingThree" role="tab" aria-controls="pills-home"
                                                               aria-selected="true">Pending</a>
                                                        </li>
                                                        <li className="nav-item" role="presentation">
                                                            <a className="nav-link" id="pills-profile-tab" data-bs-toggle="pill"
                                                               href="#pills-approvedThree" role="tab" aria-controls="pills-profile"
                                                               aria-selected="false">Approved</a>
                                                        </li>
                                                        <li className="nav-item" role="presentation">
                                                            <a className="nav-link" id="pills-profile-tab" data-bs-toggle="pill"
                                                               href="#pills-deniedThree" role="tab" aria-controls="pills-profile"
                                                               aria-selected="false">Denied</a>
                                                        </li>

                                                    </ul>

                                                </div>
                                                <div id="collapseThree" className="accordion-collapse collapse show"
                                                     aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                                    <div className="accordion-body">


                                                        <div className="tab-content" id="pills-tabContent">
                                                            <div className="tab-pane table-responsive fade show active" id="pills-pendingThree" role="tabpanel"
                                                                 aria-labelledby="pills-home-tab">

                                                                <table className="table table-striped table-hover font-xs d_table">
                                                                    <thead className="bg-warning">
                                                                    <th className="p-3 shadow-sm">S/N</th>
                                                                    <th className="p-3 shadow-sm">Username</th>
                                                                    <th className="p-3 shadow-sm">Face ID</th>
                                                                    <th className="p-3 shadow-sm">Status</th>
                                                                    <th className="p-3 shadow-sm">Date</th>
                                                                    <th className="p-3 shadow-sm">Options</th>
                                                                    </thead>
                                                                    <tbody>
                                                                    {
                                                                        this.state.verification.map((user,index) => {
                                                                            if(user.face_verification.status === 'pending') {
                                                                                return (
                                                                                    <tr>
                                                                                        <td>{index}</td>
                                                                                        <td>{user.ownerId.username}</td>
                                                                                        <td><a target="_blank" href={user.face_verification.url}>View Image</a></td>
                                                                                        <td>
                                                                                            {
                                                                                                user.face_verification.status === 'pending' ? (
                                                                                                    <span><i className="fa fa-circle text-warning"></i> Pending</span>
                                                                                                ): user.face_verification.status === 'approved' ? (
                                                                                                    <span><i className="fa fa-circle text-success"></i> Approved</span>
                                                                                                ):(
                                                                                                    <span><i className="fa fa-circle text-danger"></i> Denied</span>
                                                                                                )
                                                                                            }
                                                                                        </td>
                                                                                        <td>{moment(user.created).format('ddd MMM DD, YYYY')}</td>
                                                                                        <td>
                                                                                            {
                                                                                                user.face_verification.status === 'pending' ? (
                                                                                                    <div>
                                                                                                        <button
                                                                                                            onClick={() => this.verifyFace(user.ownerId._id, 'approved')}
                                                                                                            className="btn me-3 btn-sm btn-success">Verify</button>

                                                                                                        <button
                                                                                                            onClick={() => this.verifyFace(user.ownerId._id, 'denied')}
                                                                                                            className="btn me-3 btn-sm btn-danger">Deny</button>
                                                                                                    </div>
                                                                                                ):(null)
                                                                                            }
                                                                                        </td>

                                                                                    </tr>
                                                                                )
                                                                            }
                                                                        })
                                                                    }
                                                                    </tbody>

                                                                </table>

                                                            </div>

                                                            <div className="tab-pane  fade" id="pills-approvedThree" role="tabpanel"
                                                                 aria-labelledby="pills-profile-tab">
                                                                <div className="table-responsive">
                                                                    <table className="table table-striped table-hover font-xs d_table">
                                                                        <thead className="bg-warning">
                                                                        <th className="p-3 shadow-sm">S/N</th>
                                                                        <th className="p-3 shadow-sm">Username</th>
                                                                        <th className="p-3 shadow-sm">Face ID</th>
                                                                        <th className="p-3 shadow-sm">Status</th>
                                                                        <th className="p-3 shadow-sm">Date</th>
                                                                        <th className="p-3 shadow-sm">Options</th>
                                                                        </thead>
                                                                        <tbody>
                                                                        {
                                                                            this.state.verification.map((user,index) => {
                                                                                if(user.face_verification.status === 'approved') {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td>{index}</td>
                                                                                            <td>{user.ownerId.username}</td>
                                                                                            <td><a target="_blank" href={user.face_verification.url}>View Image</a></td>
                                                                                            <td>
                                                                                                {
                                                                                                    user.face_verification.status === 'pending' ? (
                                                                                                        <span><i className="fa fa-circle text-warning"></i> Pending</span>
                                                                                                    ): user.face_verification.status === 'approved' ? (
                                                                                                        <span><i className="fa fa-circle text-success"></i> Approved</span>
                                                                                                    ):(
                                                                                                        <span><i className="fa fa-circle text-danger"></i> Denied</span>
                                                                                                    )
                                                                                                }
                                                                                            </td>
                                                                                            <td>{moment(user.created).format('ddd MMM DD, YYYY')}</td>
                                                                                            <td>
                                                                                                {
                                                                                                    user.face_verification.status === 'pending' ? (
                                                                                                        <div>
                                                                                                            <button
                                                                                                                onClick={() => this.verifyFace(user.ownerId._id, 'approved')}
                                                                                                                className="btn me-3 btn-sm btn-success">Verify</button>

                                                                                                            <button
                                                                                                                onClick={() => this.verifyFace(user.ownerId._id, 'denied')}
                                                                                                                className="btn me-3 btn-sm btn-danger">Deny</button>
                                                                                                        </div>
                                                                                                    ):(null)
                                                                                                }
                                                                                            </td>

                                                                                        </tr>
                                                                                    )
                                                                                }
                                                                            })
                                                                        }
                                                                        </tbody>

                                                                    </table>

                                                                </div>
                                                            </div>

                                                            <div className="tab-pane  fade" id="pills-deniedThree" role="tabpanel"
                                                                 aria-labelledby="pills-profile-tab">
                                                                <div className="table-responsive">

                                                                    <table className="table table-striped table-hover font-xs d_table">
                                                                        <thead className="bg-warning">
                                                                        <th className="p-3 shadow-sm">S/N</th>
                                                                        <th className="p-3 shadow-sm">Username</th>
                                                                        <th className="p-3 shadow-sm">Face ID</th>
                                                                        <th className="p-3 shadow-sm">Status</th>
                                                                        <th className="p-3 shadow-sm">Date</th>
                                                                        <th className="p-3 shadow-sm">Options</th>
                                                                        </thead>
                                                                        <tbody>
                                                                        {
                                                                            this.state.verification.map((user,index) => {
                                                                                if(user.face_verification.status === 'denied') {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td>{index}</td>
                                                                                            <td>{user.ownerId.username}</td>
                                                                                            <td><a target="_blank" href={user.face_verification.url}>View Image</a></td>
                                                                                            <td>
                                                                                                {
                                                                                                    user.face_verification.status === 'pending' ? (
                                                                                                        <span><i className="fa fa-circle text-warning"></i> Pending</span>
                                                                                                    ): user.face_verification.status === 'approved' ? (
                                                                                                        <span><i className="fa fa-circle text-success"></i> Approved</span>
                                                                                                    ):(
                                                                                                        <span><i className="fa fa-circle text-danger"></i> Denied</span>
                                                                                                    )
                                                                                                }
                                                                                            </td>
                                                                                            <td>{moment(user.created).format('ddd MMM DD, YYYY')}</td>
                                                                                            <td>
                                                                                                {
                                                                                                    user.face_verification.status === 'pending' ? (
                                                                                                        <div>
                                                                                                            <button
                                                                                                                onClick={() => this.verifyFace(user.ownerId._id, 'approved')}
                                                                                                                className="btn me-3 btn-sm btn-success">Verify</button>

                                                                                                            <button
                                                                                                                onClick={() => this.verifyFace(user.ownerId._id, 'denied')}
                                                                                                                className="btn me-3 btn-sm btn-danger">Deny</button>
                                                                                                        </div>
                                                                                                    ):(null)
                                                                                                }
                                                                                            </td>

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

                                    <div className="tab-pane fade table-responsive mt-4" id="pills-payment4" role="tabpanel"
                                         aria-labelledby="pills-profile-tab">


                                        <div className="accordion fancy_accordion" id="accordionExample">
                                            <div className="accordion-item trade_accordion">
                                                <div className="bg-primary accordion-header clearfix" id="headingFour">
                                                    <h4>Address Verification</h4>


                                                    <ul className="nav nav-pills" id="pills-tabFour" role="tablist">
                                                        <li className="nav-item" role="presentation">
                                                            <a className="nav-link active" id="pills-home-tab" data-bs-toggle="pill"
                                                               href="#pills-pendingFour" role="tab" aria-controls="pills-home"
                                                               aria-selected="true">Pending</a>
                                                        </li>
                                                        <li className="nav-item" role="presentation">
                                                            <a className="nav-link" id="pills-profile-tab" data-bs-toggle="pill"
                                                               href="#pills-approvedFour" role="tab" aria-controls="pills-profile"
                                                               aria-selected="false">Approved</a>
                                                        </li>
                                                        <li className="nav-item" role="presentation">
                                                            <a className="nav-link" id="pills-profile-tab" data-bs-toggle="pill"
                                                               href="#pills-deniedFour" role="tab" aria-controls="pills-profile"
                                                               aria-selected="false">Denied</a>
                                                        </li>

                                                    </ul>

                                                </div>
                                                <div id="collapseFour" className="accordion-collapse collapse show"
                                                     aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                                                    <div className="accordion-body">


                                                        <div className="tab-content" id="pills-tabContent">
                                                            <div className="tab-pane table-responsive fade show active" id="pills-pendingFour" role="tabpanel"
                                                                 aria-labelledby="pills-home-tab">

                                                                <table className="table table-striped table-hover font-xs text-center d_table">
                                                                    <thead className="bg-warning">
                                                                    <th className="p-3 shadow-sm">S/N</th>
                                                                    <th className="p-3 shadow-sm">Username</th>
                                                                    <th className="p-3 shadow-sm">Address</th>
                                                                    <th className="p-3 shadow-sm">Status</th>
                                                                    <th className="p-3 shadow-sm">Date</th>
                                                                    <th className="p-3 shadow-sm">Options</th>
                                                                    </thead>
                                                                    <tbody>
                                                                    {
                                                                        this.state.verification.map((user,index) => {
                                                                            if(user.address_verification.status === 'pending') {
                                                                                return (
                                                                                    <tr>
                                                                                        <td>{index}</td>
                                                                                        <td>{user.ownerId.username}</td>
                                                                                        <td>{user.address_verification.name}</td>
                                                                                        <td>
                                                                                            {
                                                                                                user.address_verification.status === 'pending' ? (
                                                                                                    <span><i className="fa fa-circle text-warning"></i> Pending</span>
                                                                                                ): user.address_verification.status === 'approved' ? (
                                                                                                    <span><i className="fa fa-circle text-success"></i> Approved</span>
                                                                                                ):(
                                                                                                    <span><i className="fa fa-circle text-danger"></i> Denied</span>
                                                                                                )
                                                                                            }
                                                                                        </td>
                                                                                        <td>{moment(user.created).format('ddd MMM DD, YYYY')}</td>
                                                                                        <td>
                                                                                            {
                                                                                                user.address_verification.status === 'pending' ? (
                                                                                                    <div>
                                                                                                        <button
                                                                                                            onClick={() => this.verifyAddress(user.ownerId._id, 'approved')}
                                                                                                            className="btn me-3 btn-sm btn-success">Verify</button>

                                                                                                        <button
                                                                                                            onClick={() => this.verifyAddress(user.ownerId._id, 'denied')}
                                                                                                            className="btn me-3 btn-sm btn-danger">Deny</button>
                                                                                                    </div>
                                                                                                ):(null)
                                                                                            }
                                                                                        </td>

                                                                                    </tr>
                                                                                )
                                                                            }
                                                                        })
                                                                    }
                                                                    </tbody>

                                                                </table>

                                                            </div>

                                                            <div className="tab-pane  fade" id="pills-approvedFour" role="tabpanel"
                                                                 aria-labelledby="pills-profile-tab">
                                                                <div className="table-responsive">
                                                                    <table className="table table-striped table-hover font-xs text-center d_table">
                                                                        <thead className="bg-warning">
                                                                        <th className="p-3 shadow-sm">S/N</th>
                                                                        <th className="p-3 shadow-sm">Username</th>
                                                                        <th className="p-3 shadow-sm">Address</th>
                                                                        <th className="p-3 shadow-sm">Status</th>
                                                                        <th className="p-3 shadow-sm">Date</th>
                                                                        <th className="p-3 shadow-sm">Options</th>
                                                                        </thead>
                                                                        <tbody>
                                                                        {
                                                                            this.state.verification.map((user,index) => {
                                                                                if(user.address_verification.status === 'approved') {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td>{index}</td>
                                                                                            <td>{user.ownerId.username}</td>
                                                                                            <td>{user.address_verification.name}</td>
                                                                                            <td>
                                                                                                {
                                                                                                    user.address_verification.status === 'pending' ? (
                                                                                                        <span><i className="fa fa-circle text-warning"></i> Pending</span>
                                                                                                    ): user.address_verification.status === 'approved' ? (
                                                                                                        <span><i className="fa fa-circle text-success"></i> Approved</span>
                                                                                                    ):(
                                                                                                        <span><i className="fa fa-circle text-danger"></i> Denied</span>
                                                                                                    )
                                                                                                }
                                                                                            </td>
                                                                                            <td>{moment(user.created).format('ddd MMM DD, YYYY')}</td>
                                                                                            <td>
                                                                                                {
                                                                                                    user.address_verification.status === 'pending' ? (
                                                                                                        <div>
                                                                                                            <button
                                                                                                                onClick={() => this.verifyAddress(user.ownerId._id, 'approved')}
                                                                                                                className="btn me-3 btn-sm btn-success">Verify</button>

                                                                                                            <button
                                                                                                                onClick={() => this.verifyAddress(user.ownerId._id, 'denied')}
                                                                                                                className="btn me-3 btn-sm btn-danger">Deny</button>
                                                                                                        </div>
                                                                                                    ):(null)
                                                                                                }
                                                                                            </td>

                                                                                        </tr>
                                                                                    )
                                                                                }
                                                                            })
                                                                        }
                                                                        </tbody>

                                                                    </table>

                                                                </div>
                                                            </div>

                                                            <div className="tab-pane  fade" id="pills-deniedFour" role="tabpanel"
                                                                 aria-labelledby="pills-profile-tab">
                                                                <div className="table-responsive">

                                                                    <table className="table table-striped table-hover font-xs text-center d_table">
                                                                        <thead className="bg-warning">
                                                                        <th className="p-3 shadow-sm">S/N</th>
                                                                        <th className="p-3 shadow-sm">Username</th>
                                                                        <th className="p-3 shadow-sm">Address</th>
                                                                        <th className="p-3 shadow-sm">Status</th>
                                                                        <th className="p-3 shadow-sm">Date</th>
                                                                        <th className="p-3 shadow-sm">Options</th>
                                                                        </thead>
                                                                        <tbody>
                                                                        {
                                                                            this.state.verification.map((user,index) => {
                                                                                if(user.address_verification.status === 'denied') {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td>{index}</td>
                                                                                            <td>{user.ownerId.username}</td>
                                                                                            <td>{user.address_verification.name}</td>
                                                                                            <td>
                                                                                                {
                                                                                                    user.address_verification.status === 'pending' ? (
                                                                                                        <span><i className="fa fa-circle text-warning"></i> Pending</span>
                                                                                                    ): user.address_verification.status === 'approved' ? (
                                                                                                        <span><i className="fa fa-circle text-success"></i> Approved</span>
                                                                                                    ):(
                                                                                                        <span><i className="fa fa-circle text-danger"></i> Denied</span>
                                                                                                    )
                                                                                                }
                                                                                            </td>
                                                                                            <td>{moment(user.created).format('ddd MMM DD, YYYY')}</td>
                                                                                            <td>
                                                                                                {
                                                                                                    user.address_verification.status === 'pending' ? (
                                                                                                        <div>
                                                                                                            <button
                                                                                                                onClick={() => this.verifyAddress(user.ownerId._id, 'approved')}
                                                                                                                className="btn me-3 btn-sm btn-success">Verify</button>

                                                                                                            <button
                                                                                                                onClick={() => this.verifyAddress(user.ownerId._id, 'denied')}
                                                                                                                className="btn me-3 btn-sm btn-danger">Deny</button>
                                                                                                        </div>
                                                                                                    ):(null)
                                                                                                }
                                                                                            </td>

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


                            </div>



                        </div>

                    )}
                </section>






            </Dashboard_Layout>
        )
    }

}


