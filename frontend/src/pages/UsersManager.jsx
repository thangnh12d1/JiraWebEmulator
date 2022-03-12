/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { fetchUsers, usersSelector, setState } from '../slices/users'
import { Link } from 'react-router-dom'
import UserItem from '../components/User/UserItem'
import { useAppDispatch } from '../store'
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
  Select
} from '@windmill/react-ui'
import { useToasts } from 'react-toast-notifications'

const Users = () => {
  const dispatch = useAppDispatch()
  const { addToast } = useToasts()

  const { users, loading, hasErrors, updateMess, updateSuccess } =
    useSelector(usersSelector)

  //get data user
  useEffect(() => {
    dispatch(fetchUsers())
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

  //search user
  //setup search
  const [searchTerm, setSearchTerm] = React.useState('')
  const [searchResults, setSearchResults] = React.useState([])
  //setup select 
  const [selectTerm, setSelectTerm] = React.useState('')
  const handleChange = (e) => {
    setSearchTerm(e.target.value)
  }
  const handleSelect = (e) =>{
    setSelectTerm(e.target.value)
  }
  useEffect(() => {
    const results = users.filter(
      (person) =>
        person.User_Name.toLowerCase().indexOf(searchTerm.toLowerCase()) !=
          -1 ||
        person.User_Email.toLowerCase().indexOf(searchTerm.toLowerCase()) !=
          -1 ||
        person.User_Full_Name.toLowerCase().indexOf(searchTerm.toLowerCase()) !=
          -1
    )
    setSearchResults(results)
  }, [searchTerm])
  useEffect(() => {
    const resultsSelect = users.filter(
      (person) => person.Is_Admin == selectTerm
    )
    setSearchResults(resultsSelect)
  }, [selectTerm])
  //render user
  const renderUsers = () => {
    if (
      (searchTerm == '' && selectTerm == 'All') ||
      (searchTerm == '' && selectTerm == '')
    ) {
      return users.map((user) => <UserItem key={user.User_Id} user={user} />)
    } else {
      return searchResults.map((user) => (
        <UserItem key={user.User_Id} user={user} />
      ))
    }
  }
  if (loading) {
    return (
      <tr>
        <div className="loader">Loading...</div>
      </tr>
    )
  }
  if (hasErrors) return <p>Unable to get Users.</p>
  return (
    <div className="container mx-auto px-4 mb-16 sm:px-8">
      <div className="py-8">
        <div>
          <h1 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Users Manager
          </h1>
        </div>
        <div className="my-2 flex justify-between sm:flex-row flex-col">
          <div className="flex flex-row mb-1 sm:mb-0">
            <div className="relative">
              <Select
                value={selectTerm}
                onChange={handleSelect}
                className="appearance-none h-full rounded-r border-t sm:rounded-r-none sm:border-r-0 border-r border-b block w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500"
              >
                <option selected >All</option>
                <option value="0">User Admin</option>
                <option value="1">User Trusted</option>
                <option value="2">User Member</option>
              </Select>
            </div>
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
            <Link to="user-manager/create-user">
              <Button>Create User</Button>
            </Link>
          </div>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <TableContainer className="mb-8">
              <Table className="min-w-full leading-normal">
                <TableHeader>
                  <tr>
                    <TableCell>Full name</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Action</TableCell>
                  </tr>
                </TableHeader>
                <TableBody>{renderUsers()}</TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Users
