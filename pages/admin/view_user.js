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
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import { Facebook as Loader } from 'react-content-loader';
import Countdown from "react-countdown";
import createSale from "../trade/create_sale";
import viewTrade from "../trade/view_trade";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useRouter} from "next/router";
import DataTable from "react-data-table-component";
import * as Tables from "../../components/common/tables";
import Big from "big.js";
var QRCode = require('qrcode.react');


export default function viewUser(props) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState([]);
    const [advert, setAdvert] = useState([]);
    const [incomingPayment, setIncomingPayment] = useState([]);
    const [outgoingPayment, setOutgoingPayment] = useState([]);
    const [payment_count, setPaymentCount] = useState([]);
    const [activeSales, setActiveSales] = useState([]);
    const [comment, setComment] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [incoming_payment_count, setIncomingPaymentCount] = useState([]);
    const [bid, setBid] = useState([]);
    const router = useRouter();
    const id = router.query['us'];
    const assets = ls.get('assets');





    if (id) {
        if(user.length === 0) {
            fetch(Api.admin_users + '/' + id ,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + Session.token
                    }
                }).then((res) => res.json())
                .then((response109) => {
                    console.log(response109.data);
                    setUser(response109.data);
                    setLoading(false);

                })

        }
    }

    function fetchAdverts()
    {
        fetch(Api.admin_user_advert + '/' + id ,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response1) => {
                //console.log(response1);
                setAdvert(response1.data);

                fetch(Api.admin_user_bid_history + '/' + id ,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + Session.token
                        }
                    }).then((res) => res.json())
                    .then((response12) => {
                        // console.log(response12);
                        setBid(response12.data);

                        fetch(Api.adminFetchOutgoingPayments + '/' + id,
                            {
                                method: 'GET',
                                headers: {
                                    'Authorization': 'Bearer ' + Session.token
                                }
                            }).then((res) => res.json())
                            .then((response109) => {
                                console.log(response109);
                                setOutgoingPayment(response109.data.reverse());

                                var counter = 0
                                for(var i = 0; i < response109.data.length; i++)
                                {
                                    if(response109.data[i].payment == 'awaitingPayment' || response109.data[i].payment == 'awaitingConfirmation')
                                    {
                                        counter = counter + 1;
                                    }
                                }
                                setPaymentCount(counter);

                            })


                        fetch(Api.adminFetchIncomingPayments + '/' + id,
                            {
                                method: 'GET',
                                headers: {
                                    'Authorization': 'Bearer ' + Session.token
                                }
                            }).then((res) => res.json())
                            .then((response110) => {
                                console.log(response110);

                                setIncomingPayment(response110.data.reverse());

                                var counter2 = 0
                                for(var i = 0; i < response110.data.length; i++)
                                {
                                    if(response110.data[i].payment == 'awaitingPayment' || response110.data[i].payment == 'awaitingConfirmation')
                                    {
                                        counter2 = counter2 + 1;
                                    }
                                }

                                setIncomingPaymentCount(counter2);
                                setLoading(false);
                            })


                    })


            })

    }

    function fetchActiveSales()
    {
        fetch(Api.adminFetchActiveSales + '/' + id + '?expired=false' ,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((responseSales) => {
                //console.log(responseSales);
                setActiveSales(responseSales.data);
                setLoading(false);

            })
    }

    function fetchTransactions()
    {
        fetch(Api.adminFetchTransactions + '/' + id ,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((responseTrans) => {
                //console.log(responseTrans);
                setTransactions(responseTrans.data);
                setLoading(false);

            })
    }

    const handleChange = e =>
        setComment(e.target.value);

    function disableUser()
    {

        try {

        NProgress.start();
        NProgress.inc();
        NProgress.configure({ ease: 'ease', speed: 500 });

        //console.log(Api.disableUserRequest);
        fetch(Api.disableUserRequest,
            {
                method: 'POST',
                body : JSON.stringify({
                    userId : id,
                    comment : comment
                }),
                headers: {
                    Authorization : 'Bearer ' + Session.token,
                    'Content-type': 'application/json',
                    'ip' : ls.get('ip'),
                    'device' : ls.get('device'),
                }
            }).then((res) => res.json())
            .then((responseFive) => {
                NProgress.done();
                //console.log(responseFive);

                Swal.fire({
                    title: 'Success!',
                    text: responseFive.msg,
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });

                window.location.reload();
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
    }

    function enableUser()
    {

        try {

            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            //console.log(Api.disableUserRequest);
            fetch(Api.enableUserRequest,
                {
                    method: 'POST',
                    body : JSON.stringify({
                        userId : id,
                        comment : comment
                    }),
                    headers: {
                        Authorization : 'Bearer ' + Session.token,
                        'Content-type': 'application/json',
                        'ip' : ls.get('ip'),
                        'device' : ls.get('device'),
                    }
                }).then((res) => res.json())
                .then((responseFive) => {
                    NProgress.done();
                    //console.log(responseFive);

                    Swal.fire({
                        title: 'Success!',
                        text: responseFive.msg,
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    });

                    window.location.reload();
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
    }

    useEffect(() =>
    {



    }, []);



    return(
            <Dashboard_Layout title="Users">

                <section className="col-lg-12 mx-auto">

                    {loading ? (
                        <div className="row ">

                            <div className="col-lg-10 mx-auto">
                                <div className="row">

                                    <Skeleton height="200px" className="mb-4"/>
                                    <Skeleton height="200px" className="mb-4"/>
                                    <Skeleton height="200px" className="mb-4"/>
                                    <Skeleton height="200px" className="mb-4"/>
                                </div>

                            </div>

                        </div>
                    ):(

                        <div className="">

                            <div className="row">



                                <div className="col-lg-10 mx-auto">

                                    <div className="border_radius  border">
                                        <div className="border_bottom p-3">

                                            <div className="float-end">
                                            {
                                                user.userProfile.status === true ?(
                                                    <button className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#statusRequest"><i className="fa fa-window-close"></i> Deactivate User</button>
                                                ):(
                                                    <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#statusRequest"><i className="fa fa-window-close"></i> Activate User</button>
                                                )
                                            }
                                            </div>

                                            <h1 className="m-0 text-capitalize">{user.userProfile.username}
                                                {
                                                    user.userProfile.verified === true ?(
                                                        <i className="fa fa-check-circle text-success"></i>
                                                    ):(
                                                        null
                                                    )
                                                }
                                            </h1>


                                        </div>

                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item">
                                                <span className="float-end text-end col-6">{user.userProfile.email}</span>
                                                <b>Email</b>
                                            </li>
                                            <li className="list-group-item">
                                                <span className="float-end text-end col-6">
                                                    {
                                                        user.userProfile.verified === false ?(
                                                            <span className="text-danger">No</span>
                                                        ):(
                                                            <span className="text-success">Yes</span>
                                                        )
                                                    }
                                                </span>
                                                <b>Verified</b>
                                            </li>
                                            <li className="list-group-item">
                                                 <span className="float-end text-end col-6">
                                                    {
                                                        user.userProfile.verifiedEmail === false ?(
                                                            <span className="text-danger">No</span>
                                                        ):(
                                                            <span className="text-success">Yes</span>
                                                        )
                                                    }
                                                </span>
                                                <b>Email Verification</b>
                                            </li>
                                            <li className="list-group-item">
                                                 <span className="float-end text-end col-6">
                                                    {
                                                        user.userProfile.verifiedPhone === false ?(
                                                            <span className="text-danger">No</span>
                                                        ):(
                                                            <span className="text-success">Yes</span>
                                                        )
                                                    }
                                                </span>
                                                <b>Phone Verification</b>
                                            </li>
                                        </ul>


                                    </div>


                                    {/* Identity verification */}
                                    <div className="mt-4 border">
                                    <h5 className="p-3 bg-primary text-uppercase font-weight-700">Identity Verification</h5>

                                    <ul className="list-group m-3">
                                        <li className="list-group-item">
                                      <span className="float-end text-end col-6">
                                                    {
                                                        user.userIdentity ?(
                                                        user.userIdentity.bvn.status === 'denied' ? (
                                                            <span className="text-danger">Denied</span>
                                                        ) : user.userIdentity.bvn.status === 'approved' ? (
                                                            <span className="text-success">Approved</span>
                                                        ):(
                                                            <span className="">Not Submitted</span>
                                                        )
                                                        ):(null)
                                                    }
                                                </span>
                                            <b>BVN</b>
                                        </li>
                                        <li className="list-group-item">
                                      <span className="float-end text-end col-6">
                                                    {
                                                        user.userIdentity ?(
                                                        user.userIdentity.id_card.status === 'denied' ? (
                                                            <span className="text-danger">Denied</span>
                                                        ) : user.userIdentity.bvn.status === 'approved' ? (
                                                            <span className="text-success">Approved</span>
                                                        ):(
                                                            <span className="">Not Submitted</span>
                                                        )
                                                        ):(null)
                                                    }
                                                </span>
                                            <b>ID Card</b>
                                        </li>
                                        <li className="list-group-item">
                                      <span className="float-end text-end col-6">
                                                    {
                                                        user.userIdentity ?(
                                                        user.userIdentity.address_verification.status === 'denied' ? (
                                                            <span className="text-danger">Denied</span>
                                                        ) : user.userIdentity.bvn.status === 'approved' ? (
                                                            <span className="text-success">Approved</span>
                                                        ):(
                                                            <span className="">Not Submitted</span>
                                                        )
                                                        ):(null)
                                                    }
                                                </span>
                                            <b>Address Verification</b>
                                        </li>
                                        <li className="list-group-item">
                                      <span className="float-end text-end col-6">
                                                    {
                                                        user.userIdentity ?(
                                                        user.userIdentity.face_verification.status === 'denied' ? (
                                                            <span className="text-danger">Denied</span>
                                                        ) : user.userIdentity.bvn.status === 'approved' ? (
                                                            <span className="text-success">Approved</span>
                                                        ):(
                                                            <span className="">Not Submitted</span>
                                                        )
                                                        ):(null)
                                                    }
                                                </span>
                                            <b>Face Verification</b>
                                        </li>

                                    </ul>
                                    </div>


                                    {/* User Wallet */}
                                    <div className="mt-4 border">
                                        <h5 className="p-3 bg-primary text-uppercase font-weight-700">User Wallets</h5>
                                        <div className="border_radius m-3 ">
                                            <div className="row">
                                                {
                                                    user.userWallets.data.length >= 1 ? (
                                                        assets.map((asset, index) => {
                                                            let count_wallet = 0;
                                                            return (

                                                                <div className="col-sm-6 col-xl-4">

                                                                    {
                                                                        user.userWallets.data.map((wallet,index) => {

                                                                            wallet.availableBalance = wallet.balance;

                                                                            let new_wallet_addr;



                                                                            if(wallet.asset === asset.abbr.toLowerCase())
                                                                            {
                                                                                count_wallet = 1;

                                                                                return(

                                                                                    <div className="bg-white wallet_card mb-3">

                                                                                        <div className="px-4 py-3 clearfix">
                                                                                            <div className="float-end text-center">
                                                                                                <QRCode value={wallet.address[0]} size={64} />

                                                                                            </div>

                                                                                            <img src={asset.icon} width="40" className="" />

                                                                                            <div className="mt-3 mb-2">

                                                                                                <h5 className="text-uppercase font-sm-3 fw-bold m-0">{asset.name}</h5>
                                                                                                {/*<p className="m-0 wallet_address text-wrap text-capitalize">{wallet.address}</p>*/}
                                                                                                {/*<a href='#' className="float-end" onClick={() => {navigator.clipboard.writeText(wallet.address), Swal.fire('Copied','')}}>Copy wallet address</a>*/}
                                                                                            </div>

                                                                                        </div>

                                                                                        <div className="card_bottom border_top px-4 py-3">
                                                                                            <img src={'/valor_icon.png'} width="30" className="float-end" />
                                                                                            <p className="font-xs fw-2 m-0 text-uppercase">Wallet balance</p>
                                                                                            <p className="balance_text m-0 fs-5 fw-bold text-success">{Big(wallet.availableBalance).toFixed(5)} {wallet.asset.toUpperCase()} ~ ${(asset.rate * wallet.availableBalance).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                                                            {/*<p className="font-xs m-0">{wallet.totalBalance.toFixed(5)} {wallet.asset.toUpperCase()} ~ ${(asset.rate * wallet.totalBalance).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>*/}

                                                                                        </div>
                                                                                    </div>

                                                                                )
                                                                            }
                                                                        })
                                                                    }

                                                                    {
                                                                        count_wallet === 0 ? (
                                                                            <div className="wallet_card bg-white mb-3">
                                                                                <div className="p-5 text-center lead clearfix">

                                                                                    <img src={asset.icon} width="60" className="" />
                                                                                    <h6 className="text-primary text-uppercase font-sm-2 fw-bold m-0">{asset.name}</h6>
                                                                                    <p className="m-0">Wallet not found</p>



                                                                                </div>
                                                                            </div>
                                                                        ):(null)
                                                                    }


                                                                </div>




                                                            )
                                                        })
                                                    ):(
                                                        <div className="lead text-center bg-gray p-4 border_radius">
                                                            No wallet Available
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>


                                    {/* Advert history */}
                                    <div className="accordion fancy_accordion mt-5" id="accordionExample2">
                                        <div className="accordion-item trade_accordion">
                                            <div className="bg-primary accordion-header clearfix" id="headingOne">
                                                <button onClick={() => fetchAdverts()} className="float-end collapsed d-none d-lg-flex accordion-button" type="button" data-bs-toggle="collapse"
                                                        data-bs-target="#collapseDash" aria-expanded="true" aria-controls="collapseDash">
                                                </button>

                                                <ul className="nav nav-pills" id="pills-tab" role="tablist">

                                                    <li className="nav-item" role="presentation">
                                                        <a className="nav-link active" id="pills-profile-tab" data-bs-toggle="pill"
                                                           href="#pills-bids3" role="tab" aria-controls="pills-bids"
                                                           aria-selected="false">Bid History</a>
                                                    </li>

                                                    <li className="nav-item" role="presentation">
                                                        <a className="nav-link " id="pills-profile-tab" data-bs-toggle="pill"
                                                           href="#pills-advert3" role="tab" aria-controls="pills-profile"
                                                           aria-selected="false">Advert History</a>
                                                    </li>

                                                    <li className="nav-item" role="presentation">
                                                        <a className="nav-link" id="pills-profile-tab" data-bs-toggle="pill"
                                                           href="#pills-payment3" role="tab" aria-controls="pills-payment"
                                                           aria-selected="false">Payments <badge className="badge bg-danger">{payment_count + incoming_payment_count}</badge></a>
                                                    </li>

                                                </ul>

                                            </div>
                                            <div id="collapseDash" className="accordion-collapse "
                                                 aria-labelledby="headingOne" data-bs-parent="#accordionExample2">
                                                <div className="accordion-body">


                                                    <div className="tab-content" id="pills-tabContent">
                                                        <div className="tab-pane fade show active" id="pills-bids3" role="tabpanel"
                                                             aria-labelledby="pills-home-tab">

                                                            <div className="d-none d-lg-block">
                                                                <DataTable
                                                                    className="data_table_minimized"
                                                                    data={bid}
                                                                    columns={Tables.bidHistoryColumns}
                                                                    striped={true}
                                                                    hover={true}
                                                                    responsive={true}
                                                                    pagination={true}
                                                                    fixedHeader={true}
                                                                    noHeader={true}
                                                                    keyField='id'
                                                                />
                                                            </div>

                                                            <div className="d-lg-none d-block">
                                                                <DataTable
                                                                    className="data_table_minimized"
                                                                    data={bid}
                                                                    columns={Tables.bidHistoryColumnsMobile}
                                                                    responsive={true}
                                                                    pagination={true}
                                                                    fixedHeader={true}
                                                                    noHeader={true}
                                                                    keyField='id'
                                                                />
                                                            </div>

                                                        </div>

                                                        <div className="tab-pane fade " id="pills-advert3" role="tabpanel"
                                                             aria-labelledby="pills-home-tab">

                                                            <div className="d-none d-lg-block">
                                                                <DataTable
                                                                    className="data_table_minimized"
                                                                    data={advert}
                                                                    columns={Tables.advertHistoryColumns}
                                                                    striped={true}
                                                                    hover={true}
                                                                    responsive={true}
                                                                    pagination={true}
                                                                    fixedHeader={true}
                                                                    noHeader={true}
                                                                    keyField='id'
                                                                />
                                                            </div>

                                                            <div className="d-lg-none d-block">
                                                                <div className="bg-danger border font-xs text-center font-white mb-2 p-2"><i className="fa fa-info-circle"></i> Select a trade to view</div>
                                                                <DataTable
                                                                    className="data_table_minimized"
                                                                    data={advert}
                                                                    columns={Tables.advertHistoryColumnsMobile}
                                                                    responsive={true}
                                                                    pagination={true}
                                                                    noHeader={true}
                                                                    keyField='id'
                                                                />
                                                            </div>


                                                        </div>

                                                        <div className="tab-pane fade" id="pills-payment3" role="tabpanel"
                                                             aria-labelledby="pills-profile-tab">

                                                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                                                <li className="nav-item" role="presentation">
                                                                    <a className="nav-link active" id="home-tab"
                                                                       data-bs-toggle="tab" href="#home" role="tab"
                                                                       aria-controls="home" aria-selected="true">Incoming <badge className="badge bg-danger">{incoming_payment_count}</badge></a>
                                                                </li>
                                                                <li className="nav-item" role="presentation">
                                                                    <a className="nav-link" id="profile-tab" data-bs-toggle="tab"
                                                                       href="#profile" role="tab" aria-controls="profile"
                                                                       aria-selected="false">Outgoing <badge className="badge bg-danger">{payment_count}</badge></a>
                                                                </li>

                                                            </ul>
                                                            <div className="tab-content border no_border-top" id="myTabContent">
                                                                <div className="tab-pane fade p-3 show active" id="home" role="tabpanel"
                                                                     aria-labelledby="home-tab">

                                                                    <div className="d-none d-lg-block table-responsive">
                                                                        <table className="table font-xs text-center table-striped d_table table-hover">
                                                                            <thead>
                                                                            <tr>
                                                                                <th>Buyer</th>
                                                                                {/*<th>Buyer</th>*/}
                                                                                <th>Date</th>
                                                                                <th>Asset</th>
                                                                                <th>Quantity</th>
                                                                                <th>Value($)</th>
                                                                                <th>Accepted Price(N/$)</th>
                                                                                <th>Total Price(N)</th>
                                                                                <th>Status</th>
                                                                            </tr>
                                                                            </thead>
                                                                            <tbody>

                                                                            {
                                                                               incomingPayment.map((pay,index) => {
                                                                                    if(pay.payment !== 'inactive' && pay.payment !== 'failed') {
                                                                                        let listAsset;
                                                                                        let count = Session.assets.length;

                                                                                        for (let i = 0; i < count; i++) {
                                                                                            let data = Session.assets[i];

                                                                                            if (pay.asset.toUpperCase() === data.abbr) {
                                                                                                listAsset = data;
                                                                                            }


                                                                                        }

                                                                                        return (
                                                                                            <tr>
                                                                                                <td>

                                                                                                    {pay.ownerId.username}
                                                                                                    {
                                                                                                        pay.ownerId.verified === true ? (
                                                                                                            <i className="fa fa-check-circle text-success"></i>
                                                                                                        ) : (<span></span>)
                                                                                                    }
                                                                                                </td>
                                                                                                {/*<td>{pay.advertId}</td>*/}
                                                                                                <td>{moment(pay.created).format('MMM DD, YYYY H:m:s')}</td>
                                                                                                <td>{pay.asset.toUpperCase()}</td>
                                                                                                <td>{pay.amount.toFixed(5)}</td>
                                                                                                <td>{(pay.amount * listAsset.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                                                                                <td>{pay.rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                                                                                <td>{(pay.rate * (pay.amount * listAsset.rate)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                                                                                <td>{
                                                                                                    pay.payment === 'awaitingPayment' ? (
                                                                                                        <span><i
                                                                                                            className="fa fa-circle text-warning"></i> Awaiting Payment</span>
                                                                                                    ) : pay.payment === 'awaitingConfirmation' || pay.payment === 'awaitingConfimation' ? (
                                                                                                        <span><i
                                                                                                            className="fa fa-circle text-info"></i> Awaiting Confirmation</span>
                                                                                                    ) : pay.payment === 'completed' ? (
                                                                                                        <span><i
                                                                                                            className="fa fa-circle text-success"></i> Completed</span>
                                                                                                    ) : (
                                                                                                        <span>{pay.payment}</span>)
                                                                                                }</td>

                                                                                            </tr>
                                                                                        )

                                                                                    }
                                                                                })
                                                                            }


                                                                            </tbody>
                                                                        </table>
                                                                    </div>

                                                                    <div className="d-lg-none d-block">
                                                                        {
                                                                            incomingPayment.map((pay,index) => {
                                                                                if(pay.payment !== 'inactive' && pay.payment !== 'failed') {
                                                                                    let listAsset;
                                                                                    let count = Session.assets.length;

                                                                                    for (let i = 0; i < count; i++) {
                                                                                        let data = Session.assets[i];

                                                                                        if (pay.asset.toUpperCase() === data.abbr) {
                                                                                            listAsset = data;
                                                                                        }


                                                                                    }

                                                                                    return (

                                                                                        <div className="border p-3 border_radius mb-2 shadow-sm">
                                                                                            <div className="row">
                                                                                                <div className="col-7">
                                                                                                    <h5 className="m-0">
                                                                                                        ₦{(pay.rate * (pay.amount * listAsset.rate)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                                                    </h5>
                                                                                                    <p className="m-0 font-xs">{pay.amount.toFixed(5)} {pay.asset.toUpperCase()} <i className="fas text-success fa-exchange-alt"></i> ${(pay.amount * listAsset.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                                                                    <p className="m-0 font-xs">$1 = ₦{pay.rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                                                                    <p className="m-0 font-xs text-capitalize font-gray"><badge className="badge bg-success">Payment From:</badge> {pay.ownerId.username}</p>
                                                                                                </div>
                                                                                                <div className="col-5">
                                                                                                    <span className="font-xs"><i className="fa fa-clock"></i> {moment(pay.created).format('MMM DD, YYYY H:m:s')}</span>
                                                                                                    <br/>
                                                                                                    {
                                                                                                        pay.payment === 'awaitingPayment' ? (
                                                                                                            <span className="font-xs"><i
                                                                                                                className="fa fa-circle text-warning"></i> Awaiting Payment</span>
                                                                                                        ) : pay.payment === 'awaitingConfirmation' || pay.payment === 'awaitingConfimation' ? (
                                                                                                            <span className="font-xs"><i
                                                                                                                className="fa fa-circle text-info"></i> Awaiting Confirmation</span>
                                                                                                        ) : pay.payment === 'completed' ? (
                                                                                                            <span className="font-xs"><i
                                                                                                                className="fa fa-circle text-success"></i> Completed</span>
                                                                                                        ) : (
                                                                                                            <span>{pay.payment}</span>)
                                                                                                    }
                                                                                                </div>


                                                                                            </div>

                                                                                        </div>



                                                                                    )

                                                                                }
                                                                            })
                                                                        }
                                                                    </div>
                                                                </div>

                                                                <div className="tab-pane fade  p-3" id="profile" role="tabpanel"
                                                                     aria-labelledby="profile-tab">

                                                                    <div className="d-none d-lg-block table-responsive">
                                                                        <table className="table font-xs text-center table-striped d_table table-hover">
                                                                            <thead>
                                                                            <tr>
                                                                                <th>Seller</th>
                                                                                {/*<th>Buyer</th>*/}
                                                                                <th>Date</th>
                                                                                <th>Asset</th>
                                                                                <th>Quantity</th>
                                                                                <th>Value($)</th>
                                                                                <th>Accepted Price(N/$)</th>
                                                                                <th>Total Price(N)</th>
                                                                                <th>Status</th>
                                                                            </tr>
                                                                            </thead>
                                                                            <tbody>

                                                                            {
                                                                                outgoingPayment.map((pay,index) => {
                                                                                    if(pay.payment !== 'inactive' && pay.payment !== 'failed') {
                                                                                        let listAsset;
                                                                                        let count = Session.assets.length;

                                                                                        for (let i = 0; i < count; i++) {
                                                                                            let data = Session.assets[i];

                                                                                            if (pay.asset.toUpperCase() === data.abbr) {
                                                                                                listAsset = data;
                                                                                            }


                                                                                        }

                                                                                        return (
                                                                                            <tr>
                                                                                                <td>
                                                                                                    {pay.sellerId.username}
                                                                                                    {
                                                                                                        pay.sellerId.verified === true ? (
                                                                                                            <i className="fa fa-fw fa-check-circle text-success"></i>
                                                                                                        ) : (
                                                                                                            <span></span>)
                                                                                                    }
                                                                                                </td>
                                                                                                {/*<td>{pay.advertId}</td>*/}
                                                                                                <td>{moment(pay.created).format('MMM DD, YYYY H:m:s')}</td>
                                                                                                <td>{pay.asset.toUpperCase()}</td>
                                                                                                <td>{pay.amount.toFixed(5)}</td>
                                                                                                <td>{(pay.amount * listAsset.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                                                                                <td>{pay.rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                                                                                <td>{(pay.rate * (pay.amount * listAsset.rate)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                                                                                <td>{
                                                                                                    pay.payment === 'awaitingPayment' ? (
                                                                                                        <span><i
                                                                                                            className="fa fa-circle text-warning"></i> Awaiting Payment</span>
                                                                                                    ) : pay.payment === 'awaitingConfirmation' || pay.payment === 'awaitingConfimation' ? (
                                                                                                        <span><i
                                                                                                            className="fa fa-circle text-info"></i> Awaiting Confirmation</span>
                                                                                                    ) : pay.payment === 'completed' ? (
                                                                                                        <span><i
                                                                                                            className="fa fa-circle text-success"></i> Completed</span>
                                                                                                    ) : (
                                                                                                        <span>{pay.payment}</span>)
                                                                                                }</td>

                                                                                            </tr>
                                                                                        )

                                                                                    }
                                                                                })
                                                                            }


                                                                            </tbody>
                                                                        </table>
                                                                    </div>

                                                                    <div className="d-lg-none d-block ">

                                                                        {
                                                                            outgoingPayment.map((pay,index) => {
                                                                                if(pay.payment !== 'inactive' && pay.payment !== 'failed') {
                                                                                    let listAsset;
                                                                                    let count = Session.assets.length;

                                                                                    for (let i = 0; i < count; i++) {
                                                                                        let data = Session.assets[i];

                                                                                        if (pay.asset.toUpperCase() === data.abbr) {
                                                                                            listAsset = data;
                                                                                        }


                                                                                    }

                                                                                    return (

                                                                                        <div className="border p-3 border_radius mb-2 shadow-sm">
                                                                                            <div className="row">
                                                                                                <div className="col-8">
                                                                                                    <h5 className="m-0">
                                                                                                        ₦{(pay.rate * (pay.amount * listAsset.rate)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                                                    </h5>
                                                                                                    <p className="m-0 font-xs">{pay.amount.toFixed(5)} {pay.asset.toUpperCase()} <i className="fas text-success fa-exchange-alt"></i> ${(pay.amount * listAsset.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                                                                    <p className="m-0 font-xs">$1 = ₦{pay.rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                                                                    <p className="m-0 font-xs text-capitalize font-gray"><badge className="badge bg-success">Pay To:</badge> {pay.sellerId.username}{
                                                                                                        pay.sellerId.verified === true ? (
                                                                                                            <i className="fa fa-fw fa-check-circle text-success"></i>
                                                                                                        ) : (
                                                                                                            <span></span>)
                                                                                                    }</p>
                                                                                                </div>
                                                                                                <div className="col-4">
                                                                                                    <span className="font-xs"><i className="fa fa-clock"></i> {moment(pay.created).format('MMM DD, YYYY H:m:s')}</span>
                                                                                                    <br/>
                                                                                                    {
                                                                                                        pay.payment === 'awaitingPayment' ? (
                                                                                                            <span className="font-xs"><i
                                                                                                                className="fa fa-circle text-warning"></i> Awaiting Payment</span>
                                                                                                        ) : pay.payment === 'awaitingConfirmation' || pay.payment === 'awaitingConfimation' ? (
                                                                                                            <span className="font-xs"><i
                                                                                                                className="fa fa-circle text-info"></i> Awaiting Confirmation</span>
                                                                                                        ) : pay.payment === 'completed' ? (
                                                                                                            <span className="font-xs"><i
                                                                                                                className="fa fa-circle text-success"></i> Completed</span>
                                                                                                        ) : (
                                                                                                            <span>{pay.payment}</span>)
                                                                                                    }
                                                                                                </div>


                                                                                            </div>

                                                                                        </div>

                                                                                    )

                                                                                }
                                                                            })
                                                                        }

                                                                    </div>
                                                                </div>

                                                            </div>



                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                    </div>


                                    {/* Active Sales */}
                                    <div className="accordion fancy_accordion mt-5" id="accordionExample3">
                                        <div className="accordion-item trade_accordion">
                                            <div className="bg-primary accordion-header clearfix" id="headingTwo">
                                                <button onClick={() => fetchActiveSales()} className="float-end collapsed d-none d-lg-flex accordion-button" type="button" data-bs-toggle="collapse"
                                                        data-bs-target="#collapseDash2" aria-expanded="true" aria-controls="collapseDash">
                                                </button>

                                               <h5 className="m-2 bg-primary text-uppercase font-weight-700">Active Sales {
                                                       activeSales.length >= 1 ?(
                                                           <badge className="badge font-xs bg-danger">{activeSales.length}</badge>
                                                       ):(null)
                                                   }</h5>

                                            </div>
                                            <div id="collapseDash2" className="accordion-collapse collapse"
                                                 aria-labelledby="headingTwo" data-bs-parent="#accordionExample3">
                                                <div className="accordion-body">

                                                    <div className="d-none d-lg-block table-responsive">
                                                        <table className="table font-xs text-center table-striped d_table table-hover">
                                                            <thead>
                                                            <tr>
                                                                <th>S/N</th>
                                                                <th>Asset</th>
                                                                <th>Quantity</th>
                                                                <th>Value($)</th>
                                                                <th className="d-none d-md-table-cell">Top Bid (N/$)</th>
                                                                <th className="d-none d-md-table-cell">Total Price (&#8358;)</th>
                                                                <th>Time Left</th>
                                                                <th>Action</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {
                                                                activeSales.length >= 1 ? (
                                                                    activeSales.map((trade,index) => {

                                                                        let listAsset;
                                                                        let count = Session.assets.length;

                                                                        for(let i = 0; i < count; i++)
                                                                        {
                                                                            let data = Session.assets[i];

                                                                            if (trade.asset.toUpperCase() === data.abbr) {
                                                                                listAsset = data;
                                                                            }


                                                                        }

                                                                        return (
                                                                            <tr>
                                                                                <td>{index + 1}</td>
                                                                                <td>{trade.asset.toUpperCase()}</td>
                                                                                <td>{trade.amount.toFixed(5)} {
                                                                                    trade.partBid === true ? (
                                                                                        <sup className='fw-bold text-warning'>P</sup>
                                                                                    ):(
                                                                                        <sup className='fw-bold text-success'>F</sup>
                                                                                    )
                                                                                }</td>
                                                                                <td>{(trade.balance * listAsset.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                                                                <td className="d-none d-md-table-cell">{
                                                                                    trade.highestBid === null ? (
                                                                                        <span>N/A</span>
                                                                                    ):(
                                                                                        trade.highestBid.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                                                    )
                                                                                }</td>
                                                                                <td className="d-none d-md-table-cell">
                                                                                    {
                                                                                        trade.highestBid === null ? (
                                                                                            <span>N/A</span>
                                                                                        ):(
                                                                                            (trade.highestBid * (trade.amount * listAsset.rate)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                                                        )
                                                                                    }
                                                                                </td>


                                                                                <td><Countdown date={Date.parse(trade.expiringTime)} /></td>
                                                                                <td>
                                                                                    <Link href={"/trade/view?advert=" + trade._id}><button className="btn btn-sm btn-warning">View</button></Link></td>
                                                                            </tr>
                                                                        )
                                                                    })

                                                                ):(
                                                                    <tr>
                                                                        <td colSpan="12" className="p-5 lead fw-bold">No Active Sales
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            }


                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    <div className="d-block d-lg-none">
                                                        <div className="bg-gray border font-xs text-center border_radius mb-2 p-2"><i className="fa fa-info-circle"></i> Select a trade to view</div>
                                                        {
                                                            activeSales.length >= 1 ? (
                                                                activeSales.map((trade,index) => {

                                                                    let listAsset;
                                                                    let count = Session.assets.length;

                                                                    for(let i = 0; i < count; i++)
                                                                    {
                                                                        let data = Session.assets[i];

                                                                        if (trade.asset.toUpperCase() === data.abbr) {
                                                                            listAsset = data;
                                                                        }


                                                                    }

                                                                    return (

                                                                        <div className="border p-3 border_radius mb-2 shadow-sm" onClick={() => {
                                                                            this.setState({
                                                                                tradeRoute: 'viewSale',
                                                                                tradeValue: trade._id,
                                                                                mobileView: true
                                                                            })
                                                                        }}>

                                                                            <div className="row">
                                                                                <div className="col-8">
                                                                                    <h6 className="m-0">
                                                                                        {trade.balance.toFixed(5)} {trade.asset.toUpperCase()} <i className="fas text-success fa-exchange-alt"></i> ${(trade.balance * listAsset.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                                    </h6>
                                                                                    <p className="m-0 font-xs text-capitalize font-gray"><badge className="badge font-black bg-primary">Seller:</badge> {trade.ownerId.username}</p>
                                                                                </div>
                                                                                <div className="col-4">
                                                                                    <i className="fas fa-clock"></i> {
                                                                                    trade.expiringTime ? (
                                                                                        <Countdown
                                                                                            date={Date.parse(trade.expiringTime)}/>
                                                                                    ) : (
                                                                                        <span>N/A</span>
                                                                                    )
                                                                                }
                                                                                </div>

                                                                                <div className="col-12 mt-3 border_top">
                                                                                    <div className="row">
                                                                                        <div className="col p-2 border_right">
                                                                                            <p className=" m-0 text-uppercase font-xs font-weight-800">Top Bid (N/$)</p>
                                                                                            {
                                                                                                trade.highestBid === null ? (
                                                                                                    <span>N/A</span>
                                                                                                ):(
                                                                                                    trade.highestBid.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                                                                )
                                                                                            }
                                                                                        </div>
                                                                                        <div className="col p-2">
                                                                                            <p className="m-0 text-uppercase font-xs font-weight-800">Top Price (N/$)</p>
                                                                                            {
                                                                                                trade.highestBid === null ? (
                                                                                                    <span>N/A</span>
                                                                                                ):(
                                                                                                    (trade.highestBid * (trade.amount * listAsset.rate)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                                                                )
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                            </div>

                                                                        </div>

                                                                    )
                                                                })

                                                            ):(

                                                                <div className="text-center p-5 lead fw-bold">No Active Sales</div>

                                                            )
                                                        }

                                                    </div>


                                                </div>
                                            </div>
                                        </div>

                                    </div>



                                    {/* Transaction history */}
                                    <div className="accordion fancy_accordion mt-5 mb-5" id="accordionExample4">
                                        <div className="accordion-item trade_accordion">
                                            <div className="bg-primary accordion-header clearfix" id="headingThree">
                                                <button onClick={() => fetchTransactions()} className="float-end collapsed d-none d-lg-flex accordion-button" type="button" data-bs-toggle="collapse"
                                                        data-bs-target="#collapseDash3" aria-expanded="true" aria-controls="collapseDash3">
                                                </button>

                                                <h5 className="m-2 bg-primary text-uppercase font-weight-700">Transaction History</h5>

                                            </div>
                                            <div id="collapseDash3" className="accordion-collapse collapse"
                                                 aria-labelledby="headingThree" data-bs-parent="#accordionExample4">
                                                <div className="accordion-body">

                                                    <DataTable
                                                        className="data_table"
                                                        data={transactions.reverse()}
                                                        columns={Tables.transaction_columns}
                                                        striped={true}
                                                        hover={true}
                                                        responsive={true}
                                                        pagination={true}
                                                        fixedHeader={true}
                                                        noHeader={true}
                                                        keyField='id'
                                                    />



                                                </div>
                                            </div>
                                        </div>

                                    </div>


                                </div>



                            </div>


                            {/*User Status*/}
                            <div className="modal fade" id="statusRequest" data-bs-backdrop="static" data-bs-keyboard="false"
                                 tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header bg-warning">
                                            <h5 className="modal-title" id="staticBackdropLabel">User Status Request</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                                    aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">

                                            <div className="alert alert-warning">

                                                <h4 className="m-0">{user.userProfile.username}</h4>
                                                <p className="m-0">{user.userProfile.email}</p>
                                            </div>

                                            <div>
                                                {
                                                    user.userProfile.status === false ?(

                                                        <div>
                                                            <label>Reason for activation</label>
                                                            <textarea className="form-control" rows="5" onChange={handleChange} name="reason">{comment}</textarea>

                                                            <button className="btn btn-lg w-100 btn-success mt-3" onClick={() => enableUser()}>Activate User</button>
                                                        </div>

                                                    ):(
                                                        <div>
                                                        <label>Reason for deactivation</label>
                                                        <textarea className="form-control" rows="5" onChange={handleChange} name="reason">{comment}</textarea>

                                                <button className="btn btn-lg w-100 btn-danger mt-3" onClick={() => disableUser()}>Deactivate User</button>
                                                        </div>
                                                    )
                                                }
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


