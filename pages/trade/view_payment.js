import Main_Layout from "../../components/layout/main_layout";
import React, {Component,useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import ls from "local-storage";
import * as Constants from "../../components/config/constant";
import * as Api from "../../components/config/api";
import * as Session from "../../components/config/session";
import Countdown from "react-countdown";
import NProgress from "nprogress";
import Swal from "sweetalert2";
import axios from "axios";
import {currentAsset} from "../../components/config/session";
import {io} from "socket.io-client";
import activityContext from "../../components/config/context";


export default class paymentInterface extends Component {
    static contextType = activityContext;
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            payment : [],
            currentPayment : true,
            asset : [],
            advert : [],
            isDone : false,
            time_remaining : 0
        };

        this.pay = this.pay.bind(this);
    }

    pay = async e => {

        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            const res = await fetch(Api.paymentMade + "?bidId="+ this.props.payment._id, {
                method: 'POST',
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
                this.setState({isDone : true});
                Swal.fire({
                    title: 'Success!',
                    text: json.msg + ". Please wait",
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
        Session.validateUser();

        console.log(this.props);

        let data = Session.assets;
        for (let i = 0; i < data.length; i++) {

            if (this.props.payment.asset.toUpperCase() === data[i].abbr) {
                this.setState({asset : data[i]});
            }

        };


        fetch(Api.fetchAdvert + '/' + this.props.payment.advertId,
                                    {
                                        method: 'GET',
                                        headers: {
                                            Authorization: 'Bearer ' + Session.token
                                        }
                                    }).then((res) => res.json())
                                    .then((response26) => {

                                            this.setState({advert : response26.data});
                                           console.log(response26.data);
                                        this.setState({loading : false});
                                        this.setState({time_remaining : (new Date(this.props.payment.paymentTime).getTime() - new Date().getTime()) })

                                    });



    }

    render() {

        return(
            <div>
                { this.state.loading ? (
                    <Constants.loading />
                ) : (
                    <section className="">
                        <div className="bg-dark sticky-top border_bottom p-3">
                            <h5 className="m-0 font-white">View Payment</h5>
                        </div>

                        {

                            this.state.time_remaining <= 0 ? (
                                <div className="p-5 w-100 text-center ">
                                    <h5>Payment Window Elapsed</h5>
                                    <p>The 30 minutes payment window is expired and {this.props.payment.amount.toFixed(6)} {this.props.payment.asset.toUpperCase()} has been returned to the seller.</p>
                                </div>
                            ):(

                        <div className=" p-3">

                            <div className="text-center">
                                <p>You are required to make payment for your bid of</p>
                                <div className="row mb-3 align-items-center">
                                    <div className="col-5">

                                        <div className="bg-blue-2 border border_radius fw-bold p-3">NGN {(this.props.payment.rate * (this.props.payment.amount * this.state.asset.rate)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                                    </div>
                                    <div className="col-2">FOR</div>
                                    <div className="col-5">
                                        <div className="bg-blue-2 border border_radius fw-bold p-3">{this.props.payment.amount.toFixed(5)} {this.props.payment.asset.toUpperCase()}</div>
                                    </div>
                                </div>
                            </div>

                            {
                                this.state.isDone ? (
                                    <div className="alert alert-success text-center">
                                        Seller notified of payment
                                    </div>
                                ) : (
                                    <button className="btn btn-lg w-100 btn-success" onClick={() => this.pay()}>I Have
                                        Paid</button>
                                )
                            }

                            <h6 className="fw-bold mt-4 text-danger">NOTICE</h6>
                            <ol>
                                <li>Pay the above sum of money bid within the stipulated 30 minutes</li>
                                <li>Mark as paid after successful payment before the expiration of trade. </li>
                                <li>Failure to mark transaction as paid after the expiration of trade time will lead can lead to loss of funds.</li>
                                <li>Do not mark as paid if you do not make this payment</li>
                                <li>Failure to make payment will limit your chances of bidding</li>
                            </ol>

                            <h6 className="fw-bold bg-primary mt-4 p-2 text-uppercase font-xs m-0">Payment</h6>
                            <table className="table m-0 text-left table-striped border table-hover">
                                <tbody>
                                <tr>
                                    <td>Payment duration</td>
                                    <td>
                                        <Countdown date={Date.parse(this.props.payment.paymentTime)}/>
                                    </td>
                                </tr>

                                </tbody>
                            </table>

                            <h6 className="fw-bold bg-primary mt-3 p-2 text-uppercase font-xs m-0">Bank details</h6>
                            <table className="table m-0 text-left table-striped border table-hover">
                                <tbody>
                                <tr>
                                    <td>Bank Name</td>
                                    <td className="font-sm text-capitalize text-danger">{this.state.advert.defaultBank.bankName}</td>
                                </tr>
                                <tr>
                                    <td>Account Number</td>
                                    <td className="font-sm text-danger">{this.state.advert.defaultBank.accountNumber}</td>
                                </tr>
                                <tr>
                                    <td>Account Name</td>
                                    <td className="font-sm text-danger">{this.state.advert.defaultBank.accountName}</td>
                                </tr>
                                </tbody>
                            </table>

                            <h6 className="fw-bold bg-primary mt-3 p-2 text-uppercase font-xs m-0">Advert details</h6>
                            <table className="table m-0 text-left border table-striped table-hover">
                                <tbody>
                                <tr>
                                    <td>Asset</td>
                                    <td>{this.state.asset.abbr}</td>
                                </tr>
                                <tr>
                                    <td>Volume</td>
                                    <td>{this.props.payment.amount.toFixed(5)}</td>
                                </tr>
                                <tr>
                                    <td>Value ($)</td>
                                    <td>{(this.props.payment.amount * this.state.asset.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                </tr>
                                <tr>
                                    <td>Bid Price (N/$)</td>
                                    <td>{this.props.payment.rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                </tr>
                                <tr>
                                    <td>Total Price (N)</td>
                                    <td>{(this.props.payment.rate * (this.props.payment.amount * this.state.asset.rate)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                </tr>
                                </tbody>
                            </table>



                        </div>

                                )
                        }
                    </section>


                )}
            </div>
        )
    }
}

