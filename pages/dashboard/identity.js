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


export default function app() {
    const [loading, setLoading] = useState(true);
    const [identityCheck, setIdentityCheck] = useState({
        'data' : {
            'bvn' : null,
            'id_card' : null,
            'face_verification' : null,
            'address_verification' : null
        }
    });
    const [count, setCount] = useState(0)


    useEffect(() =>
    {
        Session.validateUser()

        async function loadUser() {
            const response = await fetch(Api.verifyIdentity,
                {
                    method: 'GET',
                    'headers': {
                        'Authorization': 'Bearer ' + Session.token
                    }
                });
            const data = await response.json();

            console.log(data);

            let app_count = 0;

            if(data.data !== null) {
                setIdentityCheck(data);

                if (data.data.bvn && data.data.bvn.status === 'approved') {
                    app_count = (app_count + 1);
                }


                    if (data.data.id_card && data.data.id_card.status === 'approved') {
                        app_count = (app_count + 1);
                    }


                if (data.data.face_verification && data.data.face_verification.status === 'approved') {
                    app_count = (app_count + 1);
                }

                if (data.data.address_verification && data.data.address_verification.status === 'approved') {
                    app_count = (app_count + 1);
                }
            }

            setCount(app_count);
            setLoading(false);
        }
        loadUser();


    }, []);


    return(
      <Dashboard_Layout title="Identity Verification">
              <section className="col-lg-10">

                  <h5 className="m-0">Tier ({count} of 4 Completed)</h5>
                  <p className="font-gray fs-6">We require all traders to verify their identity. After submission, processing typically takes less than 24 hours.</p>

                  <div className="row g-4 ">

                      <div className="col-lg-6">

                          <div className="bg-gray mb-4 p-4 rounded">

                              <h5 className="mb-3">Tier 1 - BVN Link</h5>
                              {loading ? (
                                  <Loader />
                                  ):(
                              <div className="row mt-4 align-items-center">
                                  <div className="col-8">
                                      <p>Link your Bank Verification number to increase your withdrawal limit.</p>
                                  </div>
                                  <div className="col-4">
                                      {
                                          identityCheck.data.bvn !== null && identityCheck.data.bvn.status !== 'awaitingApproval' ? (
                                              identityCheck.data.bvn.status === 'pending' ? (
                                                  <button className="btn btn-warning text-capitalize w-100">{identityCheck.data.bvn.status}</button>
                                                  ):(
                                              <button className="btn btn-success text-capitalize w-100">{identityCheck.data.bvn.status}</button>
                                              )
                                          ):(
                                                      <a href="identity_bvn" className="btn btn-danger w-100">Verify</a>
                                          )
                                      }

                                  </div>
                              </div>
                                  )}
                          </div>

                      </div>


                      <div className="col-lg-6">

                          <div className="bg-gray mb-4 p-4 rounded">
                              <h5 className="mb-3">Tier 2 - Identity Card Verification</h5>
                              {loading ? (
                                  <Loader />
                              ):(
                              <div className="row mt-4 align-items-center">
                                  <div className="col-8">
                                      <p>Increase your withdrawal limit by verifying your identity.</p>
                                  </div>
                                  <div className="col-4">
                                      {
                                          identityCheck.data.id_card !== null && identityCheck.data.id_card.status !== 'awaitingApproval' ? (
                                              identityCheck.data.id_card.status === 'pending' ? (
                                                  <button className="btn btn-warning text-capitalize w-100">{identityCheck.data.id_card.status}</button>
                                              ):(
                                                  <button className="btn btn-success text-capitalize w-100">{identityCheck.data.id_card.status}</button>
                                              )
                                          ):(
                                              <a href="identity_idcard" className="btn btn-danger w-100">Verify</a>
                                          )
                                      }
                                  </div>
                              </div>
                                  )}
                          </div>

                      </div>

                      <div className="col-lg-6">

                          <div className="bg-gray mb-4 p-4 rounded">
                              <h5 className="mb-3">Tier 3 - Face Verification</h5>
                              {loading ? (
                                  <Loader />
                              ):(
                              <div className="row mt-4 align-items-center">
                                  <div className="col-8">
                                      <p>Increase your withdrawal limit by verifying your identity.</p>
                                  </div>
                                  <div className="col-4">
                                      {
                                          identityCheck.data.face_verification !== null && identityCheck.data.face_verification.status !== 'awaitingApproval' ? (
                                              identityCheck.data.face_verification.status === 'pending' ? (
                                                  <button className="btn btn-warning text-capitalize w-100">{identityCheck.data.face_verification.status}</button>
                                              ):(
                                                  <button className="btn btn-success text-capitalize w-100">{identityCheck.data.face_verification.status}</button>
                                              )
                                          ):(
                                              <a href="identity_face" className="btn btn-danger w-100">Verify</a>
                                          )
                                      }
                                  </div>
                              </div>
                                  )}
                          </div>

                      </div>

                      <div className="col-lg-6">

                          <div className="bg-gray mb-4 p-4 rounded">
                              <h5 className="mb-3">Tier 4 - Address Verification</h5>
                              {loading ? (
                                  <Loader />
                              ):(
                              <div className="row mt-4 align-items-center">
                                  <div className="col-8">
                                      <p>Increase your withdrawal limit by verifying your identity.</p>
                                  </div>
                                  <div className="col-4">
                                      {
                                          identityCheck.data.address_verification !== null && identityCheck.data.address_verification.status !== 'awaitingApproval' ? (
                                              identityCheck.data.address_verification.status === 'pending' ? (
                                                  <button className="btn btn-warning text-capitalize w-100">{identityCheck.data.address_verification.status}</button>
                                              ):(
                                                  <button className="btn btn-success text-capitalize w-100">{identityCheck.data.address_verification.status}</button>
                                              )
                                          ):(
                                              <a href="identity_address" className="btn btn-danger w-100">Verify</a>
                                          )
                                      }
                                  </div>
                              </div>
                                  )}
                          </div>

                      </div>


                  </div>





              </section>






      </Dashboard_Layout>
  )
}