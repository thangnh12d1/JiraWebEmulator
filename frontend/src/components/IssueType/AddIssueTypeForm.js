import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { useHistory } from 'react-router-dom'
import { addNewIssueType } from '../../slices/issueTypes'
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
} from '@windmill/react-ui'

export const AddIssueTypeForm = () => {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [description, setDescription] = useState('')
  const [addRequestStatus, setAddRequestStatus] = useState('idle')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const dispatch = useDispatch()
  const history = useHistory()
  const onNameChanged = (e) => setName(e.target.value)
  const onDescriptionChanged = (e) => setDescription(e.target.value)
  const onIconChanged = (e) => setIcon(e.target.value)
  const canSave = [name, icon].every(Boolean) && addRequestStatus === 'idle'

  const onSaveIssueTypeClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending')
        setName('')
        setIcon('')
        setDescription('')
        const resultAction = await dispatch(
          addNewIssueType({
            Name: name,
            Icon: icon,
            Description: description,
          })
        )
        unwrapResult(resultAction)
      } catch (err) {
        console.error('Failed to save the issueType: ', err)
      } finally {
        setAddRequestStatus('idle')
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
      <div>
        <Button onClick={openModal}>Create</Button>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader className="m-2">Add a issue type</ModalHeader>
        <ModalBody class="overflow-auto h-80">
          <Label className="m-2">
            <span>Name</span>
            <Input className="mt-1" value={name} onChange={onNameChanged} />
          </Label>
          <Label className="m-2">
            <span>Icon</span>
            <Input className="mt-1" value={icon} onChange={onIconChanged} />
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
            <Button onClick={onSaveIssueTypeClicked} disabled={!canSave}>
              Accept
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  )
}
