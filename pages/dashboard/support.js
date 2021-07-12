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
import Ticket from "./ticket";
const { SearchBar } = Search;
import firebase from "firebase";



export default class support extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            tickets: [],
            message: [],
            tradeValue : '0',
            tradeRoute : null,
            mobileView : false,
        };

        this.SwitchCase = this.SwitchCase.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({...this.state, message: {...this.state.message, [e.target.name]: e.target.value } });
    }

    handleSubmit(e) {
        e.preventDefault();

        try {

            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            fetch(Api.createTicket,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        'subject' : this.state.message.subject
                    }),
                    headers: {
                        'Authorization': 'Bearer ' + Session.token,
                        'Content-type': 'application/json',
                        'ip' : ls.get('ip'),
                        'device' : ls.get('device'),
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

                    //console.log(response109);

                    this.initializeFirebase();

                    const data = {
                        message : this.state.message.subject,
                        sender : 'user',
                        username : Session.username,
                        date : Date.now()
                    }

                    let messageRef = firebase.database().ref(response109.data.ticketToken);
                    messageRef.push(data);


                    this.setState({tradeRoute: 'ticket', tradeValue: response109.data, mobileView: true})

                    //this.setState({reconciliation : response109.data.reverse()});

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

    initializeFirebase()
    {

        const config = {
            apiKey: "AIzaSyAoVCmfERUlyiZHhXnidiIbfxXuGZsT25Y",
            authDomain: "valor-7dadf.firebaseapp.com",
            projectId: "valor-7dadf",
            storageBucket: "valor-7dadf.appspot.com",
            messagingSenderId: "598126901194",
            databaseURL: "https://valor-7dadf-default-rtdb.firebaseio.com",
            appId: "1:598126901194:web:043132bee82ef213720133"
        };

        if( firebase.apps.length === 0 ){
            firebase.initializeApp(config);
        }
        this.setState({loading : false});
    }

    loadData() {

        fetch(Api.fetchTickets,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response109) => {
                this.setState({tickets : response109.data.reverse()});
                console.log(response109);
            })

    };

    supportColumns = [
        {
            dataField: 'id',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
            text: 'S/N'
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
        },
        {
            dataField: 'created',
            text: 'Options',
            formatter: (cell, row) => (
                <button
                    type="button"
                    className="btn w-100 btn-sm btn-warning"
                    onClick={() => {
                        this.setState({tradeRoute: 'view_ticket', tradeValue: row, mobileView: true})
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
            'view_ticket'
            :
                return <Ticket data={this.state.tradeValue} />;
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



    componentDidMount() {

        this.setState({loading : false})

        this.loadData();
    }

    render(){
        return(
            <Dashboard_Layout title="Support">

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
                            <div className="w-50 w-m-100 p-2 bg-white ">

                                <button data-bs-toggle="modal" data-bs-target="#newTicket" className="btn btn-warning mb-3"><i className="fa fa-plus"></i> Create New Ticket</button>

                                <ToolkitProvider
                                    keyField="id"
                                    data={ this.state.tickets }
                                    columns={ this.supportColumns }
                                    search>
                                    {
                                        props => (
                                            <div>
                                                <SearchBar className="mb-3" placeholder="Search Tickets" { ...props.searchProps } />

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

                            <div className=" d-lg-block bg-gray d-none w-50 p-2">

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


                <div className="modal fade" id="newTicket" data-bs-backdrop="static" data-bs-keyboard="false"
                     tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-dark">
                                <h5 className="modal-title font-white" id="staticBackdropLabel">New Ticket</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className=" ">

                                    <div className="bg-skyblue p-3 border border_radius">
                                        <b><i className="fa fa-info-circle"></i> Note</b>
                                        <p className="mb-0">Your complaint will be sent to our support team and you will get a
                                            response within 24-hours.</p>
                                    </div>

                                    <form onSubmit={this.handleSubmit}>
                                        <div className="mt-4  form-group">
                                            <label>Subject</label>
                                            <textarea rows="10" required onChange={this.handleChange} name="subject" className="form-control" placeholder="Enter the subject of your ticket"></textarea>
                                        </div>

                                        <button className="btn mt-3 btn-lg btn-warning w-100">Create ticket</button>
                                    </form>


                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </Dashboard_Layout>
        )
    }

}


