import ls from "local-storage";
import Link from "next/link";
import React, {useEffect, useState} from 'react';
import * as Session from "../config/session";
import * as Constant from "../config/constant";

export default function Sidebar(props)
{
    const [loading, setLoading] = useState(true);

    //setLoading(false);

    useEffect(() => {

        setLoading(false);
    }, []);


    return (
        <>
            {
                (loading ? (
                    <Constant.loading />
                ):(
                    <>
                        <sidebar className=" text-right ">


                            <nav className="nav flex-column navigation">


                                <li>
                                    <Link href="/dashboard">
                                        <a className={'nav-link ' +  (props.title == 'My Account' ? ( 'active'):('')) } >
                                            <i className="fa fa-desktop"></i> My Account
                                        </a>
                                    </Link>
                                </li>

                                <li>
                                    <Link href="/wallet">
                                        <a className={'nav-link ' +  (props.title == 'Wallet' ? ( 'active'):('')) } >
                                            <i className="fa fa-wallet"></i> Wallet Overview
                                        </a>
                                    </Link>
                                </li>

                                <li>
                                    <Link href="/wallet/transactions">
                                        <a className={'nav-link ' +  (props.title == 'Transaction History' ? ( 'active'):('')) } >
                                            <i className="fa fa-th-list"></i> Transaction History
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard/reconciliation">
                                        <a className={'nav-link ' +  (props.title == 'Reconciliation' ? ( 'active'):('')) } >
                                            <i className="fa fa-handshake"></i> Reconciliation
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard/support">
                                        <a className={'nav-link ' +  (props.title == 'Support' ? ( 'active'):('')) } >
                                            <i className="fa fa-handshake"></i> Support Tickets
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard/security">
                                        <a className={'nav-link ' +  (props.title == 'Security' ? ( 'active'):('')) } >
                                            <i className="fa fa-shield-alt"></i> Security
                                        </a>
                                    </Link>
                                </li>

                                <li>
                                    <Link href="/dashboard/identity">
                                        <a className={'nav-link ' +  (props.title == 'Identity Verification' ? ( 'active'):('')) } >
                                            <i className="fa fa-id-card"></i> Identity Verification
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard/payment">
                                        <a className={'nav-link ' +  (props.title == 'Payment' ? ( 'active'):('')) } >
                                            <i className="fa fa-wallet"></i> Payment
                                        </a>
                                    </Link>
                                </li>

                                <li>
                                    <Link href="/dashboard/activity_log">
                                        <a className={'nav-link ' +  (props.title == 'Activity Log' ? ( 'active'):('')) } >
                                            <i className="fa fa-file"></i> Activity Log
                                        </a>
                                    </Link>
                                </li>

                                <li>

                                    <a className={'nav-link text-danger'} onClick={Session.logout}>
                                            <i className="fa fa-power-off"></i> Logout
                                        </a>

                                </li>



                            </nav>

                        </sidebar>


                    </>
                ))
            }
        </>
    )

}