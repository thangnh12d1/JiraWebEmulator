import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectAllCustomFields,
  fetchCustomFields,
  deleteCustomField,
  setErrorNull,
  setSuccessNull,
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
import { AddCustomFieldForm } from '../components/CustomField/AddCustomFieldForm'
import { UpdateCustomFieldForm } from '../components/CustomField/UpdateCustomFieldForm'

const CustomFieldExcerpt = ({ customField, openModal }) => {
  const defaultFields = ['Assignee', 'Reporter', 'Start Date', 'Due Date']
  return (
    <TableRow key={customField.Id}>
      <TableCell>
        <div className="flex items-center text-sm">
          {/* <Avatar
                className="hidden mr-3 md:block"
                src={user.avatar}
                alt="User image"
              /> */}
          <div>
            <p className="font-semibold">{customField.Name}</p>
            {/* <p className="text-xs text-gray-600 dark:text-gray-400">
                  {user.job}
                </p> */}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm">{customField.Field_Type}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{customField.Description}</span>
      </TableCell>
      <TableCell>
        {defaultFields.includes(customField.Name) && <span>...</span>}
        {!defaultFields.includes(customField.Name) && (
          <UpdateCustomFieldForm customField={customField} />
        )}
        {!defaultFields.includes(customField.Name) && (
          <Badge
            className="ml-1 hover:bg-red-200 cursor-pointer"
            type={'danger'}
            onClick={() => openModal(customField.Id)}
          >
            Delete
          </Badge>
        )}
      </TableCell>
    </TableRow>
  )
}

export const CustomFields = () => {
  const { addToast } = useToasts()
  const dispatch = useDispatch()
  const customFields = useSelector(selectAllCustomFields)
  const customFieldStatus = useSelector((state) => state.customFields.status)
  const error = useSelector((state) => state.customFields.error)
  const success = useSelector((state) => state.customFields.success)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [id, setId] = useState()
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  // pagination setup
  const resultsPerPage = 10
  const totalResults = customFields.length

  // pagination change control
  function onPageChange(p) {
    setPage(p)
  }
  useEffect(() => {
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
  }, [customFieldStatus, dispatch, error, success])
  useEffect(() => {
    setData(
      customFields.slice((page - 1) * resultsPerPage, page * resultsPerPage)
    )
  }, [customFields, page])
  function openModal(id) {
    setIsModalOpen(true)
    setId(id)
  }
  function closeModal() {
    setIsModalOpen(false)
  }
  function deleteConfirm(e, Id) {
    e.preventDefault()
    dispatch(deleteCustomField({ Id }))
    closeModal()
  }

  let content
  if (customFieldStatus === 'loading') {
    content = <div className="loader">Loading...</div>
  } else if (customFieldStatus === 'succeeded') {
    console.log(data, 'hehe2')
    let tbody = data.map((customField) => (
      <CustomFieldExcerpt
        key={customField.Id}
        customField={customField}
        openModal={openModal}
      />
    ))
    content = (
      <>
        <div className="container mx-auto px-4 mb-16 sm:px-8">
          <div className="py-8">
            <div className="mb-5 my-2 flex justify-between sm:flex-row flex-col">
              <h2 className="text-2xl font-semibold leading-tight">
                Custom fields
              </h2>
              <AddCustomFieldForm />
            </div>
            <TableContainer>
              <Table>
                <TableHeader>
                  <tr>
                    <TableCell>Name</TableCell>
                    <TableCell>Field type</TableCell>
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
      </>
    )
  } else if (customFieldStatus === 'failed') {
    content = <div>{error}</div>
  }

  return <section className="customFields-list">{content}</section>
}
