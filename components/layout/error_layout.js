import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css';
import Sidebar from "../common/sidebar";
import * as Session from "../config/session";
import AdminSidebar from "../common/admin_sidebar";

//Binding events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function Error_layout ({
    children,
    title = 'Dashboard',
}) {

    return (
        <div className="full_height position-relative">

            <Head>
                <title>404 | BuyNow</title>
                <meta charSet="utf-8" />
                <script
                    src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
                    integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
                    crossOrigin="anonymous"></script>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>



            <section className="h-100 bg-primary ">

                <div className="col-lg-6 mx-auto p-5 padding_100-top text-center font-white">
                    <img src={'/logo_2.png'} className="logo img-fluid" />

                    <div className="mt-5">
                    {children}
                    </div>
                </div>

            </section>



        </div>
    )
}
