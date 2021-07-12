import Dashboard_Layout from "../../components/layout/dashboard_layout";
import React, {Component, useEffect, useState} from "react";
import * as Api from "../../components/config/api";
import * as Session from "../../components/config/session";
import {useRouter} from "next/router";
import * as Constant from "../../components/config/constant";
import Link from "next/link";
import Swal from "sweetalert2";
import NProgress from 'nprogress';
import { Facebook as Loader } from 'react-content-loader';


export default function app(props) {
    const router = useRouter();
    const v = router.query['request'];

    const [loading, setLoading] = useState(true);
    const [banks, setBanks] = useState([]);
    const [userBanks, setUserBanks] = useState([]);
    const [bankForm, setBankForm] = useState([]);





    // Bank form details
    const handleBankChange = e =>
        setBankForm({ ...bankForm, [e.target.name]: e.target.value });



    const handleBankSubmit = async e => {
        e.preventDefault();

        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            const res = await fetch(Api.userBanks + '/' + v, {
                method: 'PUT',
                body: JSON.stringify(bankForm),
                headers: {
                    'Authorization': 'Bearer ' + Session.token,
                    'Content-type': 'application/json'
                }
            });

            const json = await res.json();

            if (json.status === 'successful') {
                NProgress.done();
                Swal.fire({
                    title: 'Success!',
                    text: json.msg,
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });

                setTimeout(function(){ window.location.reload(); }, 3000);

            } else {
                NProgress.done();
                Swal.fire({
                    title: 'Failed!',
                    text: json.err,
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

    // get user's banks
    if (v) {
        if(userBanks.length === 0) {

            const response26 = fetch(Api.userBanks + '/' + v,
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + Session.token
                    }
                }).then((res) => res.json())
                .then((response26) => {
                    if (response26.data !== undefined) {
                        setUserBanks(response26.data);
                        setBankForm((response26.data));
                        setLoading(false);
                        console.log("fetch" + userBanks);
                    }
                })

        }
    }


    useEffect(() =>
    {
        Session.validateUser()

        if (banks.length === 0) {
            const response76 = fetch(Api.banks,
                {
                    method: 'GET',
                }).then((res) => res.json())
                .then((response76) => {
                    setBanks(response76.data);

                    //console.log(response76);
                })
        }





    }, []);


    return(
        <Dashboard_Layout title="Payment">


            <section className="col-lg-10">

                <Link href="payment"><button className="float-end btn btn-danger"><i className="fa fa-chevron-circle-left"></i> Back</button></Link>
                <h5 className="m-0">Edit Bank Details</h5>

                {loading ? (
                    <Loader />
                ) : (


                        <div className="card col-lg-6 mt-4" id="addBank">
                            <div className="card-header bg-dark font-white">
                               Edit Bank
                            </div>
                            <div className="card-body p-3">
                                <form onSubmit={handleBankSubmit} className=" p-0">

                                    <div className="mb-3 form-floating">

                                        <select className="form-select text-uppercase" placeholder="bank name" name="bankName" onChange={handleBankChange}>
                                            {
                                                banks.map((bank, index) => (
                                                    bank.bank_name === userBanks.bankName ? (
                                                            <option className="text-uppercase" selected>{bank.bank_name}</option>
                                                        ):(
                                                    <option className="text-uppercase">{bank.bank_name}</option>
                                                    )
                                                ))
                                            }
                                        </select>
                                        <label className="font-gray">Bank name</label>
                                    </div>


                                    <div className="mb-3 form-floating ">

                                        <input type="number" className="form-control" maxLength="10" name="accountNumber" onChange={handleBankChange}
                                               placeholder="Enter your account number" defaultValue={userBanks.accountNumber}/>
                                        <label className="font-gray">Account number</label>
                                    </div>

                                    <div className="mb-3 form-floating ">

                                        <input type="text" className="form-control" name="accountName" onChange={handleBankChange}
                                               placeholder="Enter account name" defaultValue={userBanks.accountName} />
                                        <label className="font-gray">Account name</label>
                                        <p className="Please note that Account name should match name on profile"></p>
                                    </div>


                                    <button className="btn btn-primary btn-block font-black">Update</button>


                                </form>
                            </div>

                    </div>
                )
                }


            </section>

        </Dashboard_Layout>
    )
}