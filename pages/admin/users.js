import Dashboard_Layout from "../../components/layout/dashboard_layout";
import React, {Component, useEffect, useState} from "react";
import * as Api from "../../components/config/api";
import * as Session from "../../components/config/session";
import * as Strings from "../../components/config/string";
import * as Constant from "../../components/config/constant";
import * as Constants from "../../components/config/constant";
import * as Tables from "../../components/common/tables";
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
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
const { SearchBar } = Search;

export default class users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            users: {
                verified: [],
                unverified: [],
                active: [],
                inactive: [],
            },
            admin: [],
            customerService : [],
            inactiveUsers: [],
            filter : {
                'startDate': new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                'endDate': new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
            }

        };

    }

      loadData() {


    };


    componentDidMount() {


        fetch(Api.admin_users + '?role=regular',
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response109) => {
                this.setState({users : response109.data});
                console.log(response109);
                let userData = {unverified : [],
                    verified : [],
                    active : [],
                    inactive : []};

                for(let i in response109.data)
                {
                    if(response109.data[i].verified === false)
                    {
                        userData.unverified.push(response109.data[i]);
                    }
                    if(response109.data[i].verified === true)
                    {
                        userData.verified.push(response109.data[i]);
                    }
                    if(response109.data[i].status === true)
                    {
                        userData.active.push(response109.data[i]);
                    }
                    if(response109.data[i].status === false)
                    {
                        userData.inactive.push(response109.data[i]);
                    }

                }

                this.setState({users : userData});

                this.setState({loading : false})

            })

        fetch(Api.admin_users + '?role=admin',
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response1) => {
                this.setState({admin : response1.data});

            })

        fetch(Api.admin_users + '?role=customerService',
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response2) => {
                this.setState({customerService : response2.data});

            })

    }


    render(){
        return(
            <Dashboard_Layout title="Users">

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

                            <div className="col-lg-12 text-right">
                                <div className="float-end">
                                {
                                    Session.role === 'admin' || Session.role === 'superAdmin' ? (
                                        <a className="btn btn-success" href="/admin/new_user"><i
                                                className="fa fa-plus"></i> Create User</a>
                                    ) : (null)
                                }
                                    {
                                        Session.role === 'superAdmin' ? (
                                        <a className="btn ms-3 btn-warning" href="/admin/new_admin"><i
                                            className="fa fa-plus"></i> Create Admin</a>
                                        ):null
                                    }
                                </div>
                                <ul className="nav nav-pills" id="pills-tab" role="tablist">

                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link active" id="pills-profile-tab" data-bs-toggle="pill"
                                           href="#pills-bids3" role="tab" aria-controls="pills-bids"
                                           aria-selected="false">All Users</a>
                                    </li>

                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link " id="pills-profile-tab" data-bs-toggle="pill"
                                           href="#pills-advert3" role="tab" aria-controls="pills-profile"
                                           aria-selected="false">Administrators</a>
                                    </li>

                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="pills-profile-tab" data-bs-toggle="pill"
                                           href="#pills-payment3" role="tab" aria-controls="pills-payment"
                                           aria-selected="false">Customer Service</a>
                                    </li>
                                </ul>

                                <div className="tab-content" id="pills-tabContent">
                                    <div className="tab-pane fade pt-4 show active" id="pills-bids3" role="tabpanel"
                                         aria-labelledby="pills-home-tab">


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
                                                               aria-selected="true">Verified <badge className="badge bg-danger">{this.state.users.verified.length}</badge></a>
                                                        </li>
                                                        <li className="nav-item" role="presentation">
                                                            <a className="nav-link" id="pills-profile-tab" data-bs-toggle="pill"
                                                               href="#pills-watchlist" role="tab" aria-controls="pills-profile"
                                                               aria-selected="false">Unverified <badge className="badge bg-danger">{this.state.users.unverified.length}</badge></a>
                                                        </li>
                                                        <li className="nav-item" role="presentation">
                                                            <a className="nav-link" id="pills-active-tab" data-bs-toggle="pill"
                                                               href="#pills-active" role="tab" aria-controls="pills-active"
                                                               aria-selected="false">Active <badge className="badge bg-danger">{this.state.users.active.length}</badge></a>
                                                        </li>
                                                        <li className="nav-item" role="presentation">
                                                            <a className="nav-link" id="pills-inactive-tab" data-bs-toggle="pill"
                                                               href="#pills-inactive" role="tab" aria-controls="pills-inactive"
                                                               aria-selected="false">Inactive <badge className="badge bg-danger">{this.state.users.inactive.length}</badge></a>
                                                        </li>

                                                    </ul>

                                                </div>
                                                <div id="collapseOne" className="accordion-collapse collapse show"
                                                     aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                    <div className="accordion-body">


                                                        <div className="tab-content" id="pills-tabContent">
                                                            <div className="tab-pane fade show table-responsive active" id="pills-bids" role="tabpanel"
                                                                 aria-labelledby="pills-home-tab">


                                                                    <ToolkitProvider
                                                                        keyField="id"
                                                                        data={ this.state.users.verified }
                                                                        columns={ Tables.usersColumn }
                                                                        search>
                                                                        {
                                                                            props => (
                                                                                <div>
                                                                                    <SearchBar className="mb-3" { ...props.searchProps } />

                                                                                    <BootstrapTable
                                                                                        bootstrap4
                                                                                        striped
                                                                                        hover
                                                                                        tabIndexCell
                                                                                        pagination={ paginationFactory() }
                                                                                        { ...props.baseProps }
                                                                                    />
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </ToolkitProvider>


                                                            </div>

                                                            <div className="tab-pane  fade" id="pills-watchlist" role="tabpanel"
                                                                 aria-labelledby="pills-profile-tab">
                                                                <div className="table-responsive">

                                                                    <div className="d-none d-lg-block">
                                                                        <ToolkitProvider
                                                                            keyField="id"
                                                                            data={ this.state.users.unverified }
                                                                            columns={ Tables.usersColumn }
                                                                            search>
                                                                            {
                                                                                props => (
                                                                                    <div>
                                                                                        <SearchBar className="mb-3" { ...props.searchProps } />

                                                                                        <BootstrapTable
                                                                                            bootstrap4
                                                                                            striped
                                                                                            hover
                                                                                            tabIndexCell
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

                                                            <div className="tab-pane  fade" id="pills-active" role="tabpanel"
                                                                 aria-labelledby="pills-active-tab">
                                                                <div className="table-responsive">

                                                                    <div className="d-none d-lg-block">
                                                                        <ToolkitProvider
                                                                            keyField="id"
                                                                            data={ this.state.users.active }
                                                                            columns={ Tables.usersColumn }
                                                                            search>
                                                                            {
                                                                                props => (
                                                                                    <div>
                                                                                        <SearchBar className="mb-3" placeholder="Search active users" { ...props.searchProps } />

                                                                                        <BootstrapTable
                                                                                            bootstrap4
                                                                                            striped
                                                                                            hover
                                                                                            tabIndexCell
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

                                                            <div className="tab-pane  fade" id="pills-inactive" role="tabpanel"
                                                                 aria-labelledby="pills-inactive-tab">
                                                                <div className="table-responsive">

                                                                    <div className="d-none d-lg-block">
                                                                        <ToolkitProvider
                                                                            keyField="id"
                                                                            data={ this.state.users.inactive }
                                                                            columns={ Tables.usersColumn }
                                                                            search>
                                                                            {
                                                                                props => (
                                                                                    <div>
                                                                                        <SearchBar className="mb-3" { ...props.searchProps } />

                                                                                        <BootstrapTable
                                                                                            bootstrap4
                                                                                            striped
                                                                                            hover
                                                                                            tabIndexCell
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
                                                </div>
                                            </div>

                                        </div>






                                    </div>

                                    <div className="tab-pane fade pt-4" id="pills-advert3" role="tabpanel"
                                         aria-labelledby="pills-home-tab">

                                        <ToolkitProvider
                                            keyField="id"
                                            data={ this.state.admin }
                                            columns={ Tables.usersColumn }
                                            search>
                                            {
                                                props => (
                                                    <div>
                                                        <SearchBar className="mb-3" { ...props.searchProps } />

                                                        <BootstrapTable
                                                            bootstrap4
                                                            striped
                                                            hover
                                                            tabIndexCell
                                                            pagination={ paginationFactory() }
                                                            { ...props.baseProps }
                                                        />
                                                    </div>
                                                )
                                            }
                                        </ToolkitProvider>

                                    </div>

                                    <div className="tab-pane pt-4 fade" id="pills-payment3" role="tabpanel"
                                         aria-labelledby="pills-profile-tab">

                                        <ToolkitProvider
                                            keyField="id"
                                            data={ this.state.customerService }
                                            columns={ Tables.usersColumn }
                                            search>
                                            {
                                                props => (
                                                    <div>
                                                        <SearchBar className="mb-3" { ...props.searchProps } />

                                                        <BootstrapTable
                                                            bootstrap4
                                                            striped
                                                            hover
                                                            tabIndexCell
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

                    )}
                </section>






            </Dashboard_Layout>
        )
    }

}


