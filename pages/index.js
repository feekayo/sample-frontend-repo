import Main_Layout from "../components/layout/main_layout";
import React, {useEffect, useState} from "react";
import ls from "local-storage";
import * as Constants from "../components/config/constant";
import Link from "next/link";

export default function _po_45_3r() {
    const[loading, setLoading] = useState(true);
    let assets = ls.get('front_assets');


    useEffect(() => {

        if(assets === null)
        {
          //  console.log('yes');

        }else{
            setLoading(false);
        }
    }, [assets])


    return(
        <Main_Layout title="Home">


            <section className="bg-new p-5">

                <div className="container pb-5">

                    <div className="row">
                        <div className="col-lg-5 text-center p-0 d-none d-lg-block">
                            <img src={"/ted.png"}  className="img-fluid mx-auto banner_image" />
                        </div>

                        <div className="col-lg-7">
                            <h1 className="font-white text-capitalize font-xl m-0">Rethinking exchange</h1>
                            <h1 className="font-white text-capitalize font-xl">P2P Bidding of cryptocurrency</h1>

                            <p className="font-white lead fw-light">You cannot discover new oceans unless you have the Courage to lose sight <br/> of the shore…Earn more through bidding</p>


                            <form className="col-lg-8 mt-5">
                                <div className="d-flex">
                                    <input type="email" placeholder="Enter your email" className="form-control me-4 w-50"/><button className="btn btn-primary px-4">Get Started <i className="fa fa-paper-plane"></i></button>
                                </div>
                            </form>
                        </div>
                    </div>


                </div>
            </section>


            <section className="bg-white margin_50-top">
                <div className="container pb-5">

                    
                    <div className="row text-center">

                        <div className="col-4 pt-1">
                            <img src="/1.svg" width="90px"/>
                            <h2 className="mt-3">Bid</h2>
                            <p>Fast and interactive <br/> bidding of cryptocurrency</p>
                        </div>
                        <div className="col-4 pt-1">
                            <img src="/3.svg" width="90px" />
                            <h2 className="mt-3">ZERO FEES</h2>
                            <p>Buy and sell your <br/> cryptocurrency at ZERO Fees</p>
                        </div>
                        <div className="col-4 pt-1">
                            <img src="/2.svg" width="90px" />
                            <h2 className="mt-3">Earn More</h2>
                            <p>Determine the price of your <br/> cryptocurrency through bidding</p>
                        </div>

                    </div>

                </div>
            </section>

            <div className="bg-gray-2 p-2">
                <marquee> <i className="fa fa-bullhorn"></i> {"<<<<<<Buy and sell your cryptocurrency at ZERO Fees. >>>>>>>"} </marquee>
            </div>

            <div className="bg2 ">

                <div className="container">

                    <div className="row g-0 align-content-stretch">

                        <div className="col-lg-6">
                            <div className="text-start font-white p-5 ">

                                <h2 className="font-xl-2 m-0 font-weight-700 text-uppercase">Earn Up to $100</h2>
                                <p className="text-uppercase font-weight-500 fs-3">DAILY ON VALOR EXCHANGE</p>

                                <p className="lead">Bidding creates price advantage that every crypto trader wants, By allowing you to buy and also sell at profits</p>

                                <a className="btn btn-primary btn-lg px-4 mt-3 font-black">See more</a>
                            </div>
                        </div>

                        <div className="col-lg-6 p-3 text-center d-none d-lg-block">
                            <img src="/valor_icon.png" width="300px" />
                        </div>

                    </div>

                </div>

            </div>
            <div className="bg-gray-2 p-2">
                <marquee> <i className="fa fa-bullhorn"></i> {"<<<<<<Buy and sell your cryptocurrency at ZERO Fees. >>>>>>>"} </marquee>
            </div>

            <section className="border_bottom ">
                <div className="row g-0">
                    <div className="col-lg-6 shadow">
                        <div className="bg-primary text-center font-white p-4">
                            <h3 className="fw-bold">Sell Cryptocurrency</h3>
                        </div>

                        <div className="row g-0 margin_30-top">
                            <div className="col-9">
                                <div className="slide_point text-lg-center text-end">
                                    <div className="icon_container bg-primary"><i className="fa fa-coins fa-3x"></i></div>
                                    Instantly deposit your coins
                                </div>
                            </div>
                            <div className="col-1">
                                <div className="big_angle"></div>
                            </div>
                        </div>

                        <div className="row g-0 margin_30-top">
                            <div className="col-1 offset-2">
                                <div className="big_angle_2"></div>
                            </div>
                            <div className="col-9">
                                <div className="slide_point text-lg-center text-start">
                                    <div className="icon_container_2 bg-gray-4"><i className="fa fa-handshake fa-3x"></i></div>
                                    Create sales offer
                                </div>
                            </div>

                        </div>

                        <div className="row g-0 margin_30-top">
                            <div className="col-9">
                                <div className="slide_point text-lg-center text-end">
                                    <div className="icon_container bg-primary"><i className="fa fa-check-circle fa-3x"></i></div>
                                    Accept best bid price
                                </div>
                            </div>
                            <div className="col-1">
                                <div className="big_angle"></div>
                            </div>
                        </div>


                        <div className="row g-0 margin_30-top">
                            <div className="col-1 offset-2">
                                <div className="big_angle_2"></div>
                            </div>
                            <div className="col-9">
                                <div className="slide_point text-lg-center text-start">
                                    <div className="icon_container_2 bg-gray-4"><i className="fas fa fa-university fa-3x"></i></div>
                                    Get paid into your bank account
                                </div>
                            </div>

                        </div>


                        <div className="text-center my-5">
                            <a href="/trade" className="btn btn-lg btn-primary">Create Sale</a>
                        </div>

                    </div>
                    <div className="col-lg-6 shadow">
                        <div className="bg-dark text-center font-white p-4">
                            <h3 className="fw-bold">Buy Cryptocurrency</h3>
                        </div>


                        <div className="row g-0 margin_30-top">
                            <div className="col-1 offset-2">
                                <div className="big_angle_2 primary"></div>
                            </div>
                            <div className="col-9">
                                <div className="slide_point bg-primary text-lg-center text-start">
                                    <div className="icon_container_2 bg-gray-4"><i className="fas fa fa-hand-holding-usd fa-3x"></i></div>
                                    Make a bid
                                </div>
                            </div>
                        </div>

                        <div className="row g-0 margin_30-top">
                            <div className="col-9">
                                <div className="slide_point bg-primary text-lg-center text-end">
                                    <div className="icon_container bg-gray-4"><i className="fa fa-glass-cheers fa-3x"></i></div>
                                    Win a bid
                                </div>
                            </div>
                            <div className="col-1">
                                <div className="big_angle primary"></div>
                            </div>
                        </div>

                        <div className="row g-0 margin_30-top">
                            <div className="col-1 offset-2">
                                <div className="big_angle_2 primary"></div>
                            </div>
                            <div className="col-9">
                                <div className="slide_point bg-primary text-lg-center text-start">
                                    <div className="icon_container_2 bg-gray-4"><i className="fas fa fa-dollar-sign fa-3x"></i></div>
                                    Make payment
                                </div>
                            </div>
                        </div>


                        <div className="row g-0 margin_30-top">
                            <div className="col-9">
                                <div className="slide_point bg-primary text-lg-center text-end">
                                    <div className="icon_container bg-gray-4"><i className="fa fa-donate fa-3x"></i></div>
                                    Get coin credited immediately
                                </div>
                            </div>
                            <div className="col-1">
                                <div className="big_angle primary"></div>
                            </div>
                        </div>

                        <div className="text-center my-5">
                            <a href="/trade" className="btn btn-lg btn-dark">Buy Now</a>
                        </div>

                    </div>
                </div>
            </section>

            <section>
                <div className="container py-5">
                    <h3 className="fw-bold mb-4">Supported Cryptocurrencies</h3>

                    <div className="bg-red">
                        {
                            loading ? (
                                Constants.loading()
                            ):(
                                <table className=" home_table table-hover table ">
                                    <thead>
                                    <tr>
                                        <th>Coin</th>
                                        <th>Last Price </th>
                                        <th>24hr Change</th>
                                        <th>24hr High</th>
                                        <th>24hr Low</th>
                                        <th>Trade</th>
                                    </tr>
                                    </thead>

                                    <tbody>

                                    {
                                        assets.map((asset,index) => (
                                            <tr>
                                                <td><img src={asset.icon} className="float-start me-2" style={{ maxWidth : '30px' }} />
                                                    {asset.name}</td>
                                                <td>${asset.currentPrice}</td>
                                                <td>
                                                    <p className={
                                                        asset.change24.charAt(0) === '-' ? (
                                                            "fs-6 text-danger font-weight-700 m-0"
                                                        ) : ("fs-6 text-success font-weight-700 m-0")}>{asset.change24}

                                                        <span className={
                                                            asset.change24Percentage.charAt(0) === '-' ? (
                                                                "fs-6 text-danger"
                                                            ) : ("fs-6 text-success")}> {
                                                            asset.change24Percentage.charAt(0) === '-' ? (
                                                                ""
                                                            ) : ("+")}{asset.change24Percentage}%</span>
                                                    </p>
                                                </td>
                                                <td>${asset.high24}</td>
                                                <td>${asset.low24}</td>
                                                <td>
                                                    <Link href="/trade">
                                                        <a className="btn btn-primary">Buy Now</a>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    }

                                    </tbody>
                                </table>
                            )
                        }
                    </div>
                </div>
            </section>


            <section className="bg-dark font-white">
                <div className="container py-5">

                    <div className="row">
                        <div className="col-lg-8">
                            <h3 className="fw-bold mb-4">Wallet</h3>

                            <ul className="nav nav-pills mb-3 home_wallet_tabs" id="pills-tab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill"
                                            data-bs-target="#pills-home" type="button" role="tab"
                                            aria-controls="pills-home" aria-selected="true">Deposit
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill"
                                            data-bs-target="#pills-profile" type="button" role="tab"
                                            aria-controls="pills-profile" aria-selected="false">Withdraw
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill"
                                            data-bs-target="#pills-contact" type="button" role="tab"
                                            aria-controls="pills-contact" aria-selected="false">Transfer
                                    </button>
                                </li>
                            </ul>
                            <div className="tab-content pt-3" id="pills-tabContent">
                                <div className="tab-pane fade show active" id="pills-home" role="tabpanel"
                                     aria-labelledby="pills-home-tab">
                                    <h5>How to deposit</h5>
                                    <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. </p>
                                </div>
                                <div className="tab-pane fade" id="pills-profile" role="tabpanel"
                                     aria-labelledby="pills-profile-tab">
                                    <h5>How to withdraw</h5>
                                    <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. </p>
                                </div>
                                <div className="tab-pane fade" id="pills-contact" role="tabpanel"
                                     aria-labelledby="pills-contact-tab">
                                    <h5>How to transfer</h5>
                                    <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. </p>
                                </div>
                            </div>

                        </div>
                        <div className="col-lg-4">
                            <img src="/wallet_img.png" className="img-fluid" />
                        </div>
                    </div>



                </div>
            </section>

            <footer className="font-white">

                <div className="container py-5">

                    <div className="row">

                        <div className="col-lg-2 text-lg-start text-center mb-3 ">
                            <div><img src="/v.png" style={{ maxWidth : '90px' }} className="img-fluid mb-3" /></div>
                            <img src="/logo_white.png" style={{ maxWidth : '100px' }} className="img-fluid" />
                        </div>

                        <div className="col-lg-2 mb-4">
                            <h5 className="font-weight-700 mb-4">About</h5>
                            <ul>
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Terms of service</a></li>
                                <li><a href="#">Privacy policy</a></li>
                                <li><a href="#">Cookies policy</a></li>
                                <li><a href="#">Security</a></li>
                                <li><a href="#">Fees</a></li>
                            </ul>

                        </div>

                        <div className="col-lg-2 mb-4">
                            <h5 className="font-weight-700 mb-4">Services</h5>
                            <ul>
                                <li><a href="#">Bidding</a></li>
                                <li><a href="#">Bulk Bidding</a></li>
                                <li><a href="#">Guide</a></li>
                                <li><a href="#">Buy Bitcoin</a></li>
                                <li><a href="#">Buy Tether</a></li>
                                <li><a href="#">Buy Ethereum</a></li>
                                <li><a href="#">Verification</a></li>
                                <li><a href="#">Wallet</a></li>
                                <li><a href="#">Escrow</a></li>
                                <li><a href="#">Rewards</a></li>
                            </ul>

                        </div>


                        <div className="col-lg-2 mb-4">
                            <h5 className="font-weight-700 mb-4">Learn about</h5>
                            <ul>
                                <li><a href="#">Creating sales</a></li>
                                <li><a href="#">Participating in a bid</a></li>
                                <li><a href="#">Winning bids</a></li>
                                <li><a href="#">Making bulk bids</a></li>
                                <li><a href="#">Watchlist</a></li>
                                <li><a href="#">Buy now feature</a></li>
                                <li><a href="#">Partial sales</a></li>
                                <li><a href="#">Minimum order quantity (MOQ)</a></li>
                                <li><a href="#">Transfer of asset</a></li>
                                <li><a href="#">Withdrawals</a></li>
                                <li><a href="#">Deposit</a></li>
                            </ul>

                        </div>

                        <div className="col-lg-2 mb-4">
                            <h5 className="font-weight-700 mb-4">Support</h5>
                            <ul>
                                <li><a href="#">Contact us</a></li>
                                <li><a href="#">Give us feedback</a></li>
                                <li><a href="#">Live chat</a></li>
                                <li><a href="#">FAQs</a></li>
                                <li><a href="#">Media</a></li>
                            </ul>

                        </div>

                        <div className="col-lg-2 mb-4">
                            <h5 className="font-weight-700 mb-4">Community</h5>

                            <i className="fab fa-facebook-f circle-icon"></i>
                            <i className="fab fa-instagram circle-icon"></i>
                            <i className="fab fa-twitter circle-icon"></i>
                            <i className="fab fa-telegram circle-icon"></i>
                            <i className="fab fa-whatsapp circle-icon"></i>
                            <i className="fab fa-reddit circle-icon"></i>

                        </div>

                    </div>

                </div>

            </footer>


        </Main_Layout>
    )
}
