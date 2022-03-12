import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../store'
import { deleteUser, setRoleUpdate } from '../../slices/pro-user-role'
import { fetchRoles, rolesSelector } from '../../slices/roles'
import { useSelector } from 'react-redux'
import ProjectUserRoleApi from '../../api/pro-user-roleApi'
import Avatar from '@material-ui/core/Avatar'
import {
  orange,
  purple,
  red,
  blue,
  lime,
  blueGrey,
} from '@material-ui/core/colors'
import { TableCell, TableRow, Button } from '@windmill/react-ui'
import { makeStyles } from '@material-ui/core/styles'
import { useToasts } from 'react-toast-notifications'
import { Select } from '@windmill/react-ui'

//list colour
const colours = [
  blue[800],
  orange[500],
  purple[800],
  red[800],
  lime[500],
  blueGrey[800],
]
//random color
const getColour = () => colours[Math.floor(Math.random() * colours.length)]

const useStyles = makeStyles(() => ({
  backgroundColor: {
    color: '#fff',
    backgroundColor: getColour(),
  },
}))
export default function ProjectUserItems({ dataItem, projectkey }) {
  const dispatch = useAppDispatch()
  const { addToast } = useToasts()

  //delete user project
  function deleteConfirm(e, userId) {
    let dataDelete = {
      UserId: userId,
      ProjectKey: projectkey,
    }
    e.preventDefault()
    if (confirm('Delete?')) {
      dispatch(deleteUser(dataDelete))
    }
  }
  const [roleId, setroleId] = useState(dataItem.RoleId)
  //load role
  const { roles, loading, hasErrors } = useSelector(rolesSelector)
  useEffect(() => {
    dispatch(fetchRoles())
  }, [dispatch])
  //render role
  var options = roles.map((option) => {
    return (
      <option key={option.Role_Id} value={option.Role_Id}>
        {option.Role_Name}
      </option>
    )
  })
  //update role for user
  const handleChange = (e) => {
    setroleId(e.target.value)
    let data = {
      projectKey: projectkey,
      userId: dataItem.UserId.toString(),
      roleIdNew: e.target.value,
    }
    ProjectUserRoleApi.updateRoleUserInProject(data)
      .then((res) => {
        addToast(res.Msg, {
          appearance: 'success',
          autoDismiss: true,
        })
        
      })
      .catch((err) => {
         addToast(err.response.data.Msg, {
           appearance: 'error',
           autoDismiss: true,
         })
      })
  }

  ////get avatar user
  const classes = useStyles()
  const Ava = () => {
    let result = []
    dataItem.UserName.split('').forEach((letter) => {
      result.push(letter)
    })
    return <Avatar className={classes.backgroundColor}>{result[0]}</Avatar>
  }
  return (
    <>
      {/* <UpdateUserModal modalDialog={modalUpdate} /> */}
      <TableRow key={dataItem.UserId}>
        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10">{Ava()}</div>
            <div className="ml-3">
              <p className="text-gray-900 whitespace-no-wrap">
                {dataItem.UserName}
              </p>
            </div>
          </div>
        </TableCell>
        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {dataItem.UserMail}
          </p>
        </TableCell>
        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            <Select
              className="py-2 px-3 rounded-md border border-purple-500 mt-1"
              value={roleId}
              onChange={handleChange}
            >
              {options}
            </Select>
          </p>
        </TableCell>
        <td className="px-5 py-5 border-b text-center border-gray-200 bg-white text-sm">
          <span className="relative inline-block px-3 py-1 ml-1.5 font-semibold text-green-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-red-400 opacity-50 rounded-full"
            />
            <a
              onClick={(e) => deleteConfirm(e, dataItem.UserId)}
              className="relative cursor-pointer text-red-900"
            >
              Delete
            </a>
          </span>
        </td>
      </TableRow>
    </>
  )
}
