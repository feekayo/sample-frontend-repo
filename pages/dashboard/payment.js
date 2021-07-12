import Dashboard_Layout from "../../components/layout/dashboard_layout";
import React, {Component, useEffect, useState} from "react";
import * as Api from "../../components/config/api";
import * as Session from "../../components/config/session";
import * as Constant from "../../components/config/constant";
import * as Constants from "../../components/config/constant";
import Link from "next/link";
import Swal from "sweetalert2";
import NProgress from 'nprogress';
import { Facebook as Loader } from 'react-content-loader';
import ls from "local-storage";



export default function app() {
    const [loading, setLoading] = useState(true);
    const [userBanks, setUserBanks] = useState([]);
    const [banks, setBanks] = useState([]);
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

            const res = await fetch(Api.userBanks, {
                method: 'POST',
                body: JSON.stringify(bankForm),
                headers: {
                    'Authorization': 'Bearer ' + Session.token,
                    'Content-type': 'application/json',
                    'ip' : ls.get('ip'),
                    'device' : ls.get('device'),
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


    async function deleteBank(id) {
        try {
            NProgress.start();
            NProgress.inc();
            NProgress.configure({ ease: 'ease', speed: 500 });

            const res = await fetch(Api.userBanks + "/" + id, {
                method: 'DELETE',
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
                    //setLoading(false);
                    console.log(response76);
                })
        }

        if (userBanks.length === 0) {
            const response26 = fetch(Api.userBanks + '?userId=' + Session.id,
                {
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + Session.token
                    }
                }).then((res) => res.json())
                .then((response26) => {
                    setUserBanks(response26.data);
                    setLoading(false);
                    console.log(response26.data);
                })
        }


    }, []);


    return(
        <Dashboard_Layout title="Payment">


            <section className="col-lg-10">

                <button className="float-end btn btn-danger" data-bs-toggle="collapse" href="#addBank" role="button" aria-expanded="false" aria-controls="addBank"><i className="fa fa-plus"></i> Add Bank</button>
                <h5 className="m-0">Bank Details</h5>
                <p className="font-gray fs-6">Provide your banking information to receive payments when trading</p>



                {loading ? (
                    <Loader />
                ) : (

                    <div>
                        <div className="card collapse col-lg-6" id="addBank">
                            <div className="card-header bg-dark font-white">
                                Add New Bank
                            </div>
                            <div className="card-body p-3">
                                <form onSubmit={handleBankSubmit} className=" p-0">


                                    <div className="mb-3 form-floating">

                                        <select className="form-select text-uppercase" placeholder="bank name" name="bankName" onChange={handleBankChange}>
                                            <option selected disabled value="">Select bank</option>
                                            {
                                                banks.map((bank, index) => (
                                                    <option>{bank.bank_name}</option>
                                                ))
                                            }
                                        </select>
                                        <label className="font-gray">Bank name</label>
                                    </div>


                                    <div className="mb-3 form-floating ">

                                        <input type="number" className="form-control" maxLength="10" name="accountNumber" onChange={handleBankChange}
                                               placeholder="Enter your account number"/>
                                        <label className="font-gray">Account number</label>
                                    </div>

                                    <div className="mb-3 form-floating ">

                                        <input type="text" className="form-control" name="accountName" onChange={handleBankChange}
                                               placeholder="Enter account name"/>
                                        <label className="font-gray">Account name</label>
                                        <p className="Please note that Account name should match name on profile"></p>
                                    </div>

                                    <div className="mb-3 form-floating">

                                        <select className="form-select" name="accountType" onChange={handleBankChange}>
                                            <option selected disabled value="">Select account type</option>
                                            <option value="current">Current</option>
                                            <option value="savings">Savings</option>
                                        </select>
                                        <label className="font-gray">Account Type</label>
                                    </div>

                                    <button className="btn btn-primary btn-block font-black">Add New</button>


                                </form>
                            </div>
                        </div>

                        <table className="table table-borderless table-striped mt-3 table-hover">
                            <thead>
                            <tr className="bg-primary">
                                <th>S/N</th>
                                <th>Bank Name</th>
                                <th>Account Name</th>
                                <th>Account Number</th>
                                <th>Options</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                userBanks.length >= 1 ? (
                                    userBanks.map((bank, index) => (
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td className="text-uppercase">{bank.bankName}</td>
                                            <td className="text-capitalize">{bank.accountName}</td>
                                            <td>{bank.accountNumber}</td>
                                            <td>
                                                <Link href={"edit_bank?request=" + bank._id}><button className="btn btn-warning btn-sm me-3"><i className="fa fa-edit"></i> Edit</button></Link>
                                                <button onClick={() => deleteBank(bank._id)} className="btn btn-danger btn-sm"><i className="fa fa-window-close"></i> Delete</button>
                                            </td>
                                        </tr>
                                    ))

                                ):(
                                    <td colSpan="12" className="p-5 w-100 text-center">
                                        <i className="fa fa-question-circle fa-2x font-gray"></i>
                                        <h5 className="font-gray">You have not added any banking information</h5>
                                    </td>
                                )
                            }

                            </tbody>
                        </table>
                    </div>
                )
                }


            </section>

        </Dashboard_Layout>
    )
}