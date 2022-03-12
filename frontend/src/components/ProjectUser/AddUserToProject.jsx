import React, { useEffect, useState } from 'react'
import DialogModal from '../DialogModal'
import { DialogActions, DialogContent } from '../DialogModal'
import { Button } from '@windmill/react-ui'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from '../../store'
import { AddUserToProject } from '../../slices/pro-user-role'
import { fetchRoles, rolesSelector } from '../../slices/roles'
import { fetchUsers, usersSelector } from '../../slices/users'
import { useSelector } from 'react-redux'
import FormInput from '../Form/FormInput'
import React_Select from 'react-select'
import {  Select } from '@windmill/react-ui'

export default function AddUserProject({ modalDialog }) {
  const { handleClose, projectkey, listUser } = modalDialog
  const { register, handleSubmit } = useForm()
  const dispatch = useAppDispatch()
  //load user
  const { users } = useSelector(usersSelector)
  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])
  const temp = users.filter(
    (item1) => !listUser.some((item2) => item1.User_Id === item2.UserId)
  )
  //options user
  const options_user = temp.map((user) => ({
    value: user.User_Id,
    label: user.User_Name,
  }))

  //load role
  const { roles } = useSelector(rolesSelector)
  useEffect(() => {
    dispatch(fetchRoles())
  }, [dispatch])
  //options role
  const options_role = roles.map((option) => ({
    value: option.Role_Id,
    label: option.Role_Name,
  }))
  var options = roles.map((option) => {
    return (
      <option key={option.Role_Id} value={option.Role_Id}>
        {option.Role_Name}
      </option>
    )
  })
  
  //arr user selected
  const [arrUser, setarrUser] = useState([])
  const onchangeSelect = (item) => {
    setarrUser(item)
  }
  //submit
  const onSubmit = (data) => {
    let role_name
    roles.map((temp) => {
      if (temp.Role_Id == data.idrole) {
        role_name = temp.Role_Name
      }
    })
    arrUser.map((user) => {
      const postdata = {
        userId: user.value.toString(),
        roleId: data.idrole,
        projectKey: projectkey,
        RoleName: role_name,
      }
      dispatch(AddUserToProject(postdata))
    })
    handleClose()
  }
  return (
    <>
      <DialogModal
        title="Grant Permission"
        modalDialog={modalDialog}
        // handleSubmit={handleSubmit(onSubmit)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers className="mx-12">
            <div className="grid grid-cols-1 my-4">
              <label className="uppercase md:text-sm text-xs text-gray-500 text-light">
                Name
              </label>
              <React_Select
                components={{
                  IndicatorSeparator: () => null,
                }}
                isMulti
                name="userId"
                options={options_user}
                onChange={onchangeSelect}
                className="py-2 px-3 rounded-md border border-purple-500 mt-1 "
                styles={{
                  dropdownIndicator: (base) => ({
                    ...base,
                    padding: 0,
                    // Custom colour
                  }),
                  control: (provided, state) => ({
                    ...provided,
                    boxShadow: 'none',
                    border: 'none',
                  }),
                  menuPortal: (styles) => ({ ...styles, zIndex: 1000 }),
                }}
              />
            </div>
            <div className="grid grid-cols-1 my-4">
              <label className="mt-4">
                <span> Project Role</span>
              </label>
              <Select
                className="py-2 px-3 rounded-md border border-purple-500 mt-1"
                {...register('idrole')}
              >
                {options}
              </Select>
            </div>
          </DialogContent>
          <DialogActions>
            <div className="hidden sm:block m-2">
              <Button layout="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>
            <div className="hidden sm:block m-2">
              <Button type="submit" color="primary">
                Submit
              </Button>
            </div>
          </DialogActions>
        </form>
      </DialogModal>
    </>
  )
}
