import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { updateIssue } from '../../slices/issues'
import {
  selectIssueById,
  selectUserList,
  fetchUserList,
} from '../../slices/issues'
import { useForm, Controller } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
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
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css'
import React_Select from 'react-select'

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }, { size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { color: [] },
      { background: [] },
      { align: [] },
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link'],
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
]

export const UpdateIssueForm = ({ issue }) => {
  const dispatch = useDispatch()
  const { register, handleSubmit, reset, control } = useForm()
  const [name, setName] = useState(issue.Name)
  const [key, setKey] = useState(issue.Key)
  const [project, setProject] = useState(issue.Project)
  const [projectName, setProjectName] = useState(issue.Project_Name)
  const [issueTypeName, setIssueTypeName] = useState(issue.Issue_Type_Name)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [status, setStatus] = useState(issue.Status)
  const [description, setDescription] = useState(issue.Description)

  const [editRequestStatus, setEditRequestStatus] = useState('idle')
  const userList = useSelector(selectUserList)
  useEffect(() => {
    if (isModalOpen) {
      dispatch(fetchUserList({ project: project }))
    }
  }, [dispatch, isModalOpen])
  const onNameChanged = (e) => setName(e.target.value)
  const onStatusChanged = (e) => setStatus(e.target.value)
  const canSave =
    [name, key, status].every(Boolean) && editRequestStatus === 'idle'
  const history = useHistory()
  const onSaveIssueClicked = async (data) => {
    console.log(data)
    if (canSave) {
      try {
        const newIssue = {
          ...issue,
          Key: key,
          Name: name,
          Status: status,
          Description: description,
        }
        newIssue.Fields = newIssue.Fields
          ? newIssue.Fields.map((item) => ({
              ...item,
              Value:
                typeof data[item.Name] === 'object'
                  ? data[item.Name]?.value
                  : data[item.Name],
            }))
          : []
        setEditRequestStatus('pending')
        const resultAction = await dispatch(updateIssue(newIssue))
        unwrapResult(resultAction)
      } catch (err) {
        console.error('Failed to save the issue: ', err)
        setName(issue.Name)
        reset({})
      } finally {
        setEditRequestStatus('idle')
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

  const userOptions = userList.map((item) => ({
    value: item.User_Full_Name,
    label: item.User_Full_Name,
  }))

  const transitionOptions = issue.Transitions?.map((item) => (
    <option key={item.Id_Transition} value={item.Name_Status2}>
      {`${item.Name_Transition} -> ${item.Name_Status2}`}
    </option>
  ))
  let inputFields
  if (issue.Fields && issue.Fields.length !== 0) {
    inputFields = issue.Fields.map((item) => {
      switch (item.Field_Type) {
        case 'Text':
          return (
            <Label key={item.Name} className="m-2">
              <span>{item.Name}</span>
              <Input
                className="mt-1 w-32 md:w-48 lg:w-72"
                {...register(item.Name)}
                defaultValue={item.Value}
              />
            </Label>
          )
        case 'Date':
          return (
            <Label key={item.Name} className="m-2">
              <span>{item.Name}</span>
              <Input
                type="date"
                className="mt-1 w-32 md:w-48 lg:w-72"
                {...register(item.Name)}
                defaultValue={item.Value}
              />
            </Label>
          )
        case 'Text area':
          return (
            <Label key={item.Name} className="m-2">
              <span>{item.Name}</span>
              <Textarea
                className="mt-1 w-32 md:w-48 lg:w-72"
                {...register(item.Name)}
                defaultValue={item.Value}
              />
            </Label>
          )
        case 'People':
          return (
            <Label key={item.Name} className="m-2">
              <span>{item.Name}</span>
              <Controller
                control={control}
                name={item.Name}
                defaultValue={
                  item.Value
                    ? {
                        value: item.Value,
                        label: item.Value,
                      }
                    : ''
                }
                render={({ field: { onChange, value, ref } }) => (
                  <React_Select
                    options={userOptions}
                    onChange={onChange}
                    value={value}
                    isSearchable={true}
                    isClearable={true}
                  />
                )}
              />
            </Label>
          )
      }
    })
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

      <Modal
        className="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-6xl"
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <ModalHeader className="m-2">Edit a issue</ModalHeader>
        <ModalBody class="overflow-auto h-80 flex">
          <div className="flex-auto">
            <Label className="m-2">
              <span>Name</span>
              <Input
                className="mt-1 w-32 md:w-48 lg:w-72"
                value={name}
                onChange={onNameChanged}
              />
            </Label>
            <Label className="m-2">
              <span>Key</span>
              <Input
                className="mt-1 w-32 md:w-48 lg:w-72"
                value={key}
                disabled={true}
              />
            </Label>
            <Label className="m-2">
              <span>Project</span>
              <Input
                className="mt-1 w-32 md:w-48 lg:w-72"
                placeholder="Jane Doe"
                value={projectName}
                disabled={true}
              />
            </Label>
            <Label className="m-2">
              <span>Issue type</span>
              <Input
                className="mt-1 w-32 md:w-48 lg:w-72"
                placeholder="Jane Doe"
                value={issueTypeName}
                disabled={true}
              />
            </Label>
            <Label className="m-2">
              <span>{status}</span>
              <Select
                className="mt-1 w-32 md:w-48 lg:w-72"
                value=""
                onChange={onStatusChanged}
              >
                <option value=""></option>
                {transitionOptions}
              </Select>
            </Label>
            {inputFields}
          </div>
          <div className="m-2 mr-4 flex-auto">
            <Label className="mb-1">
              <span>Description</span>
            </Label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              modules={modules}
              formats={formats}
              placeholder={'Write something...'}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button
              onClick={handleSubmit(onSaveIssueClicked)}
              disabled={!canSave}
            >
              Accept
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  )
}
