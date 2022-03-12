import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  selectAllIssueTypes,
  fetchIssueTypes,
  deleteIssueType,
  setErrorNull,
  setSuccessNull,
} from '../slices/issueTypes'
import {
  selectAllProjectIssueTypeScreens,
  fetchProjectIssueTypeScreens,
} from '../slices/projectIssueTypeScreens'
import { selectAllScreens, fetchScreens } from '../slices/screens'
import { fetchProjects, selectAllProjects } from '../slices/projects'
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
} from '@windmill/react-ui'
import { AddIssueTypeForm } from '../components/IssueType/AddIssueTypeForm'
import { UpdateIssueTypeForm } from '../components/IssueType/UpdateIssueTypeForm'

const IssueTypeExcerpt = ({
  issueType,
  projectIssueTypeScreensHaveName,
  openModal,
}) => {
  return (
    <TableRow key={issueType.Id}>
      <TableCell>
        <div className="flex items-center text-sm">
          <div>
            <p className="font-semibold">{issueType.Name}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm">{issueType.Icon}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{issueType.Description}</span>
      </TableCell>
      <TableCell>
        <UpdateIssueTypeForm issueType={issueType} />
        <Badge
          className="ml-1 hover:bg-red-200 cursor-pointer"
          type={'danger'}
          onClick={() => openModal(issueType.Id)}
        >
          Delete
        </Badge>
        <Badge
          className="ml-1 hover:bg-gray-200 cursor-pointer"
          type={'neutral'}
          onClick={() => openModal(issueType.Id)}
        >
          <Link
            to={{
              pathname: `/app/issueTypes/projectIssueTypeScreens/${issueType.Id}`,
              state: { issueType, projectIssueTypeScreensHaveName },
            }}
          >
            Configure
          </Link>
        </Badge>
      </TableCell>
    </TableRow>
  )
}

export const IssueTypes = () => {
  const { addToast } = useToasts()
  const dispatch = useDispatch()
  const issueTypes = useSelector(selectAllIssueTypes)
  const projectIssueTypeScreens = useSelector(selectAllProjectIssueTypeScreens)
  const screens = useSelector(selectAllScreens)
  const projects = useSelector(selectAllProjects)

  const issueTypeStatus = useSelector((state) => state.issueTypes.status)
  const projectIssueTypeScreenStatus = useSelector(
    (state) => state.projectIssueTypeScreens.status
  )
  const screenStatus = useSelector((state) => state.screens.status)
  const projectStatus = useSelector((state) => state.projects.loading)

  const error = useSelector((state) => state.issueTypes.error)
  const success = useSelector((state) => state.issueTypes.success)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [id, setId] = useState()
  const errorProjectIssueTypeScreen = useSelector(
    (state) => state.projectIssueTypeScreens.error
  )
  const errorScreens = useSelector((state) => state.screens.error)
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  // pagination setup
  const resultsPerPage = 10
  const totalResults = issueTypes.length

  // pagination change control
  function onPageChange(p) {
    setPage(p)
  }
  useEffect(() => {
    if (issueTypeStatus === 'idle') {
      dispatch(fetchIssueTypes())
    }
    if (projectIssueTypeScreenStatus === 'idle') {
      dispatch(fetchProjectIssueTypeScreens())
    }
    if (screenStatus === 'idle') {
      dispatch(fetchScreens())
    }
    if (projects.length === 0 && projectStatus === false) {
      dispatch(fetchProjects())
    }
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
  }, [
    issueTypeStatus,
    projectIssueTypeScreenStatus,
    screenStatus,
    dispatch,
    error,
    success,
  ])
  useEffect(() => {
    setData(
      issueTypes.slice((page - 1) * resultsPerPage, page * resultsPerPage)
    )
  }, [issueTypes, page])
  function openModal(id) {
    setIsModalOpen(true)
    setId(id)
  }
  function closeModal() {
    setIsModalOpen(false)
  }
  function deleteConfirm(e, Id) {
    e.preventDefault()
    dispatch(deleteIssueType({ Id }))
    closeModal()
  }
  let content
  //console.log(issueTypeStatus, projectIssueTypeScreenStatus, screenStatus, projectStatus, "lllllllllllllllll")
  if (
    issueTypeStatus === 'loading' ||
    projectIssueTypeScreenStatus === 'loading' ||
    screenStatus === 'loading' ||
    projectStatus === true
  ) {
    content = <div className="loader">Loading...</div>
  } else if (
    issueTypeStatus === 'succeeded' &&
    projectIssueTypeScreenStatus === 'succeeded' &&
    screenStatus === 'succeeded' &&
    projectStatus === false
  ) {
    // gan ten cua screen va project vao danh sach
    const projectIssueTypeScreensHaveName = []
    projectIssueTypeScreens.forEach((element) => {
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

    let tbody = data.map((issueType) => {
      const temp = projectIssueTypeScreensHaveName.filter(
        (item1) => item1.Issue_Type === issueType.Id
      )
      return (
        <IssueTypeExcerpt
          key={issueType.Id}
          issueType={issueType}
          projectIssueTypeScreensHaveName={temp}
          openModal={openModal}
        />
      )
    })
    content = (
      <div className="container mx-auto px-4 mb-16 sm:px-8">
        <div className="py-8">
          <div className="mb-5 my-2 flex justify-between sm:flex-row flex-col">
            <h2 className="text-2xl font-semibold leading-tight">Issue types</h2>
            <AddIssueTypeForm />
          </div>
          <TableContainer>
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>Name</TableCell>
                  <TableCell>Icon</TableCell>
                  <TableCell>Description</TableCell>

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
  } else if (issueTypeStatus === 'failed') {
    content = <div>{error}</div>
  }

  return <section className="issueTypes-list">{content}</section>
}
