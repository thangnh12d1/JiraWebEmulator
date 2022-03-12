import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../store'
import { useSelector } from 'react-redux'
import axios from 'axios'
import {
  fetchWorkflowProjects,
  workflowProjectsSelector,
} from '../../slices/wor-pro'
import { useHistory } from 'react-router-dom'
import { setWorkflowUpdate, updateWorkflow } from '../../slices/workflows'
import workflowApi from '../../api/workflowApi'
import { 
  deleteWorkflow,
  
} from '../../slices/workflows'
import WorkflowModal from '../../pages/UpdateWorkflow'
import { useToasts } from 'react-toast-notifications'
import { TableCell, TableRow, Button,Table, ModalHeader, ModalBody,ModalFooter,Modal,Badge } from '@windmill/react-ui'

const WorkflowItem = ({ workflow }) => {
  const {addToast} = useToasts()
  const dispatch = useAppDispatch()
  const history = useHistory()

  const [workflowprojects_temp, setResult] = useState([])
  useEffect(() => {
    if (workflow) {
      workflowApi.getWorkflowProject(workflow.WorkflowId).then((data) => {
        setResult(data.Data)
      })
    }
  }, [])

  //get workflow to detail
  const handleOpenUpdate = (e, workflow) => {
    e.preventDefault()
    dispatch(setWorkflowUpdate(workflow))
    addToast("Create Workflow Success", {
      appearance: 'success',
      autoDismiss: true,
    })
    history.push('/app/workflows-manager/create-workflows')
  }
  const handleOpenTransition = (e, workflow) => {
    e.preventDefault()
    dispatch(setWorkflowUpdate(workflow))
    addToast("Open Success", {
      appearance: 'success',
      autoDismiss: true,
    })
    history.push('/app/workflows-manager/transitions-manager')
  }
  const [openUpdate, setOpenUpdate] = React.useState(false)

  const handleOpenUpdateWorkflow = (e, workflow) => {
    e.preventDefault()
    dispatch(setWorkflowUpdate(workflow))
    
    setOpenUpdate(true)
  }
  const handleCloseUpdate = () => {
    setOpenUpdate(false)
  }
  const modalUpdate = {
    open: openUpdate,
    handleOpen: handleOpenUpdateWorkflow,
    handleClose: handleCloseUpdate,
  }
  const renderWorkflowProject = () => {
    if (workflowprojects_temp != null) {
      return workflowprojects_temp.map((temp) => (
        <li key={temp.ProjectKey}>{temp.ProjectName}</li>
      ))
    } else {
      return <li></li>
    }
  }

  // DELETE
  const [isModalOpen, setIsModalOpen, deleteP] = useState(false)

  function openModal() {
    setIsModalOpen(true)
  }
 

  function closeModal() {
    setIsModalOpen(false)
  }
  function deleteConfirm(e, WorkflowId) {
    e.preventDefault()
    
      dispatch(deleteWorkflow(WorkflowId))
      // addToast("Delete Workflow Success", {
      //   appearance: 'success',
      //   autoDismiss: true,
      // })
    
  }
  return (
    <>
      <WorkflowModal modalDialog={modalUpdate} />
      <TableRow key={workflow.WorkflowId}>
        <TableCell className="px-5 py-5 font-semibold border-b border-gray-200 bg-white text-sm">
          
          <span>{workflow.WorkflowName}</span>
        </TableCell>
        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        
          <span>{workflow.WorkflowId}</span>
        </TableCell>
        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          
          <span>{workflow.WorkflowDescription}</span>
        </TableCell>
        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <span>{renderWorkflowProject()}</span>
        </TableCell>

        <TableCell className="px-5 py-5 text-center border-b border-gray-200 bg-white text-sm">
          
          <Badge 
              className="hover:bg-white-200 cursor-pointer"
              type={'status'}
              onClick={(e) => handleOpenUpdate(e, workflow)}
          >
              Add Project
          </Badge>
          <Badge 
              className="hover:bg-blue-200 cursor-pointer"
              type={'button'}
              onClick={(e) => handleOpenTransition(e, workflow)}
          >
              Transition
          </Badge>
          <Badge 
              className="hover:bg-green-200 cursor-pointer"
              type={'success'}
              onClick={(e) => handleOpenUpdateWorkflow(e, workflow)}
          >
              Edit
          </Badge>
          <Badge 
              className="hover:bg-red-200 cursor-pointer"
              type={'danger'}
              onClick={openModal}
          >
              Delete
          </Badge>
          
          <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Delete Workflow</ModalHeader>
        <ModalBody>
          Are you sure DELETE this Workflow!
        </ModalBody>
        <ModalFooter>
          {/* I don't like this approach. Consider passing a prop to ModalFooter
           * that if present, would duplicate the buttons in a way similar to this.
           * Or, maybe find some way to pass something like size="large md:regular"
           * to Button
           */}
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block" onClick={(e) => deleteConfirm(e, workflow.WorkflowId)}>
            <Button>Accept</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large">
              Accept
            </Button>
          </div>
        </ModalFooter>
      </Modal>
          {/* <span className="relative inline-block px-3 ml-1.5 py-1 font-semibold text-green-900 leading-tight">
                <span
                  aria-hidden
                  className="absolute inset-0 bg-red-400 opacity-50 rounded-full"
                />
                <a
                  // onClick={(e) => deleteConfirm(e,project.Project_Id)}
                  className="relative cursor-pointer text-red-900"
                >
                  Delete
                </a>
              </span> */}
        </TableCell>
      </TableRow>
    </>
  )
}

export default WorkflowItem
