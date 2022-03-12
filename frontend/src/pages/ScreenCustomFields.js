import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { Link, useLocation } from 'react-router-dom'
import {
  addNewScreenCustomField,
  deleteScreenCustomField,
  setErrorNull,
  setSuccessNull,
} from '../slices/screenCustomFields'
import { selectAllCustomFields } from '../slices/customFields'
import { useToasts } from 'react-toast-notifications'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  Label,
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

const ScreenCustomFieldExcerpt = ({ screenCustomField, openModal }) => {
  return (
    <TableRow key={screenCustomField.Id}>
      <TableCell>
        <div className="flex items-center text-sm">
          <div>
            <p className="font-semibold">{screenCustomField.Name}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm">{screenCustomField.Field_Type}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{screenCustomField.Description}</span>
      </TableCell>
      <TableCell>
        <Badge
          className="ml-1 hover:bg-red-200 cursor-pointer"
          type={'danger'}
          onClick={() => openModal(screenCustomField.Id)}
        >
          Delete
        </Badge>
      </TableCell>
    </TableRow>
  )
}

export const ScreenCustomFields = () => {
  const { addToast } = useToasts()
  const location = useLocation()
  const screen = location.state?.screen
  //const listCustomFields = location.state?.listCustomFields
  const [listCustomFields, setListCustomFields] = useState(
    location.state?.listCustomFields
  )
  const dispatch = useDispatch()
  const customFields = useSelector(selectAllCustomFields)
  const temp = customFields.filter(
    (item1) => !listCustomFields.some((item2) => item1.Name === item2.Name)
  )
  const fieldTypesOptions = temp.map((customField) => (
    <option key={customField.Id} value={customField.Id}>
      {customField.Name}
    </option>
  ))
  const onFieldTypeChanged = async (e) => {
    try {
      console.log({
        Screen: screen.Id,
        Custom_Field: e.target.value,
      })
      const resultAction = await dispatch(
        addNewScreenCustomField({
          Screen: screen.Id,
          Custom_Field: Number(e.target.value),
        })
      ).then((res) => {
        let result = [res.payload.Data]
        const temp = customFields.filter((item1) =>
          result.some((item2) => item1.Id === item2.Custom_Field)
        )
        //console.log(res.payload.Data, customFields, temp)
        temp.forEach((element) => {
          result.forEach((ele) => {
            if (element.Id === ele.Custom_Field) {
              setListCustomFields((oldArray) => [
                ...oldArray,
                { ...element, Id: ele.Id },
              ])
            }
          })
        })
      })
      //unwrapResult(resultAction)
    } catch (err) {
      console.error('Failed to save the customField: ', err)
    } finally {
      //setAddRequestStatus('idle')
    }
  }
  const screenCustomFieldStatus = useSelector(
    (state) => state.screenCustomFields.status
  )
  const error = useSelector((state) => state.screenCustomFields.error)
  const success = useSelector((state) => state.screenCustomFields.success)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [id, setId] = useState()
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  // pagination setup
  const resultsPerPage = 10
  const totalResults = listCustomFields.length

  // pagination change control
  function onPageChange(p) {
    setPage(p)
  }
  useEffect(() => {
    // if (screenCustomFieldStatus === 'idle') {
    //   dispatch(fetchScreenCustomFields())
    // }
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
  }, [screenCustomFieldStatus, dispatch, error, success])
  useEffect(() => {
    setData(
      listCustomFields.slice((page - 1) * resultsPerPage, page * resultsPerPage)
    )
  }, [listCustomFields, page])
  const deleteRow = (Id) => {
    const result = listCustomFields.filter((ele) => ele.Id !== Id)
    setListCustomFields(result)
  }

  function openModal(id) {
    setIsModalOpen(true)
    setId(id)
  }
  function closeModal() {
    setIsModalOpen(false)
  }
  function deleteConfirm(e, id) {
    e.preventDefault()
    dispatch(deleteScreenCustomField({ Id: id })).then((res) =>
      deleteRow(res.payload.Data.Id)
    )
    closeModal()
    //window.location.reload(false);
  }
  let content

  // if (screenCustomFieldStatus === 'loading') {
  //   content = <div className="loader">Loading...</div>
  // } else if (screenCustomFieldStatus === 'succeeded') {
  let tbody = data?.map((screenCustomField) => (
    <ScreenCustomFieldExcerpt
      key={screenCustomField.Id}
      screenCustomField={screenCustomField}
      openModal={openModal}
    />
  ))
  content = (
    <div className="container mx-auto px-4 mb-16 sm:px-8">
      <div className="py-8">
        <div className="mb-5 my-2 flex justify-between sm:flex-row flex-col">
          <h2 className="text-2xl font-semibold leading-tight">{`Screen: ${screen.Name}`}</h2>
          <Label className="m-2">
            <span className="text-1xl font-semibold leading-tight">Add a custom field</span>
            <Select className="mt-1" value={''} onChange={onFieldTypeChanged}>
              <option value=""></option>
              {fieldTypesOptions}
            </Select>
          </Label>
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
  // } else if (screenCustomFieldStatus === 'error') {
  //   content = <div>{error}</div>
  // }

  return <section className="screenCustomFields-list">{content}</section>
}
