import Dashboard_Layout from "../../components/layout/dashboard_layout";
import React, {useEffect, useState} from "react";
import ls from "local-storage";
import * as Session from "../../components/config/session";
import * as Api from "../../components/config/api";
import Skeleton from "react-loading-skeleton";
import DataTable from "react-data-table-component";
import * as Tables from "../../components/common/tables";
import moment from "moment";
import ToolkitProvider, {Search} from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";;
const { SearchBar } = Search;

export default function log() {
    const [loading, setLoading] = useState(true);
    const [log, setLog] = useState([]);

    const columns = [
        {
            text: 'ID',
            sort: true,
            width: '70px',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
        },
        {
            dataField: 'created',
            text: 'Date',
            sort: true,
            width: '200px',
            formatter: (cell, row) => (moment(row.created).format('ddd MMM DD, YYYY H:m:s')),
        },
        {
            dataField: 'message',
            text: 'Status',
            sort: true,
            width: '40%',
            formatter: (cell, row) => (<>
            <p className="text-wrap">{row.message}</p>
                <span className="font-gray font-xs">{row.deviceName}</span>
            </>),

        },
        {
            dataField: 'ip',
            text: 'IP',
            sort: true,
            width: '150px',
        }

    ];

    useEffect(() =>
    {
        Session.validateUser()

        async function loadUser() {

            const response2 = await fetch(Api.log,
                {
                    method: 'GET',
                    'headers': {
                        'Authorization': 'Bearer ' + Session.token
                    }
                });
            const jsondata2 = await response2.json();

            console.log(jsondata2);
            setLog(jsondata2.data);
            setLoading(false);
        }

        loadUser();

    }, []);


  return(
      <Dashboard_Layout title="Activity Log">

          {loading ? (
              <div >
                  <Skeleton height="50px" className="mb-3" />

                  <Skeleton height="30px" className="mb-2"/>
                  <Skeleton height="30px" className="mb-2"/>
                  <Skeleton height="30px" className="mb-2"/>
                  <Skeleton height="30px" className="mb-2"/>
                  <Skeleton height="30px" className="mb-2"/>

              </div>
          ):(
              <section>

                  <ToolkitProvider
                      keyField="id"
                      data={ log.reverse() }
                      columns={ columns }
                      search>
                      {
                          props => (
                              <div>
                                  <SearchBar className="mb-3" placeholder="Search Log" { ...props.searchProps } />

                                  <BootstrapTable
                                      bootstrap4
                                      striped
                                      hover
                                      tabIndexCell
                                      className="w-100"
                                      pagination={ paginationFactory() }
                                      { ...props.baseProps }
                                  />
                              </div>
                          )
                      }
                  </ToolkitProvider>


              </section>
          )}



      </Dashboard_Layout>
  )
}