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


export default function release(props) {
    const [loading, setLoading] = useState(true);
    const [payment, setPayment] = useState([]);
    const [currentPayment, setCurrentPayment] = useState([]);
    const [asset, setAsset] = useState([]);
    const [advert, setAdvert] = useState([]);
    const [done, setDone] = useState(false);

    const pay = async e => {

        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            const res = await fetch(Api.confirmPayment + "?bidId="+ currentPayment._id, {
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
                setDone(true);
                Swal.fire({
                    title: 'Success!',
                    text: json.msg + ". Please wait",
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });

              //  setTimeout(function(){ window.location.reload(); }, 3000);

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

    useEffect(() =>
    {
       // console.log(props);
        async function loadData() {

            // fetch payments

            fetch(Api.fetchIncomingPayments,
                {
                    method: 'GET',
                    headers: {
                        Authorization : 'Bearer ' + Session.token,
                        'Content-type': 'application/json'
                    }
                }).then((res) => res.json())
                .then(function (response) {
                        //setPayment(response.data.data);
            //console.log(response.data);

                        let count = Session.assets.length;

                        for (let i = 0; i < response.data.length; i++) {

                            if (response.data[i]._id === props.id) {
                                setCurrentPayment(response.data[i]);

                                console.log('current set');
                                for (let x = 0; x < count; x++) {
                                    let data = Session.assets[x];

                                    console.log(Session.assets[x]);
                                    if (response.data[i].asset.toUpperCase() === data.abbr) {
                                        setAsset(data);

                                        console.log('asset set');

                                        fetch(Api.fetchAdvert + '/' + response.data[i].advertId,
                                            {
                                                method: 'GET',
                                                headers: {
                                                    Authorization: 'Bearer ' + Session.token
                                                }
                                            }).then((res) => res.json())
                                            .then((response26) => {
                                                if (response26.data !== undefined) {
                                                    setAdvert(response26.data);
                                                    setLoading(false);
                                                    //console.log(response26);
                                                }
                                            })
                                    }

                                }


                            }

                        }


                    })
                    .catch(function (error) {
                        console.log(error);
                    });


        }

        loadData();



    }, []);
    return (
        <div>
            { loading ? (
                <Constants.loading />
            ) : (
                <section className="">
                    <div className="bg-dark sticky-top border_bottom p-3">
                        <h5 className="m-0 font-white">Release Coins</h5>
                    </div>

                <div className=" p-3">
                    <div className="text-center">
                    <p>The buyer({currentPayment.ownerId.username}) has paid the sum of:</p>
                    <div className="row mb-3 align-items-center">
                        <div className="col-5">
                            <div className="bg-blue-2 border border_radius fw-bold p-3">NGN {(currentPayment.rate * (currentPayment.amount * asset.rate)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                        </div>
                        <div className="col-2">FOR</div>
                        <div className="col-5">
                            <div className="bg-blue-2 border border_radius fw-bold p-3">{currentPayment.amount.toFixed(6)} {currentPayment.asset.toUpperCase()}</div>
                        </div>
                    </div>
                    </div>

                    <p className="text-center">to your bank account:</p>
                    <h6 className="fw-bold bg-primary mt-3 p-2 text-uppercase font-xs m-0">Bank details</h6>
                    <table className="table m-0 text-left table-striped border table-hover">
                        <tbody>
                        <tr>
                            <td>Bank Name</td>
                            <td className="font-sm text-capitalize text-danger">{advert.defaultBank.bankName}</td>
                        </tr>
                        <tr>
                            <td>Account Number</td>
                            <td className="font-sm text-danger">{advert.defaultBank.accountNumber}</td>
                        </tr>
                        <tr>
                            <td>Account Name</td>
                            <td className="font-sm text-capitalize text-danger">{advert.defaultBank.accountName}</td>
                        </tr>
                        </tbody>
                    </table>


                    <h6 className="fw-bold mt-4 text-danger">NOTICE</h6>
                    <ol>
                        <li>Do not release asset until you confirm payment in your account</li>
                        <li>Do not rely on SMS notifications or email notifications as confirmation of payment</li>
                        <li>Ensure you login to your account to be sure that you have received money from the buer before
                        releasing asset to prevent losses</li>
                    </ol>

                    {
                        done ?(
                                <div className="alert alert-success text-center">
                                    Coin released successfully
                                </div>
                        ):(
                            <button className="btn mb-5 btn-lg w-100 btn-success" onClick={() => pay()}>Release Coins</button>
                        )
                    }

                </div>

                </section>


            )}
        </div>
    );
}

