import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { useHistory } from 'react-router-dom'
import { updateIssueType, selectIssueTypeById } from '../../slices/issueTypes'
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

export const UpdateIssueTypeForm = ({ issueType }) => {
  const [name, setName] = useState(issueType.Name)
  const [icon, setIcon] = useState(issueType.Icon)
  const [description, setDescription] = useState(issueType.Description)
  const [updateRequestStatus, setUpdateRequestStatus] = useState('idle')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const dispatch = useDispatch()
  const history = useHistory()
  const onNameChanged = (e) => setName(e.target.value)
  const onDescriptionChanged = (e) => setDescription(e.target.value)
  const onIconChanged = (e) => setIcon(e.target.value)
  useEffect(() => {
    setName(issueType.Name)
    setIcon(issueType.Icon)
    setDescription(issueType.Description)
  }, [issueType])
  const canSave = [name, icon].every(Boolean) && updateRequestStatus === 'idle'

  const onSaveIssueTypeClicked = async () => {
    if (canSave) {
      try {
        setUpdateRequestStatus('pending')
        const resultAction = await dispatch(
          updateIssueType({
            Id: issueType.Id,
            Name: name,
            Icon: icon,
            Description: description,
          })
        )
        unwrapResult(resultAction)
      } catch (err) {
        console.error('Failed to save the issueType: ', err)
        setName(issueType.Name)
        setIcon(issueType.Icon)
        setDescription(issueType.Description)
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
        <ModalHeader className="m-2">Edit a issue type</ModalHeader>
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

          {/* <Label className="m-2">
            <span>Disabled</span>
            <Input disabled className="mt-1" placeholder="Jane Doe" />
          </Label> */}
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
            <Button onClick={onSaveIssueTypeClicked} disabled={!canSave}>
              Accept
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  )
}
