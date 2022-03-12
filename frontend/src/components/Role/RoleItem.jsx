import React, { useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../store'
import {
  deleteRole,
  setRoleUpdate,
} from '../../slices/roles'
import RoleModal from './UpdateRoleModal';
import { TableCell, TableRow, Badge } from '@windmill/react-ui'


const RoleItem = ({ role }) => {
  const dispatch = useAppDispatch()
  const deleteConfirm = ((e, roleId) => {
      e.preventDefault()
      if (confirm('Delete?')) {
        dispatch(deleteRole(roleId)) 
      }
    }
  )
   
  
  const [openUpdate, setOpenUpdate] = React.useState(false)

  const handleOpenUpdate = (e, role) => {
    e.preventDefault()
    dispatch(setRoleUpdate(role))
    setOpenUpdate(true)
  }
  const handleCloseUpdate = () => {
    setOpenUpdate(false)
  }
  const modalUpdate = {
    open: openUpdate,
    handleOpen: handleOpenUpdate,
    handleClose: handleCloseUpdate,
  }


  return (
    <>
      <RoleModal modalDialog={modalUpdate} />
      <TableRow key={role.Role_Id}>
        <TableCell>
          <span>{role.Role_Name || role.rolenamesub}</span>
        </TableCell>
        <TableCell>
          <span>{role.Role_Description || role.roledescription}</span>
        </TableCell>

        <TableCell>
          <Badge
            className="hover:bg-green-200 cursor-pointer"
            type={'success'}
            onClick={(e) => handleOpenUpdate(e, role)}
          >
            Edit
          </Badge>
          {/* <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
            />
            <a
              onClick={(e) => handleOpenUpdate(e, role)}
              className="relative cursor-pointer"
            >
              Edit
            </a>
          </span> */}
          <Badge
            className="ml-1 hover:bg-red-200 cursor-pointer"
            type={'danger'}
            onClick={(e) => deleteConfirm(e, role.Role_Id)}
          >
            Delete
          </Badge>
          {/* <span className="relative inline-block px-3 ml-1.5 py-1 font-semibold text-green-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-red-400 opacity-50 rounded-full"
            />
            <a
              onClick={(e) => deleteConfirm(e, role.Role_Id)}
              className="relative cursor-pointer text-red-900"
            >
              Delete
            </a>
          </span> */}
        </TableCell>
      </TableRow>
    </>
  )
}

export default RoleItem
