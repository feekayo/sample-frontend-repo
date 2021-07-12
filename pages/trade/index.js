import Trade_Layout from "../../components/layout/trade_layout";
import React, {Component,useEffect,useContext, useState} from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import ls from "local-storage";
import * as Constants from "../../components/config/constant";
import * as Session from "../../components/config/session";
import CreateSale from "./create_sale";
import Link from "next/link";
import ViewTrade from "./view_trade";
import TradingViewWidget from 'react-tradingview-widget';
import * as Api from "../../components/config/api";
import Skeleton from "react-loading-skeleton";
import Countdown from "react-countdown";
import axios from "axios";
import PaymentInterface from "./view_payment";
import Reconcile from "./reconcile";
import release from "./release";
import moment from "moment";
import Swal from "sweetalert2";
import activityContext from "../../components/config/context";
import Switch, { Case, Default } from 'react-switch-case';
import NProgress from "nprogress";
import {participatingBids} from "../../components/config/api";
import DataTable from "react-data-table-component";
import * as Tables from "../../components/common/tables";
import viewAdvert from "./view";
import ToolkitProvider, {Search} from "react-bootstrap-table2-toolkit";
import firebase from "firebase";

const { SearchBar } = Search;


export default class trade2 extends Component{
    static contextType = activityContext;
    constructor(props) {
        super(props);
        this.state = {
            loading : false,
            showTradeView : false,
            maxLiveSales : false,
            generalNotifications : [],
            myNotifications : [],
            watchlist : {},
            bidHistory : [],
            activeSales : [],
            advertHistory : [],
            liveData : [],
            payment : [],
            reconcile : [],
            payment_count : 0,
            incoming_payment_count : 0,
            incomingPayment : [],
            participatingBids : [],
            assets : ls.get('assets'),
            tradeValue : '0',
            tradeRoute : null,
            mobileView : false,
            current_asset : ls.get('currentAsset'),

        };
        this.SwitchCase = this.SwitchCase.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.fetchNotifications = this.fetchNotifications.bind(this);
    }




    handleChange(e) {
        this.setState({...this.state, reconcile: {...this.state.reconcile, [e.target.name]: e.target.value } });
    }

    addToWatchlist(id) {

        NProgress.start();
        NProgress.inc();
        NProgress.configure({ ease: 'ease', speed: 500 });

        fetch(Api.watchlist + '/' + id,
            {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + Session.token,
                    'ip' : ls.get('ip'),
                    'device' : ls.get('device'),
                }
            }).then((res) => res.json())
            .then((response261) => {
             //   console.log(response261);
                NProgress.done();
                if (response261.status === 'successful') {
                    NProgress.done();
                    Swal.fire({
                        title: 'Success!',
                        text: response261.msg,
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    });

                } else {
                    NProgress.done();

                    Swal.fire({
                        title: 'Failed!',
                        text: response261.msg,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                }

            })


    };

    getLiveSales() {
        fetch(Api.fetchAllAdverts + '?status=active&expired=false',
            {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response26) => {
                this.setState({liveData: response26.data});
                //console.log(response26);

                // get user adverts and active sales
                this.getUserAdvert();

                // get watchlist
                this.getWatchlist();

                // get payments
                this.getPayments();

                // get bid history
                this.getBidHistory();

                // participating bids
                this.getParticipatingBids();
            })
    }

    getParticipatingBids() {
        fetch(Api.participatingBids,
            {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response261) => {
                //console.log('FETCHING PARTICIPATING BIDS');
                this.setState({participatingBids : response261.data});
          //  console.log(response261);

            })
    }

    getUserAdvert()
    {
        // get advert history
        fetch(Api.userAdvert,
            {
                method: 'GET',
                'headers': {
                    'Authorization': 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response2) => {
                this.setState({advertHistory : response2.data});
              //  console.log(this.state.advertHistory)
            })


        // get active sales
        fetch(Api.userAdvert + '?status=active&expired=false',
            {
                method: 'GET',
                'headers': {
                    'Authorization': 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response3) => {
                this.setState({activeSales : response3.data});
               // console.log(response3)
            })

    }

    getWatchlist()
    {
        fetch(Api.watchlist,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response1) => {
             //   console.log(response1);
                if(response1.data) {
                    this.setState({watchlist: response1.data});
                }else{{
                    this.setState({watchlist: []});
                }}

            })
    }

    removeFromWatchlist(id)
    {
        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            fetch(Api.deleteWatchlist + '/' + id,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response109) => {
                NProgress.done();
                Swal.fire({
                    title: 'Success!',
                    text: response109.msg,
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });
            //    console.log(response109);
                this.getParticipatingBids();
                this.getUserAdvert();
                this.getWatchlist();
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

    getPayments()
    {
        fetch(Api.fetchOutgoingPayments,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response109) => {
                this.setState({payment : response109.data.reverse()});
               // console.log(response109);
                var counter = 0
                for(var i = 0; i < response109.data.length; i++)
                {
                    if(response109.data[i].payment == 'awaitingPayment' || response109.data[i].payment == 'awaitingConfirmation')
                    {
                        counter = counter + 1;
                    }
                }

                this.setState({payment_count : counter});
            })


        fetch(Api.fetchIncomingPayments,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response110) => {
              //  console.log(response110);
                this.setState({incomingPayment : response110.data.reverse()});

                var counter2 = 0
                for(var i = 0; i < response110.data.length; i++)
                {
                    if(response110.data[i].payment == 'awaitingPayment' || response110.data[i].payment == 'awaitingConfirmation')
                    {
                        counter2 = counter2 + 1;
                    }
                }

                this.setState({incoming_payment_count : counter2});
            })
    }

    getBidHistory()
    {
        // get bid history
        fetch(Api.bidHistory,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response12) => {
                this.setState({bidHistory : response12.data});
                // console.log(response12);
            })
    }

    SwitchCase() {

        switch(this.state.tradeRoute) {
            case
            'createSale'
            :
                return <CreateSale />;
            case
            'viewTrade'
            :
                return <ViewTrade id={this.state.tradeValue} />;
            case
            'viewSale'
            :
                return viewAdvert( {advert : this.state.tradeValue, vision : 'mobile'});
            case
            'reconcile'
            :
                return <Reconcile data={this.state.tradeValue} />;
            case
            'release'
            :
                return release({id : this.state.tradeValue});
            case
            'viewPayment'
            :
                return <PaymentInterface payment={this.state.tradeValue} />;
            default:
                return (
                    <div className="text-center margin_100-top lead p-5 font-gray">
                        <i className="fa fa-window-restore mb-3 fa-2x"></i>
                        <h5>Activity Panel</h5>
                        <p>Actions and pages will be displayed here for you to respond to</p>
                    </div>
                );
        }
    }

    reconcile(id, bidAmt, form = null)
    {

        try {

            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            var formdata = new FormData();
            formdata.append("bidId", id);

            fetch(Api.reconciliation,
                {
                    method: 'POST',
                    body: JSON.stringify({'bidId' : id, 'subject' : this.state.reconcile.subject}),
                    headers: {
                        Authorization : 'Bearer ' + Session.token,
                        'Content-type': 'application/json',
                        'ip' : ls.get('ip'),
                        'device' : ls.get('device'),
                    }
                }).then((res) => res.json())
                .then((response_110) => {
                    NProgress.done();
                    this.getPayments();
                   // console.log(response_110);

                    if(response_110.status === 'successful') {

                        let data = {data : response_110.data, bid : bidAmt};

                        this.setState({tradeRoute : 'reconcile', tradeValue : data, mobileView: true})

                        if(form === true) {
                            Swal.fire({
                                title: 'Reconciliation Started',
                                text: 'Close this pop-up to continue',
                                icon: 'success',
                                confirmButtonText: 'Ok'
                            });
                        }
                    }else{
                        Swal.fire({
                            title: 'Failed!',
                            text: response_110.err,
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


    fetchNotifications()
    {
        this.context.initializeFirebase();
        if(ls.get('v_token')) {
            const messageRef = this.context.firebase.database().ref(  '/notifications/general');
            messageRef.on('value', (snapshot) => {
                const messages = snapshot.val();
               // console.log(messages);
                const id = snapshot.key;
                const messageList = [];
                let counter = 0;

                if(messages) {
                    for (let id in messages) {
                        let array = {'message' : messages[id].message, 'date' : messages[id].timestamp};
                        messageList.push(array);

                        if(messages[id].status === true)
                        {
                            //openNotificationWithIcon('success','Wallet Transaction', messages[id].message);

                            if (messages[id].msg === 'new-advert') {
                                        NProgress.done();
                                        this.getParticipatingBids();
                                        this.getLiveSales();
                                        this.getUserAdvert();
                                        this.getWatchlist();
                                    }else if (messages[id].msg === 'reload paticipating bid') {
                                this.getParticipatingBids();
                                        this.getUserAdvert();
                                        this.getWatchlist();
                                    }else if (messages[id].msg === 'reload payment') {
                                this.getPayments();
                            }


                            let key = Object.keys(messages)[counter];
                            messageRef.child(key).update({'status': false})
                        }

                        counter++;
                    }
                }
                //console.log(id);
                this.setState({generalNotification : messageList});

            });


        }
    }


    componentDidMount() {

        Session.validateUser();

        if(this.state.assets.length <= 0)
        {
            Constants.setAssets();
            this.setState({loading : true});
        }else {

           // console.log(ls.get('assets'));
            // live sales
            this.getLiveSales();

            this.fetchNotifications();

            setTimeout(() => {
                this.setState({showTradeView: true})
            }, 2000);



        }

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.assets !== this.state.assets) {
            console.log('changed');
            this.setState({assets : this.state.assets});
        }
    }

    render() {



        return(

            <Trade_Layout title="Trade">
                { this.state.loading ? (
                    <Constants.loading />
                ) : (

                        <div className="d-flex align-items-stretch h-100">
                            <div className="main h-100 padding_50-bottom w-70 bg-white border_right">

                                <div className="top_summary border-bottom p-2 row">
                                    <div className="col-lg-2 col-3 border_right">
                                        <div className="dropdown">
                                            <button className="btn w-100  btn-warning dropdown-toggle" type="button" id="dropdownMenuButton"
                                                    data-bs-toggle="dropdown" aria-expanded="false">
                                                <span className="d-none d-lg-inline">{this.state.current_asset.name}</span> ({this.state.current_asset.abbr})
                                            </button>
                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                {this.state.assets.map((asset, index) => (
                                                    <li><a onClick={() => Constants.switchAsset(asset.abbr)} className="dropdown-item" href="#">{asset.name} ({asset.abbr})</a></li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-9 border_right">
                                        <Constants.ticker display="true" />
                                    </div>


                                    <div className="col-4 d-none d-lg-block">

                                        <a onClick={() => {this.setState({tradeRoute : 'none', mobileView : true}) }} className="btn btn-lg font-weight-600 font-sm no_border_radius me-3 btn-warning">Create Bulk Bid</a>
                                        <a onClick={() => {this.setState({tradeRoute : 'createSale', mobileView : true}) } } className="btn btn-lg font-weight-600 font-sm no_border_radius btn-success">Create Sale</a>
                                    </div>


                                </div>

                                <div className="col-12 p-2 d-md-none ">

                                    <a onClick={() => {this.setState({tradeRoute : 'none', mobileView : true}) }} className="btn btn-lg  font-weight-600 font-sm no_border_radius w-50 btn-warning">Create Bulk Bid</a>
                                    <a onClick={() => {this.setState({tradeRoute : 'createSale', mobileView : true}) } } className="btn btn-lg font-weight-600 w-50 font-sm no_border_radius btn-success">Create Sale</a>

                                    <div className="mt-3 border p-3">
                                    <Constants.walletSummary />
                                    </div>
                                </div>
                                {
                                    this.state.maxLiveSales === true ? (
                                        <section className="p-2">
                                            <div className="row">

                                                <div className="col-lg-12">
                                                    <button onClick={() => this.setState({maxLiveSales : false})} className="btn btn-outline-danger btn-sm float-end"><i className="fas fa-window-close"></i> Close</button>
                                                    <h4 className=""><i className="fa fa-circle font-red blink"></i> Live Sales - {this.state.current_asset.abbr}</h4>
                                                    <div className="live_stats bg-gray">

                                                        <table className="table text-center table-responsive table-borderless bg-gray table-hover">
                                                            <thead>
                                                            <tr>
                                                                <th className="bg-dark font-white shadow-sm p-2">Quantity</th>
                                                                <th className="bg-dark font-white p-2 shadow-sm">Value($)</th>
                                                                <th className="bg-dark font-white p-2 shadow-sm">Base Price (N/$)</th>
                                                                <th className="bg-dark font-white p-2 shadow-sm">Time Left</th>
                                                                <th className="bg-dark font-white p-2 shadow-sm">No. of Bids</th>
                                                                <th className="bg-dark font-white p-2 shadow-sm">Seller</th>
                                                                <th className="bg-dark font-white p-2 shadow-sm">Partial Sale</th>
                                                                <th className="bg-dark font-white p-2 shadow-sm">Payment Bank</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {
                                                                this.state.liveData.length <= 0 ? (
                                                                    <tr>
                                                                        <td colSpan="12">
                                                                            <div className="p-5 ">

                                                                                <p className="">No data to display</p>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ):(
                                                                    this.state.liveData.map((data,index) =>{
                                                                        if(data.asset === this.state.current_asset.abbr.toLowerCase()) {
                                                                            if(data.ownerId._id !== Session.id && data.balance !== 0) {
                                                                                let time_remaining = (new Date(data.expiringTime).getTime() - new Date().getTime());
                                                                                if(time_remaining > 0) {
                                                                                    return (
                                                                                        <tr className={
                                                                                            time_remaining <= 200000 ? (
                                                                                                "text-danger"
                                                                                            ) : time_remaining < 300000 && time_remaining > 200000 ? (
                                                                                                "text-primary-dark"
                                                                                            ) : (
                                                                                                "text-black"
                                                                                            )
                                                                                        } onClick={() => {
                                                                                            this.setState({
                                                                                                tradeRoute: 'viewTrade',
                                                                                                tradeValue: data._id,
                                                                                                mobileView : true
                                                                                            })
                                                                                        }}>
                                                                                            <td>{data.balance.toFixed(5)}</td>
                                                                                            <td>{(data.balance * this.state.current_asset.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                                                                            <td>{data.openingRate.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                                                                            <td>
                                                                                                <Countdown
                                                                                                    date={Date.parse(data.expiringTime)}/>
                                                                                            </td>
                                                                                            <td>
                                                                                                {data.bids.length}
                                                                                            </td>
                                                                                            <td className="text-capitalize">
                                                                                                {data.ownerId.username}
                                                                                            </td>
                                                                                            <td className="text-capitalize">
                                                                                                {
                                                                                                    data.partBid === true ? (
                                                                                                        <span>Allowed</span>
                                                                                                    ) : (
                                                                                                        <span>Not Allowed</span>
                                                                                                    )
                                                                                                }
                                                                                            </td>
                                                                                            <td className="text-capitalize">
                                                                                                {data.defaultBank.bankName}
                                                                                                <i onClick={() => this.addToWatchlist(data._id)} className="fa ms-2 font-black fa-eye btn btn-sm btn-primary"></i>
                                                                                            </td>
                                                                                        </tr>
                                                                                    )
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                )
                                                            }

                                                            </tbody>
                                                        </table>


                                                    </div>
                                                </div>

                                            </div>

                                            <hr/>
                                        </section>
                                    ):( <span></span> )
                                }
                                <section className="p-2">
                                    <div className="row">

                                        <div className={
                                            this.state.maxLiveSales === false ? (
                                                "col-lg-6"
                                            ) : ("d-none col-lg-12")
                                        }>
                                            <div className="d-none d-lg-block">
                                            {
                                                this.state.showTradeView === true ? (

                                                    <TradingViewWidget symbol={this.state.current_asset.chart} width="100%"
                                                                       height="400px" interval="5"/>

                                                ) : (
                                                    <div>
                                                        <Skeleton height={50} className="mb-1" />
                                                        <Skeleton height={350} />
                                                    </div>
                                                )
                                            }
                                            </div>
                                        </div>

                                        {
                                            this.state.maxLiveSales === false ? (
                                                <div className="col-lg-6 mt-3">
                                                    <button onClick={() => this.setState({maxLiveSales : true} )}
                                                            className="btn btn-warning btn-sm float-end"><i
                                                        className="fas fa-window-maximize"></i> Maximize
                                                    </button>
                                                    <h4 className=""><i className="fa fa-circle font-red blink"></i> Live
                                                        Sales - {this.state.current_asset.abbr}</h4>
                                                    <div className="live_stats bg-gray">

                                                        <table
                                                            className="table text-center table-responsive table-borderless bg-gray table-hover">
                                                            <thead>
                                                            <tr>
                                                                <th className="bg-dark font-white shadow-sm p-2">Quantity</th>
                                                                <th className="bg-dark font-white p-2 shadow-sm">Value($)</th>
                                                                <th className="bg-dark font-white p-2 shadow-sm">Base Price (N/$)</th>
                                                                <th className="bg-dark font-white p-2 shadow-sm">Time Left</th>
                                                                {/*<th className="p-2 shadow-sm">T1</th>*/}
                                                                {/*<th className="p-2 shadow-sm">T2</th>*/}
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {
                                                                this.state.liveData.length <= 0 ? (
                                                                   <tr>
                                                                    <td colSpan="12">
                                                                        <div className="p-5 ">

                                                                            <p className="">No data to display</p>
                                                                        </div>
                                                                    </td>
                                                                   </tr>
                                                                ) : (
                                                                    this.state.liveData.map((data, index) => {
                                                                        if (data.asset === this.state.current_asset.abbr.toLowerCase()) {
                                                                            if (data.ownerId._id !== Session.id && data.balance !== 0) {
                                                                                let time_remaining = (new Date(data.expiringTime).getTime() - new Date().getTime());
                                                                                if(time_remaining > 0) {
                                                                                    return (
                                                                                        <tr className={
                                                                                            time_remaining <= 200000 ? (
                                                                                                "text-danger"
                                                                                            ) : time_remaining < 300000 && time_remaining > 200000 ? (
                                                                                                "text-primary-dark"
                                                                                            ) : (
                                                                                                "text-black"
                                                                                            )
                                                                                        } onClick={() => {
                                                                                            this.setState({
                                                                                                tradeRoute: 'viewTrade',
                                                                                                tradeValue: data._id,
                                                                                                mobileView : true
                                                                                            })
                                                                                        }}>
                                                                                            <td>{data.balance.toFixed(5)} {
                                                                                                data.partBid === true ? (
                                                                                                    <sup
                                                                                                        className='fw-bold text-warning'>P</sup>
                                                                                                ) : (
                                                                                                    <sup
                                                                                                        className='fw-bold text-success'>F</sup>
                                                                                                )
                                                                                            }</td>
                                                                                            <td>{(data.balance * this.state.current_asset.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                                                                            <td>{data.openingRate.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                                                                            <td>

                                                                                                <Countdown
                                                                                                    date={Date.parse(data.expiringTime)}/>

                                                                                                    <i onClick={() => this.addToWatchlist(data._id)} className="fa ms-2 font-black fa-eye btn btn-sm btn-primary"></i>
                                                                                            </td>
                                                                                            {/*<td>*/}
                                                                                            {/*    {time_remaining}*/}
                                                                                            {/*</td>*/}
                                                                                            {/*<td>*/}
                                                                                            {/*    <p>{new Date(data.expiringTime).getTime()}</p>*/}
                                                                                            {/*    <p>{new Date().getTime()}</p>*/}
                                                                                            {/*</td>*/}

                                                                                        </tr>
                                                                                    )
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                )
                                                            }

                                                            </tbody>
                                                        </table>


                                                    </div>
                                                </div>
                                            ) : (<span></span>)
                                        }

                                        <div className="clearfix"></div>

                                        <div className="col-12 mt-4">

                                            <div className="accordion fancy_accordion" id="accordionExample">
                                                <div className="accordion-item trade_accordion">
                                                    <div className="bg-gray accordion-header clearfix" id="headingOne">

                                                        <button className="float-end d-lg-flex d-none show_hide_button accordion-button" type="button" data-bs-toggle="collapse"
                                                                data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                        </button>

                                                        <ul className="nav nav-pills" id="pills-tab" role="tablist">
                                                            <li className="nav-item" role="presentation">
                                                                <a className="nav-link active" id="pills-home-tab" data-bs-toggle="pill"
                                                                   href="#pills-bids" role="tab" aria-controls="pills-home"
                                                                   aria-selected="true">Participating Bids</a>
                                                            </li>
                                                            <li className="nav-item" role="presentation">
                                                                <a className="nav-link" id="pills-profile-tab" data-bs-toggle="pill"
                                                                   href="#pills-watchlist" role="tab" aria-controls="pills-profile"
                                                                   aria-selected="false">Watchlist <badge className="badge bg-danger">{this.state.watchlist.length}</badge></a>
                                                            </li>

                                                        </ul>

                                                    </div>
                                                    <div id="collapseOne" className="accordion-collapse collapse show"
                                                         aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                        <div className="accordion-body">


                                                            <div className="tab-content" id="pills-tabContent">
                                                                <div className="tab-pane fade show table-responsive active" id="pills-bids" role="tabpanel"
                                                                     aria-labelledby="pills-home-tab">


                                                                    <div className="d-none d-lg-block">


                                                                    <table className="table table-striped table-hover font-xs text-center d_table">
                                                                        <thead>
                                                                        <tr>
                                                                            <th>S/N</th>
                                                                            <th>Seller</th>
                                                                            <th>Asset</th>
                                                                            <th>Quantity</th>
                                                                            <th>Value($)</th>
                                                                            <th className="d-none d-md-table-cell">Top Bid (N/$)</th>
                                                                            <th className="d-none d-md-table-cell">My Bid (N/$)</th>
                                                                            <th>Total Price (&#8358;)</th>
                                                                            <th>Bid Expiry</th>
                                                                            <th>Time Left</th>
                                                                            <th className="">Action</th>
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                        {
                                                                            this.state.participatingBids.length >= 1 ? (
                                                                                this.state.participatingBids.map((bid,index) => {

                                                                                    let listAsset;
                                                                                    let count = this.state.assets.length;

                                                                                    for(let i = 0; i < count; i++)
                                                                                    {
                                                                                        let data = this.state.assets[i];

                                                                                        if (bid.advertId.asset.toUpperCase() === data.abbr) {
                                                                                            listAsset = data;
                                                                                        }

                                                                                    }
                                                                                    let time_remaining = (new Date(bid.expiringTime).getTime() - new Date().getTime());
                                                                                    if(time_remaining > 0) {

                                                                                        return (
                                                                                            <tr onClick={() => {
                                                                                                this.setState({
                                                                                                    tradeRoute: 'viewTrade',
                                                                                                    tradeValue: bid.advertId._id,
                                                                                                    mobileView: true
                                                                                                })
                                                                                            }}>
                                                                                                <td>{index + 1}</td>
                                                                                                <td>{bid.sellerId.username}</td>
                                                                                                <td>{bid.advertId.asset.toUpperCase()}</td>
                                                                                                <td>{bid.advertId.amount.toFixed(5)} {
                                                                                                    bid.advertId.partBid === true ? (
                                                                                                        <sup
                                                                                                            className='fw-bold text-warning'>P</sup>
                                                                                                    ) : (
                                                                                                        <sup
                                                                                                            className='fw-bold text-success'>F</sup>
                                                                                                    )
                                                                                                }</td>
                                                                                                <td>{(bid.advertId.balance * listAsset.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                                                                                <td className="d-none d-md-table-cell">{bid.higestBid}</td>
                                                                                                <td className="d-none d-md-table-cell">
                                                                                                    {bid.rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                                                </td>
                                                                                                <td>
                                                                                                    {(bid.rate * (bid.advertId.amount * listAsset.rate)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                                                </td>
                                                                                                <td>
                                                                                                    {
                                                                                                        bid.expiringTime ? (
                                                                                                            <Countdown
                                                                                                                date={Date.parse(bid.expiringTime)}/>
                                                                                                        ) : (
                                                                                                            <span>N/A</span>
                                                                                                        )
                                                                                                    }
                                                                                                </td>
                                                                                                <td><Countdown
                                                                                                    date={Date.parse(bid.advertId.expiringTime)}/>
                                                                                                </td>
                                                                                                <td className="">
                                                                                                    <button
                                                                                                        className="btn btn-sm btn-warning">Update
                                                                                                        Bid
                                                                                                    </button>
                                                                                                </td>
                                                                                            </tr>
                                                                                        )
                                                                                    }
                                                                                })

                                                                            ):(
                                                                                <tr>
                                                                                    <td colSpan="12" className="p-5 lead fw-bold">No participating bids yet
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        }


                                                                        </tbody>
                                                                    </table>
                                                                    </div>

                                                                    <div className="d-block d-lg-none">
                                                                        <div className="bg-danger border font-xs text-center font-white mb-2 p-2"><i className="fa fa-info-circle"></i> Select a bid to update bid price</div>
                                                                        {
                                                                            this.state.participatingBids.length >= 1 ? (
                                                                                this.state.participatingBids.map((bid,index) => {

                                                                                    let listAsset;
                                                                                    let count = this.state.assets.length;

                                                                                    for(let i = 0; i < count; i++)
                                                                                    {
                                                                                        let data = this.state.assets[i];

                                                                                        if (bid.advertId.asset.toUpperCase() === data.abbr) {
                                                                                            listAsset = data;
                                                                                        }

                                                                                    }
                                                                                    let time_remaining = (new Date(bid.expiringTime).getTime() - new Date().getTime());
                                                                                    if(time_remaining > 0) {

                                                                                        return (
                                                                                            <div className="border p-3 border_radius mb-2 shadow-sm" onClick={() => {
                                                                                                this.setState({
                                                                                                    tradeRoute: 'viewTrade',
                                                                                                    tradeValue: bid.advertId._id,
                                                                                                    mobileView: true
                                                                                                })
                                                                                            }}>
                                                                                                <div className="row">
                                                                                                    <div className="col-8">
                                                                                                        <h6 className="m-0">
                                                                                                            {bid.advertId.amount.toFixed(5)} {bid.advertId.asset.toUpperCase()} <i className="fas text-success fa-exchange-alt"></i> ${(bid.advertId.balance * listAsset.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                                                        </h6>
                                                                                                        <p className="font-xs text-capitalize font-gray"><badge className="badge font-black bg-primary">Seller:</badge> {bid.sellerId.username}</p>
                                                                                                    </div>
                                                                                                    <div className="col-4">
                                                                                                        <i className="fas fa-clock"></i> {
                                                                                                            bid.expiringTime ? (
                                                                                                                <Countdown
                                                                                                                    date={Date.parse(bid.expiringTime)}/>
                                                                                                            ) : (
                                                                                                                <span>N/A</span>
                                                                                                            )
                                                                                                        }
                                                                                                    </div>

                                                                                                    <div className="col-12 border_top">
                                                                                                        <div className="row">
                                                                                                            <div className="col p-2 border_right">
                                                                                                                <p className=" m-0 text-uppercase font-xs font-weight-800">Top Bid (N/$)</p>
                                                                                                                {bid.higestBid}
                                                                                                            </div>
                                                                                                            <div className="col p-2">
                                                                                                                <p className="m-0 text-uppercase font-xs font-weight-800">My Bid (N/$)</p>
                                                                                                                {bid.rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>

                                                                                            </div>
                                                                                        )
                                                                                    }
                                                                                })

                                                                            ):(
                                                                                <div className="p-5 text-center lead fw-bold">No participating bids yet
                                                                                </div>
                                                                            )
                                                                        }


                                                                    </div>
                                                                </div>

                                                                <div className="tab-pane  fade" id="pills-watchlist" role="tabpanel"
                                                                     aria-labelledby="pills-profile-tab">
                                                                    <div className="table-responsive">


                                                                        <div className="d-none d-lg-block">
                                                                    <table className="table table-hover table-striped font-xs text-center table-hover d_table">
                                                                        <thead>
                                                                        <tr>
                                                                            <th>S/N</th>
                                                                            <th>Seller</th>
                                                                            <th>Asset</th>
                                                                            <th>Quantity</th>
                                                                            <th>Value($)</th>
                                                                            {/*<th>Top Bid (N/$)</th>*/}
                                                                            {/*<th>My Bid (N/$)</th>*/}
                                                                            {/*<th>Total Price (&#8358;)</th>*/}
                                                                            {/*<th>Bid Expiry</th>*/}
                                                                            <th>Time Left</th>
                                                                            <th className="">Action</th>
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                        {
                                                                            this.state.watchlist.length >= 1 ? (
                                                                                this.state.watchlist.map((trade,index) => {

                                                                                    let listAsset;
                                                                                    let count = this.state.assets.length;

                                                                                    for(let i = 0; i < count; i++)
                                                                                    {
                                                                                        let data = this.state.assets[i];

                                                                                        if (trade.asset.toUpperCase() === data.abbr) {
                                                                                            listAsset = data;
                                                                                        }


                                                                                    }

                                                                                    return (
                                                                                        <tr onClick={() => {
                                                                                            this.setState({
                                                                                                tradeRoute: 'viewTrade',
                                                                                                tradeValue: trade._id,
                                                                                                mobileView: true
                                                                                            })
                                                                                        }}>
                                                                                            <td>{index + 1}</td>
                                                                                            <td className="text-capitalize">{trade.ownerId.username}</td>
                                                                                            <td>{trade.asset.toUpperCase()}</td>
                                                                                            <td>{trade.amount.toFixed(5)} {
                                                                                                trade.partBid === true ? (
                                                                                                    <sup className='fw-bold text-warning'>P</sup>
                                                                                                ):(
                                                                                                    <sup className='fw-bold text-success'>F</sup>
                                                                                                )
                                                                                            }</td>
                                                                                            <td>{(trade.balance * listAsset.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                                                                            {/*<td></td>*/}
                                                                                            {/*<td></td>*/}
                                                                                            {/*<td></td>*/}
                                                                                            {/*<td>N/A</td>*/}
                                                                                            <td><Countdown date={Date.parse(trade.expiringTime)} /></td>
                                                                                            <td className="">
                                                                                                <button className="btn btn-sm btn-warning" onClick={() => {this.setState({tradeRoute : 'viewTrade',tradeValue : trade._id, mobileView : true})} }>View</button>
                                                                                                <button className="btn btn-sm btn-danger" onClick={() => this.removeFromWatchlist(trade._id)}>Remove</button>
                                                                                            </td>
                                                                                        </tr>
                                                                                    )
                                                                                })

                                                                            ):(
                                                                                <tr>
                                                                                    <td colSpan="12" className="p-5 fw-bold">No advert in your watchlist
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        }


                                                                        </tbody>
                                                                    </table>
                                                                        </div>

                                                                        <div className="d-block d-lg-none">
                                                                            <div className="bg-danger border font-xs text-center font-white mb-2 p-2"><i className="fa fa-info-circle"></i> Select a trade to view</div>
                                                                            {
                                                                                this.state.watchlist.length >= 1 ? (
                                                                                    this.state.watchlist.map((trade,index) => {

                                                                                        let listAsset;
                                                                                        let count = this.state.assets.length;

                                                                                        for(let i = 0; i < count; i++)
                                                                                        {
                                                                                            let data = this.state.assets[i];

                                                                                            if (trade.asset.toUpperCase() === data.abbr) {
                                                                                                listAsset = data;
                                                                                            }


                                                                                        }

                                                                                        return (
                                                                                            <div className="border p-3 border_radius mb-2 shadow-sm" onClick={() => {
                                                                                                this.setState({
                                                                                                    tradeRoute: 'viewTrade',
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


                                                                                                </div>

                                                                                            </div>

                                                                                        )
                                                                                    })

                                                                                ):(
                                                                                    <div className="p-5 text-center fw-bold">No advert in your watchlist</div>


                                                                                )
                                                                            }


                                                                        </div>

                                                                    </div>
                                                                </div>

                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="accordion fancy_accordion mt-5" id="accordionExample3">
                                                <div className="accordion-item trade_accordion">
                                                    <div className="bg-gray accordion-header clearfix" id="headingOne">
                                                        <button className="float-end d-lg-flex d-none p-2 accordion-button" type="button" data-bs-toggle="collapse"
                                                                data-bs-target="#collapseSales" aria-expanded="true" aria-controls="collapseSales">
                                                        </button>

                                                        <h5 className="">Active Sales <badge className="badge bg-danger">{this.state.activeSales.length}</badge></h5>

                                                    </div>
                                                    <div id="collapseSales" className="accordion-collapse collapse show"
                                                         aria-labelledby="headingOne" data-bs-parent="#accordionExample3">
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
                                                                    this.state.activeSales.length >= 1 ? (
                                                                        this.state.activeSales.map((trade,index) => {

                                                                            let listAsset;
                                                                            let count = this.state.assets.length;

                                                                            for(let i = 0; i < count; i++)
                                                                            {
                                                                                let data = this.state.assets[i];

                                                                                if (trade.asset.toUpperCase() === data.abbr) {
                                                                                    listAsset = data;
                                                                                }


                                                                            }

                                                                            return (
                                                                                <tr>
                                                                                    <td>{index + 1}</td>
                                                                                    <td>{trade.asset.toUpperCase()}</td>
                                                                                    <td>{trade.balance.toFixed(5)} {
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
                                                                     this.state.activeSales.length >= 1 ? (
                                                                         this.state.activeSales.map((trade,index) => {

                                                                             let listAsset;
                                                                             let count = this.state.assets.length;

                                                                             for(let i = 0; i < count; i++)
                                                                             {
                                                                                 let data = this.state.assets[i];

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

                                            <div className="accordion fancy_accordion mt-5" id="accordionExample2">
                                                <div className="accordion-item trade_accordion">
                                                    <div className="bg-gray accordion-header clearfix" id="headingOne">
                                                        <button className="float-end d-none d-lg-flex accordion-button" type="button" data-bs-toggle="collapse"
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
                                                                   aria-selected="false">Payments <badge className="badge bg-danger">{this.state.payment_count + this.state.incoming_payment_count}</badge></a>
                                                            </li>

                                                        </ul>

                                                    </div>
                                                    <div id="collapseDash" className="accordion-collapse collapse show"
                                                         aria-labelledby="headingOne" data-bs-parent="#accordionExample2">
                                                        <div className="accordion-body">


                                                            <div className="tab-content" id="pills-tabContent">
                                                                <div className="tab-pane fade show active" id="pills-bids3" role="tabpanel"
                                                                     aria-labelledby="pills-home-tab">

                                                                    <div className="d-none d-lg-block">
                                                                    <DataTable
                                                                        className="data_table_minimized"
                                                                        data={this.state.bidHistory}
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
                                                                            data={this.state.bidHistory}
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
                                                                        data={this.state.advertHistory}
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
                                                                            data={this.state.advertHistory}
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
                                                                               aria-controls="home" aria-selected="true">Incoming <badge className="badge bg-danger">{this.state.incoming_payment_count}</badge></a>
                                                                        </li>
                                                                        <li className="nav-item" role="presentation">
                                                                            <a className="nav-link" id="profile-tab" data-bs-toggle="tab"
                                                                               href="#profile" role="tab" aria-controls="profile"
                                                                               aria-selected="false">Outgoing <badge className="badge bg-danger">{this.state.payment_count}</badge></a>
                                                                        </li>

                                                                    </ul>
                                                                    <div className="tab-content border no_border-top" id="myTabContent">

                                                                       {/*Incoming payment*/}
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
                                                                                    <th>Option</th>
                                                                                </tr>
                                                                                </thead>
                                                                                <tbody>

                                                                                {
                                                                                    this.state.incomingPayment.map((pay,index) => {
                                                                                        if(pay.payment !== 'inactive' && pay.payment !== 'failed') {
                                                                                            let listAsset;
                                                                                            let count = this.state.assets.length;

                                                                                            for (let i = 0; i < count; i++) {
                                                                                                let data = this.state.assets[i];

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
                                                                                                    <td>
                                                                                                        {
                                                                                                            pay.payment === 'awaitingConfirmation' || pay.payment === 'awaitingConfimation' ? (
                                                                                                                <div>
                                                                                                                    <button
                                                                                                                        type="button"
                                                                                                                        className="btn mb-2 btn-sm btn-success w-100"
                                                                                                                        onClick={() => {
                                                                                                                            this.setState({tradeRoute : 'release', tradeValue : pay._id, mobileView : true})
                                                                                                                        }}>
                                                                                                                        Release
                                                                                                                        coins
                                                                                                                    </button>
                                                                                                                    {
                                                                                                                        pay.reconcilation === true ? (
                                                                                                                            <button
                                                                                                                                type="button"
                                                                                                                                className="btn btn-sm btn-warning w-100"
                                                                                                                                onClick={() => this.reconcile(pay._id, pay)}
                                                                                                                            >
                                                                                                                                Reconcile
                                                                                                                            </button>
                                                                                                                        ) : (
                                                                                                                            <button
                                                                                                                                type="button"
                                                                                                                                className="btn btn-sm btn-warning w-100"
                                                                                                                                data-bs-toggle="modal"
                                                                                                                                data-bs-target="#startReconciliation"
                                                                                                                                onClick={() => this.setState({reconcile: pay})}
                                                                                                                            >
                                                                                                                                Reconcile
                                                                                                                            </button>
                                                                                                                        )
                                                                                                                    }
                                                                                                                </div>
                                                                                                            ) : (
                                                                                                                <span></span>)
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

                                                                            <div className="d-lg-none d-block">
                                                                                {
                                                                                    this.state.incomingPayment.map((pay,index) => {
                                                                                        if(pay.payment !== 'inactive' && pay.payment !== 'failed') {
                                                                                            let listAsset;
                                                                                            let count = this.state.assets.length;

                                                                                            for (let i = 0; i < count; i++) {
                                                                                                let data = this.state.assets[i];

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


                                                                                                            {
                                                                                                                pay.payment === 'awaitingConfirmation' || pay.payment === 'awaitingConfimation' ? (
                                                                                                                    <div className="col-12 mt-3 pt-3 border_top">
                                                                                                                        <button
                                                                                                                            type="button"
                                                                                                                            className="btn mb-2 btn-success w-100"
                                                                                                                            onClick={() => {
                                                                                                                                this.setState({tradeRoute : 'release', tradeValue : pay._id, mobileView : true})
                                                                                                                            }}>
                                                                                                                            Release
                                                                                                                            coins
                                                                                                                        </button>

                                                                                                                        {
                                                                                                                            pay.reconcilation === true ? (
                                                                                                                                <button
                                                                                                                                    type="button"
                                                                                                                                    className="btn btn-sm btn-warning w-100"
                                                                                                                                    onClick={() => this.reconcile(pay._id, pay)}
                                                                                                                                >
                                                                                                                                    Reconcile
                                                                                                                                </button>
                                                                                                                            ) : (
                                                                                                                                <button
                                                                                                                                    type="button"
                                                                                                                                    className="btn btn-sm btn-warning w-100"
                                                                                                                                    data-bs-toggle="modal"
                                                                                                                                    data-bs-target="#startReconciliation"
                                                                                                                                    onClick={() => this.setState({reconcile: pay})}
                                                                                                                                >
                                                                                                                                    Reconcile
                                                                                                                                </button>
                                                                                                                            )
                                                                                                                        }
                                                                                                                    </div>
                                                                                                                ) : (
                                                                                                                    <span></span>)
                                                                                                            }


                                                                                                    </div>

                                                                                                </div>



                                                                                            )

                                                                                        }
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </div>


                                                                        {/*Outgoing payment*/}
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
                                                                                    <th>Option</th>
                                                                                </tr>
                                                                                </thead>
                                                                                <tbody>

                                                                                {
                                                                                    this.state.payment.map((pay,index) => {
                                                                                        if(pay.payment !== 'inactive' && pay.payment !== 'failed') {
                                                                                            let listAsset;
                                                                                            let count = this.state.assets.length;

                                                                                            for (let i = 0; i < count; i++) {
                                                                                                let data = this.state.assets[i];

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
                                                                                                    <td>
                                                                                                        {
                                                                                                            pay.payment === 'awaitingPayment' ? (
                                                                                                                <button
                                                                                                                    type="button"
                                                                                                                    className="btn btn-sm btn-success"
                                                                                                                    onClick={() => {
                                                                                                                        this.setState({tradeRoute : 'viewPayment', tradeValue : pay, mobileView : true})
                                                                                                                    }}>
                                                                                                                    Make
                                                                                                                    Payment
                                                                                                                </button>
                                                                                                            ) : pay.payment === 'awaitingConfirmation' || pay.payment === 'awaitingConfimation' ? (

                                                                                                                    pay.reconcilation === true ? (
                                                                                                                        <button
                                                                                                                            type="button"
                                                                                                                            className="btn btn-sm btn-warning w-100"
                                                                                                                            onClick={() => this.reconcile(pay._id, pay)}
                                                                                                                        >
                                                                                                                            Reconcile
                                                                                                                        </button>
                                                                                                                        ):(
                                                                                                                <button
                                                                                                                    type="button"
                                                                                                                    className="btn btn-sm btn-warning w-100"
                                                                                                                    data-bs-toggle="modal" data-bs-target="#startReconciliation"
                                                                                                                    onClick={() => this.setState({reconcile : pay})}
                                                                                                                    >
                                                                                                                    Reconcile
                                                                                                                </button>
                                                                                                                    )
                                                                                                            ) : (
                                                                                                                <span></span>
                                                                                                            )
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

                                                                            <div className="d-lg-none d-block ">

                                                                                {
                                                                                    this.state.payment.map((pay,index) => {
                                                                                        if(pay.payment !== 'inactive' && pay.payment !== 'failed') {
                                                                                            let listAsset;
                                                                                            let count = this.state.assets.length;

                                                                                            for (let i = 0; i < count; i++) {
                                                                                                let data = this.state.assets[i];

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

                                                                                                                <div className="col-12 mt-3 pt-3 border_top">
                                                                                                                    {
                                                                                                                        pay.payment === 'awaitingPayment' ? (
                                                                                                                            <button
                                                                                                                                type="button"
                                                                                                                                className="btn w-100 btn-success"
                                                                                                                                onClick={() => {
                                                                                                                                    this.setState({tradeRoute : 'viewPayment', tradeValue : pay, mobileView : true})
                                                                                                                                }}>
                                                                                                                                Make
                                                                                                                                Payment
                                                                                                                            </button>
                                                                                                                        ) : pay.payment === 'awaitingConfirmation' || pay.payment === 'awaitingConfimation' ? (

                                                                                                                            pay.reconcilation === true ? (
                                                                                                                                <button
                                                                                                                                    type="button"
                                                                                                                                    className="btn btn-sm btn-warning w-100"
                                                                                                                                    onClick={() => this.reconcile(pay._id, pay)}
                                                                                                                                >
                                                                                                                                    Reconcile
                                                                                                                                </button>
                                                                                                                            ):(
                                                                                                                                <button
                                                                                                                                    type="button"
                                                                                                                                    className="btn btn-sm btn-warning w-100"
                                                                                                                                    data-bs-toggle="modal" data-bs-target="#startReconciliation"
                                                                                                                                    onClick={() => this.setState({reconcile : pay})}
                                                                                                                                >
                                                                                                                                    Reconcile
                                                                                                                                </button>
                                                                                                                            )

                                                                                                                        ) : (
                                                                                                                            <span></span>
                                                                                                                        )
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

                                        </div>


                                    </div>
                                </section>



                            </div>

                            <div className="sidebar d-lg-block d-none w-30 h-100 p-2">


                                <div className="bg-white p-2 border rounded wallet_summary">

                                    <Constants.walletSummary />

                                </div>


                                <div className="bg-white mt-2 border rounded preview">

                                    <this.SwitchCase />

                                </div>

                            </div>
                        </div>

                )}

                { this.state.mobileView === true ? (


                <div className="bg-white mobile_panel animated fadeInUpBig mt-2 border rounded preview">
                    <button className="btn btn-danger close-btn" onClick={() => this.setState({mobileView : false})}><i className="fa fa-window-close"></i> Close</button>
                    <this.SwitchCase />

                </div>
                ):(null) }



                {/*Start reconciliation*/}
                <div className="modal fade" id="startReconciliation" data-bs-backdrop="static" data-bs-keyboard="false"
                     tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-warning">
                                <h5 className="modal-title" id="staticBackdropLabel">Reconciliation Dispute</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">

                                <div className="alert alert-warning">
                                    <p>Reconciliation dispute brings together all parties (Buyer & Seller) involved in this trade
                                        to discuss and come to a resolution regarding any issue during the completion of this trade.</p>
                                    <p className="m-0">Reconciliation dispute is monitored and controlled by an administrator</p>
                                </div>


                                    <div className="form-floating mb-3">
                                        <textarea className="form-control h-50" name="subject" onChange={this.handleChange} placeholder="reconciliation"></textarea>
                                        <label>Why are you starting a reconciliation?</label>
                                    </div>

                                <button onClick={() => {this.reconcile(this.state.reconcile._id, this.state.reconcile, true) }} className="btn btn-lg w-100 btn-success">Start Reconciliation</button>


                            </div>

                        </div>
                    </div>
                </div>

            </Trade_Layout>

        )
    }
}






