import React, {Component,useEffect, useContext, useState} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import ls from "local-storage";
import * as Constants from "../../components/config/constant";
import * as Api from "../../components/config/api";
import * as Session from "../../components/config/session";
import Countdown from "react-countdown";
import NProgress from "nprogress";
import Swal from "sweetalert2";
import {useRouter} from "next/router";
import Trade_Layout from "../../components/layout/trade_layout";
import viewTrade from "./view_trade";
import {io} from "socket.io-client";
import createSale from "./create_sale";
import moment from "moment";
import activityContext from "../../components/config/context";
import CreateSale from "./create_sale";
import ViewTrade from "./view_trade";
import release from "./release";
import PaymentInterface from "./view_payment";


export default function viewAdvert(props) {
    const [loading, setLoading] = useState(true);
    const [advert, setAdvert] = useState([]);
    const current_asset = Session.currentAsset;
    const router = useRouter();
    const [mobileView, setMobileView] = useState(false);

    const [bids, setBids] = useState([]);
    const [tradeRoute, setTradeRoute] = useState(true);
    const [tradeValue, setTradeValue] = useState(true);
    const [asset, setAsset] = useState([]);
    let myBids = 0;
    const context = useContext(activityContext);
    const [vision, setVision] = useState(props.vision);
    let mobileDisplay = false;


    let id = router.query['advert'];
    if(id === undefined)
    {
        id = props.advert;

    }

    if(vision === 'mobile')
    {
        mobileDisplay = true;
    }

    function SwitchCase() {

        switch(tradeRoute) {
            case
            'createSale'
            :
                return <CreateSale />;
            case
            'viewTrade'
            :
                return <ViewTrade id={tradeValue} />;
            case
            'reconcile'
            :
                return reconcile({id : tradeValue});
            case
            'release'
            :
                return release({id : tradeValue});
            case
            'viewPayment'
            :
                return <PaymentInterface payment={tradeValue} />;
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


    async function accept_bid(bid_id)
    {
        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            var formdata = new FormData();

            formdata.append("advertId", advert._id);
            formdata.append("bidId", bid_id);

            const res = await fetch(Api.acceptBid + '?advertId=' + advert.data._id + '&bidId=' + bid_id, {
                method: 'POST',
                //body: formdata,
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
                    text: json.msg + ". Please wait",
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });

                setTimeout(function(){ window.location.reload(); }, 3000);

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


    if (id) {

        if(advert.length === 0) {

            const response26 = fetch(Api.fetchAdvert + '/' + id,
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + Session.token
                    }
                }).then((res) => res.json())
                .then((response26) => {
                    if (response26.data !== undefined) {
                        setAdvert(response26);

                        let assets = ls.get('assets');
                       // console.log(response26);

                        let count = assets.length;

                        for(let i = 0; i < count; i++)
                        {
                            let data = assets[i];

                            if (response26.data.asset.toUpperCase() === data.abbr) {
                                setAsset(data);
                            }


                        }

                        setLoading(false);
                    }
                });

            fetch(Api.fetchAdvertBids + '/' + id,
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + Session.token
                    }
                }).then((res) => res.json())
                .then((response26) => {
                    console.log(response26.data);
                    setBids(response26.data);



                })



            context.initializeFirebase();

            const messageRef = context.firebase.database().ref(  '/notifications/general');
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

                            if (messages[id].msg === 'send-advert-bids-to-user ') {
                                fetch(Api.fetchAdvertBids + '/' + id,
                                    {
                                        method: 'GET',
                                        headers: {
                                            Authorization: 'Bearer ' + Session.token
                                        }
                                    }).then((res) => res.json())
                                    .then((response26) => {

                                        setBids(response26.data);

                                    })
                            }

                        }

                        counter++;
                    }
                }
                //console.log(id);
               // this.setState({generalNotification : messageList});

            });


            // context.socket2.emit('fetch-bids-for-an-advert', id);
            // context.socket2.on("send-advert-bids-to-user", (pBids) => {
            //     setBids(pBids);
            //     //console.log(id);
            // });

        }
    }



    useEffect(() =>
    {


    }, [loading]);


    return (

        <div>

        <Trade_Layout mobile={mobileDisplay} title="Advert">


            { loading ? (
                <Constants.loading />
            ) : (



                    <div className="d-flex align-items-stretch h-100">
                        <div className="main h-100 padding_50-bottom w-70 bg-white border_right">

                            {
                                vision !== 'mobile' ?(

                                    <div>
                            <div className="top_summary border-bottom p-2 row">

                                <div className="col-lg-8 col-12 border_right">
                                    <Constants.ticker display="true" />
                                </div>


                                <div className="col-4 d-none d-lg-block">

                                    <a onClick={() => {setTradeRoute('none'); setMobileView(true)}} className="btn btn-lg font-weight-600 font-sm no_border_radius me-3 btn-warning">Create Bulk Bid</a>
                                    <a onClick={() => {setTradeRoute('createSale');setMobileView(true)} } className="btn btn-lg font-weight-600 font-sm no_border_radius btn-success">Create Sale</a>
                                </div>
                            </div>

                            <div className="col-12 p-2 d-md-none ">

                                <a onClick={() => {setTradeRoute('none'); setMobileView(true)}} className="btn btn-lg  font-weight-600 font-sm no_border_radius w-50 btn-warning">Create Bulk Bid</a>
                                <a onClick={() => {setTradeRoute('createSale');setMobileView(true)} } className="btn btn-lg font-weight-600 w-50 font-sm no_border_radius btn-success">Create Sale</a>
                            </div>
                                    </div>

                                ):(
                                    <div className="bg-dark font-white sticky-top border_bottom p-3">
                                        <h5 className="m-0">View Trade</h5>
                                    </div>

                                ) }
                            <section className="p-3">

                                {
                                    vision !== 'mobile' ? (
                                        <a href="/trade" className="btn btn-warning mb-3"><i
                                            className="fas fa-chevron-circle-left"></i> Back</a>
                                    ) : (null)
                                }

                                <div className="border border_radius">
                                    <div className="row g-0">
                                        <div className="col-lg-6 border_right">
                                            <div className="p-4 bg-skyblue text-center">
                                                <h2 className="m-0">{advert.data.balance.toFixed(6)} {advert.data.asset.toUpperCase()} <i className="fas fa-1x text-success fa-exchange-alt"></i> ${(advert.data.balance * asset.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h2>
                                                <p className="m-0">{moment(advert.data.created).format('MMMM Do YYYY, h:mm:ss a')}</p>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="p-4 bg-skyblue text-center">
                                                <badge className="badge bg-danger">Expires In</badge>
                                                <br/>
                                                <Countdown className="font-lg"
                                                    date={Date.parse(advert.data.expiringTime)}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-6">
                                <h5 className="bg-primary p-3 mt-3 mb-0">Details</h5>

                                <div className="border font-sm-2">

                                    <table className="table mb-0 w-100 table-borderless table-hover">
                                        <tbody>
                                        <tr>
                                            <td>
                                                <h6>Sale ID:</h6>
                                            </td>
                                            <td>
                                                {advert.data._id}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h6>Volume:</h6>
                                            </td>
                                            <td>
                                                {advert.data.amount.toFixed(5)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h6>Balance:</h6>
                                            </td>
                                            <td>
                                                {advert.data.balance.toFixed(5)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h6>Value:</h6>
                                            </td>
                                            <td>
                                                ${(advert.data.amount * asset.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h6>Base Price (N/$):</h6>
                                            </td>
                                            <td>
                                                {advert.data.openingRate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h6>Buy Now:</h6>
                                            </td>
                                            <td>
                                                {advert.data.buyItNow.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h6>Partial Sale:</h6>
                                            </td>
                                            <td>
                                                {
                                                    advert.data.partBid === true ? (
                                                        <span>Allowed</span>
                                                    ):(
                                                        <span>Not Allowed</span>
                                                    )
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h6>No. of Bids:</h6>
                                            </td>
                                            <td>
                                                {advert.bidCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                                    </div>

                                    <div className="col-lg-6">
                                        <h5 className="bg-primary p-3 mt-3 mb-0">Asset Info.</h5>

                                        <div className="border font-sm-2">

                                            <table className="table mb-0 w-100 table-borderless table-hover">
                                                <tbody>
                                                <tr>
                                                    <td>
                                                        <h6>Asset:</h6>
                                                    </td>
                                                    <td>
                                                        {asset.abbr}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h6>Current Value:</h6>
                                                    </td>
                                                    <td>
                                                        ${asset.rate.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    </td>
                                                </tr>

                                                </tbody>
                                            </table>
                                        </div>

                                        <h5 className="bg-primary p-3 mt-3 mb-0">Payment Info.</h5>

                                        <div className="border font-sm-2">

                                            <table className="table mb-0 w-100 table-borderless table-hover">
                                                <tbody>
                                                <tr>
                                                    <td>
                                                        <h6>Bank:</h6>
                                                    </td>
                                                    <td>
                                                        {advert.data.defaultBank.bankName.toUpperCase()}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h6>Account Name:</h6>
                                                    </td>
                                                    <td>
                                                        {advert.data.defaultBank.accountName.toUpperCase()}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h6>Account Number:</h6>
                                                    </td>
                                                    <td>
                                                        {advert.data.defaultBank.accountNumber.toUpperCase()}
                                                    </td>
                                                </tr>

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                </div>

                                <div>

                                    <div className="card mt-4">
                                        <div className="card-header bg-dark">
                                            <h5 className="font-white">Bid Offers</h5>
                                        </div>
                                        <div className="card-body">
                                            <table className="table table-hover">
                                                <thead>
                                                <tr>
                                                    <th>Buyer</th>
                                                    <th className="d-none d-lg-block">Date</th>
                                                    <th>Quantity</th>
                                                    <th className="d-none d-lg-block">Value</th>
                                                    <th>Bid Price (N/$)</th>
                                                    <th>Total Price (N)</th>
                                                    <th>Bid Expiry Time</th>
                                                    <th></th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {

                                                    bids.map((bid,index) => {
                                                        let time_remaining = (new Date(advert.data.expiringTime).getTime() - new Date().getTime());
                                                            if(bid.advertId === advert.data._id) {
                                                                myBids = myBids + 1;
                                                                return (
                                                                    <tr>
                                                                        <td>{bid.ownerId.username}
                                                                            {
                                                                                bid.accepted ? (
                                                                                    <badge className=" ms-2 badge bg-success font-white">Accepted <i className="fa fa-check-circle"></i></badge>
                                                                                ) : null
                                                                            }
                                                                            </td>
                                                                        <td className="d-none d-lg-block">{moment(bid.created).format('ddd MMM DD, YYYY')}</td>
                                                                        <td>{bid.amount.toFixed(5)}</td>
                                                                        <td className="d-none d-lg-block">
                                                                            ${(bid.amount * asset.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                        </td>
                                                                        <td>{bid.rate}</td>
                                                                        <td>{(bid.rate * (bid.amount * asset.rate)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                                                        <td>
                                                                            {
                                                                                bid.expired === false ? (
                                                                                bid.expiringTime ? (
                                                                                    <Countdown date={Date.parse(bid.expiringTime)}/>
                                                                                ) : (
                                                                                    <span>N/A</span>
                                                                                )
                                                                                ) : (
                                                                                    <span className="text-danger">Expired</span>
                                                                                )
                                                                            }
                                                                        </td>

                                                                        <td>
                                                                            {
                                                                                time_remaining > 0 ?(
                                                                                    bid.expired === false ? (
                                                                            <button className="btn btn-warning"
                                                                                    onClick={() => accept_bid(bid._id)}>Accept Bid
                                                                            </button>
                                                                                    ): null
                                                                                ): null
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            }
                                                    })
                                                }

                                                {
                                                    myBids === 0 ? (
                                                        <tr >
                                                            <td colspan="12" className="fs-5 p-5 text-center">No pending bids</td>
                                                        </tr>
                                                    ):(<div></div>)
                                                }
                                                </tbody>
                                            </table>
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
                                <SwitchCase />
                            </div>

                        </div>
                    </div>


            )}

            { mobileView === true ? (


                <div className="bg-white mobile_panel animated fadeInUpBig mt-2 border rounded preview">
                    <button className="btn btn-danger close-btn" onClick={() => setMobileView(false)}><i className="fa fa-window-close"></i> Close</button>
                    <SwitchCase />

                </div>
            ):(null) }
        </Trade_Layout>

            </div>
    );
}
