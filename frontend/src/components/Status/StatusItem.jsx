import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../store'
import { deleteStatus,setStatusUpdate} from '../../slices/statuss'
import StatusModal from './UpdateStatusModal';
import { TableCell, TableRow, Button, ModalHeader, ModalBody,ModalFooter,Modal,Badge } from '@windmill/react-ui'
import { useToasts } from 'react-toast-notifications'

const StatusItem = ({ status }) => {
  const {addToast} = useToasts()
  const dispatch = useAppDispatch()

  const [isModalOpen, setIsModalOpen, deleteP] = useState(false)

  function openModal() {
    setIsModalOpen(true)
  }
 

  function closeModal() {
    setIsModalOpen(false)
  }
  function deleteConfirm(e, statusId) {
    e.preventDefault()
    
      dispatch(deleteStatus(statusId))
      // addToast("Delete Status Success", {
      //   appearance: 'success',
      //   autoDismiss: true,
      // })
    
  }

  const [openUpdate, setOpenUpdate] = React.useState(false)

  const handleOpenUpdate = (e, status) => {
    e.preventDefault()
    dispatch(setStatusUpdate(status))
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
      <StatusModal modalDialog={modalUpdate} />
      <TableRow key={status.StatusId}>
            <TableCell className="px-5 py-5 font-semibold border-b border-gray-200 bg-white text-sm">
              
              <span>{status.StatusName}</span>
            </TableCell>
            <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
             
              <span>{status.StatusDescription}</span>
            </TableCell>
           
            <TableCell className="px-5 py-5 text-center border-b border-gray-200 bg-white text-sm">
              <Badge 
                className="ml-1 hover:bg-green-200 cursor-pointer"
                onClick={(e) => handleOpenUpdate(e, status)} 
                    type={'success'} >
              
              
                
                Edit
              </Badge>
              <Badge 
                    className="ml-1 hover:bg-red-200 cursor-pointer"
                    onClick={openModal}
                    type={'danger'} >
                  
                
                  
                  Delete
                
              </Badge>
              <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ModalHeader>Delete Status</ModalHeader>
                  <ModalBody>
                    Are you sure DELETE this Status!
                  </ModalBody>
                <ModalFooter>
          {/* I don't like this approach. Consider passing a prop to ModalFooter
           * that if present, would duplicate the buttons in a way similar to this.
           * Or, maybe find some way to pass something like size="large md:regular"
           * to Button
           */}
              <div className="hidden sm:block">
                <Button layout="outline" onClick={closeModal}>
                  Cancel
                </Button>
              </div>
              <div className="hidden sm:block" onClick={(e) => deleteConfirm(e, status.StatusId)}>
                <Button>Accept</Button>
              </div>
              <div className="block w-full sm:hidden">
                <Button block size="large" layout="outline" onClick={closeModal}>
                  Cancel
                </Button>
              </div>
              <div className="block w-full sm:hidden">
                <Button block size="large">
                  Accept
                </Button>
              </div>
                </ModalFooter>
      </Modal>
            </TableCell>
          </TableRow>
    </>
  )
}

export default StatusItem
