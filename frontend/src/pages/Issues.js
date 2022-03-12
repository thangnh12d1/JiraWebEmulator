import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectAllIssues, fetchIssues, deleteIssue } from '../slices/issues'
import { fetchProjects, selectAllProjects } from '../slices/projects'
import { selectAllIssueTypes, fetchIssueTypes } from '../slices/issueTypes'
import { fetchStatuss } from '../slices/statuss'
import { fetchUsers } from '../slices/users'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
  Label,
  Select,
  Input,
} from '@windmill/react-ui'
import { UpdateIssueForm } from '../components/Issue/UpdateIssueForm'

import React_Select from 'react-select'

// import ReactQuill from 'react-quill'
// import 'react-quill/dist/quill.snow.css'
// import 'react-quill/dist/quill.bubble.css'

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image', 'video'],
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
}
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'align',
  'background',
  'color',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
]

const IssueExcerpt = ({ issue, openModal }) => {
  return (
    <TableRow key={issue.Id}>
      <TableCell>
        <div className="flex items-center text-sm">
          <div>
            <p className="font-semibold">{`${issue.Name} (${issue.Key})`}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm">{`${issue.Project_Name} (${issue.Project})`}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{issue.Issue_Type_Name}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{issue.Status}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">
          {issue.Fields?.find((item) => item.Name === 'Assignee')?.Value}
        </span>
      </TableCell>
      <TableCell>
        <span className="text-sm">
          {issue.Fields?.find((item) => item.Name === 'Due Date')?.Value}
        </span>
      </TableCell>
      <TableCell>
        <Badge
          className="mr-1 hover:bg-gray-200 cursor-pointer"
          type={'neutral'}
        >
          <Link
            to={{
              pathname: `/app/viewIssue/${issue.Key}`,
            }}
          >
            View
          </Link>
        </Badge>
        {/* <ViewIssue issue={issue} /> */}
        <UpdateIssueForm issue={issue} />
        <Badge
          className="ml-1 hover:bg-red-200 cursor-pointer"
          type={'danger'}
          onClick={() => openModal(issue.Id)}
        >
          Delete
        </Badge>
      </TableCell>
    </TableRow>
  )
}

export const Issues = () => {
  // const [value, setValue] = useState('')
  const dispatch = useDispatch()
  const issues = useSelector(selectAllIssues)
  const issueStatus = useSelector((state) => state.issues.status)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [id, setId] = useState()
  const error = useSelector((state) => state.issues.error)
  const projects = useSelector(selectAllProjects)
  const projectStatus = useSelector((state) => state.projects.loading)

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index
  }

  // usage example:
  let namesOptions = issues.map((issue) => issue.Name)
  namesOptions = namesOptions.filter(onlyUnique)

  namesOptions = namesOptions.map((item) => ({
    value: item,
    label: item,
  }))

  const [name, setName] = useState('')
  const onNameChanged = (e) => setName(e?.value)

  const projectsOptions = projects.map((project) => ({
    value: project.ProjectKey,
    label: project.ProjectName,
  }))
  const [project, setProject] = useState('')
  const onProjectChanged = (e) => setProject(e?.value)

  const issueTypes = useSelector(selectAllIssueTypes)
  const issueTypeStatus = useSelector((state) => state.issueTypes.status)
  const issueTypesOptions = issueTypes.map((issueType) => ({
    value: issueType.Name,
    label: issueType.Name,
  }))
  const [issueType, setIssueType] = useState('')
  const onIssueTypeChanged = (e) => setIssueType(e?.value)

  const statuses = useSelector((state) => state.statuss.statuss)
  const statusesLoading = useSelector((state) => state.statuss.loading)
  const statusesOptions = statuses.map((status) => ({
    value: status.StatusName,
    label: status.StatusName,
  }))
  const [status, setStatus] = useState('')
  const onStatusChanged = (e) => setStatus(e?.value)

  const users = useSelector((state) => state.users.users)
  const usersLoading = useSelector((state) => state.users.loading)
  const usersOptions = users.map((user) => ({
    value: user.User_Full_Name,
    label: user.User_Full_Name,
  }))
  const [user, setUser] = useState('')
  const onUserChanged = (e) => setUser(e?.value)
  const [fromDate, setFromDate] = useState('')
  const onFromDateChanged = (e) => setFromDate(e.target.value)
  const [toDate, setToDate] = useState('')
  const onToDateChanged = (e) => setToDate(e.target.value)
  localStorage.setItem('IssuesAll', JSON.stringify(issues))
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  // pagination setup
  const resultsPerPage = 10
  const [totalResults, setTotalResults] = useState(issues.length)

  // pagination change control
  function onPageChange(p) {
    setPage(p)
  }
  useEffect(() => {
    if (issueStatus === 'idle') {
      dispatch(fetchIssues())
    }
    if (issueTypeStatus === 'idle') {
      dispatch(fetchIssueTypes())
    }
    if (statuses.length === 0) {
      dispatch(fetchStatuss())
    }
    if (users.length === 0) {
      dispatch(fetchUsers())
    }
  }, [issueStatus, issueTypeStatus, dispatch])
  useEffect(() => {
    if (projects.length === 0 && projectStatus === false) {
      dispatch(fetchProjects())
    }
    let filteredIssues = issues
    if (name)
      filteredIssues = filteredIssues.filter((item) => item.Name === name)
    if (project)
      filteredIssues = filteredIssues.filter((item) => item.Project === project)
    if (issueType)
      filteredIssues = filteredIssues.filter(
        (item) => item.Issue_Type_Name === issueType
      )
    if (status)
      filteredIssues = filteredIssues.filter((item) => item.Status === status)
    if (user)
      filteredIssues = filteredIssues.filter(
        (item) =>
          item.Fields?.find((item) => item.Name === 'Assignee')?.Value === user
      )
    if (fromDate) {
      const date = new Date(fromDate)
      filteredIssues = filteredIssues.filter((item) => {
        let date2 = new Date(
          item.Fields?.find((item) => item.Name === 'Due Date')?.Value
        )
        return date2 ? date2 >= date : false
      })
    }
    if (toDate) {
      const date = new Date(toDate)
      filteredIssues = filteredIssues.filter((item) => {
        let date2 = new Date(
          item.Fields?.find((item) => item.Name === 'Due Date')?.Value
        )
        return date2 ? date2 <= date : false
      })
    }
    setTotalResults(filteredIssues.length)
    setData(
      filteredIssues.slice((page - 1) * resultsPerPage, page * resultsPerPage)
    )
  }, [issues, page, name, project, issueType, status, user, fromDate, toDate])
  function openModal(id) {
    setIsModalOpen(true)
    setId(id)
  }
  function closeModal() {
    setIsModalOpen(false)
  }
  function deleteConfirm(e, Id) {
    e.preventDefault()
    dispatch(deleteIssue({ Id }))
    closeModal()
  }
  let content

  if (
    issueStatus === 'loading' ||
    projectStatus === true ||
    issueTypeStatus === 'loading' ||
    statusesLoading === true ||
    usersLoading === true
  ) {
    content = <div className="loader">Loading...</div>
  } else if (
    issueStatus === 'succeeded' &&
    projectStatus === false &&
    issueTypeStatus === 'succeeded' &&
    statusesLoading === false &&
    usersLoading === false
  ) {
    let tbody = data.map((issue) => {
      return <IssueExcerpt key={issue.Id} issue={issue} openModal={openModal} />
    })
    content = (
      <div className="container mx-auto px-4 mb-16 sm:px-8">
        <div className="py-8">
          <div className="mb-5 my-2">
            <h2 className="text-2xl font-semibold leading-tight">Issues</h2>

            <div className="flex justify-between sm:flex-row flex-col">
              <Label className="m-2 w-full">
                <span className="text-1xl font-semibold leading-tight">
                  Name:
                </span>
                <React_Select
                  className="mt-1"
                  options={namesOptions}
                  onChange={onNameChanged}
                  isSearchable={true}
                  isClearable={true}
                  placeholder="All"
                />
              </Label>
              <Label className="m-2 w-full">
                <span className="text-1xl font-semibold leading-tight">
                  Project:
                </span>
                <React_Select
                  className="mt-1"
                  options={projectsOptions}
                  onChange={onProjectChanged}
                  isSearchable={true}
                  isClearable={true}
                  placeholder="All"
                />
              </Label>
              <Label className="m-2 w-full">
                <span className="text-1xl font-semibold leading-tight">
                  Issue type:
                </span>
                <React_Select
                  className="mt-1"
                  options={issueTypesOptions}
                  onChange={onIssueTypeChanged}
                  isSearchable={true}
                  isClearable={true}
                  placeholder="All"
                />
              </Label>
              <Label className="m-2 w-full">
                <span className="text-1xl font-semibold leading-tight">
                  Status:
                </span>
                <React_Select
                  className="mt-1"
                  options={statusesOptions}
                  onChange={onStatusChanged}
                  isSearchable={true}
                  isClearable={true}
                  placeholder="All"
                />
              </Label>
              <Label className="m-2 w-full">
                <span className="text-1xl font-semibold leading-tight">
                  Assignee:
                </span>
                <React_Select
                  className="mt-1"
                  options={usersOptions}
                  onChange={onUserChanged}
                  isSearchable={true}
                  isClearable={true}
                  placeholder="All"
                />
              </Label>
              <Label className="m-2 w-full">
                <span className="text-1xl font-semibold leading-tight">
                  From date:
                </span>
                <Badge
                  className="ml-2 bg-gray-300 hover:bg-gray-400 cursor-pointer"
                  type={'neutral'}
                  onClick={() => setFromDate('')}
                >
                  Clear
                </Badge>
                <Input
                  type="date"
                  className="mt-1"
                  value={fromDate}
                  onChange={onFromDateChanged}
                />
              </Label>
              <Label className="m-2 w-full">
                <span className="text-1xl font-semibold leading-tight">
                  To date:
                </span>
                <Badge
                  className="ml-2 bg-gray-300 hover:bg-gray-400 cursor-pointer"
                  type={'neutral'}
                  onClick={() => setToDate('')}
                >
                  Clear
                </Badge>
                <Input
                  type="date"
                  className="mt-1"
                  value={toDate}
                  onChange={onToDateChanged}
                />
              </Label>
            </div>
          </div>
          <TableContainer>
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>Name</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Issue type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Assignee</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Action</TableCell>
                </tr>
              </TableHeader>
              <TableBody>{tbody}</TableBody>
            </Table>
            <TableFooter>
              <Pagination
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
                label="Table navigation"
                onChange={onPageChange}
              />
            </TableFooter>
          </TableContainer>
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <ModalHeader>Delete ?</ModalHeader>
            <ModalBody>
              {
                "You're about to permanently this and all of its data. If you're not sure, you can close this instead."
              }
            </ModalBody>
            <ModalFooter>
              <div className="hidden sm:block">
                <Button layout="outline" onClick={closeModal}>
                  Cancel
                </Button>
              </div>
              <div className="hidden sm:block">
                <Button onClick={(e) => deleteConfirm(e, id)}>Accept</Button>
              </div>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    )
  } else if (issueStatus === 'failed') {
    content = <div>{error}</div>
  }

  return <section className="issues-list">{content}</section>
}
