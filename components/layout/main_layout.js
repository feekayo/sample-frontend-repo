import Head from 'next/head';
import header from "../common/main_header";
import Router from 'next/router';
import * as Strings from "../config/string";
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css';
import {appName} from "../config/string"; //styles of nprogress

//Binding events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function Main_Layout ({
    children,
    title = 'Home',
}) {

    return (
        <div>

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


            {children}



        </div>
    )
}
