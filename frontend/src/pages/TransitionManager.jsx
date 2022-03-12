import React, { useEffect, useState } from 'react'
import { fetchTransitions,getDataByIdWorkflow,transitionsSelector } from '../slices/transition'
import { fetchTransitionStatuss,transitionStatussSelector } from '../slices/tra-sta'
import { fetchStatuss, statussSelector,setState  } from '../slices/statuss'
import { useAppDispatch } from '../store'
import { useSelector } from 'react-redux'
import TransitionItem from '../components/Transition/TransitionItem'
import { Link } from 'react-router-dom'
import { workflowsSelector } from '../slices/workflows'
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Button,
  Pagination,
  Select
} from '@windmill/react-ui'
 const TransitionManager= () => {
    const {workflowUpdate} = useSelector(workflowsSelector)
    if (workflowUpdate.WorkflowId) {
      localStorage.setItem('Workflow', JSON.stringify(workflowUpdate))
    }
    let temp = JSON.parse(localStorage.getItem('Workflow') || '[]' )
    const dispatch = useAppDispatch()
    
    const { transitions,loading, hasErrors } = useSelector(transitionsSelector)
   useEffect(() => {
        dispatch(getDataByIdWorkflow(temp.WorkflowId)) 
    }, [dispatch])
    localStorage.setItem('TransitionAll', JSON.stringify(transitions))

    // setup pages control for every table
  const [pageTable1, setPageTable1] = useState(1)
  // setup data for every table 
  const [dataTable1, setDataTable1] = useState([])
  // pagination setup
  const resultsPerPage =5
  const totalResults = transitions.length
  // pagination change control
  function onPageChangeTable1(p) {
    setPageTable1(p)
  }
  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setDataTable1(transitions.slice((pageTable1 - 1) * resultsPerPage, pageTable1 * resultsPerPage))
  }, [transitions, pageTable1])

    const renderTransition = () =>
       {    if(transitions)
            return dataTable1.map((transition)=>
            <TransitionItem key={transition.TransitionId} transition={transition} />
        )
        else return <div>NULL</div>
    }
    
    if (loading) {
      return (
        <tr>
          <div className="loader">Loading...</div>
        </tr>
      )
    }

    if (hasErrors) return <p>Unable to get Transition.</p>
    return (
        <div className="container mx-auto px-4 mb-16 sm:px-8">
        <div className="py-8">
          <div>
            <h2 className="text-2xl font-semibold leading-tight">Transition</h2>
          </div>
          <div className="my-2 flex justify-between sm:flex-row flex-col">
          <div className="flex">
            <Link to="/app/workflows-manager/transitions-manager/create-transitions">
              <Button >
                Create Transition
              </Button>
            </Link>
            {/* <Link to="/invite-user">
              <button className="bg-white border shadow-sm px-3 py-1.5 rounded-md hover:text-green-500 text-gray-700 ml-1">
                Invite Users
              </button>
            </Link> */}
          </div>
          <div className="flex">
            <Link to="/app/workflows-manager/transitions-manager/view-diagram">
              <Button >
                View Diagram
              </Button>
            </Link>
            {/* <Link to="/invite-user">
              <button className="bg-white border shadow-sm px-3 py-1.5 rounded-md hover:text-green-500 text-gray-700 ml-1">
                Invite Users
              </button>
            </Link> */}
          </div>
        </div>
          <div className="my-2 flex justify-between sm:flex-row flex-col">
            <div className="flex">
              {/* <Link to="/create-statuss">
                <button className="bg-white border shadow-sm px-3 py-1.5 rounded-md hover:text-green-500 text-gray-700">
                  Create status
                </button>
              </Link> */}
              {/* <Link to="/invite-user">
                <button className="bg-white border shadow-sm px-3 py-1.5 rounded-md hover:text-green-500 text-gray-700 ml-1">
                  Invite Users
                </button>
              </Link> */}
            </div>
          </div>
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name Transition
                    </th>
                    
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status 1
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status 2
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                    {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Group name
                    </th> */}
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {/* Action */}
                    </th>
                  </tr>
                </thead>
                <tbody>{renderTransition()}</tbody>
              </table>
              <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={onPageChangeTable1}
            label="Table navigation"
          />
        </TableFooter>
            </div>
          </div>
        </div>
      </div>
    )
}
export default TransitionManager