import Dashboard_Layout from "../../components/layout/dashboard_layout";
import React, {Component, useEffect, useState} from "react";
import * as Api from "../../components/config/api";
import * as Session from "../../components/config/session";
import * as Tables from "../../components/common/tables";
import * as Constant from "../../components/config/constant";
import Link from "next/link";
import Swal from "sweetalert2";
import ls from "local-storage";
import 'jquery/dist/jquery.min.js';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import DataTable from 'react-data-table-component';


import NProgress from 'nprogress';
import { Facebook as Loader } from 'react-content-loader';
import moment from "moment";
import Skeleton from "react-loading-skeleton";

export default function app() {
    const [loading, setLoading] = useState(true);
    const [wallet, setWallet] = useState([]);
    const [dollarRate, setDollarRate] = useState(0);
    const [walletBalance, setWalletBalance] = useState("Select an asset");
    const [transfer, setTransfer] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const assets = ls.get('assets');


    useEffect(() =>
    {
        Session.validateUser()

        async function loadUser() {

            const response2 = await fetch(Api.transactions,
                {
                    method: 'GET',
                    'headers': {
                        'Authorization': 'Bearer ' + Session.token
                    }
                });
            const jsondata2 = await response2.json();
            setTransactions(jsondata2.data);
            console.log(jsondata2);

            setLoading(false);
        }

        loadUser();





    }, []);


    return(
        <Dashboard_Layout title="Transaction History">


                {loading ? (
                    <div >
                        <Skeleton height="50px" className="mb-3" />

                        <Skeleton height="30px" className="mb-2"/>
                        <Skeleton height="30px" className="mb-2"/>
                        <Skeleton height="30px" className="mb-2"/>
                        <Skeleton height="30px" className="mb-2"/>
                        <Skeleton height="30px" className="mb-2"/>

                    </div>
                ):(
                    <section>

                        <DataTable
                            className="data_table"
                            data={transactions.reverse()}
                            columns={Tables.transaction_columns}
                            striped={true}
                            hover={true}
                            responsive={true}
                            pagination={true}
                            fixedHeader={true}
                            noHeader={true}
                            keyField='id'
                        />







                    </section>
                )}







        </Dashboard_Layout>
    )
}