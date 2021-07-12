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
                        <sidebar className="text-right ">


                            <nav className="nav flex-column navigation">

                                <li>
                                    <Link href="/dashboard">
                                        <a className={'nav-link ' +  (props.title == 'Dashboard' ? ( 'active'):('')) } >
                                            <i className="fa fa-desktop"></i> Dashboard
                                        </a>
                                    </Link>
                                </li>

                                <li>
                                    <Link href="/wallet">
                                        <a className={'nav-link ' +  (props.title == 'Wallet Balance' ? ( 'active'):('')) } >
                                            <i className="fa fa-wallet"></i> Wallet Balance
                                        </a>
                                    </Link>
                                </li>

                                <li>
                                    <Link href="/wallet">
                                        <a className={'nav-link ' +  (props.title == 'Deposit' ? ( 'active'):('')) } >
                                            <i className="fa fa-money-check"></i> Deposit
                                        </a>
                                    </Link>
                                </li>

                                <li>
                                    <Link href="/wallet">
                                        <a className={'nav-link ' +  (props.title == 'Withdraw' ? ( 'active'):('')) } >
                                            <i className="fa fa-hand-holding-usd"></i> Withdraw
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/wallet/transfer">
                                        <a className={'nav-link ' +  (props.title == 'Transfer' ? ( 'active'):('')) } >
                                            <i className="fa fa-handshake"></i> Transfer
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

                                    <a className={'nav-link'} onClick={Session.logout}>
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