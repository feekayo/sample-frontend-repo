import Main_Layout from "../../components/layout/main_layout";
import React, {Component,useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import ls from "local-storage";
import * as Constants from "../../components/config/constant";
import NProgress from "nprogress";
import * as Api from "../../components/config/api";
import * as Session from "../../components/config/session";
import Swal from "sweetalert2";


export default class CreateSale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            sale: [],
            userBanks: [],
            saleType: 'full',
            assets: ls.get('assets'),
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.calc_amt = this.calc_amt.bind(this)
        this.calc_amt2 = this.calc_amt2.bind(this)
    }

    handleChange = e => {
        if(e.target.name === 'partBid')
        {
            if(e.target.value === 'true') {
                this.setState({...this.state, sale: {...this.state.sale, [e.target.name]: true}});
                this.setState({saleType : 'part'});

            }else{
                this.setState({...this.state, sale: {...this.state.sale, [e.target.name]: false}});
                this.setState({saleType : 'full'});
            }
        }else if(e.target.name === 'amount' || e.target.name === 'buyItNow' || e.target.name === 'moq' || e.target.name === 'openingRate' ){

            this.setState({...this.state, sale: {...this.state.sale, [e.target.name]: Number(e.target.value)}});
        }else {
            this.setState({...this.state, sale: {...this.state.sale, [e.target.name]: e.target.value}});
        }
    }

    calc_amt()
    {
        let count = this.state.assets.length;

        for(let i = 0; i < count; i++)
        {
            let data = this.state.assets[i];

            if(this.state.sale['asset'])
            {
                if (this.state.sale['asset'].toUpperCase() === data.abbr) {


                        this.setState({...this.state, sale: {...this.state.sale, ['value']: (this.state.sale['amount'] * data.rate).toFixed(2)}});

                        //setDollarRate((sale['amount'] * data.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));

                }
            }

        }
    }

    calc_amt2()
    {
        let count = this.state.assets.length;

        for(let i = 0; i < count; i++)
        {
            let data = this.state.assets[i];

            if(this.state.sale['asset'])
            {
                if (this.state.sale['asset'].toUpperCase() === data.abbr) {

                        this.setState({...this.state, sale: {...this.state.sale, ['moqvalue']: (this.state.sale['moq'] * data.rate).toFixed(2)}});

                        //setDollarRate((sale['amount'] * data.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));

                    
                }
            }

        }
    }


    handleSubmit = async e => {
        e.preventDefault();

        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            delete this.state.sale.value;
            delete this.state.sale.moqvalue;

            const res = await fetch(Api.createAdvert, {
                method: 'POST',
                body: JSON.stringify(this.state.sale),
                headers: {
                    'Authorization': 'Bearer ' + Session.token,
                    'Content-type': 'application/json',
                    'ip' : ls.get('ip'),
                    'device' : ls.get('device'),
                }
            });

            //console.log(sale);

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

    fetchBanks()
    {
        if (this.state.userBanks.length === 0) {
            const response26 = fetch(Api.userBanks + '?userId=' + Session.id,
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + Session.token
                    }
                }).then((res) => res.json())
                .then((response262) => {
                    console.log(response262)
                    this.setState({userBanks : response262.data});

                    this.setState({Loading : false});
                })
        }
    }

    componentDidMount() {

        this.fetchBanks();


        this.setState({loading: false});
    }

    render() {
        return (
            <div>
                { this.state.loading ? (
                    <Constants.loading />
                ) : (
                    <section className="">
                        <div className="bg-dark sticky-top border_bottom p-3">
                            <h5 className="m-0 font-white">Create Sale Advert</h5>
                        </div>
                        <div className="p-3">
                            <form className="" onSubmit={this.handleSubmit}>

                                <div className="row g-2">

                                    <div className="form-floating col-6 mb-3">
                                        <select id="float_asset" onFocus={this.calc_amt} name="asset" onChange={this.handleChange} required className="form-select">
                                            <option value="" selected disabled>-- Select an option  --</option>
                                            {
                                                this.state.assets.map((asset,index) => (
                                                    <option value={asset.abbr.toLowerCase()}>{asset.name}</option>
                                                ))
                                            }
                                        </select>
                                        <label>Choose an asset</label>

                                    </div>
                                    <div className="form-floating col-6 mb-3">
                                        <select id="float_asset" onChange={this.handleChange} name="partBid" required className="form-select">
                                            <option value="" selected disabled>-- Select an option  --</option>
                                            <option value={true}>Allowed</option>
                                            <option value={false}>Not Allowed</option>
                                        </select>
                                        <label>Partial Sale</label>

                                    </div>

                                    <div className="form-floating col-6 mb-3">
                                        <input type="text" autoComplete="off" onChange={this.handleChange} onKeyUp={this.calc_amt} name="amount" required className="form-control"
                                               placeholder="quantity"/>
                                        <label>Quantity</label>
                                    </div>

                                    <div className="form-floating col-6 mb-3">
                                        <input type="text" autoComplete="off" value={this.state.sale.value} disabled="" name="value" className="form-control"
                                               placeholder="Value"/>
                                        <label>Value ($)</label>
                                    </div>

                                    {
                                        this.state.saleType === 'full' ? (
                                            <div></div>
                                        ):(
                                            <div className="row p-0 g-2">
                                                <div className="form-floating col-6 mb-3">
                                                    <input type="text" onChange={this.handleChange} onKeyUp={this.calc_amt2} name="moq" required className="form-control"
                                                           placeholder="quantity"/>
                                                    <label>Minimum order quantity</label>
                                                </div>

                                                <div className="form-floating col-6 mb-3">
                                                    <input type="text" disabled="" value={this.state.sale.moqvalue}  name="moqvalue" className="form-control"
                                                           placeholder="Value"/>
                                                    <label>MOQ Value ($)</label>
                                                </div>
                                            </div>

                                        )
                                    }


                                    <div className="form-floating col-12 mb-3">
                                        <input type="text" onChange={this.handleChange} name="openingRate" required className="form-control"
                                               placeholder="Base Bid"/>
                                        <label>Base Bid Rate (N/$)</label>
                                    </div>

                                    <div className="form-floating col-12 mb-3">
                                        <input type="text" onChange={this.handleChange} name="buyItNow" required className="form-control"
                                               placeholder="Buy it now"/>
                                        <label>Buy It Now Price (N/$)</label>
                                    </div>

                                    <div className="form-floating col-6 mb-3">
                                        <select id="float_asset" required onChange={this.handleChange} name="expiresIn" className="form-select">
                                            <option value="" selected disabled>-- Select expiry time  --</option>
                                            <option value="3m">3 minutes</option>
                                            <option value="10m">10 minutes</option>
                                            <option value="30m">30 minutes</option>
                                            <option value="1h">1 hour</option>
                                            <option value="2h">2 hours</option>
                                        </select>
                                        <label>Sale Expiry Time</label>
                                    </div>

                                    <div className="form-floating col-6 mb-3">
                                        <select id="float_asset" required onChange={this.handleChange} name="defaultBank" className="form-select">
                                            <option value="" selected disabled>-- Select bank  --</option>
                                            {
                                                this.state.userBanks.map((bank, index) => (
                                                    <option value={bank._id}>{bank.bankName} - {bank.accountNumber}</option>
                                                ))
                                            }
                                        </select>
                                        <label>Account To Pay In</label>
                                    </div>

                                    <button className="btn btn-primary btn-lg btn-block font-black">Create Advert</button>
                                </div>
                            </form>
                        </div>
                    </section>
                )}
            </div>
        )
    }
}



