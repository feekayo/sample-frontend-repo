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
import Big from 'big.js';



export default class wallets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            wallet: [],
            dollarRate: 0,
            totalFunds: 0,
            walletAddress: '',
            selectedAsset: '',
            walletBalance: [],
            transactions: [],
            transfer: [],
            withdraw: {
                'asset' : 'btc'
            },
            deposit:  {
                'asset' : 'btc'
            },
            newWallet : {
                userId : Session.id
            },
            rate : 0,
            assets: ls.get('assets'),
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleDepositChange = this.handleDepositChange.bind(this);
        this.depositCreateWallet = this.depositCreateWallet.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDepositSubmit = this.handleDepositSubmit.bind(this);
        this.handleWithdrawSubmit = this.handleWithdrawSubmit.bind(this);
        this.handleWithdrawSubmit = this.handleWithdrawSubmit.bind(this);
        this.calc_amt = this.calc_amt.bind(this)
    }


    depositCreateWallet(e)
    {
        try {
            let asset = e.target.value;

            if(asset === 'usdt')
            {

                this.setState({selectedAsset: 'USDT(TRC20)'});
            }else {
                this.setState({selectedAsset: asset.toUpperCase()});
            }
            if(asset !== 'btc')
            {
                this.state.wallet.map((wallet,index) => {

                    if (wallet.asset === asset) {
                        this.setState({walletAddress: wallet.address });
                    }
                });

            }else{

                    NProgress.start();
                    NProgress.inc();
                    NProgress.configure({ease: 'ease', speed: 500});

                    fetch(Api.createWallet + '/' + asset,
                        {
                            method: 'POST',
                            headers: {
                                Authorization: 'Bearer ' + Session.token,
                                'Content-type': 'application/json',
                                'ip' : ls.get('ip'),
                                'device' : ls.get('device'),
                            }
                        }).then((res) => res.json())
                        .then((response26) => {
                            NProgress.done();
                            console.log(response26.data.data.address.reverse()[0]);

                            this.setState({walletAddress: response26.data.data.address[0]});
                        })
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

    }

    createWallet(asset)
    {
        let exists = 0;



            try {
                NProgress.start();
                NProgress.inc();
                NProgress.configure({ease: 'ease', speed: 500});

                fetch(Api.createWallet + '/' + asset,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: 'Bearer ' + Session.token,
                            'Content-type': 'application/json',
                            'ip' : ls.get('ip'),
                            'device' : ls.get('device'),
                        }
                    }).then((res) => res.json())
                    .then((response26) => {
                        NProgress.done();
                        console.log(response26);

                        fetch(Api.wallet,
                            {
                                method: 'GET',
                                headers: {
                                    Authorization: 'Bearer ' + Session.token
                                }
                            }).then((res) => res.json())
                            .then((response26) => {
                               // console.log(response26);
                                if(response26.status !== 'failed') {
                                    this.setState({wallet: response26.data});
                                }


                            })

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

    fetchTransactions(){
        fetch(Api.transactions,
            {
                method: 'GET',
                'headers': {
                    'Authorization': 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response26) => {
                this.setState({transactions : response26.data.reverse()})
                console.log(response26);
            })


    }


    handleChange = e => {
        if(e.target.name === 'amount'){
            this.setState({...this.state, transfer: {...this.state.transfer, [e.target.name]: Number(e.target.value)}});
        }else {
            this.setState({...this.state, transfer: {...this.state.transfer, [e.target.name]: e.target.value.toLowerCase()}});

            if(e.target.name === 'asset')
            {
                this.shw_bal(e.target.value.toLowerCase());
            }
        }
    }

    handleSubmit = async e => {
        e.preventDefault();

        console.log(this.state.transfer);
        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            const res = await fetch(Api.transfer , {
                method: 'POST',
                body: JSON.stringify(this.state.transfer),
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

                this.getWallets();
                this.fetchTransactions();

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

    handleDepositChange(e) {

            this.setState({
                ...this.state,
                deposit: {[e.target.name]: Number(e.target.value)}
            });

    }

    handleDepositSubmit = async e => {
        e.preventDefault();

        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            const res = await fetch(Api.deposit, {
                method: 'POST',
                body: JSON.stringify(this.state.deposit),
                headers: {
                    'Authorization': 'Bearer ' + Session.token,
                    'Content-type': 'application/json',
                    'ip' : ls.get('ip'),
                    'device' : ls.get('device'),
                }
            });

            //console.log(this.state.deposit);

            const json = await res.json();
            console.log(json);
            console.log(Api.deposit);
            if (json.status === 'successful') {
                NProgress.done();
                Swal.fire({
                    title: 'Success!',
                    text: json.msg,
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });

                this.getWallets();
                this.fetchTransactions();
            } else {
                NProgress.done();
                console.log(json);
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

    handleWithdrawChange = e => {
        if(e.target.name === 'amount'){
            this.setState({...this.state, withdraw: {...this.state.withdraw, [e.target.name]: Number(e.target.value)}});
        }else {
            this.setState({...this.state, withdraw: {...this.state.withdraw, [e.target.name]: e.target.value}});
            this.setState({walletAddress : ''});

            if(e.target.name === 'asset')
            {
                this.shw_bal(e.target.value.toLowerCase());
            }
        }
    }

    handleWithdrawSubmit = async e => {
        e.preventDefault();

        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            const res = await fetch(Api.withdraw + '/' + this.state.withdraw.asset, {
                method: 'POST',
                body: JSON.stringify(this.state.withdraw),
                headers: {
                    'Authorization': 'Bearer ' + Session.token,
                    'Content-type': 'application/json',
                    'ip' : ls.get('ip'),
                    'device' : ls.get('device'),
                }
            });


            const json = await res.json();
          //  console.log(json);
            if (json.status === 'successful') {
                NProgress.done();
                Swal.fire({
                    title: 'Success!',
                    text: json.msg,
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });

                this.getWallets();
                this.fetchTransactions();

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

    shw_bal(asset)
    {
        let count = this.state.wallet.length;

        this.setState({walletBalance : 'Wallet not available'});
        for(let i = 0; i < count; i++)
        {
            let data = this.state.wallet[i];


            if (asset === data.asset) {
                this.setState({walletBalance : Big(data.availableBalance).toFixed(6) + " " + asset.toUpperCase()});
            }



        }

    }

    calc_amt()
    {
        let count = this.state.assets.length;

        for(let i = 0; i < count; i++)
        {
            let data = this.state.assets[i];

         //   console.log(this.state.transfer);
            if(this.state.transfer['asset'])
            {
                if (this.state.transfer['asset'].toUpperCase() === data.abbr) {
                    this.setState({dollarRate : (this.state.transfer['amount'] * data.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')});
                }
            }

        }
    }

    async getWallets()
    {
        let walletArray = [];

        this.state.assets.map((asset,index) => {

            fetch(Api.fetchSingleWallet + '?asset=' + asset.abbr.toLowerCase(),
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + Session.token
                    }
                }).then((res) => res.json())
                .then((response26) => {
                    console.log(asset.abbr);
                    console.log(response26);
                    if(response26.data !== undefined) {

                        this.setState({wallet: [...this.state.wallet, response26.data ] });
                        let data = response26.data;

                        let count = this.state.assets.length;

                        for (let x = 0; x < count; x++) {
                            let crypto = Session.assets[x];

                            if (data.asset.toUpperCase() === crypto.abbr) {

                                this.setState({totalFunds: (this.state.totalFunds + (crypto.rate * Big(data.balance)))});

                            }

                        }

                    }

                })

        })

        this.setState({loading : false});


    }

    async componentDidMount() {

        const step1 = await this.getWallets();

        this.fetchTransactions();



    }

    render(){

        return(
            <Dashboard_Layout title="Wallet">

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

                                <div className="bg-skyblue border_radius mb-4 border p-3">
                                    <div className="row">
                                    {
                                        this.state.assets.map((asset, index) => {
                                            let count_wallet = 0;
                                            return (

                                                <div className="col-sm-6 col-xl-4">

                                                    {
                                                        this.state.wallet.length >= 1 ? (
                                                        this.state.wallet.map((wallet,index) => {

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

                                                        ):null
                                                    }



                                                    {
                                                        count_wallet === 0 ? (
                                                            <div className="wallet_card bg-white mb-3">
                                                                <div className="p-4 text-center lead clearfix">

                                                                    <img src={asset.icon} width="60" className="" />
                                                                    <h6 className="text-primary text-uppercase font-sm-2 fw-bold m-0">{asset.name}</h6>
                                                                    <p className="m-0">Wallet not found</p>

                                                                    <button className="btn btn-warning mt-2 mb-2" onClick={() => this.createWallet(asset.abbr.toLowerCase())}><i className="fa fa-plus"></i> Create Wallet</button>

                                                                </div>
                                                            </div>
                                                        ):(null)
                                                    }



                                                </div>




                                            )
                                        })
                                    }
                                    </div>
                                </div>

                                <div className="col-lg-8 order-2 order-lg-1 border_right">

                                    <div className="row">

                                    <div className="row mb-4">
                                    <h4 className="col-6 m-0">Last Transactions</h4>
                                        <a href="/wallet/transactions" className="text-end text-primary col-6">See all <i className="fa fa-chevron-circle-right"></i></a>
                                    </div>
                                        <div className="pr-5 mb-5">
                                        {
                                            this.state.transactions.length >= 1 ? (
                                                this.state.transactions.slice(0,5).map((trans,index) => {

                                                let listAsset;
                                                let count = Session.assets.length;

                                                for(let i = 0; i < count; i++)
                                                {
                                                    let data = Session.assets[i];

                                                    if (trans.asset.toUpperCase() === data.abbr) {
                                                        listAsset = data;
                                                    }

                                                }
                                                return(
                                                    <div className="transaction_item">
                                                        <div className="row">

                                                            <div className="col-1">
                                                                <img src={listAsset.icon} width="30" className="img-fluid" />
                                                            </div>

                                                            <div className="col-4 text-capitalize">
                                                                {trans.description ? trans.description :

                                                                    trans.receiverId === Session.id ? (
                                                                        <span >
                                                                           Credit Transaction
                                                                        </span>
                                                                    ):(
                                                                        <span >
                                                                             Debit Transaction
                                                                        </span>
                                                                    )
                                                                }

                                                            </div>

                                                            <div className="col-3">
                                                                {Big(trans.amount).toFixed(6)} {listAsset.abbr}
                                                            </div>

                                                            <div className="col-2">
                                                                {
                                                                    trans.receiverId === Session.id ? (
                                                                        <span >
                                                                            <i className="fa fa-circle text-success"></i> Credit
                                                                        </span>
                                                                    ):(
                                                                        <span >
                                                                            <i className="fa fa-circle text-danger"></i> Debit
                                                                        </span>
                                                                    )
                                                                }
                                                            </div>

                                                            <div className="col-2">
                                                                {moment(trans.created).format('ddd MMM DD, YYYY H:m:s')}
                                                            </div>

                                                        </div>
                                                    </div>
                                                    )
                                                }
                                                )
                                            ):(
                                                <div>
                                                    <p className="p-5 lead text-center">No transactions yet</p>
                                                </div>
                                            )
                                        }
                                        </div>
                                    </div>

                                </div>

                                <div className="col-lg-4 order-1 order-lg-2 p-4">

                                    <div className="text-center">
                                        <div className="round_circle shadow mb-3">
                                            <img src={'/valor_icon.png'} width="50" className="img-round" />
                                        </div>
                                        <h5>Total Funds</h5>

                                        <div className="bg-skyblue font-lg border d-inline mx-auto p-2 border_radius">${Big(this.state.totalFunds).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                                    </div>

                                    <div className="row mt-3">
                                    <div className="col">
                                        <button className="btn mb-3 btn-success w-100" data-bs-toggle="modal" data-bs-target="#depositModal">
                                            Deposit
                                        </button>
                                    </div>
                                        <div className="col">
                                        <button className="btn mb-3 btn-warning w-100" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                            Transfer
                                        </button>
                                        </div>
                                        <div className="col">
                                        <button className="btn btn-danger w-100" data-bs-toggle="modal" data-bs-target="#withdrawModal">
                                            Withdraw
                                        </button>

                                    </div>
                                    </div>




                                </div>





                                {/*Transfer*/}
                                <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content">
                                            <div class="modal-header bg-warning">
                                                <h5 class="modal-title" id="staticBackdropLabel">Transfer</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                <form className="row g-2" onSubmit={this.handleSubmit}>
                                                    <div className="form-floating col-6 mb-3">
                                                        <select id="float_asset" name="asset" onChange={this.handleChange} required className="form-select">
                                                            <option value="" selected disabled>-- Select an option  --</option>
                                                            {
                                                                this.state.assets.map((asset,index) => (
                                                                    <option value={asset.abbr.toLowerCase()}>{asset.name}</option>
                                                                ))
                                                            }
                                                        </select>
                                                        <label>Choose an asset</label>

                                                    </div>
                                                    <div className="col-6 mb-3">
                                                        <div className="bg-gray border_radius p-3">
                                                            <span className="fw-bold m-0">Balance: </span>{this.state.walletBalance}

                                                        </div>

                                                    </div>

                                                    <div className="form-floating col-12 mb-3">
                                                        <input type="text" onChange={this.handleChange} className="form-control" placeholder="username" name="receiverId" />
                                                        <label>Receiver's username</label>

                                                    </div>

                                                    <div className="form-floating col-6 mb-3">
                                                        <input type="text" autoComplete="off" onChange={this.handleChange} onKeyUp={this.calc_amt} className="form-control" placeholder="username" name="amount" />
                                                        <label>Quantity</label>
                                                    </div>

                                                    <div className="form-floating col-6 mb-3">
                                                        <input type="text" onChange={this.handleChange} value={this.state.dollarRate} disabled className="form-control" placeholder="value" />
                                                        <label>Value</label>
                                                    </div>

                                                    <div className="form-floating col-12 mb-3">
                                                        <input type="text" autoComplete="off" onChange={this.handleChange} className="form-control" placeholder="description" name="narration" />
                                                        <label>Narration</label>
                                                    </div>

                                                    <button className="btn w-100 btn-lg btn-success ">Submit Transfer</button>
                                                </form>
                                            </div>

                                        </div>
                                    </div>
                                </div>


                                {/* Deposit */}
                                <div class="modal fade" id="depositModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="depositModalLabel" aria-hidden="true">
                                    <div class="modal-dialog modal-lg modal-dialog-centered">
                                        <div class="modal-content">
                                            <div class="modal-header bg-warning">
                                                <h5 class="modal-title" id="depositModalLabel">Deposit</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">

                                                <div className="bg-gray border_radius border mb-3 p-3 font-gray font-xs">
                                                    Send only {this.state.selectedAsset} to this deposit address.
                                                    Sending coin or token other than {this.state.selectedAsset} to this address may result in the loss of your deposit.
                                                </div>


                                                    <div className="form-floating col-12 mb-3">
                                                        <select id="float_asset" name="asset" onChange={this.depositCreateWallet} required className="form-select">
                                                            <option value="" selected disabled>-- Select an asset --</option>
                                                            {
                                                                this.state.assets.map((asset,index) => (
                                                                    <option value={asset.abbr.toLowerCase()}>{asset.name} ({asset.abbr})</option>
                                                                ))
                                                            }
                                                        </select>
                                                        <label>Choose an asset</label>

                                                    </div>

                                                {this.state.walletAddress ? (
                                                   <div className="bg-gray text-wrap text-center my-4 border p-2 border_radius">
                                                       <p className="m-0 text-uppercase font-black badge bg-warning">Make payment to the wallet address below:</p>
                                                    <h4 className="text-wrap text-truncate">{this.state.walletAddress}</h4>

                                                       <a onClick={() => {navigator.clipboard.writeText(this.state.walletAddress), Swal.fire('Copied','')}} className="btn btn-sm btn-danger">Copy wallet address</a>
                                                   </div>
                                                ):(null)}




                                            </div>

                                        </div>
                                    </div>
                                </div>

                                {/* Withdraw */}
                                <div class="modal fade" id="withdrawModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="withdrawModalLabel" aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content">
                                            <div class="modal-header bg-warning">
                                                <h5 class="modal-title" id="withdrawModalLabel">Withdraw</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">


                                                <div className="text-danger mb-3">
                                                    Withdrawal Fee: 0.0002 BTC
                                                </div>

                                                <form className="row g-2" onSubmit={this.handleWithdrawSubmit}>

                                                    <div className="form-floating col-6 mb-3">
                                                        <select id="float_asset" name="asset" onChange={this.handleWithdrawChange} required className="form-select">
                                                            <option value="" selected disabled>-- Select an option  --</option>
                                                            {
                                                                this.state.assets.map((asset,index) => (
                                                                    <option value={asset.abbr.toLowerCase()}>{asset.name}</option>
                                                                ))
                                                            }
                                                        </select>
                                                        <label>Choose an asset</label>

                                                    </div>
                                                    <div className="col-6 mb-3">
                                                        <div className="bg-gray border_radius p-3">
                                                            <span className="fw-bold m-0">Balance: </span>{this.state.walletBalance}

                                                        </div>

                                                    </div>

                                                    <div className="form-floating col-12 mb-3">
                                                        <input type="text" autoComplete="off" onChange={this.handleWithdrawChange} className="form-control" placeholder="address" name="destinationAddress" />
                                                        <label>Destination Address</label>
                                                    </div>

                                                    <div className="form-floating col-12 mb-3">
                                                        <input type="number" step="0.0000000001" autoComplete="off" onChange={this.handleWithdrawChange} className="form-control" placeholder="amount" name="amount" />
                                                        <label>Amount</label>
                                                    </div>

                                                    <button className="btn w-100 mt-3 btn-lg btn-success ">Continue <i className="fa fa-chevron-circle-right"></i></button>
                                                </form>
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


