import React, {useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../store'
import { deleteProject, setProjectUpdate } from '../../slices/projects'
import { selectAllIssues, fetchIssues, deleteIssue } from '../../slices/issues'
import { fetchWorkflows,workflowsSelector,setState } from '../../slices/workflows'
import UpdateProjectModal from './UpdateProjectModal';
import ViewProject from './ViewProject';
import { setWorkflowUpdate } from '../../slices/workflows'
import { useHistory } from 'react-router-dom'
import { TableCell, TableRow, Button, Table, ModalHeader, ModalBody,ModalFooter,Modal,Badge } from '@windmill/react-ui';
import { useToasts } from 'react-toast-notifications'
import { useSelector, useDispatch } from 'react-redux'
const ProjectItem = ({ project }) => {
  
  const {addToast} = useToasts()
  const dispatch = useAppDispatch()
  const history = useHistory()
  
  const { updateWor, updateSuccess,workflows,loading, hasErrors } = useSelector(workflowsSelector)
   useEffect(() => {
        dispatch(fetchWorkflows()) 
    }, [dispatch])
    console.log(workflows)
  const [isModalOpen, setIsModalOpen, deleteP] = useState(false)
  let temp = JSON.parse(localStorage.getItem('WorkflowAll') || '[]' )
  let temp1 = JSON.parse(localStorage.getItem('IssuesAll') || '[]' )
  let WorkflowNa
  workflows.map((temp1) =>{
    if(temp1.WorkflowId == project.WorkflowId){
      WorkflowNa = temp1.WorkflowName
    }
  }) 
  function openModal() {
    setIsModalOpen(true)
  }
 

  function closeModal() {
    setIsModalOpen(false)
  }
  function deleteConfirm(e, project_key) {
    let bool
    temp1.map((temp) =>{
      if(temp.Project == project_key){
          bool =-5
      }
  })
  if(bool == -5){
    addToast("Must Delete All issue in this project!", {
      appearance: 'error',
      autoDismiss: true,
    })

  }
  else{
    setIsModalOpen(true)
    e.preventDefault()
    
      dispatch(deleteProject(project_key))
      //alert('Delete Success!')
      addToast("Delete Success!", {
        appearance: 'success',
        autoDismiss: true,
      })
  }
    
    
  }
  const issues = useSelector(selectAllIssues)
  console.log(issues)
  const [openUpdate, setOpenUpdate] = React.useState(false)

  const handleOpenUpdate = (e, project) => {
    e.preventDefault()
    dispatch(setProjectUpdate(project))
    setOpenUpdate(true)
  }
  const handleCloseUpdate = () => {
    setOpenUpdate(false)
  }
  const modalUpdate = {
    open: openUpdate,
    handleOpen: handleOpenUpdate,
    handleClose: handleCloseUpdate,
  }

  const [openView, setOpenView] = React.useState(false)

  const handleOpenView = (e, project) => {
    e.preventDefault()
    dispatch(setProjectUpdate(project))
    setOpenView(true)
  }
  const handleCloseView = () => {
    setOpenView(false)
  }
  const modalView = {
    open: openView,
    handleOpenViewProject: handleOpenView,
    handleCloseViewProject: handleCloseView,
  }
  const handleOpenTransition = (e, workflow) => {
    e.preventDefault()
    dispatch(setWorkflowUpdate(workflow))
    history.push('/app/transitionsforproject-manager')
  }

  return (
    <>
      <UpdateProjectModal modalDialog={modalUpdate} />
      <ViewProject modalDialog={modalView} />
      <TableRow key={project.ProjectKey}>
        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10">
              <img
                className="w-full h-full rounded-full"
                src="https://www.vhv.rs/dpng/d/614-6141793_planning-icon-png-test-transparent-png.png"
                alt=""
              />
            </div>
            <div className="ml-3">
              <p className="text-gray-900 whitespace-no-wrap">
                <Link
                  to={`/app/IssuesByProject/${project.ProjectKey}`}
                  className="relative cursor-pointer text-blue-400 whitespace-no-wrap"
                >
                  {project.ProjectName}
                </Link>
              </p>
            </div>  
          </div>
        </TableCell>
        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
         
          <span>{project.ProjectKey}</span>
        </TableCell>
        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
         
          <span>{project.ProjectUrl}</span>
        </TableCell>
        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          
          <span>{project.ProjectLeadName}</span>
        </TableCell>
        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          
          <span>{WorkflowNa}</span>
        </TableCell>
        <TableCell className="px-5 py-5 text-center border-b border-gray-200 bg-white text-sm">
          
          <Badge type={'status'}
                  className="hover:bg-blue-200 cursor-pointer"
           >
            
            <Link
              to={`/app/project-user/${project.ProjectKey}-${project.ProjectName}`}
              className="relative cursor-pointer"
            >
              Access
            </Link>
          </Badge>
          
          <Badge 
              className="hover:bg-blue-200 cursor-pointer"
              type={'status'}
              onClick={(e) => handleOpenTransition(e, project)}
          >
              View Workflow
          </Badge>
          <Badge 
              className="hover:bg-green-200 cursor-pointer"
              type={'success'}
              onClick={(e) => handleOpenUpdate(e, project)}
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
            <ModalHeader>Delete Project</ModalHeader>
              <ModalBody>
                 Are you sure DELETE this Project !
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
                <div className="hidden sm:block" onClick={(e) => deleteConfirm(e, project.ProjectKey)}>
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
          
        </TableCell>
      </TableRow>
    </>
  )
}

export default ProjectItem
