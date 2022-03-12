import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { useHistory } from 'react-router-dom'
import { addNewCustomField } from '../../slices/customFields'
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

const fieldTypes = [
  { Id: '0', Name: 'Text' },
  { Id: '1', Name: 'Date' },
  { Id: '2', Name: 'Text area' },
  { Id: '3', Name: 'People' },
]

export const AddCustomFieldForm = () => {
  const [name, setName] = useState('')
  const [fieldType, setFieldType] = useState('')
  const [description, setDescription] = useState('')
  const [addRequestStatus, setAddRequestStatus] = useState('idle')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()
  const onNameChanged = (e) => setName(e.target.value)
  const onDescriptionChanged = (e) => setDescription(e.target.value)
  const onFieldTypeChanged = (e) => setFieldType(e.target.value)
  const canSave =
    [name, fieldType].every(Boolean) && addRequestStatus === 'idle'

  const onSaveCustomFieldClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending')
        setName('')
        setFieldType('')
        setDescription('')
        const resultAction = await dispatch(
          addNewCustomField({
            Name: name,
            Field_Type: fieldType,
            Description: description,
          })
        )
        unwrapResult(resultAction)
      } catch (err) {
        console.error('Failed to save the customField: ', err)
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
  const fieldTypesOptions = fieldTypes.map((customField) => (
    <option key={customField.Id} value={customField.Name}>
      {customField.Name}
    </option>
  ))
  return (
    <>
      <div>
        <Button onClick={openModal}>Create</Button>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader className="m-2">Add a custom field</ModalHeader>
        <ModalBody>
          <Label className="m-2">
            <span>Name</span>
            <Input className="mt-1" value={name} onChange={onNameChanged} />
          </Label>

          <Label className="m-2">
            <span>Type</span>
            <Select
              className="mt-1"
              value={fieldType}
              onChange={onFieldTypeChanged}
            >
              <option value=""></option>
              {fieldTypesOptions}
            </Select>
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
            <Button onClick={onSaveCustomFieldClicked} disabled={!canSave}>
              Accept
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  )
}
