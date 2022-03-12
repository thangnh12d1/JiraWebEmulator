import React from 'react'
import { useAppDispatch } from '../../store'
import { deleteRoleInPermission } from '../../slices/per-role'
import { TableCell, TableRow, Badge } from '@windmill/react-ui'

export default function PermissionRoleItem({ permission_role }) {

  const dispatch = useAppDispatch()

  function deleteConfirm(e, PermissionId, RoleId) {
    e.preventDefault()
    if (confirm('Delete?')) {
      dispatch(deleteRoleInPermission(PermissionId,RoleId))
    }
  }


  
  return (
    <>
      {/* <RoleModal modalDialog={modalUpdate} /> */}
      <TableRow>
        <TableCell>
          <span>{permission_role.RoleName}</span>
        </TableCell>
        <TableCell>
          <Badge
            className="ml-1 hover:bg-red-200 cursor-pointer"
            type={'danger'}
            onClick={(e) =>
              deleteConfirm(
                e,
                permission_role.PermissionId,
                permission_role.RoleId
              )
            }
          >
            Delete
          </Badge>
        </TableCell>
      </TableRow>
    </>
  )
}
