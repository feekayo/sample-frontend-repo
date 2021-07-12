import Main_Layout from "../../components/layout/main_layout";
import React, {Component,useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import ls from "local-storage";
import * as Constants from "../../components/config/constant";
import * as Api from "../../components/config/api";
import * as Session from "../../components/config/session";
import Countdown from "react-countdown";
import NProgress from "nprogress";
import Swal from "sweetalert2";
import Link from "next/link";
import createSale from "./create_sale";
import activityContext from "../../components/config/context";

export default class viewTrade extends Component {
    static contextType = activityContext;
    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            expired : false,
            advert : [],
            walletAvailable : true,
            fullBid : {advertId : this.props.id},
            buyItNow : {advertId : this.props.id},
            asset : [],
            totalBidPrice : 0,
            bidValue : 0
        };
        this.handleFullBidChange = this.handleFullBidChange.bind(this);
        this.handleFullBidSubmit = this.handleFullBidSubmit.bind(this);
        this.addToWatchlist = this.addToWatchlist.bind(this);
        this.buyNow = this.buyNow.bind(this);
        this.calc_amt = this.calc_amt.bind(this);
        this.calc_amt2 = this.calc_amt2.bind(this);
        this.calc_amt3 = this.calc_amt3.bind(this);
    }

    handleFullBidChange(e) {

        if(e.target.name === 'rate' ){
            this.setState({...this.state, fullBid: {...this.state.fullBid, [e.target.name] : Number(e.target.value) } });
        }else if(e.target.name === 'dollarValue' ) {
            this.setState({...this.state, bidValue: e.target.value });
        } else {
            this.setState({...this.state, fullBid: {...this.state.fullBid,[e.target.name]: e.target.value } });
        }

        if(this.state.fullBid.sellerId === undefined) {
            this.setState({...this.state, fullBid: {...this.state.fullBid,['sellerId']: this.state.advert.data.ownerId._id } });
        }
    }

    handleFullBidSubmit = async e => {
        e.preventDefault();

        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            const res = await fetch(Api.createBid, {
                method: 'POST',
                body: JSON.stringify(this.state.fullBid),
                headers: {
                    'Authorization': 'Bearer ' + Session.token,
                    'Content-type': 'application/json',
                    'ip' : ls.get('ip'),
                    'device' : ls.get('device'),
                }
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

                this.getData();
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

    addToWatchlist = async e => {
        e.preventDefault();

        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            const res = await fetch(Api.watchlist + '/' + this.state.advert.data._id, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + Session.token,
                    'Content-type': 'application/json',
                    'ip' : ls.get('ip'),
                    'device' : ls.get('device'),
                }
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
                    text: json.msg,
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

    buyNow = async e => {
        e.preventDefault();

        if (window.confirm('Are you sure you want to buy ' + this.state.advert.data.balance + ' ' +  this.state.advert.data.asset.toUpperCase() + '  at the rate of N'+ this.state.advert.data.buyItNow.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ? This action cannot be reversed.')) {
        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            const res = await fetch(Api.buyItNow, {
                method: 'POST',
                body: JSON.stringify({
                    'advertId'      : this.state.advert.data._id,
                    'rate'          : this.state.advert.data.buyItNow,
                    'amount'        : this.state.advert.data.balance,
                    'asset'         : this.state.advert.data.asset,
                    'sellerId'      : this.state.advert.data.ownerId._id,
                    'expiresIn'     : '2h'
                }),
                headers: {
                    'Authorization': 'Bearer ' + Session.token,
                    'Content-type': 'application/json',
                    'ip' : ls.get('ip'),
                    'device' : ls.get('device'),
                }
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

                this.getData();
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
        }
    };

    calc_amt()
    {
        this.setState({totalBidPrice : (this.state.fullBid.rate * (this.state.advert.data.balance * this.state.asset.rate)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')});
       // console.log(this.state.fullBid);
    }

    calc_amt2()
    {
        this.setState({bidValue : (this.state.fullBid.amount *  this.state.asset.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')});
        // console.log(this.state.fullBid);
    }

    calc_amt3()
    {
        this.setState({...this.state, fullBid: {...this.state.fullBid,['amount']: (this.state.bidValue /  this.state.asset.rate).toFixed(5) } });
        // console.log(this.state.fullBid);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.id !== this.props.id)
        {
           this.getData();
        }
    }

    getData()
    {
        // get advert data
        fetch(Api.fetchAdvert + '/' + this.props.id,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response1) => {

                // check expired
                let time_remaining = (new Date(response1.data.expiringTime).getTime() - new Date().getTime());
                if(time_remaining > 0) {
                    this.setState({expired : false});
                }else{
                    this.setState({expired : true});
                }

                // set advert state
                this.setState({advert : response1});

                // set fullBid
                this.setState({fullBid : {
                        'asset' : response1.data.asset,
                        'advertId' : this.props.id,
                        'amount' : response1.data.balance
                    }});

                // set asset
                let count = Session.assets.length;

                for (let i = 0; i < count; i++) {
                    let data = Session.assets[i];

                    if (response1.data.asset.toUpperCase() === data.abbr) {
                        this.setState({asset : data});
                    }
                }


                // check wallet
                fetch(Api.fetchSingleWallet + '?asset=' + response1.data.asset.toLowerCase(),
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + Session.token
                        }
                    }).then((res) => res.json())
                    .then((response22) => {
                        // console.log(response22);
                        if(response22.status === 'failed')
                        {
                            this.setState({walletAvailable: false});
                        }else{
                            this.setState({walletAvailable: true});
                        }

                        // stop loading
                        this.setState({loading : false});

                    })

                console.log(response1.data);
                this.setState({loading : false});
            })
    }


    componentDidMount() {

        Session.validateUser();


        this.getData()


    }

    render(){
        return (
            <div>
                { this.state.loading ? (
                    <Constants.loading />
                ) : (
                    <section className="">
                        <div className="bg-gray sticky-top border_bottom p-3">
                            <h5 className="m-0">Advert</h5>
                        </div>
                        <div className="p-3">

                            {
                                this.state.expired === false ? (
                                this.state.advert.data.balance <= 0 ? (
                            <div className="p-5 w-100 text-center ">
                                <h5>Advert Expired</h5>
                                <p>This advert is no longer available, view another advert you can bid on</p>
                            </div>
                                ):(

                                    <div>
                            <div className="row">

                                <div className="col-6">
                                    <table className="table font-xs table-borderless table-hover">
                                        <tbody>
                                        <tr>
                                            <td className="fw-bold">Advertiser</td>
                                            <td className="text-capitalize">{this.state.advert.data.ownerId.username}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Asset</td>
                                            <td>{this.state.advert.data.asset.toUpperCase()}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Quantity</td>
                                            <td>{this.state.advert.data.balance.toFixed(5)}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Value</td>
                                            <td>{(this.state.advert.data.balance * this.state.asset.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Base Price</td>
                                            <td>{this.state.advert.data.openingRate.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Partial Sale</td>
                                            <td>
                                                {
                                                    this.state.advert.data.partBid === true ? (
                                                        <span>Allowed</span>
                                                    ):(
                                                        <span>Not Allowed</span>
                                                    )
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">MOQ</td>
                                            <td>{this.state.advert.data.moq.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">MOQ ($)</td>
                                            <td>{(this.state.advert.data.moq * this.state.asset.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Buy Now ($)</td>
                                            <td>{this.state.advert.data.buyItNow.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Top Bid</td>
                                            <td>
                                                {
                                                    this.state.advert.highestBid === null ? (
                                                        <span>N/A</span>
                                                    ):(
                                                        this.state.advert.highestBid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                    )
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="fw-bold">Your Bid</td>
                                            <td></td>
                                        </tr>
                                        </tbody>

                                    </table>
                                </div>

                                <div className="col-6 text-center">

                                    <h6 className="fw-bold">Time Left</h6>
                                    <Countdown className="font-lg" date={Date.parse(this.state.advert.data.expiringTime)} />

                                    <h6 className="fw-bold mt-4">No. of Bids</h6>
                                    <p className="font-lg">{this.state.advert.data.bids.length}</p>

                                    <h6 className="fw-bold mt-4">No. of Watchers</h6>
                                    <p className="font-lg">{this.state.advert.watchListCount}</p>
                                </div>

                            </div>

                            <div className="bg-gray border_radius ">
                                <div className="bg-primary p-3">
                                    <h5 className="m-0">Bid</h5>
                                </div>

                                {
                                    this.state.walletAvailable === true ? (
                                        <div>
                                            <form className="p-3" onSubmit={this.handleFullBidSubmit}>
                                                <div className="row g-2">
                                                    <div className="col-6">
                                                        <div className="form-floating mb-3">
                                                            <input type="text" disabled value={this.state.advert.data.amount}
                                                                   className="form-control" placeholder="Volume"/>
                                                            <label>Volume</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="form-floating mb-3">
                                                            <input type="text" disabled
                                                                   value={(this.state.advert.data.amount * this.state.asset.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                   className="form-control" name="value" placeholder="Value"/>
                                                            <label>Value ($)</label>
                                                        </div>
                                                    </div>

                                                    {
                                                        this.state.advert.data.partBid === true ? (
                                                            <div className="row g-1">
                                                            <div className="col-6">
                                                                <div className="form-floating mb-3">
                                                                    <input type="text" className="form-control"
                                                                           onChange={this.handleFullBidChange} value={this.state.fullBid.amount} onKeyUp={this.calc_amt2} name="amount"
                                                                           placeholder="Quantity"/>
                                                                    <label>Quantity</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <div className="form-floating mb-3">
                                                                    <input type="text" value={this.state.bidValue} className="form-control" onKeyUp={this.calc_amt3} onChange={this.handleFullBidChange}
                                                                            placeholder="Value" name="dollarValue"/>
                                                                    <label>Value ($)</label>
                                                                </div>
                                                            </div>
                                                            </div>
                                                        ) : (
                                                            <span></span>
                                                        )
                                                    }

                                                    <div className="col-6">
                                                        <div className="form-floating mb-3">
                                                            <input type="text" onChange={this.handleFullBidChange}
                                                                   className="form-control" onKeyUp={this.calc_amt} name="rate"
                                                                   placeholder="Bid"/>
                                                            <label>Your Bid Rate (N/$)</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="form-floating mb-3">
                                                            <input type="text" disabled value={this.state.totalBidPrice}
                                                                   className="form-control" placeholder="Volume"/>
                                                            <label>Total Bid Price</label>
                                                        </div>
                                                    </div>

                                                    <div className="form-floating col-6 mb-3">
                                                        <select id="float_asset" onChange={this.handleFullBidChange} name="expiresIn"
                                                                className="form-select">
                                                            <option value="" selected disabled>-- Select expiry time --</option>
                                                            <option value="10m">10 minutes</option>
                                                            <option value="30m">30 minutes</option>
                                                            <option value="1h">1 hour</option>
                                                            <option value="2h">2 hours</option>
                                                        </select>
                                                        <label>Bid Expiry Time</label>
                                                    </div>
                                                </div>

                                                <button className="btn btn-success mb-2 mt-4 btn-lg w-100">Submit Bid</button>
                                            </form>
                                            <div className="px-3 pb-4">
                                                <button className="btn btn-warning mb-2 btn-lg w-100" onClick={this.buyNow}>Buy Now</button>
                                                <a onClick={this.addToWatchlist} className="btn btn-outline-primary btn-lg w-100">Add to
                                                    Watchlist</a>
                                            </div>
                                        </div>
                                    ):(
                                        <div className="text-center p-5">
                                            <p className="lead">You do not have a {this.state.asset.abbr} wallet. You need to create a wallet
                                                before you can bid.</p>

                                            <Link href="/wallet">
                                                <a className="btn btn-warning"><i className="fa fa-wallet"></i> Create {this.state.asset.abbr} wallet</a>
                                            </Link>
                                        </div>
                                    )
                                }


                            </div>
                                    </div>
                                )
                                ):(
                                    <div className="p-5 w-100 text-center ">
                                        <h5>Advert Expired</h5>
                                        <p>This advert is no longer available, view another advert you can bid on</p>
                                    </div>
                                )
                            }

                        </div>
                    </section>


                )}
            </div>
        );
    }
}



