import Head from 'next/head';
import header from "../common/header";
import Router from 'next/router';
import * as Strings from "../config/string";
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css';
import Sidebar from "../common/wallet_sidebar";
import {appName} from "../config/string";
import {useEffect} from "react";
import * as Api from "../config/api";
import * as Session from "../config/session";
import Swal from "sweetalert2"; //styles of nprogress

//Binding events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function Wallet_Layout ({
    children,
    title = 'Wallet',
}) {

    useEffect(() => {
        if(title !== 'Payment') {
            const response76 = fetch(Api.userBanks + '?userId=' + Session.id,
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + Session.token
                    }
                }).then((res) => res.json())
                .then((response76) => {
                    //setBanks(response76.data);
                    //setLoading(false);
                    console.log(response76);

                    if (response76.data.length <= 0) {
                        console.log('empty');
                        setTimeout(() => {
                            window.top.location.href = '/dashboard/payment';
                        }, 2000);

                        return (
                            Swal.fire(
                                {
                                    title: 'Update Payment Information',
                                    text: 'A bank account is needed to continue. Please wait while you are redirected',
                                    icon: 'info',
                                    showConfirmButton: false,
                                }
                            )
                        );
                    }
                })
        }
    }, [])

    return (
        <div className="full_height position-relative">

            <Head>
                <title>{title} | {Strings.appName}</title>
                <meta charSet="utf-8" />
                <link rel="icon" href="/favicon.ico"/>
                <script
                    src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
                    integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
                    crossOrigin="anonymous"></script>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            {header()}

            <div className="d-flex align-items-stretch h-100">

                <div className="sidebar w-20 h-100 p-2 bg-blue-2d-none d-lg-block">
                    <section className="sticky-top bg-gray h-100">
                        <Sidebar title={title} />
                    </section>

                </div>

                <div className="main h-100 w-80 bg-white border_right">
                    <section className="px-3 ">

                        <div className="sticky-top bg-white border_bottom">
                            <div className="container-fluid">
                                <h3 className="py-3 m-0">{title}</h3>
                            </div>
                        </div>

                        <div className="mt-4"></div>

                        <div className="">

                            {children}
                        </div>

                    </section>
                </div>
            </div>



        </div>
    )
}
