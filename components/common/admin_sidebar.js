import ls from "local-storage";
import Link from "next/link";
import React, {useEffect, useState} from 'react';
import * as Session from "../config/session";
import * as Constant from "../config/constant";

export default function AdminSidebar(props)
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
                                    <Link href="/admin">
                                        <a className={'nav-link ' +  (props.title == 'Dashboard' ? ( 'active'):('')) } >
                                            <i className="fa fa-desktop"></i> Dashboard
                                        </a>
                                    </Link>
                                </li>

                                {
                                    Session.role === 'admin' || Session.role === 'superAdmin' ? (

                                        <div>
                                            <li>
                                                <Link href="/wallet">
                                                    <a className={'nav-link ' + (props.title == 'Wallet' ? ('active') : (''))}>
                                                        <i className="fa fa-wallet"></i> Wallet Overview
                                                    </a>
                                                </Link>
                                            </li>

                                            <li>
                                                <Link href="/wallet/transactions">
                                                    <a className={'nav-link ' + (props.title == 'Transaction History' ? ('active') : (''))}>
                                                        <i className="fa fa-th-list"></i> Transaction History
                                                    </a>
                                                </Link>
                                            </li>


                                <li>
                                    <Link href="/admin/user_status">
                                        <a className={'nav-link ' +  (props.title == 'User Status Request' ? ( 'active'):('')) } >
                                            <i className="fa fa-user-alt-slash"></i> User Status Request
                                        </a>
                                    </Link>
                                </li>

                                        </div>
                                    ) : (null)
                                }

                                <li>
                                    <Link href="/admin/support">
                                        <a className={'nav-link ' +  (props.title == 'Support Messages' ? ( 'active'):('')) } >
                                            <i className="fa fa-comments"></i> Support Messages
                                        </a>
                                    </Link>
                                </li>

                                <li>
                                    <Link href="/admin/reconciliation">
                                        <a className={'nav-link ' +  (props.title == 'Reconciliation' ? ( 'active'):('')) } >
                                            <i className="fa fa-handshake"></i> Reconciliation
                                        </a>
                                    </Link>
                                </li>

                                <li>
                                    <Link href="/admin/identity_verification">
                                        <a className={'nav-link ' +  (props.title == 'Identity Verification' ? ( 'active'):('')) } >
                                            <i className="fa fa-id-card"></i> Identity Verification
                                        </a>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/admin/users">
                                        <a className={'nav-link ' +  (props.title == 'Users' ? ( 'active'):('')) } >
                                            <i className="fa fa-users"></i> Users
                                        </a>
                                    </Link>
                                </li>

                                <li>
                                    <Link href="/dashboard">
                                        <a className={'nav-link ' +  (props.title == 'My Account' ? ( 'active'):('')) } >
                                            <i className="fa fa-desktop"></i> My Account
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