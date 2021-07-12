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
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ToolkitProvider, {Search} from "react-bootstrap-table2-toolkit";
import Reconcile from "../trade/reconcile";
import * as Tables from "../../components/common/tables";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
const { SearchBar } = Search;



export default class reconciliation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            open: [],
            closed: [],
            tradeValue : '0',
            tradeRoute : null,
            mobileView : false,
        };

        this.SwitchCase = this.SwitchCase.bind(this)
    }

    loadData() {

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
                    }else if(response109.data[rec].status === 'closed')
                    {
                        closedRec.push(response109.data[rec]);
                    }
                }

                //console.log(openRec);

                this.setState({closed : closedRec});
                this.setState({open : openRec});
            })

    };

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
        },
        {
            dataField: 'created',
            text: 'Options',
            formatter: (cell, row) => (
                <button
                    type="button"
                    className="btn btn-sm btn-primary font-black w-100"
                    onClick={() => {
                        this.reconcile(row.bidId, row)

                        // this.setState({tradeRoute : 'reconcile', tradeValue : pay._id})
                    }}>
                    View
                </button>
            ),
            sort: true
        },
    ];

    SwitchCase() {

        switch(this.state.tradeRoute) {
            case
            'reconcile'
            :
                return <Reconcile data={this.state.tradeValue} />;
            default:
                return (
                    <div className="text-center margin_50-top margin_50-bottom lead p-5 font-gray">
                        <i className="fa fa-window-restore mb-3 fa-2x"></i>
                        <h5>Activity Panel</h5>
                        <p>Actions and pages will be displayed here for you to respond to</p>
                    </div>
                );
        }
    }

    reconcile(id, bidAmt)
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
                    body: JSON.stringify({'bidId' : id}),
                    headers: {
                        Authorization : 'Bearer ' + Session.token,
                        'Content-type': 'application/json',
                        'ip' : ls.get('ip'),
                        'device' : ls.get('device'),
                    }
                }).then((res) => res.json())
                .then((response_110) => {
                    NProgress.done();
                     //console.log(response_110);

                    if(response_110.status === 'successful') {


                        fetch(Api.bid + '/' + response_110.data.bidId,
                            {
                                method: 'GET',
                                headers: {
                                    Authorization : 'Bearer ' + Session.token,
                                    'Content-type': 'application/json'
                                }
                            }).then((res) => res.json())
                            .then((response1101) => {

                                //console.log(response1101);

                                let data = {data: response_110.data, bid: response1101.data};

                                this.setState({tradeRoute: 'reconcile', tradeValue: data, mobileView: true})

                            });

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

    componentDidMount() {

        this.setState({loading : false})

        this.loadData();
    }

    render(){
        return(
            <Dashboard_Layout title="Reconciliation">

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

                        <div className="d-flex align-items-stretch ">
                            <div className="w-50 w-m-100 p-2 bg-white border_right">

                                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">

                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link active" id="pills-profile-tab" data-bs-toggle="pill"
                                           href="#pills-bids3" role="tab" aria-controls="pills-bids"
                                           aria-selected="false">Open</a>
                                    </li>

                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link " id="pills-profile-tab" data-bs-toggle="pill"
                                           href="#pills-advert3" role="tab" aria-controls="pills-profile"
                                           aria-selected="false">Closed</a>
                                    </li>


                                </ul>

                                <div className="tab-content" id="pills-tabContent">
                                    <div className="tab-pane fade show mt-4 active" id="pills-bids3" role="tabpanel"
                                         aria-labelledby="pills-home-tab">

                                        <ToolkitProvider
                                            keyField="id"
                                            data={ this.state.open }
                                            columns={ this.adminReconciliation }
                                            search>
                                            {
                                                props => (
                                                    <div>
                                                        <SearchBar className="mb-3" placeholder="Search Reconciliation" { ...props.searchProps } />

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




                                    <div className="tab-pane fade mt-4" id="pills-advert3" role="tabpanel"
                                         aria-labelledby="pills-home-tab">

                                        <ToolkitProvider
                                            keyField="id"
                                            data={ this.state.closed }
                                            columns={ this.adminReconciliation }
                                            search>
                                            {
                                                props => (
                                                    <div>
                                                        <SearchBar className="mb-3" placeholder="Search Reconciliation" { ...props.searchProps } />

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

                            <div className=" d-lg-block d-none w-50 p-2">

                                <div className="bg-white mt-2 border rounded preview">

                                    <this.SwitchCase />

                                </div>

                            </div>
                        </div>
                    )}
                </section>




                { this.state.mobileView === true ? (


                    <div className="bg-white mobile_panel animated fadeInUpBig mt-2 border rounded preview">
                        <button className="btn btn-danger close-btn" onClick={() => this.setState({mobileView : false})}><i className="fa fa-window-close"></i> Close</button>
                        <this.SwitchCase />

                    </div>
                ):(null) }

            </Dashboard_Layout>
        )
    }

}


