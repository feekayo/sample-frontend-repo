import Dashboard_Layout from "../../components/layout/dashboard_layout";
import React, {useRef, Component, useEffect, useState} from "react";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LineChart, PieChart } from 'react-chartkick'
import 'chartkick/chart.js'
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider from "react-bootstrap-table2-toolkit";




export default class wallets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data : [],
            open : [],
            openTicket : [],
            chartData : [],
            assets : ls.get('assets'),
            filter : {
                'startDate': new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                'endDate': new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
            }

        };


        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value,name) {
        this.setState({...this.state, filter: {...this.state.filter, [name]:value } });
    }


    fetchChartData()
    {
        this.setState({chartData : []});

        fetch(Api.analytics2 + '?start='+moment(this.state.filter.startDate).format('MM-DD-YYYY')+'&end='+moment(this.state.filter.endDate).format('MM-DD-YYYY'),
            {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response2) => {
                console.log(response2);
                NProgress.done();

                this.setState({chartData : response2.data});
            })
    }

    adminReconciliation = [
        {
            dataField: 'id',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
            text: 'S/N'
        },
        {
            dataField: 'ownerName',
            text: 'Info',
            sort: true,
            formatter: (cell, row) => (
                <div>
                    <span className="font-xs font-gray">{moment(row.created).format('ddd MMM DD, YYYY')}</span>
                    <p className="mb-2">{row.subject}</p>
                    <badge className="badge bg-success font-xs font-white">{row.sellerName}</badge>
                    <span><i className="fa fa-exchange-alt fa-fw"></i></span>
                    <badge className="badge bg-danger font-xs font-white">{row.ownerName}</badge>
                </div>
            )
        },
        {
            dataField: 'status',
            text: 'Status',
            formatter: (cell, row) => row.status === "pending" ? (
                <span><i className="fa fa-circle text-success"></i> Open</span>
            ) : (
                <span className="text-capitalize"><i className="fa fa-circle text-danger"></i> {row.status}</span>
            ),
            sort: true
        }
    ];

    adminTicket = [
        {
            dataField: 'id',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
            text: 'S/N'
        },
        {
            dataField: 'username',
            text: 'User',
            sort: true
        },
        {
            dataField: 'subject',
            text: 'Subject',
            sort: true,
            formatter: (cell, row) => (<div><p className="m-0">{row.subject}</p> <p className="font-xs font-gray m-0">{moment(row.created).format('ddd MMM DD, YYYY')}</p></div>),
        },
        {
            dataField: 'status',
            text: 'Status',
            formatter: (cell, row) => row.status === "pending" ? (
                <span className="text-capitalize"><i className="fa fa-circle text-success"></i> Open</span>
            ) : (
                <span className="text-capitalize"><i className="fa fa-circle text-danger"></i> {row.status}</span>
            ),
            sort: true
        }
    ];



    componentDidMount() {

        fetch(Api.analytics,
            {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response261) => {
                 //  console.log(response261);
                NProgress.done();
                this.setState({data : response261.data});
            })

        fetch(Api.adminFetchReconciliation,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response109) => {
                //this.setState({reconciliation : response109.data.reverse()});
                //console.log(response109);

                let openRec = [];
                let closedRec = [];
                for(let rec in response109.data)
                {
                    console.log(rec);

                    if(response109.data[rec].status === 'pending')
                    {
                        openRec.push(response109.data[rec]);
                    }
                }

                //console.log(openRec);

                this.setState({open : openRec});
            })

        fetch(Api.adminFetchTickets,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response1109) => {
                //this.setState({reconciliation : response109.data.reverse()});
                //console.log(response109);

                let openRec2 = [];

                for(let rec2 in response1109.data)
                {

                    if(response1109.data[rec2].status === 'pending')
                    {
                        openRec2.push(response1109.data[rec2]);
                    }
                }

                //console.log(openRec);

                this.setState({openTicket : openRec2});
            })


        this.fetchChartData();

        setTimeout(() => {
            this.setState({loading : false});
        }, 2000)
    }

    render(){
        return(
            <Dashboard_Layout title="Dashboard">

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

                        <section>
                            {
                                Session.role === 'admin' || Session.role == 'superAdmin' ?(

                                    <div className="row ">

                            <div className="col-lg-3 col-6">
                               <Link href="/admin/users">
                                   <div className="mb-3 hover_shadow border p-3 border_radius">
                                            <p className="m-0 text-uppercase font-weight-600 font-xs">
                                                <span className="bg-green me-2 p-2 rounded-pill"><i className="fas font-white fa-users"></i></span> All Users</p>
                                            <h2 className="mb-0 mt-2 fw-bold">{this.state.data.regulars}</h2>
                                </div>
                            </Link>
                        </div>

                            <div className="col-lg-3 col-6">
                                <Link href="/admin/users">
                                <div className="mb-3 hover_shadow border p-3 border_radius">
                                    <p className="m-0 text-uppercase font-weight-600 font-xs">
                                        <span className="bg-danger me-2 p-2 rounded-pill"><i className="fas font-white fa-headphones-alt"></i></span> Customer Service Agents</p>
                                    <h2 className="mb-0 mt-2 fw-bold">{this.state.data.customerService}</h2>
                                </div>
                                </Link>
                            </div>

                            <div className="col-lg-3 col-6">
                                <Link href="/admin/support">
                                <div className="mb-3 hover_shadow border p-3 border_radius">
                                    <p className="m-0 text-uppercase font-weight-600 font-xs">
                                        <span className="bg-yellow me-2 p-2 rounded-pill"><i className="fas font-white fa-inbox"></i></span> Pending Tickets</p>
                                    <h2 className="mb-0 mt-2 fw-bold">{this.state.data.pendingTickets}</h2>
                                </div>
                                </Link>
                            </div>

                            <div className="col-lg-3 col-6">
                                <Link href="/admin/reconciliation">
                                <div className="mb-3 hover_shadow border p-3 border_radius">
                                    <p className="m-0 text-uppercase font-weight-600 font-xs">
                                        <span className="bg-blue me-2 p-2 rounded-pill"><i className="fas font-white fa-comments"></i></span> Pending Reconciliations</p>
                                    <h2 className="mb-0 mt-2 fw-bold">{this.state.data.pendingReconcilations}</h2>
                                </div>
                                </Link>
                            </div>

                        </div>
                                    ):null}


                        <div className="row">


                            <div className="col-lg-9">

                                {
                                    Session.role === 'admin' || Session.role == 'superAdmin' ?(


                                <div className="card border_radius mb-3">

                                    <div className="card-body p-4  bg-primary-color-light">
                                        <div className="float-end col-4 text-end">
                                            <div className="row">
                                                <div className="col-5">

                                                    <DatePicker selected={this.state.filter.startDate} dateFormat="Y-M-d" className="form-control w-100" name='startDate' onChange={date => this.handleChange(date,'startDate')} />

                                                </div>

                                                <div className="col-5">

                                                    <DatePicker minDate={this.state.filter.startDate} selected={this.state.filter.endDate} dateFormat="Y-M-d" className="form-control w-100"  name='endDate' onChange={date => this.handleChange(date,'endDate')} />
                                                </div>
                                                <div className="col-1 text-center">
                                                    <button onClick={() => this.fetchChartData()} className="btn btn-primary"><i className="fas fa-search"></i></button>
                                                </div>
                                            </div>
                                        </div>


                                        <h4 className="m-0">Amount Traded</h4>
                                        <p className=""><badge className="badge bg-success font-white">From:</badge> {moment(this.state.filter.startDate).format('YYYY-MM-DD')} <badge className="badge bg-danger font-white">To:</badge> {moment(this.state.filter.endDate).format('YYYY-MM-DD')}</p>

                                        <LineChart empty="Loading data" data={this.state.chartData} />
                                    </div>
                                    <div className="card-footer">
                                        {
                                            this.state.assets.map((asset,index) => {

                                                let total = 0;
                                               for(let i in this.state.chartData)
                                               {
                                                   if(asset.abbr === this.state.chartData[i].name) {

                                                       for(let v in this.state.chartData[i].data)
                                                       {
                                                           total = Number(total) + Number(this.state.chartData[i].data[v]);
                                                       }
                                                   }
                                               }

                                               //console.log(total);

                                                return(
                                                    <div className="border_bottom p-2">
                                                        <p className="float-end">{total.toFixed(5)} {asset.abbr}</p>
                                                        {asset.name}
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                    ):(
                                        <div>
                                                <h4 className="text-center m-0 text-capitalize fw-light">Welcome Back</h4>
                                            <h1 className="font-xl text-center text-capitalize">{Session.username}</h1>

                                            <div className="row mt-4">

                                                <div className="col-lg-6">

                                                    <div className="card">
                                                        <div className="card-header p-3">
                                                                <p className="m-0 text-uppercase font-weight-600 font-xs">
                                                                    <span className="bg-blue me-2 p-2 rounded-pill"><i className="fas font-white fa-comments"></i></span> Pending Reconciliations</p>
                                                                <h2 className="mb-0 mt-2 fw-bold">{this.state.data.pendingReconcilations}</h2>
                                                        </div>
                                                        <div className="card-body ">

                                                            <ToolkitProvider
                                                                keyField="id"
                                                                data={ this.state.open }
                                                                columns={ this.adminReconciliation }
                                                                search>
                                                                {
                                                                    props => (
                                                                        <div>

                                                                            <BootstrapTable
                                                                                bootstrap4
                                                                                striped
                                                                                hover
                                                                                headerClasses=""
                                                                                tabIndexCell
                                                                                className="w-100"
                                                                                pagination={ paginationFactory() }
                                                                                { ...props.baseProps }
                                                                            />
                                                                        </div>
                                                                    )
                                                                }
                                                            </ToolkitProvider>

                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="col-lg-6">
                                                    <div className="card">
                                                    <div className="card-header p-3">

                                                        <p className="m-0 text-uppercase font-weight-600 font-xs">
                                                            <span className="bg-yellow me-2 p-2 rounded-pill"><i className="fas font-white fa-inbox"></i></span> Pending Tickets</p>
                                                        <h2 className="mb-0 mt-2 fw-bold">{this.state.data.pendingTickets}</h2>
                                                    </div>
                                                    <div className="card-body">
                                                        <ToolkitProvider
                                                            keyField="id"
                                                            data={ this.state.openTicket }
                                                            columns={ this.adminTicket }
                                                            search>
                                                            {
                                                                props => (
                                                                    <div>

                                                                        <BootstrapTable
                                                                            bootstrap4
                                                                            striped
                                                                            hover
                                                                            tabIndexCell
                                                                            className="w-100"
                                                                            pagination={ paginationFactory() }
                                                                            { ...props.baseProps }
                                                                        />
                                                                    </div>
                                                                )
                                                            }
                                                        </ToolkitProvider>
                                                    </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    )
                                }

                            </div>

                            <div className="col-lg-3">

                                <div className="h-100 card border_radius">
                                    <div className="card-header p-3 bg-primary">
                                        <h5 className="m-0">Assets Available</h5>
                                    </div>
                                    <div className="card-body">

                                        {
                                            this.state.assets.map((asset,index) =>(
                                                <div className="bg-gray p-3 border_radius mb-3">
                                                    <img src={asset.icon} className="img_icon float-start me-2" />
                                                    <h6 className="m-0">{asset.name} ({asset.abbr})</h6>
                                                    <p className="m-0">${asset.rate.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                </div>
                                            ))
                                        }


                                    </div>
                                </div>

                            </div>


                        </div>

                        </section>
                    )}
                </section>






            </Dashboard_Layout>
        )
    }

}


