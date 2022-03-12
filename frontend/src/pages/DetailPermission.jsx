import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { permissionsSelector } from '../slices/permission'
import {
  fetchPermissionRoles,
  permissionRolesSelector,
  setState,
} from '../slices/per-role'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../store'
import PermissionRoleItem from '../components/Permission/PermissionRoleItem'
import UpdateRolePermission from '../components/Permission/UpdateRolePermission'
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Button,
  Pagination,
} from '@windmill/react-ui'
import { useToasts } from 'react-toast-notifications'

export default function DetailPermission() {
  const { permissionUpdate } = useSelector(permissionsSelector)
  const { addToast } = useToasts()

  //lưu vào localStorage
  if (permissionUpdate.Permission_Id) {
    localStorage.setItem('Permission', JSON.stringify(permissionUpdate))
  }
  let temp = JSON.parse(localStorage.getItem('Permission') || '[]')
  const dispatch = useAppDispatch()
  //permissionroles
  const { permissionroles, loading, hasErrors, updateMess, updateSuccess } =
    useSelector(permissionRolesSelector)
  useEffect(() => {
    dispatch(fetchPermissionRoles(temp.Permission_Id))
  }, [dispatch])
  //notification delete,update
  useEffect(() => {
    if (updateSuccess) {
      addToast(updateMess, {
        appearance: 'success',
        autoDismiss: true,
      })
      dispatch(setState())
    }
  }, [updateSuccess])

  //search role
  //setup search
  const [searchTerm, setSearchTerm] = React.useState('')
  const [searchResults, setSearchResults] = React.useState([])
  const handleChange = (e) => {
    setSearchTerm(e.target.value)
  }
  useEffect(() => {
    const results = permissionroles.filter(
      (role) =>
        role.RoleName.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1
    )
    setSearchResults(results)
  }, [searchTerm])
  //render permission role
  const renderPermissionRole = () => {
    if (searchTerm == '') {
      //get full data
      return permissionroles.map((temp_role) => (
        <PermissionRoleItem
          key={temp_role.RoleId}
          permission_role={temp_role}
        ></PermissionRoleItem>
      ))
    } else {
      //after using search
      return searchResults.map((temp_role) => (
        <PermissionRoleItem
          key={temp_role.RoleId}
          permission_role={temp_role}
        ></PermissionRoleItem>
      ))
    }
  }
  //open modalUpdate
  const [openUpdate, setOpenUpdate] = React.useState(false)
  const handleOpenUpdate = (e) => {
    e.preventDefault()
    // dispatch(setUserUpdate(user))
    setOpenUpdate(true)
  }
  const handleCloseUpdate = () => {
    setOpenUpdate(false)
  }
  const modalUpdate = {
    open: openUpdate,
    handleOpen: handleOpenUpdate,
    handleClose: handleCloseUpdate,
    data_permission: temp,
    fulldata: permissionroles,
  }
  return (
    <>
      <UpdateRolePermission modalDialog={modalUpdate}></UpdateRolePermission>
      <div className="container mx-auto px-4 mb-16 sm:px-8">
        <div className="py-8">
          <div>
            <h2 className="text-2xl font-semibold leading-tight">
              {temp.Permission_Name}
            </h2>
            <p className=" font-semibold leading-tight">
              {temp.Permission_Description}
            </p>
          </div>
          <div className="my-2 flex justify-between sm:flex-row flex-col">
            <div className="flex flex-row mb-1 sm:mb-0">
              {/* Ô search */}
              <div className="flex relative">
                <span className="h-full absolute inset-y-0 right-2 flex items-center pl-2">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 fill-current text-gray-500"
                  >
                    <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
                  </svg>
                </span>
                <input
                  placeholder="Search"
                  className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
                  value={searchTerm}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex">
              <a onClick={(e) => handleOpenUpdate(e)}>
                <Button>Add role</Button>
              </a>
            </div>
          </div>
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <TableContainer className="mb-8">
                <Table className="min-w-full leading-normal">
                  <TableHeader>
                    <tr>
                      <TableCell className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role Name
                      </TableCell>
                      <TableCell className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Action
                      </TableCell>
                    </tr>
                  </TableHeader>
                  <TableBody>{renderPermissionRole()}</TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
