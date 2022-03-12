/* eslint-disable no-unused-vars */
import React, { useEffect,useState } from 'react'
import { useSelector } from 'react-redux'
import {
  fetchProjects,
  projectsSelector,
  createProject,
  setState
} from '../slices/projects'
import { Link } from 'react-router-dom'
import ProjectItem from '../components/Project/ProjectItem'
import { useAppDispatch } from '../store'
import CreateProjectModal from '../components/Project/CreateProjectModal';
import { useToasts } from 'react-toast-notifications'
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
  Select,
  Input,
} from '@windmill/react-ui'
const Projects = () => {
  
  let temp = JSON.parse(localStorage.getItem('WorkflowAll') || '[]' )
  const { addToast } = useToasts()
  const dispatch = useAppDispatch()
  const { updateWor, updateSuccess, projects, loading, hasErrors } = useSelector(projectsSelector)
  
// setup pages control for every table
const [pageTable1, setPageTable1] = useState(1)
// setup data for every table 
const [dataTable1, setDataTable1] = useState([])
// pagination setup
const resultsPerPage = 3
const totalResults = projects.length
// pagination change control
function onPageChangeTable1(p) {
  setPageTable1(p)
}
// on page change, load new sliced data
// here you would make another server request for new data
useEffect(() => {
  dispatch(fetchProjects())
}, [dispatch])

useEffect(() => {
  if (updateSuccess) {
    addToast("Success", {
      appearance: 'success',
      autoDismiss: true,
    })
    dispatch(setState())
  }
}, [updateSuccess])
localStorage.setItem('ProjectAll', JSON.stringify(projects))
useEffect(() => {
  setDataTable1(projects.slice((pageTable1 - 1) * resultsPerPage, pageTable1 * resultsPerPage))
}, [projects,pageTable1])

  //search user
  //setup search
  const [searchTerm, setSearchTerm] = React.useState('')
  const [searchResults, setSearchResults] = React.useState([])
  //setup select 
  const [selectTerm, setSelectTerm] = React.useState('')
  const handleChange = (e) => {
    setSearchTerm(e.target.value)
  }
  const handleSelect = (e) =>{
    setSelectTerm(e.target.value)
  }
  useEffect(() => {
    const results = projects.filter(
      (person) =>
        person.ProjectKey.toLowerCase().indexOf(searchTerm.toLowerCase()) !=
          -1 ||
        person.ProjectName.toLowerCase().indexOf(searchTerm.toLowerCase()) !=
          -1 
        // person.User_Full_Name.toLowerCase().indexOf(searchTerm.toLowerCase()) !=
        //   -1
    )
    setSearchResults(results)
  }, [searchTerm])
  useEffect(() => {
    const resultsSelect = projects.filter(
      (person) => person.WorkflowId == selectTerm
    )
    setSearchResults(resultsSelect)
  }, [selectTerm])
  //render user
  
  const renderProjects = () => {
    
    if (
      (searchTerm == '' && selectTerm == 'All') ||
      (searchTerm == '' && selectTerm == '')
      
    ) {
      return dataTable1.map((project) => <ProjectItem key={project.ProjectKey} project={project} />)
    }
    
    else {
      return searchResults.map((project) => (
        <ProjectItem key={project.ProjectKey} project={project} />
      ))
    }
  }
  // filter workflow id
  var option1s = temp.map((option) => {
    return (
      <option key={option.WorkflowId} value={option.WorkflowId}>
        {option.WorkflowName}({option.WorkflowId})
      </option>
    )
  })
  

  const [openCreate, setOpenCreate] = React.useState(false)

  const handleOpenCreate = () => {
    setOpenCreate(true)
  }
  const handleCloseCreate = () => {
    setOpenCreate(false)
  }

  const modalCreate = {
    open: openCreate,
    handleOpen: handleOpenCreate,
    handleClose: handleCloseCreate,
  }

  const addPost = (e) => {
    e.preventDefault()
    const Project = {
      id: 1,
      name: 'Nacef',
      projectname: 'magiko',
      email: 'nacef.otay@esprit.tn',
      phone: '+21629903274',
      website: 'nacefotay.me',
    }
    dispatch(createProject(Project))
  }
  if (loading) {
    return (
      <tr>
        <div className="loader">Loading...</div>
      </tr>
    )
  }
  if (hasErrors) return <p>Unable to get Projects.</p>
  return (
    <div className="container mx-auto px-4 mb-16 sm:px-8">
      <div className="py-8">
        <div>
          <h2 className="text-2xl font-semibold leading-tight">Projects</h2>
        </div>
        <div className="my-2 flex justify-between sm:flex-row flex-col">
          <div className="flex flex-row mb-1 sm:mb-0">
            <div className="relative">
            <Select
                value={selectTerm}
                onChange={handleSelect}
                className="appearance-none h-full rounded-r border-t sm:rounded-r-none sm:border-r-0 border-r border-b block w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500"
              > 
                {/* <option selected className="h-4 w-4 font-semibold ">OPTION</option> */}
                <option selected ></option> 
                <option selected className="h-4 w-4 fill-current text-blue-500">All</option>
                               
                <option value='0' className="h-4 w-4 fill-current text-blue-500">NULL</option>
                
              
                {option1s}
              </Select>
            </div>
            
            {/* Ô search */}
            <div className="flex relative">
              <span className="h-full absolute inset-y-0 right-2 flex items-center pl-2">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current text-gray-500"
                >
                  <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
                </svg>
              </span>
              <Input
                placeholder="Search for projects"
                className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-8 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
                value={searchTerm}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex">
            <CreateProjectModal modalDialog={modalCreate} />
            <Button 
              onClick={handleOpenCreate}
              >
              Create Project
            </Button>
          </div>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-green-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name Project
                  </th>
                  <th className="px-5 py-3 border-b-2 border-green-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Key
                  </th>
                  <th className="px-5 py-3 border-b-2 border-green-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-5 py-3 border-b-2 border-green-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Project Lead
                  </th>
                  <th className="px-5 py-3 border-b-2 border-green-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Workflow
                  </th>
                  <th className="px-5 py-3 border-b-2 border-green-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>{renderProjects()}</tbody>
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

export default Projects
