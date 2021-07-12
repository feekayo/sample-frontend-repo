
import Main_Layout from "../components/layout/main_layout";
import React, {Component,useEffect, useState} from 'react';
import Link from "next/link";
import { Link as ScrollLink } from 'react-scroll';
import * as Session from "../components/config/session";
import Head from "next/head";
import NProgress from "nprogress";
import * as Api from "../components/config/api";
import Swal from "sweetalert2";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'
import ls from "local-storage";

export default function home() {
    const [contact, setContact] = useState([]);
    const [mobileModal, setMobileModal] = useState(false);
    const handleChange = e => {
        setContact({...contact, [e.target.name]: e.target.value});
    }

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ease: 'ease', speed: 500});

            const res = await fetch(Api.preUsers, {
                method: 'POST',
                body: JSON.stringify(contact),
                headers: {
                    'Authorization': 'Bearer ' + Session.token,
                    'Content-type': 'application/json',
                    'ip': ls.get('ip'),
                    'device': ls.get('device'),
                }
            });

            //console.log(sale);

            const json = await res.json();
            console.log(json);
            if (json.status === 'successful') {
                NProgress.done();
                Swal.fire({
                    title: 'Success!',
                    text: json.msg,
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });


                // setTimeout(function(){ window.location.reload(); }, 3000);

            } else {
                NProgress.done();

                Swal.fire({
                    title: 'Failed!',
                    text: json.err.err,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
        } catch (e) {
            NProgress.done();
            console.log('An error occurred', e);
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while submitting the form',
                icon: 'error',
                confirmButtonText: 'Ok'
            });

        }
    };

    useEffect(() => {
        setTimeout(() => setMobileModal(true), 10000);

    }, []);


    return (
        <section>
            <title>ValorExchange | Home</title>
            <script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
                crossOrigin="anonymous"></script>
            <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-transparent_black_4">
                <div className="container">
                    <Link href="/"><a className="navbar-brand">
                        <img src={'/logo.png'} width="100px"/>
                    </a></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarText"
                            aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarText">
                        <ul className="navbar-nav ms-auto ">
                            <li className="nav-item">
                                <ScrollLink activeClass="active" to="about" spy={true} smooth={true} duration={1000}>
                                    <a className="nav-link me-4" href="#">About Us</a>
                                </ScrollLink>
                            </li>
                            <li className="nav-item">
                                <ScrollLink activeClass="active" to="faq" spy={true} smooth={true} duration={1000}>
                                    <a className="nav-link me-4" href="#">FAQ</a>
                                </ScrollLink>
                            </li>
                            <li className="nav-item me-lg-5">
                                <ScrollLink to="bethefirst" spy={true} smooth={true} duration={1000}>
                                    <a className="nav-link rounded-pill bg-primary px-3 font-black" href="#">Join
                                        Now</a>
                                </ScrollLink>
                            </li>

                        </ul>

                    </div>
                </div>
            </nav>
            <div className="jumbotron ">
                <div className="overlay"></div>

                <div className="content text-center ">
                    <div className="container">
                        <h1 className="font-xl-2 ">The first ever peer-to-peer BIDDING platform</h1>
                        <p className="fs-4 fw-light">Stay Updated!</p>

                        <img src={'/illust.png'} class="featured_image"/>

                        <div>
                            <img src={'/group_fees.png'} className="mt-4 img-fluid w-70"/>
                        </div>


                        {/*<div className="text-center">*/}
                        {/*    <ScrollLink activeClass="active" to="about" spy={true} smooth={true} duration={1000}>*/}
                        {/*    <div className="circle"><i className="fa fa-caret-down fa-2x mt-3"></i></div>*/}
                        {/*    <p className="mt-4">Read More</p>*/}
                        {/*    </ScrollLink>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>

            <div className="black_bg d-none d-lg-inline-block">

            </div>

            <div className="bg-white">
                <div className="container">
                    <div className="row g-0">
                        <div className="col-lg-5 col-12 no_xs_padding padding_xs  padding_100-top padding_100-bottom ">
                            <h3 className="fs-1 mb-4 fw-bold pt-5">Peer to Peer bidding</h3>
                            <p className="fs-5 fw-light">Peer-to-peer bidding is a process where buyers and sellers
                                exchange cryptocurrency through Bidding. The buyer and the seller bargain for a price
                                and when
                                the Bid is accepted, the buyer and seller can trade assets with other currencies.</p>
                        </div>
                        <div className="col-lg-7 padding_xs no_xs_padding padding_50-top">
                            <div className="text-lg-end no_xs_padding mt-5 text-center ">

                                <iframe width="80%" className=" mb-4" height="300"
                                        src="https://www.youtube.com/embed/mhl-DGUvcCo"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen></iframe>

                                {/*<i className="fa fa-play-circle fa-7x text-primary hover" data-bs-toggle="modal"*/}
                                {/*   data-bs-target="#videoModal"></i>*/}

                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="fancy_bg" id="about">
                <div className="container  padding_90-top padding_90-bottom text-center">
                    <div className="col-lg-8 my-4 mx-auto padding_xs">
                        <h3 className="fs-1 mb-4 fw-bold">About Us</h3>
                        <p className="fs-5 fw-light">Valor Exchange is a platform where you not only buy and sell your
                            cryptocurrency,
                            but you BID for it. A peer-to-peer bidding that guarantees you more through a trading
                            mechanism
                            designed to get you better deals.</p>
                        <p className="fs-5 fw-light">
                            Our aim is to elevate the technological strides in the cryptocurrency trading ecosystem
                        </p>

                        <a href="https://t.me/valorexchangecommunity" target="_blank"
                           className="btn btn-warning rounded-pill mt-4">Learn more <i
                            className="fa fa-chevron-circle-right"></i></a>
                    </div>
                </div>

            </div>

            <section className="row g-0">
                <div className="col-lg-6">
                    <div className="yellow_bg" id="bethefirst">


                        <div className="container padding_50 padding_xs text-center">
                            <div className="col-lg-10 my-4 mx-auto">
                                <div
                                    className="bg-white shadow-sm padding_xs padding_50 padding_90-top padding_90-bottom  white_form">
                                    <img src="/tether.svg" className="eth"/>
                                    <img src="/btc2.svg" className="tether"/>
                                    <img src="/plant.svg" className="plant"/>

                                    <h3 className="fs-1 mb-2 fw-bold">Notify me</h3>
                                    <div className="col-sm-8 margin_50-bottom  mx-auto">
                                        <p>Drop your contact information and you'd be the first to know when we've
                                            launched.</p>
                                    </div>


                                    <form className="fs-4" onSubmit={handleSubmit}>
                                        <div className="row g-5">
                                            <div className="col-md-6">
                                                <div className="form-floating">
                                                    <input type="text" required name="firstName"
                                                           className="form-control" onChange={handleChange}
                                                           placeholder="First name"/>
                                                    <label>First Name</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-floating">
                                                    <input type="text" required name="lastName" className="form-control"
                                                           onChange={handleChange} placeholder="First name"/>
                                                    <label>Last Name</label>
                                                </div>
                                            </div>

                                            <div className="col-md-12">
                                                <div className="form-floating">
                                                    <input type="email" required name="email" className="form-control"
                                                           onChange={handleChange} placeholder="Email"/>
                                                    <label>Email</label>
                                                </div>
                                            </div>

                                            <div className="col-12 text-center">
                                                <div className="form-floating">
                                                    <button
                                                        className="btn btn-primary rounded-pill btn-lg px-5">Submit
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="col-lg-6 telegram_bg">


                    <div className="font-white text-center padding_100">
                        <i className="fa fa-paper-plane fa-4x mb-3"></i>
                        <h1>Join our <br/>Telegram Community</h1>

                        <a href="https://t.me/valorexchangecommunity" target="_blank"
                           className="btn btn-warning mt-5 btn-lg rounded-pill">Join now</a>

                    </div>

                </div>
            </section>


            <section className="row g-0" id="faq">
                <div className="col-lg-6">
                    <div className=" text-center col-8 p-5 mx-auto">
                        <img src="/faq.png" className="img-fluid"/>
                    </div>
                </div>

                <div className="col-lg-6 ">

                    <div className="p-5">
                        <h1 className="fw-bold mb-4 text-center">FAQ</h1>

                        <div className="accordion" id="accordionExample">
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingOne">
                                    <button className="accordion-button fs-5" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapseOne" aria-expanded="true"
                                            aria-controls="collapseOne">
                                        When will Valor Exchange be available?
                                    </button>
                                </h2>
                                <div id="collapseOne" className="accordion-collapse collapse show"
                                     aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                    <div className="accordion-body lead">
                                        We will let you know when we launch. <a className="lead"
                                                                                href="https://t.me/valorexchangecommunity"
                                                                                target="_blank">Join</a> our community
                                        to stay updated
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingTwo">
                                    <button className="accordion-button fs-5 collapsed" type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseTwo" aria-expanded="false"
                                            aria-controls="collapseTwo">
                                        What do I need to get started?
                                    </button>
                                </h2>
                                <div id="collapseTwo" className="accordion-collapse collapse"
                                     aria-labelledby="headingTwo"
                                     data-bs-parent="#accordionExample">
                                    <div className="accordion-body lead">
                                        You will require an e-mail address, mobile number and a government-issued ID
                                        card
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingThree">
                                    <button className="accordion-button fs-5 collapsed" type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseThree" aria-expanded="false"
                                            aria-controls="collapseThree">
                                        What can I achieve on Valor Exchange?
                                    </button>
                                </h2>
                                <div id="collapseThree" className="accordion-collapse collapse"
                                     aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                    <div className="accordion-body lead">
                                        You can bid, buy and sell cryptocurrencies such as Bitcoin, Ethereum, Tether and
                                        more
                                    </div>
                                </div>
                            </div>

                            <div className="accordion-item">
                                <h2 className="accordion-header" id="heading4">
                                    <button className="accordion-button fs-5 collapsed" type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapse4" aria-expanded="false"
                                            aria-controls="collapse4">
                                        What makes Valor Exchange different from other Peer-to-Peer platform?
                                    </button>
                                </h2>
                                <div id="collapse4" className="accordion-collapse collapse"
                                     aria-labelledby="heading4" data-bs-parent="#accordionExample">
                                    <div className="accordion-body lead">
                                        Valor Exchange stands out from all other trading platforms with its unique
                                        bidding feature. Buyers and sellers can negotiate and agree on the prices they
                                        want to buy and sell their asset or exchange it for value.
                                    </div>
                                </div>
                            </div>

                            <div className="accordion-item">
                                <h2 className="accordion-header" id="heading5">
                                    <button className="accordion-button fs-5 collapsed" type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapse5" aria-expanded="false"
                                            aria-controls="collapse4">
                                        Will Valor Exchange charge fees?
                                    </button>
                                </h2>
                                <div id="collapse5" className="accordion-collapse collapse"
                                     aria-labelledby="heading5" data-bs-parent="#accordionExample">
                                    <div className="accordion-body lead">
                                        No! We do not charge fees for trading on Valor Exchange.
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </section>


            <div className="bg-dark p-4">
                <div className="container">

                    <div className="row align-items-center">

                        <div className="col">
                            <img src="/v.png" width="50px"/> <br/>
                            <img src="/logo_white.png" width="50px"/>
                        </div>

                        <div className="col d-none d-md-block text-center">
                            <p className="font-gray">&copy; 2021 valorexexchange.com | All Rights Reserved</p>
                        </div>

                        <div className="col text-end font-white">
                            <p>Join our community</p>
                            <a href="https://fb.com/valorexchange" target="_blank" className="font-white me-2"><i
                                className="fab fa-2x fa-facebook"></i></a>
                            <a href="https://twitter.com/ValorExchange" target="_blank" className="font-white me-2"><i
                                className="fab fa-2x fa-twitter"></i></a>
                            <a href="https://instagram.com/valor_exchange" target="_blank"
                               className="font-white me-2"><i className="fab fa-2x fa-instagram"></i></a>
                            <a href="https://t.me/valorexchangecommunity" target="_blank" className="font-white me-2"><i
                                className="fab fa-2x fa-telegram"></i></a>
                            <a href="https://www.youtube.com/channel/UCKCfiS1Zn18TSGvKpWf9NoQ" target="_blank"
                               className="font-white me-2"><i className="fab fa-2x fa-youtube"></i></a>


                        </div>

                    </div>

                </div>

            </div>


            <div class="modal  fade" id="videoModal" tabindex="-1" aria-labelledby="exampleModalLabel"
                 aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-body">
                            <iframe width="100%" height="400" src="https://www.youtube.com/embed/mhl-DGUvcCo"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen></iframe>
                        </div>

                    </div>
                </div>

            </div>

            {
                mobileModal === true ? (

                    <div className="modal fade show d-md-none d-lg-none d-block" id="mobileVideoModal" tabIndex="-1"
                         aria-labelledby="exampleModalLabel"
                         aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h3 className="fs-1 mb-2 fw-bold">Notify me</h3>
                                    <button type="button" onClick={() => setMobileModal(!mobileModal)}
                                            className="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <p className="font-gray">Drop your contact information and you'd be the first to
                                        know when we've launched.</p>
                                    <form className="fs-4" onSubmit={handleSubmit}>
                                        <div className="row g-5">
                                            <div className="col-md-6">
                                                <div className="form-floating">
                                                    <input type="text" required name="firstName"
                                                           className="form-control" onChange={handleChange}
                                                           placeholder="First name"/>
                                                    <label>First Name</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-floating">
                                                    <input type="text" required name="lastName" className="form-control"
                                                           onChange={handleChange} placeholder="First name"/>
                                                    <label>Last Name</label>
                                                </div>
                                            </div>

                                            <div className="col-md-12">
                                                <div className="form-floating">
                                                    <input type="email" required name="email" className="form-control"
                                                           onChange={handleChange} placeholder="Email"/>
                                                    <label>Email</label>
                                                </div>
                                            </div>

                                            <div className="col-12 text-center">
                                                <div className="form-floating">
                                                    <button
                                                        className="btn btn-primary rounded-pill btn-lg px-5">Submit
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">

                                    <button type="button" onClick={() => setMobileModal(!mobileModal)}
                                            className="btn btn-secondary" data-bs-dismiss="modal">Close
                                    </button>

                                </div>

                            </div>
                        </div>

                    </div>

                ) : (null)
            }
        </section>
    )
}