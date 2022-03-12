import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { Link, useLocation } from 'react-router-dom'
import {
  addNewProjectIssueTypeScreen,
  deleteProjectIssueTypeScreen,
  setErrorNull,
  setSuccessNull,
} from '../slices/projectIssueTypeScreens'
import { selectAllScreens } from '../slices/screens'
import { selectAllProjects } from '../slices/projects'
import { useToasts } from 'react-toast-notifications'
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
} from '@windmill/react-ui'

const ProjectIssueTypeScreenExcerpt = ({
  projectIssueTypeScreen,
  openModal,
}) => {
  return (
    <TableRow key={projectIssueTypeScreen.Id}>
      <TableCell>
        <div className="flex items-center text-sm">
          <div>
            <p className="font-semibold">{`${projectIssueTypeScreen.ProjectName} (${projectIssueTypeScreen.Project})`}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center text-sm">
          <div>
            <p className="font-semibold">{projectIssueTypeScreen.ScreenName}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          className="ml-1 hover:bg-red-200 cursor-pointer"
          type={'danger'}
          onClick={() => openModal(projectIssueTypeScreen.Id)}
        >
          Delete
        </Badge>
      </TableCell>
    </TableRow>
  )
}

export const ProjectIssueTypeScreens = () => {
  const { addToast } = useToasts()
  const location = useLocation()
  const issueType = location.state?.issueType
  const [rows, setRows] = useState(
    location.state?.projectIssueTypeScreensHaveName
  )

  // code below add new project issue type screen
  const dispatch = useDispatch()
  const screens = useSelector(selectAllScreens)
  const projects = useSelector(selectAllProjects)
  const filteredProjects = projects.filter(
    (item1) => !rows.some((item2) => item1.ProjectKey === item2.Project)
  )

  const filteredScreensOptions = screens.map((screen) => (
    <option key={screen.Id} value={screen.Id}>
      {screen.Name}
    </option>
  ))
  const filteredProjectsOptions = filteredProjects.map((project) => (
    <option key={project.ProjectKey} value={project.ProjectKey}>
      {project.ProjectName}
    </option>
  ))

  const [screen, setScreen] = useState('')
  const onScreenChanged = (e) => setScreen(e.target.value)
  const [project, setProject] = useState('')
  const onProjectChanged = (e) => setProject(e.target.value)
  const [addRequestStatus, setAddRequestStatus] = useState('idle')
  const canSave =
    [screen, project].every(Boolean) && addRequestStatus === 'idle'

  const onSaveClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending')
        setScreen('')
        setProject('')
        const resultAction = await dispatch(
          addNewProjectIssueTypeScreen({
            Project: project,
            Issue_Type: issueType.Id,
            Screen: Number(screen),
          })
        ).then((res) => {
          let result = [res.payload.Data]
          const projectIssueTypeScreensHaveName = []
          result.forEach((element) => {
            screens.forEach((ele) => {
              if (element.Screen === ele.Id) {
                projectIssueTypeScreensHaveName.push({
                  ...element,
                  ScreenName: ele.Name,
                })
              }
            })
          })
          projectIssueTypeScreensHaveName.forEach((element) => {
            projects.forEach((ele) => {
              if (element.Project === ele.ProjectKey) {
                element.ProjectName = ele.ProjectName
              }
            })
          })
          setRows((oldArray) => [
            ...oldArray,
            ...projectIssueTypeScreensHaveName,
          ])
        })
      } catch (err) {
        console.error('Failed to save the customField: ', err)
      } finally {
        setAddRequestStatus('idle')
      }
    }
  }
  const projectIssueTypeScreenStatus = useSelector(
    (state) => state.projectIssueTypeScreens.status
  )
  const error = useSelector((state) => state.projectIssueTypeScreens.error)
  const success = useSelector((state) => state.projectIssueTypeScreens.success)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [id, setId] = useState()
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  // pagination setup
  const resultsPerPage = 10
  const totalResults = rows.length

  // pagination change control
  function onPageChange(p) {
    setPage(p)
  }
  useEffect(() => {
    if (error) {
      addToast(error, {
        appearance: 'error',
        autoDismiss: true,
      })
      dispatch(setErrorNull({ error: null }))
    }
    if (success) {
      addToast(success, {
        appearance: 'success',
        autoDismiss: true,
      })
      dispatch(setSuccessNull({ success: null }))
    }
  }, [projectIssueTypeScreenStatus, dispatch, error, success])
  useEffect(() => {
    setData(rows.slice((page - 1) * resultsPerPage, page * resultsPerPage))
  }, [page, rows])
  function openModal(id) {
    setIsModalOpen(true)
    setId(id)
  }
  function closeModal() {
    setIsModalOpen(false)
  }
  function deleteConfirm(e, id) {
    e.preventDefault()
    dispatch(deleteProjectIssueTypeScreen({ Id: id })).then((res) =>
      deleteRow(res.payload.Data.Id)
    )
    closeModal()
  }
  const deleteRow = (Id) => {
    const result = rows.filter((ele) => ele.Id !== Id)
    setRows(result)
  }
  let content

  let tbody = data?.map((projectIssueTypeScreen) => (
    <ProjectIssueTypeScreenExcerpt
      key={projectIssueTypeScreen.Id}
      projectIssueTypeScreen={projectIssueTypeScreen}
      openModal={openModal}
    />
  ))
  content = (
    <div className="container mx-auto px-4 mb-16 sm:px-8">
      <div className="py-8">
        <div className="mb-5 my-2 flex justify-between sm:flex-row flex-col">
          <h2 className="text-2xl font-semibold leading-tight">{`Issue type: ${issueType.Name}`}</h2>
          <div className="flex justify-between sm:flex-row flex-col">
            <Label className="m-2">
              <span className="text-1xl font-semibold leading-tight">
                Choose a screen:
              </span>
              <Select
                className="mt-1"
                value={screen}
                onChange={onScreenChanged}
              >
                <option value=""></option>
                {filteredScreensOptions}
              </Select>
            </Label>
            <Label className="m-2">
              <span className="text-1xl font-semibold leading-tight">
                Choose a project:
              </span>
              <Select
                className="mt-1"
                value={project}
                onChange={onProjectChanged}
              >
                <option value=""></option>
                {filteredProjectsOptions}
              </Select>
            </Label>
            <Label className="m-2">
              <Button
                className="mt-6"
                onClick={onSaveClicked}
                disabled={!canSave}
              >
                Save
              </Button>
            </Label>
          </div>
        </div>
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Project</TableCell>
                <TableCell>Screen</TableCell>
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
            <div className="hidden sm:block">
              <Button onClick={(e) => deleteConfirm(e, id)}>Accept</Button>
            </div>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  )

  return <section className="projectIssueTypeScreens-list">{content}</section>
}
