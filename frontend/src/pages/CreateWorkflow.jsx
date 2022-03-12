import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { workflowsSelector } from '../slices/workflows'
import {
  fetchWorkflowProjects,
  workflowProjectsSelector,
} from '../slices/wor-pro'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../store'
import WorkflowProjectItem from '../components/Workflow/WorkflowProjectItem'
import UpdateProjectWorkflow from '../components/Workflow/UpdateWorkflowModal'

export default function DetailWorkflow() {
  const { workflowUpdate } = useSelector(workflowsSelector)
  //lưu vào localStorage
  if (workflowUpdate.WorkflowId) {
    localStorage.setItem('Workflow', JSON.stringify(workflowUpdate))
  }
  let temp = JSON.parse(localStorage.getItem('Workflow') || '[]')
  const dispatch = useAppDispatch()
  const { workflowprojects, loading, hasErrors } = useSelector(
    workflowProjectsSelector
  )
  useEffect(() => {
    dispatch(fetchWorkflowProjects(temp.WorkflowId))
  }, [dispatch])
 
  
  const renderWorkflowProject = () => {
    return workflowprojects.map((temp_project) => (
      <WorkflowProjectItem
        key={temp_project.ProjectKey}
        workflow_project={temp_project}
      ></WorkflowProjectItem>
    ))
  }
  
  const [openUpdate, setOpenUpdate] = React.useState(false)
  const handleOpenUpdate = (e) => {
    e.preventDefault()
    // dispatch(setUserUpdate(user))
    setOpenUpdate(true)
  }
  const handleCloseUpdate = () => {
    setOpenUpdate(false)
  }
  const modalUpdate = {
    open: openUpdate,
    handleOpen: handleOpenUpdate,
    handleClose: handleCloseUpdate,
    data_workflow: temp,
    fulldata:workflowprojects
  }
  
  return (
    <>
      <UpdateProjectWorkflow modalDialog={modalUpdate}></UpdateProjectWorkflow>
      <div className="container mx-auto px-4 mb-16 sm:px-8">
        <div className="py-8">
          <div>
            <h2 className="text-2xl font-semibold leading-tight">
              {temp.WorkflowName}
            </h2>
            <p className=" font-semibold leading-tight">
              {temp.WorkflowDescription}
            </p>
          </div>
          <div className="my-2 flex justify-between sm:flex-row flex-col">
            <div className="flex">
              <a onClick={(e) => handleOpenUpdate(e)} >
                <button className="bg-white border shadow-sm px-3 py-1.5 rounded-md hover:text-green-500 text-gray-700">
                  Add project
                </button>
              </a>
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
                      Project Name
                    </th>
                    {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th> */}
                    {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th> */}
                    {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Group name
                  </th> */}
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>{renderWorkflowProject()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
