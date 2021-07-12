import Head from 'next/head';
import header from "../common/header";
import Router from 'next/router';
import * as Strings from "../config/string";
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css';
import Sidebar from "../common/sidebar";
import * as Session from "../config/session";
import AdminSidebar from "../common/admin_sidebar";
import {appName} from "../config/string";
import {useEffect} from "react";
import * as Api from "../config/api"; //styles of nprogress
import Swal from "sweetalert2";

//Binding events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function Dashboard_Layout ({
    children,
    title = 'Dashboard',
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
    }, []);

    return (
        <div className="full_height position-relative">

            <Head>
                <title>{title} | {Strings.appName}</title>
                <meta charSet="utf-8" />
                <script
                    src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
                    integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
                    crossOrigin="anonymous"></script>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            {header()}


            <div className="d-flex align-items-stretch h-100">
                <div className="sidebar d-none w-20 h-100 bg-blue-2  d-lg-block">
                    <section className="sticky-top bg-gray h-100 overflow_y-auto">
                        {
                            Session.role === 'admin' ||  Session.role === 'customerService' || Session.role === 'superAdmin' ?(
                                <AdminSidebar title={title} />
                            ):(
                                <Sidebar title={title} />
                            )
                        }

                    </section>

                </div>

                <div id="collapseMobileMenu" className="sidebar w-100 collapse animated fadeInLeft w-20 h-100 bg-blue-2">
                    <section className="sticky-top bg-gray h-100">
                        <button className="btn btn-lg m-2 d-xl-none font-white font-xl float-end no_background" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseMobileMenu" aria-expanded="false"
                                aria-controls="collapseMobileMenu">
                            x
                        </button>
                        <div class="clearfix"></div>
                        {
                            Session.role === 'admin' ||  Session.role === 'customerService' || Session.role === 'superAdmin' ?(
                                <AdminSidebar title={title} />
                            ):(
                                <Sidebar title={title} />
                            )
                        }
                    </section>

                </div>

                <div className="main h-100 w-80 bg-white ">
                    <section className="">

                        <div className="sticky-top bg-white shadow-sm">
                            <div className="container-fluid px-4 py-3">

                                <button className="btn btn-lg d-md-none float-end btn-warning" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapseMobileMenu" aria-expanded="false"
                                        aria-controls="collapseMobileMenu">
                                    <i className="fa fa-bars"></i>
                                </button>

                                <h2 className="fw-light m-0">{title}</h2>
                                <nav className="m-0"
                                    aria-label="breadcrumb">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item"><a href="/dashboard">Dashboard</a></li>
                                        <li className="breadcrumb-item"><a href="/trade">Trade</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">{title}</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>

                        <div className="mt-4"></div>

                        <div className="px-4">
                            {children}
                        </div>

                    </section>
                </div>
            </div>



        </div>
    )
}
