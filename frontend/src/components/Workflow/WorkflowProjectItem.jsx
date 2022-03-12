import React from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../store'
import { deleteProjectInWorkflow } from '../../slices/wor-pro'
import { TableCell, TableRow, Badge } from '@windmill/react-ui'
import { useToasts } from 'react-toast-notifications'
export default function WorkflowProjectItem({ workflow_project }) {

  const dispatch = useAppDispatch()
  const {addToast} = useToasts()
  function deleteConfirm(e, WorkflowId, ProjectKey) {
    e.preventDefault()
    
      dispatch(deleteProjectInWorkflow(WorkflowId,ProjectKey))
      addToast("Delete Status Success", {
        appearance: 'success',
        autoDismiss: true,
      })
    
  }


  
  return (
    <>
      {/* <ProjectModal modalDialog={modalUpdate} /> */}
      <tr>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <div className="flex items-center">
            <TableCell className="ml-3">
             
                {workflow_project.ProjectName}
                    
                 
            </TableCell>
          </div>
        </td>
        {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <Link to="#">
              <a className="text-blue-400 whitespace-no-wrap">
                {workflow.Workflow_Description}
              </a>
            </Link>
          </td> */}
        {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <Link to="#">
              <ul className="text-blue-400 whitespace-no-wrap">
                {renderWorkflowProject()}
              </ul>
            </Link>
          </td> */}

        <td className="px-5 py-5 text-center border-b border-gray-200 bg-white text-sm">
          {/* <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
              <span
                aria-hidden
                className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
              />
               <a 
                // onClick={(e) => handleOpenUpdate(e,workflow)}
                className="relative cursor-pointer"
              >
                Edit
              </a>
            </span> */}
           <Badge
              className="hover:bg-green-200 cursor-pointer"
              type={'success'}
              onClick={(e) => deleteConfirm(e, workflow_project.WorkflowId,workflow_project.ProjectKey)}
             
              >
            
            
              Delete
              </Badge>
          
        </td>
      </tr>
    </>
  )
}
