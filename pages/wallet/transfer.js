import Wallet_layout from "../../components/layout/wallet_layout";
import React, {Component, useEffect, useState} from "react";
import * as Api from "../../components/config/api";
import * as Session from "../../components/config/session";
import * as Strings from "../../components/config/string";
import * as Constant from "../../components/config/constant";
import * as Constants from "../../components/config/constant";
import Link from "next/link";
import Swal from "sweetalert2";
import ls from "local-storage";

import NProgress from 'nprogress';
import { Facebook as Loader } from 'react-content-loader';
import moment from "moment";

export default function app() {
    const [loading, setLoading] = useState(true);
    const [wallet, setWallet] = useState([]);
    const [dollarRate, setDollarRate] = useState(0);
    const [walletBalance, setWalletBalance] = useState("Select an asset");
    const [transfer, setTransfer] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const assets = ls.get('assets');


    const handleChange = e => {
       if(e.target.name === 'amount'){
            setTransfer({...transfer, [e.target.name]: Number(e.target.value)});
       }else {
            setTransfer({...transfer, [e.target.name]: e.target.value.toLowerCase()});

            if(e.target.name === 'asset')
            {
                shw_bal(e.target.value.toLowerCase());
            }
        }
    }

    function shw_bal(asset)
    {
        let count = wallet.length;

        setWalletBalance('Wallet not available');
        for(let i = 0; i < count; i++)
        {
            let data = wallet[i];


                if (asset === data.asset) {
                    setWalletBalance(data.availableBalance + " " + asset.toUpperCase());
                }



        }

    }

    function calc_amt()
    {
        let count = assets.length;

        for(let i = 0; i < count; i++)
        {
            let data = assets[i];

            if(transfer['asset'])
            {
                if (transfer['asset'].toUpperCase() === data.abbr) {
                    setDollarRate((transfer['amount'] * data.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
                }
            }

        }
    }

    const handleSubmit = async e => {
        e.preventDefault();


        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            const res = await fetch(Api.transfer, {
                method: 'POST',
                body: JSON.stringify(transfer),
                headers: {
                    'Authorization': 'Bearer ' + Session.token,
                    'Content-type': 'application/json',
                    'ip' : ls.get('ip'),
                    'device' : ls.get('device'),
                }
            });

            const json = await res.json();
            console.log(json);
            if (json.msg === 'Transfer successful') {
                NProgress.done();
                Swal.fire({
                    title: 'Success!',
                    text: json.msg,
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });

                setTimeout(function(){ window.location.reload(); }, 3000);

            } else {
                NProgress.done();
                console.log(transfer);

                Swal.fire({
                    title: 'Failed!',
                    text: json.err.err,
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
        Session.validateUser();

        async function loadUser() {
            const response = await fetch(Api.wallet + '?userId=' + Session.id,
                {
                    method: 'GET',
                    'headers': {
                        'Authorization': 'Bearer ' + Session.token
                    }
                });
            const jsondata = await response.json();
            setWallet(jsondata.data);


            const response2 = await fetch(Api.transactions,
                {
                    method: 'GET',
                    'headers': {
                        'Authorization': 'Bearer ' + Session.token
                    }
                });
            const jsondata2 = await response2.json();
            setTransactions(jsondata2.data);
            console.log(jsondata2);

            setLoading(false);
        }
        loadUser();


        // get countries



    }, []);


    return(
        <Wallet_layout title="Transfer">




                {loading ? (
                    <div>
                        <Loader />


                    </div>
                ):(
                    <section>

                        <div className="row">

                            <div className="col-lg-8">
                        {
                            wallet.length === 0 ? (
                                <div className="p-5 bg-gray text-center">
                                    <i className="fa mb-4 fa-plus-circle font-xl-2"></i>
                                    <h3>No Wallet Found</h3>
                                    <p className="lead">You have not added any wallet to your account.</p>
                                    <button className="btn btn-primary" data-bs-toggle="collapse" href="#addWallet" role="button" aria-expanded="false" aria-controls="addWallet">Add Wallet</button>
                                </div>
                            ):(
                                <div>

                                    <form className="row g-2" onSubmit={handleSubmit}>
                                        <div className="form-floating col-6 mb-3">
                                            <select id="float_asset" name="asset" onChange={handleChange} required className="form-select">
                                                <option value="" selected disabled>-- Select an option  --</option>
                                                {
                                                    assets.map((asset,index) => (
                                                        <option value={asset.abbr.toLowerCase()}>{asset.name}</option>
                                                    ))
                                                }
                                            </select>
                                            <label>Choose an asset</label>

                                        </div>
                                        <div className="col-6 mb-3">
                                            <div className="bg-gray border_radius p-3">
                                                <span className="fw-bold m-0">Balance: </span>{walletBalance}

                                            </div>

                                        </div>

                                        <div className="form-floating col-12 mb-3">
                                           <input type="text" onChange={handleChange} className="form-control" placeholder="username" name="receiverId" />
                                            <label>Receiver's username</label>

                                        </div>

                                        <div className="form-floating col-6 mb-3">
                                            <input type="text" onChange={handleChange} onKeyUp={calc_amt} className="form-control" placeholder="username" name="amount" />
                                            <label>Quantity</label>
                                        </div>

                                        <div className="form-floating col-6 mb-3">
                                            <input type="text" onChange={handleChange} value={dollarRate} disabled className="form-control" placeholder="value" />
                                            <label>Value</label>
                                        </div>

                                        <div className="form-floating col-12 mb-3">
                                            <input type="text" onChange={handleChange} className="form-control" placeholder="description" name="narration" />
                                            <label>Narration</label>
                                        </div>

                                        <button className="btn w-auto btn-primary ">Submit Transfer</button>
                                    </form>


                                </div>
                            )
                        }
                            </div>

                            <div className="col-lg-4">
                                <div className="bg-gray border_radius p-3">
                                <h6>Last 3 Withdrawal Transactions</h6>
                                    <hr/>

                                    {
                                        transactions.map((trans,index) => {
                                            if(index <= 2) {
                                                return (
                                                    <div className="bg-white mb-3 p-2 ">
                                                        <div className="row">
                                                            <div className="col-6">
                                                                <span
                                                                    className="fw-bold">Date:</span> {moment(trans.date).format('ddd MMM DD, YYYY')}
                                                            </div>
                                                            <div className="col-6">
                                                                <span
                                                                    className="fw-bold">Asset:</span> {trans.asset.toUpperCase()}
                                                            </div>
                                                            <div className="col-6">
                                                                <span
                                                                    className="fw-bold">Quantity:</span> {trans.amount.toFixed(5)}
                                                            </div>
                                                            <div className="col-6">
                                                                <span
                                                                    className="fw-bold">Value:</span> {moment(trans.date).format('ddd MMM DD, YYYY')}
                                                            </div>
                                                            <div className="col-12 text-capitalize">
                                                                <span className="fw-bold">Status:</span> {
                                                                trans.status === 'completed' ? (
                                                                    <span className="text-success">Completed</span>
                                                                ) : (
                                                                    <span className="text-warning">{trans.status}</span>
                                                                )
                                                            }
                                                            </div>
                                                            <div className="col-12 mb-0 text-capitalize">
                                                                <span className="fw-bold">Destination Address:</span>
                                                                <p className="m-0">LekanSalami24</p>
                                                            </div>
                                                            <div className="col-12 text-capitalize">
                                                                <span className="fw-bold">Transaction Id:</span>
                                                                <p className="m-0">{trans.transactionId}</p>
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

                    </section>
                )}







        </Wallet_layout>
    )
}