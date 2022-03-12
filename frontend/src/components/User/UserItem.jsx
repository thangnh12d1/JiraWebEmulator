import React from 'react'
// import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../store'
import {
  usersSelector,
  deleteUser,
  setUserUpdate,
  
} from '../../slices/users'
import UpdateUserModal from './UpdateUserModal';
import { useSelector } from 'react-redux'
import { TableCell, TableRow, Button, Badge } from '@windmill/react-ui'
import Avatar from '@material-ui/core/Avatar'
import {
  orange,
  purple,
  red,
  blue,
  lime,
  blueGrey,
} from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/core/styles'
import { EditIcon, TrashIcon } from '../../icons'
import { useToasts } from 'react-toast-notifications'

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

const UserItem = ({ user }) => {
  const dispatch = useAppDispatch()
  const {  updateMess, updateSuccess } = useSelector(usersSelector)
  const { addToast } = useToasts()

  //delete user from list user
  function deleteConfirm(e, userId) {
    e.preventDefault()
    if (confirm('Delete?')) {
      dispatch(deleteUser(userId))
    }
  }
  //update user
  const [openUpdate, setOpenUpdate] = React.useState(false)
  const handleOpenUpdate = (e, user) => {
    e.preventDefault()
    dispatch(setUserUpdate(user))
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
  //load role
  let globalrole
  if (user.Is_Admin == '0' || user.globalrole == '0') {
    globalrole = 'Admin'
  }
  if (user.Is_Admin == '1' || user.globalrole == '1') {
    globalrole = 'Trusted'
  }
  if (user.Is_Admin == '2' || user.globalrole == '2') {
    globalrole = 'Member'
  }

  ////get avatar user
  const classes = useStyles()
  const Ava = () => {
      let result = []
      user.User_Name.split('').forEach((letter) => {
        result.push(letter)
      })
      return <Avatar className={classes.backgroundColor}>{result[0]}</Avatar>
    }
  

  return (
    <>
      <UpdateUserModal modalDialog={modalUpdate} />
      <TableRow key={user.User_Id}>
        <TableCell>
          <div className="flex items-center">
            <div >{Ava()}</div>
            <div className="ml-3">
              <p >
                {user.User_Full_Name}
              </p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <span>{user.User_Name}</span>
        </TableCell>
        <TableCell>
          <span>{user.User_Email}</span>
        </TableCell>
        <TableCell>
          <span>{globalrole}</span>
        </TableCell>
        <TableCell>
          <Badge
            className="hover:bg-green-200 cursor-pointer"
            type={'success'}
            onClick={(e) => handleOpenUpdate(e, user)}
          >
            Edit
          </Badge>
          <Badge
            className="ml-1 hover:bg-red-200 cursor-pointer"
            type={'danger'}
            onClick={(e) => deleteConfirm(e, user.User_Id)}
          >
            Delete
          </Badge>

          {/* <Badge className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
            <Badge
              aria-hidden
              className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
            />
            <a
              onClick={(e) => handleOpenUpdate(e, user)}
              className="relative cursor-pointer"
            >
              Edit
            </a>
          </Badge>
          <Badge className="relative inline-block px-3 py-1 ml-1.5 font-semibold text-green-900 leading-tight">
            <Badge
              aria-hidden
              className="absolute inset-0 bg-red-400 opacity-50 rounded-full"
            />
            <a
              onClick={(e) => deleteConfirm(e, user.User_Id)}
              className="relative cursor-pointer text-red-900"
            >
              Delete
            </a>
          </Badge> */}
        </TableCell>
      </TableRow>
    </>
  )
}

export default UserItem
