import * as Strings from "../config/string";
import ls from "local-storage";
import React, {Component,useEffect,useContext, useState} from 'react';
import Link from "next/link";
import * as Session from "../config/session";
import * as Constants from "../config/constant";
import * as Api from "../config/api";
import {io} from "socket.io-client";
import activityContext from "../config/context";
import {NotificationManager} from "react-notifications";
import moment from "moment";

export default function header()
{
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState([]);
    const [notificationCount, setNotificationCount] = useState([]);
    const loggedInUser = Session.token;
    const context = useContext(activityContext);
    //const socket2 = io("https://valorexchange.herokuapp.com");
    //socket2.emit("connect-to-your-participating-bids", Session.id)


    async function loadNotifications()
    {
        setLoading(true);
        fetch(Api.notification,
            {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + Session.token
                }
            }).then((res) => res.json())
            .then((response26) => {
               // console.log(response26);
                setNotification(response26.data.reverse());
                setNotificationCount(response26.data.length);
                setLoading(false);
            })
    }

    useEffect(() => {

        loadNotifications();

    }, []);

        return(
        <header>


        <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-black">
            <div className="container-fluid">
                <Link href="/trade/"><a className="navbar-brand">
                    <img src={'/logo.png'} width="80px"/>
                </a></Link>
                <div>

                    <a className="nav-link dropdown-toggle d-inline-block font-white d-lg-none" onMouseOver={() => loadNotifications()} href="#" id="navbarDropdown3" role="button"
                       data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fa fa-bell"></i>
                        {
                            notificationCount >= 1 ? (
                                <i className="fa fa-circle text-warning font-xs"></i>
                            ):(<span></span>)
                        }

                    </a>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText"
                        aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                    <ul className="dropdown-menu pt-0 notification_body animated fadeInRightBig w-30 border_radius" aria-labelledby="navbarDropdown3">
                        <div className="p-4 border_bottom">
                            <p className="float-end font-weight-300 font-sm-2">X</p>
                            <h4 className="m-0">Notifications</h4>
                        </div>
                        {
                            loading === true ? (
                                <div className="bg-gray p-1 w-100 font-xs">Loading notifications</div>
                            ):(null)
                        }
                        {notification.length <= 0 ? (
                            <div className="p-5 lead font-gray text-center">
                                No notification found
                            </div>
                        ) : (
                            <div className="notification_display">
                                {
                                    notification.map((notifi,index) => (
                                        <li>
                                            <a href={notifi.url} className="text-wrap dropdown-item">
                                                <div className="row px-4 py-2">
                                                    <div className="col-2">
                                                        <div className={
                                                            notifi.message.includes("Advert") || notifi.message.includes("advert") ? (
                                                                'notification_badge color_2'
                                                            ): notifi.message.includes("Payment") || notifi.message.includes("payment") ? (
                                                                'notification_badge color_3'
                                                            ):notifi.message.includes("Wallet") || notifi.message.includes("wallet") ? (
                                                                'notification_badge color_4'
                                                            ):('notification_badge color_1')
                                                        }>
                                                            {
                                                                notifi.message.includes("Advert") || notifi.message.includes("advert") ? (
                                                                    <i className="fa fa-bullhorn"></i>
                                                                ): notifi.message.includes("Payment") || notifi.message.includes("payment") ? (
                                                                    <i className="fa fa-dollar-sign"></i>
                                                                ):notifi.message.includes("Wallet") || notifi.message.includes("wallet") ? (
                                                                    <i className="fa fa-wallet"></i>
                                                                ):(<i className="fa fa-info"></i>)
                                                            }

                                                        </div>
                                                    </div>
                                                    <div className="col-10 text-dark text-capitalize">
                                                        {notifi.message}
                                                        <p className="m-0 text-lowercase font-gray font-xs">{moment(notifi.created).format('ddd MMM DD, YYYY HH:m:s')}</p>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                    ))
                                }

                            </div>
                        )
                        }

                    </ul>
                </div>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav ms-auto ">
                        <li className="nav-item">
                            <Link href="/trade"><a className="nav-link" aria-current="page">Trade</a></Link>
                        </li>

                        <li className="nav-item ">
                            <Link href="/wallet">
                                <a className="nav-link">Wallet</a>
                            </Link>
                        </li>
                        <li className="nav-item me-lg-5">
                                <a onClick={Session.logout} href="#" className="nav-link text-danger">Logout</a>
                        </li>
                        <li className="nav-item me-lg-5 dropdown d-none d-lg-block">
                            <a className="nav-link dropdown-toggle" onMouseOver={() => loadNotifications()} href="#" id="navbarDropdown" role="button"
                               data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="fa fa-bell"></i>
                                {
                                    notificationCount >= 1 ? (
                                        <i className="fa fa-circle text-warning font-xs"></i>
                                    ):(<span></span>)
                                }

                            </a>

                            <ul className="dropdown-menu pt-0 notification_body animated fadeInRightBig w-30 border_radius" aria-labelledby="navbarDropdown">
                                <div className="p-4 border_bottom">
                                    <h4 className="m-0">Notifications</h4>
                                </div>
                                {
                                    loading === true ? (
                                        <div className="bg-gray p-1 w-100 font-xs">Loading notifications</div>
                                    ):(null)
                                }
                                {notification.length <= 0 ? (
                                    <div className="p-5 lead font-gray text-center">
                                        No notification found
                                    </div>
                                ) : (
                                    <div className="notification_display">
                                        {
                                            notification.map((notifi,index) => (
                                                <li>
                                                    <a href={notifi.url} className="text-wrap dropdown-item">
                                                        <div className="row px-4 py-2">
                                                            <div className="col-2">
                                                                <div className={
                                                                    notifi.message.includes("Advert") || notifi.message.includes("advert") ? (
                                                                        'notification_badge color_2'
                                                                    ): notifi.message.includes("Payment") || notifi.message.includes("payment") ? (
                                                                        'notification_badge color_3'
                                                                    ):notifi.message.includes("Wallet") || notifi.message.includes("wallet") ? (
                                                                        'notification_badge color_4'
                                                                    ):('notification_badge color_1')
                                                                }>
                                                                    {
                                                                        notifi.message.includes("Advert") || notifi.message.includes("advert") ? (
                                                                            <i className="fa fa-bullhorn"></i>
                                                                        ): notifi.message.includes("Payment") || notifi.message.includes("payment") ? (
                                                                            <i className="fa fa-dollar-sign"></i>
                                                                        ):notifi.message.includes("Wallet") || notifi.message.includes("wallet") ? (
                                                                            <i className="fa fa-wallet"></i>
                                                                        ):(<i className="fa fa-info"></i>)
                                                                    }

                                                                </div>
                                                            </div>
                                                            <div className="col-10 text-dark text-capitalize">
                                                                {notifi.message}
                                                                <p className="m-0 text-lowercase font-gray font-xs">{moment(notifi.created).format('ddd MMM DD, YYYY HH:m:s')}</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </li>
                                            ))
                                        }

                                    </div>
                                )
                                }

                            </ul>
                        </li>


                        {loggedInUser ? (
                        <li className="nav-item">
                            {
                                Session.role === 'superAdmin' || Session.role === 'admin' || Session.role === 'customerService' ?(
                                    <Link href="/admin/"><a className="nav-link">
                                        <i className="fa fa-user-circle"></i> <span className="text-capitalize">{Session.username}</span>
                                    </a></Link>
                                    ):(
                                    <Link href="/dashboard/"><a className="nav-link">
                                        <i className="fa fa-user-circle"></i> <span className="text-capitalize">{Session.username}</span>
                                    </a></Link>
                                )
                            }
                        </li>
                            ) : (
                                <>
                            <li className="nav-item">
                                <Link href="/access/login"><a className="nav-link">
                                    Sign In
                                </a></Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/access/signup"><a className="nav-link">
                                 Sign Up
                                </a></Link>
                            </li>
                            </>
                            )}
                    </ul>

                </div>
            </div>
        </nav>
            <div className="mt-5 pt-2"></div>
        </header>
    )
}