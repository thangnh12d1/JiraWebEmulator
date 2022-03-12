import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  selectAllScreens,
  fetchScreens,
  deleteScreen,
  setErrorNull,
  setSuccessNull,
} from '../slices/screens'
import {
  selectAllScreenCustomFields,
  fetchScreenCustomFields,
} from '../slices/screenCustomFields'
import {
  selectAllCustomFields,
  fetchCustomFields,
} from '../slices/customFields'
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
import { AddScreenForm } from '../components/Screen/AddScreenForm'
import { UpdateScreenForm } from '../components/Screen/UpdateScreenForm'

const ScreenExcerpt = ({ screen, listCustomFields, openModal }) => {
  return (
    <TableRow key={screen.Id}>
      <TableCell>
        <div className="flex items-center text-sm">
          <div>
            <p className="font-semibold">{screen.Name}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm">{screen.Description}</span>
      </TableCell>
      <TableCell>
        {listCustomFields.map((customField) => (
          <p className="text-sm" key={customField.Id}>
            {customField.Name}
          </p>
        ))}
      </TableCell>
      <TableCell>
        <UpdateScreenForm screen={screen} />
        <Badge
          className="ml-1 hover:bg-red-200 cursor-pointer"
          type={'danger'}
          onClick={() => openModal(screen.Id)}
        >
          Delete
        </Badge>
        <Badge
          className="ml-1 hover:bg-gray-200 cursor-pointer"
          type={'neutral'}
          onClick={() => openModal(screen.Id)}
        >
          <Link
            to={{
              pathname: `/app/screenCustomFields/${screen.Id}`,
              state: { screen, listCustomFields },
            }}
          >
            Configure
          </Link>
        </Badge>
      </TableCell>
    </TableRow>
  )
}

export const Screens = () => {
  const { addToast } = useToasts()
  const dispatch = useDispatch()
  const screens = useSelector(selectAllScreens)
  const screenCustomFields = useSelector(selectAllScreenCustomFields)
  const customFields = useSelector(selectAllCustomFields)

  const screenStatus = useSelector((state) => state.screens.status)
  const customFieldStatus = useSelector((state) => state.customFields.status)
  const screenCustomFieldStatus = useSelector(
    (state) => state.screenCustomFields.status
  )

  const error = useSelector((state) => state.screens.error)
  const success = useSelector((state) => state.screens.success)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [id, setId] = useState()
  const errorScreenCustomField = useSelector(
    (state) => state.screenCustomFields.error
  )
  const errorCustomFields = useSelector((state) => state.customFields.error)
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  // pagination setup
  const resultsPerPage = 4
  const totalResults = screens.length

  // pagination change control
  function onPageChange(p) {
    setPage(p)
  }
  useEffect(() => {
    if (screenStatus === 'idle') {
      dispatch(fetchScreens())
    }
    if (screenCustomFieldStatus === 'idle') {
      dispatch(fetchScreenCustomFields())
    }
    if (customFieldStatus === 'idle') {
      dispatch(fetchCustomFields())
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
    screenStatus,
    screenCustomFieldStatus,
    customFieldStatus,
    dispatch,
    error,
    success,
  ])
  useEffect(() => {
    setData(screens.slice((page - 1) * resultsPerPage, page * resultsPerPage))
  }, [screens, page])
  function openModal(id) {
    setIsModalOpen(true)
    setId(id)
  }
  function closeModal() {
    setIsModalOpen(false)
  }
  function deleteConfirm(e, Id) {
    e.preventDefault()
    dispatch(deleteScreen({ Id }))
    closeModal()
  }
  let content

  if (
    screenStatus === 'loading' ||
    screenCustomFieldStatus === 'loading' ||
    customFieldStatus === 'loading'
  ) {
    content = <div className="loader">Loading...</div>
  } else if (
    screenStatus === 'succeeded' &&
    screenCustomFieldStatus === 'succeeded' &&
    customFieldStatus === 'succeeded'
  ) {
    let tbody = data.map((screen) => {
      const listCustomFieldsId = screenCustomFields.filter(
        (row) => row?.Screen == screen.Id
      )
      const temp = customFields.filter((item1) =>
        listCustomFieldsId.some((item2) => item1.Id === item2.Custom_Field)
      )
      const listCustomFields = []
      temp.forEach((element) => {
        listCustomFieldsId.forEach((ele) => {
          if (element.Id === ele.Custom_Field) {
            listCustomFields.push({ ...element, Id: ele.Id })
          }
        })
      })
      return (
        <ScreenExcerpt
          key={screen.Id}
          screen={screen}
          listCustomFields={listCustomFields}
          openModal={openModal}
        />
      )
    })
    content = (
      <div className="container mx-auto px-4 mb-16 sm:px-8">
        <div className="py-8">
          <div className="mb-5 my-2 flex justify-between sm:flex-row flex-col">
            <h2 className="text-2xl font-semibold leading-tight">Screens</h2>
            <AddScreenForm />
          </div>
          <TableContainer>
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>Name</TableCell>

                  <TableCell>Description</TableCell>
                  <TableCell>Custom fields</TableCell>
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
  } else if (
    screenStatus === 'failed' ||
    screenCustomFieldStatus === 'failed' ||
    customFieldStatus === 'failed'
  ) {
    content = <div>{(error, errorScreenCustomField, errorCustomFields)}</div>
  }

  return <section className="screens-list">{content}</section>
}
