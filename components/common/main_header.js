import * as Strings from "../config/string";
import ls from "local-storage";
import Link from "next/link";
import * as Session from "../config/session";

export default function header()
{
    const loggedInUser = ls.get("token");

    return(
        <header>
        <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-black">
            <div className="container">
                <Link href="/"><a className="navbar-brand">
                    <img src={'/logo.png'} width="100px"/>
                </a></Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText"
                        aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">

                        {loggedInUser ? (
                            <ul className="navbar-nav ms-auto ">
                            <li className="nav-item">
                                <Link href="/dashboard/"><a className="nav-link">
                                    <i className="fa fa-user-circle"></i> <span className="text-capitalize">{Session.username}</span>
                                </a></Link>
                            </li>
                            </ul>
                            ):(
                            <ul className="navbar-nav ms-auto ">
                            <li className="nav-item">
                                <Link href="/access/login"><a className="font-white me-lg-4 nav-link">
                                    Sign In
                                </a></Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/access/signup"><a className="btn font-white px-2 py-0 mt-2 btn-outline-warning nav-link">
                                 Create an account
                                </a></Link>
                            </li>
                            </ul>
                            )}



                </div>
            </div>
        </nav>

        </header>
    )
}