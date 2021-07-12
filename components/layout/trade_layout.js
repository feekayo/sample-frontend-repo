import Head from 'next/head';
import header from "../common/header";
import Router from 'next/router';
import * as Strings from "../config/string";
import * as Session from "../config/session";
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css';
import {appName} from "../config/string";
import {useEffect} from "react";
import * as Api from "../config/api";
import Swal from "sweetalert2"; //styles of nprogress

//Binding events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function Trade_Layout ({
    children,
    title = 'Home',
    mobile = false,
}) {

    useEffect(() => {

        Session.confirmUser();

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
                   // console.log(response76);

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
        <div>

            <Head>
                <title>{title} | {Strings.appName}</title>
                <meta charSet="utf-8" />
                <script
                    src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
                    integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
                    crossOrigin="anonymous"></script>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            {
                mobile === false ? (header()):(null)
            }



            {children}



        </div>
    )
}
