import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../store'
import { useSelector } from 'react-redux'
import axios from 'axios'
import {
  fetchPermissionRoles,
  permissionRolesSelector,
} from '../../slices/per-role'
import { TableCell, TableRow, Button, Badge } from '@windmill/react-ui'

import { useHistory } from 'react-router-dom'
import { setPermissionUpdate } from '../../slices/permission'
import permissionApi from '../../api/permissionApi'
const PermissionItem = ({ permission }) => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const [permissionroles_temp, setResult] = useState([])
  useEffect(() => {
    if (permission) {
      permissionApi.getPrmissionRole(permission.Permission_Id).then((data) => {
        setResult(data.Data)
      })
    }
  }, [])

  //get permission to detail
  const handleOpenUpdate = (e, permission) => {
    e.preventDefault()
    dispatch(setPermissionUpdate(permission))
    history.push('permission-manager/detail-permission')
  }

  const renderPermissionRole = () => {
    if (permissionroles_temp != null) {
      return permissionroles_temp.map((temp) => (
        <li key={temp.RoleId}>{temp.RoleName}</li>
      ))
    } else {
      return <li></li>
    }
  }
  return (
    <>
      {/* <RoleModal modalDialog={modalUpdate} /> */}
      <TableRow key={permission.Permission_Id}>
        <TableCell>
          <span>{permission.Permission_Name}</span>
        </TableCell>
        <TableCell>
          <span>{permission.Permission_Description}</span>
        </TableCell>
        <TableCell>
          <ul>{renderPermissionRole()}</ul>
        </TableCell>

        <TableCell >
          {/* <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
            />
            <a
              onClick={(e) => handleOpenUpdate(e, permission)}
              className="relative cursor-pointer"
            >
              Edit
            </a>
          </span> */}
          <Badge
            className="hover:bg-green-200 cursor-pointer"
            type={'success'}
            onClick={(e) => handleOpenUpdate(e, permission)}
          >
            Edit
          </Badge>
        </TableCell>
      </TableRow>
    </>
  )
}

export default PermissionItem
