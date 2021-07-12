import React, {Component, useState, useEffect} from 'react';
import ls from "local-storage";
import * as Session from "./session";
import NProgress from "nprogress";
import moment from "moment";
import Swal from "sweetalert2";
import * as Api from "./api"
import { Facebook as Loader } from 'react-content-loader';
import Skeleton from "react-loading-skeleton";
import Countdown from 'react-countdown';
import createSale from "../../pages/trade/create_sale";
import viewTrade from "../../pages/trade/view_trade";
import activityContext from "./context";


export function setAssets() {
    //const [assets, setAssets] = useState(false);

    /*if(!ls.get('assets')) {

        let assets = [];

        const socket = io(Api.socketUrl);

        socket.once("subscribed-coins", (tickerdata)  => {

            ls.remove("assets");

            let count = tickerdata.length;

            for(let i = 0; i <count; i++)
            {

                let data = tickerdata[i];

                let asset_array = {
                    name : data.name,
                    abbr : data.symbol.toUpperCase(),
                    chart : "BITSTAMP:" + data.symbol.toUpperCase() + "USD",
                    icon : data.image,
                    rate : data.current_price
                }

                assets.push(asset_array);

            }

            ls.set("assets", assets);


        });

    }*/

        if(!ls.get('assets')) {
            let asset_array = [
                {
                    "name":"Tether",
                    "abbr":"USDT",
                    "chart":"KRAKEN:USDTUSD",
                    "icon":"https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
                    "rate":1
                },

            ];

            ls.set('assets', asset_array);
        }

        if(!ls.get('currentAsset')){
            ls.set('currentAsset', {
                "name":"Tether",
                "abbr":"USDT",
                "chart":"KRAKEN:USDTUSD",
                "icon":"https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
                "rate":1
            });
        }


}

export function switchAsset(asset)
{

    const assets = ls.get('assets');

    let count = assets.length;

    for(let i = 0; i < count; i++)
    {
        let data = assets[i];

        if ( data.abbr === asset) {
            ls.set("currentAsset", data);
        }

    }
    window.location.reload();

}


export function loading()
{
    return (

        <div className="loading">
            <i className="fas fa-stroopwafel fa-spin fa-4x"></i>
            <p>LOADING</p>
        </div>

    );
}


export function ticker(props)
{
    let loading = true,
        data = [],
        assetData = ls.get('assets'),
        current_asset = ls.get('currentAsset');

    const [tickerDataDisplay, setTickerDataDisplay] = useState([]);
    const [webData, setWebData] = useState([]);

    // const [loading, setLoading] = useState(true);
    // const [data, setData] = useState([]);
    // const [assetData, setAssetData] = useState([]);

    //const current_asset = ls.get('currentAsset');

    function loadData()
    {

        fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,tether',
            {
                method: 'GET',
            }).then((res) => res.json())
            .then((tickerdata) => {

                assetData = tickerdata;
                let count = tickerdata.length;
                let new_assets = [];
                let new_front_assets = [];

                for (let i = 0; i < count; i++) {

                    let data = tickerdata[i];
                    let chart_point = 'BITSTAMP:';

                    if (data.symbol === 'usdt') {
                        chart_point = 'KRAKEN:';
                    } else {
                        chart_point = 'BITSTAMP:';
                    }


                    //populate all assets
                    let new_asset_array = {
                        name: data.name,
                        abbr: data.symbol.toUpperCase(),
                        chart: chart_point + data.symbol.toUpperCase() + "USD",
                        icon: data.image,
                        rate: data.current_price
                    }
                    new_assets.push(new_asset_array);


                    //populate current asset
                    if (data.symbol === current_asset.abbr.toLowerCase()) {
                        //console.log(data);
                        let asset_array = {
                            currentPrice: data.current_price.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                            change24: data.price_change_24h.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                            change24Percentage: data.price_change_percentage_24h.toFixed(2),
                            high24: data.high_24h.toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                            low24: data.low_24h.toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                        };

                        let current_asset_array = {
                            name: data.name,
                            abbr: data.symbol.toUpperCase(),
                            chart: chart_point + data.symbol.toUpperCase() + "USD",
                            icon: data.image,
                            rate: data.current_price
                        }

                        //data = [];

                        setTickerDataDisplay(asset_array);
                        ls.set('currentAsset', current_asset_array);
                        //console.log(asset_array);
                    }

                    let asset_array2 = {
                        currentPrice: data.current_price.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                        change24: data.price_change_24h.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                        change24Percentage: data.price_change_percentage_24h.toFixed(2),
                        high24: data.high_24h.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                        low24: data.low_24h.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                        icon: data.image,
                        rate: data.current_price,
                        name: data.name,
                        abbr: data.symbol.toUpperCase(),
                    };
                    new_front_assets.push(asset_array2);

                }
                ls.remove('assets');
                ls.set('assets', new_assets);
                ls.set('front_assets', new_front_assets);

            })

    }

    useEffect(() => {
            loadData();

            setInterval(() => loadData(), 30000);

        }
, [tickerDataDisplay.currentPrice]);

               // console.log(tickerDataDisplay.change24);

        if (props.display === 'true') {

            return (
                tickerDataDisplay.currentPrice === undefined ? (
                    <div className="row">
                        <div className="col">
                            <Skeleton count={2} height={8}/>
                        </div>
                        <div className="col">
                            <Skeleton count={2} height={8}/>
                        </div>
                        <div className="col">
                            <Skeleton count={2} height={8}/>
                        </div>
                        <div className="col">
                            <Skeleton count={2} height={8}/>
                        </div>
                    </div>
                ) : (
                    <div className="row g-0 lh-sm">
                        <div className="col-lg-3 col-4">
                            <p className="font-xs text-uppercase m-0 p-0 font-gray">Current <br
                                className="d-md-none"/> Price</p>
                            <p className="fs-6 font-weight-700 m-0 font-black">${tickerDataDisplay.currentPrice}</p>
                        </div>
                        <div className="col-lg-3 col-4">
                            <p className="font-xs text-uppercase m-0 p-0 font-gray">24hr <br
                                className="d-md-none"/> Change</p>
                            <p className={
                                tickerDataDisplay.change24.charAt(0) === '-' ? (
                                    "fs-6 text-danger font-weight-700 m-0"
                                ) : ("fs-6 text-success font-weight-700 m-0")}>{tickerDataDisplay.change24}

                                <span className={
                                    tickerDataDisplay.change24Percentage.charAt(0) === '-' ? (
                                        "fs-6 text-danger"
                                    ) : ("fs-6 text-success")}> {
                                    tickerDataDisplay.change24Percentage.charAt(0) === '-' ? (
                                        ""
                                    ) : ("+")}{tickerDataDisplay.change24Percentage}%</span>
                            </p>
                        </div>
                        <div className="col-lg-3 col-2">
                            <p className="font-xs text-uppercase m-0 p-0 font-gray">24hr <br
                                className="d-md-none"/> High</p>
                            <p className="fs-6 font-weight-700 m-0 font-black">${tickerDataDisplay.high24}</p>
                        </div>
                        <div className="col-lg-3 col-2">
                            <p className="font-xs text-uppercase m-0 p-0 font-gray">24hr <br className="d-md-none"/> Low
                            </p>
                            <p className="fs-6 font-weight-700 m-0 font-black">${tickerDataDisplay.low24}</p>
                        </div>
                    </div>
                )
            )
        } else {
            return null
        }

}


export class walletSummary extends Component
{
    static contextType = activityContext;

    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            balance_display : ls.get('bal'),
        };

        this.fetchWallet = this.fetchWallet.bind(this);
    }

    fetchWallet()
    {
        fetch(Api.wallet,
            {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response26) => {
                if(response26.status !== 'failed') {
                    this.setState({wallet: response26.data});

                    if(response26.data.length <= this.state.assets.length) {
                        this.setState({loading: false});
                    }else{
                        setTimeout(() => {
                            ticker(false);
                            this.fetchWallet();
                        }, 2000)
                    }
                }
                //console.log(response26)

            })
    }

    componentDidMount() {

        // if(this.context.showWallet)
        // {
        //     this.setState({loading : false});
        // }

        if(this.context.wallets.length >= 1)
        {
            this.setState({loading : false});
        }else{
            setTimeout(() => {
                this.setState({loading  : false});
            }, 4000)
        }

       // console.log(this.state.assets);

    }


    set_balance_display(status)
    {
        ls.set('bal',status);

        this.setState({balance_display : status});
    }

    render() {

    return (

        this.state.loading === true ? (

                <div className="row">

                    <div className="col-4">
                        <Skeleton className="mb-2" height="20px" />
                        <Skeleton className="mb-2" height="20px" />
                    </div>
                    <div className="col-8">
                    <Skeleton className="mb-2" height="20px" />
                    <Skeleton className="mb-2" height="20px" />
                    <Skeleton className="mb-2" height="20px" />
                    </div>
                </div>
        ):(
        <div className="row">
            <div className="col-4">

                <h6>Available Balance</h6>
                {
                    this.state.balance_display === 'hide' ? (
                        <a onClick={() => {this.setState({balance_display : 'show'})}} className="btn btn-outline-warning font-black btn-sm"><i className="fa fa-eye"></i> Show balance</a>
                    ) : (
                        <a onClick={() =>  {this.setState({balance_display : 'hide'})}} className="btn btn-outline-warning font-black btn-sm"><i className="fa fa-eye-slash"></i> Hide balance</a>
                        )}
            </div>
            <div className="col-8">
                <table className="m-0 table table-hover">
                    <tbody>
                    {
                        this.context.wallets.map((wallet,index) => (
                            <tr>
                                <td className="font-weight-700">
                                    {
                                        this.state.balance_display === 'hide' ? (
                                            <span>****** {wallet[0].asset.toUpperCase()}</span>
                                        ) : (
                                            <span>{Number(wallet[0].balance ? wallet[0].balance : 0).toFixed(5)} {wallet[0].asset ? wallet[0].asset.toUpperCase() : 'loading' }</span>
                                        )
                                    }
                                </td>
                                <td>
                                    {
                                        this.state.balance_display === 'hide' ? (
                                            <span>****** $</span>
                                        ) : (
                                            <span>{wallet[1].rate ? (wallet[0].balance * wallet[1].rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0} $</span>
                                        )
                                    }

                                </td>
                            </tr>
                        ))
                    }


                    </tbody>
                </table>
            </div>
        </div>
        )

    )
    }
}


export const name = user =>
{
    let v;
    if(user.verified === true) {
            v = <i className="fa fa-fw fa-check-circle text-success"></i>

    };


    return user.username + v;

}

export function collectRefund(id)
{
    console.log(id + 'processing refund');

    NProgress.start();
    NProgress.inc();
    NProgress.configure({ ease: 'ease', speed: 500 });

    fetch(Api.refund,
        {
            method: 'POST',
            body : JSON.stringify({
                advertId: id
            }),
            headers: {
                'Content-Type' : 'Application/json',
                Authorization: 'Bearer ' + Session.token
            }
        }).then((res) => res.json())
        .then((response26) => {
            NProgress.done();
            // if(response26.status === 'failed') {
            //     this.setState({wallet: response26.data});
            //
            //     if(response26.data.length <= this.state.assets.length) {
            //         this.setState({loading: false});
            //     }else{
            //         setTimeout(() => {
            //             ticker(false);
            //             this.fetchWallet();
            //         }, 2000)
            //     }
            // }
            console.log(response26)

        })
}