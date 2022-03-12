import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { useHistory } from 'react-router-dom'
import { updateScreen, selectScreenById } from '../../slices/screens'
import {
  Input,
  Label,
  Select,
  Textarea,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Badge,
} from '@windmill/react-ui'

export const UpdateScreenForm = ({ screen }) => {
  const [name, setName] = useState(screen.Name)
  const [description, setDescription] = useState(screen.Description)
  const [updateRequestStatus, setUpdateRequestStatus] = useState('idle')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()
  const onNameChanged = (e) => setName(e.target.value)
  const onDescriptionChanged = (e) => setDescription(e.target.value)

  useEffect(() => {
    setName(screen.Name)
    setDescription(screen.Description)
  }, [screen])

  const canSave = [name].every(Boolean) && updateRequestStatus === 'idle'

  const onSaveScreenClicked = async () => {
    if (canSave) {
      try {
        setUpdateRequestStatus('pending')
        const resultAction = await dispatch(
          updateScreen({ Id: screen.Id, Name: name, Description: description })
        )
        unwrapResult(resultAction)
      } catch (err) {
        console.error('Failed to save the screen: ', err)
        setName(screen.Name)
        setDescription(screen.Description)
      } finally {
        setUpdateRequestStatus('idle')
        closeModal()
      }
    }
  }
  function openModal() {
    setIsModalOpen(true)
  }
  function closeModal() {
    setIsModalOpen(false)
  }
  return (
    <>
      <Badge
        className="hover:bg-green-200 cursor-pointer"
        type={'success'}
        onClick={openModal}
      >
        Edit
      </Badge>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader className="m-2">Edit a screen</ModalHeader>
        <ModalBody>
          <Label className="m-2">
            <span>Name</span>
            <Input className="mt-1" value={name} onChange={onNameChanged} />
          </Label>

          <Label className="m-2">
            <span>Description</span>
            <Textarea
              className="mt-1"
              rows="3"
              value={description}
              onChange={onDescriptionChanged}
            />
          </Label>
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button onClick={onSaveScreenClicked} disabled={!canSave}>
              Accept
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  )
}
