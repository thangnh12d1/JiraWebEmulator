import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { fetchRoles, rolesSelector, setState } from '../slices/roles'
import { Link } from 'react-router-dom'
import RoleItem from '../components/Role/RoleItem'
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
} from '@windmill/react-ui'
import { useToasts } from 'react-toast-notifications'

const Roles = () => {
  const dispatch = useAppDispatch()
  const { addToast } = useToasts()
  //roles
  const { updateMess, updateSuccess, roles, loading, hasErrors } =
    useSelector(rolesSelector)
  useEffect(() => {
    dispatch(fetchRoles())
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
    const results = roles.filter(
      (role) =>
        role.Role_Name.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1
    )
    setSearchResults(results)
  }, [searchTerm])
  //render roles
  const renderRole = () => {
    if (searchTerm == '') { //get full data
      return roles.map((role) => <RoleItem key={role.Role_Id} role={role} />)
    } else {//after using search 
      return searchResults.map((role) => (
        <RoleItem key={role.Role_Id} role={role} />
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
  if (hasErrors) return <p>Unable to get Roles.</p>

  return (
    <div className="container mx-auto px-4 mb-16 sm:px-8">
      <div className="py-8">
        <div>
          <div>
            <h1 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
              Project Role
            </h1>
          </div>
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
          <div className="flex flex-row mb-1 sm:mb-0"></div>
          <div className="flex">
            <Link to="role-manager/create-role">
              <Button>Create role</Button>
            </Link>
          </div>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <TableContainer className="mb-8">
              <Table className="min-w-full leading-normal">
                <TableHeader>
                  <tr>
                    <TableCell >
                      Role Name
                    </TableCell>
                    <TableCell>
                      Description
                    </TableCell>
                    <TableCell >
                      Action
                    </TableCell>
                  </tr>
                </TableHeader>
                <TableBody>{renderRole()}</TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Roles
