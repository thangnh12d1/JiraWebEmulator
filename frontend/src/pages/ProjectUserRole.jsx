import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../store'
import {
  fetchProjectUserRole,
  projectUserRolesSelector,
  setState
} from '../slices/pro-user-role'
import { useSelector } from 'react-redux'
import ProjectUserItems from '../components/ProjectUser/ProjectUserItems'
import AddUserToProject from '../components/ProjectUser/AddUserToProject'
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

export default function ProjectUserRole() {
  const { addToast } = useToasts()

  let temp = window.location.pathname.split(/[/,-]/)
  let projectkey = temp[temp.length - 2]
  let projectname = temp[temp.length - 1]

  const dispatch = useAppDispatch()
  const { updateMess, updateSuccess, projectUserRoles, loading, hasErrors } =
    useSelector(projectUserRolesSelector)
  useEffect(() => {
    dispatch(fetchProjectUserRole(projectkey))
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
  //render UserRole
  const renderUserRole = () => {
    return projectUserRoles.map((projectUserRole) => (
      <ProjectUserItems
        key={projectUserRole.UserId}
        dataItem={projectUserRole}
        projectkey={projectkey}
      ></ProjectUserItems>
    ))
  }
  const [openAddUser, setopenAddUser] = useState(false)
  const handleAddUser = (e) => {
    e.preventDefault()
    setopenAddUser(true)
  }
  const handleCloseAdd = () => {
    setopenAddUser(false)
  }
  const modalUpdate = {
    open: openAddUser,
    handleOpen: handleAddUser,
    handleClose: handleCloseAdd,
    projectkey: projectkey,
    listUser: projectUserRoles,
  }
  return (
    <>
      <AddUserToProject modalDialog={modalUpdate}></AddUserToProject>
      <div className="container mx-auto px-4 mb-16 sm:px-8">
        <div className="py-8">
          <div>
            <h1 className="text-3xl font-semibold leading-tight">
              Access Project
            </h1>
            <h2 className="text-2xl font-semibold leading-tight">
              {projectname}
            </h2>
          </div>
          <div className="my-2 flex justify-between sm:flex-row flex-col">
            <div className="flex flex-row mb-1 sm:mb-0"></div>

            <div className="flex">
              <a onClick={(e) => handleAddUser(e)}>
                <Button>Add User</Button>
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
                        Name
                      </TableCell>
                      <TableCell className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </TableCell>
                      <TableCell className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role
                      </TableCell>
                      <TableCell className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Action
                      </TableCell>
                    </tr>
                  </TableHeader>
                  <TableBody>{renderUserRole()}</TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
