import * as Session from "../config/session";
import * as Constant from "../config/constant";
import React from "react";
import moment from "moment";
import ls from "local-storage";
import Countdown from "react-countdown";
import Link from "next/link";

export const transaction_columns = [
    {
        name: 'ID',
        sortable: true,
        width: '70px',
        cell: (row, index) => (index + 1),
    },
    {
        name: 'Tnx ID',
        selector: 'transactionId',
        sortable: true,
    },
    {
        name: 'Description',
        selector: 'transactionId',
        sortable: true,
        cell: (row, index) => (row.description ? row.description :

                row.receiverId === Session.id ? (
                    <span>
                                                                           Credit Transaction
                                                                        </span>
                ) : (
                    <span>
                                                                             Debit Transaction
                                                                        </span>
                )
        )
    },
    {
        name: 'Cr',
        selector: 'credit',
        sortable: true,
        cell: (row, index) => (
            row.receiverId === Session.id ? (row.amount + " " + row.asset.toUpperCase()) : (0.00)
        ),
    },
    {
        name: 'Dr',
        selector: 'debit',
        sortable: true,
        cell: (row, index) => (
            row.receiverId !== Session.id ? (row.amount + " " + row.asset.toUpperCase()) : (0.00)
        ),
    },
    {
        name: 'Date',
        selector: 'date',
        sortable: true,
        cell: (row, index) => (moment(row.created).format('ddd MMM DD, YYYY H:m:s')),
    },
    {
        name: 'Status',
        selector: 'status',
        sortable: true,
        cell: (row, index) => (
            row.status === 'completed' ? (
                <span className="text-success">Completed</span>
            ) : (
                <span className="text-warning">{row.status}</span>
            )
        ),
    }

];


export const bidHistoryColumns = [
    {
        name: 'ID',
        sortable: true,
        width: '70px',
        cell: (row, index) => (index + 1),
    },
    {
        name: 'Seller',
        selector: 'sellerId',
        sortable: true,
        cell: (row, index) => <span className="text-capitalize">{row.sellerId.username}</span>,
    },
    {
        name: 'Asset',
        selector: 'asset',
        sortable: true,
        cell: (row, index) => <span className="text-uppercase">{row.advertId.asset.toUpperCase()}</span>,
    },
    {
        name: 'Quantity',
        selector: 'quantity',
        sortable: true,
        cell: (row, index) => <TradeAmount {...row} />
    },
    {
        name: 'Value ($)',
        selector: 'value',
        sortable: true,
        cell: (row, index) => <BidValue {...row} />
    },
    {
        name: 'My Bid (₦/$)',
        selector: 'my_bid',
        sortable: true,
        cell: (row, index) => (row.rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')),
    },
    {
        name: 'Total Price (₦)',
        selector: 'total_price',
        sortable: true,
        cell: (row, index) => <TotalPrice {...row} />,
    },
    {
        name: 'Bid Expiry',
        selector: 'date',
        sortable: true,
        cell: (row, index) => row.expiringTime ? (
            <Countdown date={Date.parse(row.expiringTime)}/>
        ) : (
            <span>N/A</span>
        ),
    }
    // ,
    // {
    //     name: 'Time Left',
    //     selector: 'status',
    //     sortable: true,
    //     cell: (row, index) => <Countdown date={Date.parse(row.advertId.expiringTime)}/>,
    // }

];

export const bidHistoryColumnsMobile = [
    {
        name: 'My Bids',
        sortable: true,
        width: '100%',
        cell: (row, index) => (
            <div className="border my-2 w-100 p-3 border_radius shadow-sm">
                <div className="row">
                    <div className="col-8">
                        <h5 className="m-0">
                            {row.advertId.amount.toFixed(5)}{row.advertId.asset.toUpperCase()} <i className="fas text-success fa-exchange-alt"></i> $<BidValue {...row} />
                        </h5>
                        {/*<p className="m-0 font-xs">{pay.amount.toFixed(5)} {pay.asset.toUpperCase()} <i className="fas text-success fa-exchange-alt"></i> ${(pay.amount * listAsset.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>*/}
                        {/*<p className="m-0 font-xs">$1 = ₦{pay.rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>*/}
                        <p className="m-0 font-xs text-capitalize font-gray"><badge className="badge bg-success">Seller:</badge> {row.sellerId.username}</p>
                    </div>
                    <div className="col-4">
                        <i className="fa fa-clock"></i> {
                        row.expiringTime ? (
                                 <Countdown date={Date.parse(row.expiringTime)}/>
                            ) : (
                                <span>N/A</span>
                            )
                        }
                    </div>

                    <div className="col-12 mt-3 border_top">
                        <div className="row">
                            <div className="col p-2 border_right">
                                <p className=" m-0 text-uppercase font-xs font-weight-800">My Bid (N/$)</p>
                                {row.rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            </div>
                            <div className="col p-2">
                                <p className="m-0 text-uppercase font-xs font-weight-800">Total Price (N)</p>
                                <TotalPrice {...row} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
];

export const advertHistoryColumns = [
    {
        name: 'ID',
        sortable: true,
        width: '70px',
        cell: (row, index) => (index + 1),
    },
    {
        name: 'Asset',
        selector: 'asset',
        sortable: true,
        cell: (row, index) => <span className="text-uppercase">{row.asset.toUpperCase()}</span>,
    },
    {
        name: 'Quantity',
        selector: 'quantity',
        sortable: true,
        cell: (row, index) => row.amount.toFixed(5)
    },
    {
        name: 'Value ($)',
        selector: 'value',
        sortable: true,
        cell: (row, index) => <BidValue2 {...row} />
    },
    {
        name: 'Top Bid',
        selector: 'total_price',
        sortable: true,
        cell: (row, index) =>
            row.highestBid === null ? (
                <span>N/A</span>
            ) : (
                row.highestBid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            )

    },
    {
        name: 'Total Price (₦)',
        selector: 'total_price',
        sortable: true,
        cell: (row, index) => <TotalPrice2 {...row} />,
    },


    {
        name: 'Action',
        selector: 'action',
        sortable: true,
        cell: (row, index) => {
            let time_remaining = (new Date(row.expiringTime).getTime() - new Date().getTime());
            return(
                <div className="d-block p-2">
                    {
                        row.expired === false && time_remaining <= 0 ? (
                            <button onClick={() => Constant.collectRefund(row._id)} className="btn mb-2 btn-sm btn-success w-100">Collect Refund</button>
                        ) : null
                    }
                            <Link href={"/trade/view?advert=" + row._id}>
                <button className="btn btn-sm w-100 btn-warning">View</button>
            </Link>
                    </div>)
        },
    }

];

export const advertHistoryColumnsMobile = [
    {
        name: 'My Adverts',
        sortable: true,
        width: '100%',
        cell: (row, index) => (
            <Link href={"/trade/view?advert=" + row._id}>
            <div className="border clearfix my-2 w-100 p-3 border_radius shadow-sm">
                <div className="row">
                    <div className="col-8">
                        <h5 className="m-0">
                            {row.amount.toFixed(5)}{row.asset.toUpperCase()} <i className="fas text-success fa-exchange-alt"></i> $<BidValue2 {...row} />
                        </h5>
                        <p className="m-0 font-xs">$1 = ₦{row.openingRate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>

                    </div>
                    <div className="col-4">
                        <i className="fa fa-clock"></i> {moment(row.created).format('MMM DD, YYYY H:m:s')}
                    </div>

                    <div className="col-12 mt-3 border_top">
                        <div className="row">
                            <div className="col p-2 border_right">
                                <p className=" m-0 text-uppercase font-xs font-weight-800">Top Bid (N/$)</p>
                                {
                                    row.highestBid === null ? (
                                                <span>N/A</span>
                                            ) : (
                                                row.highestBid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                            )
                                }
                            </div>
                            <div className="col p-2">
                                <p className="m-0 text-uppercase font-xs font-weight-800">Total Price (N)</p>
                                <TotalPrice2 {...row} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </Link>
        )
    }

];


const TradeAmount = row => {

    if (row.advertId.partBid === true) {
        return (<span>{row.advertId.amount.toFixed(5)} <sup className='fw-bold text-warning'>P</sup></span>);
    } else {
        return (<span>{row.advertId.amount.toFixed(5)} <sup className='fw-bold text-success'>F</sup></span>);
    }
}


const BidValue = row => {
    let assets = ls.get('assets');

    let listAsset;
    let count = assets.length;

    for (let i = 0; i < count; i++) {
        let data = assets[i];

        if (row.advertId.asset.toUpperCase() === data.abbr) {
            listAsset = data;
        }

    }

    return (row.advertId.amount * listAsset.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const BidValue2 = row => {
    let assets = ls.get('assets');

    let listAsset;
    let count = assets.length;

    for (let i = 0; i < count; i++) {
        let data = assets[i];

        if (row.asset.toUpperCase() === data.abbr) {
            listAsset = data;
        }

    }

    return (row.amount * listAsset.rate).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const TotalPrice = row => {
    let assets = ls.get('assets');

    let listAsset;
    let count = assets.length;

    for (let i = 0; i < count; i++) {
        let data = assets[i];

        if (row.advertId.asset.toUpperCase() === data.abbr) {
            listAsset = data;
        }

    }


    return ((row.rate * (row.advertId.amount * listAsset.rate)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
}

const TotalPrice2 = row => {
    let assets = ls.get('assets');

    let listAsset;
    let count = assets.length;

    for (let i = 0; i < count; i++) {
        let data = assets[i];

        if (row.asset.toUpperCase() === data.abbr) {
            listAsset = data;
        }

    }


    return (row.highestBid === null ? (
        <span>N/A</span>
    ) : (
        (row.highestBid * (row.amount * listAsset.rate)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    ))
}


export const usersColumn = [
    {
        dataField: 'id',
        formatter: (cell, row, rowIndex) => rowIndex + 1,
        text: 'S/N'
    }, {
        dataField: 'username',
        text: 'Username',
        sort: true
    }, {
        dataField: 'email',
        text: 'Email',
        sort: true
    },
    {
        dataField: 'created',
        text: 'Date Joined',
        formatter: (cell, row) => moment(row.created).format('ddd MMM DD, YYYY'),
        sort: true
    },
    {
        dataField: 'status',
        text: 'Status',
        formatter: (cell, row) => row.status === true ? (
            <span><i className="fa fa-circle text-success"></i> Active</span>
        ) : (
            <span><i className="fa fa-circle text-danger"></i> Inactive</span>
        ),
        sort: true
    },
    {
        dataField: 'created',
        text: 'Options',
        formatter: (cell, row) => (
            <a href={"/admin/view_user?us=" + row._id} className="btn btn-sm btn-warning">View More</a>),
        sort: true
    },
];

