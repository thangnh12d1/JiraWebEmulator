import React from 'react'
import DialogModal from '../DialogModal'
import FormInput from '../Form/FormInputNew'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { statussSelector,updateStatus } from '../../slices/statuss'
import { DialogActions, DialogContent } from '../DialogModal'
import Button from '@material-ui/core/Button'

function UpdateStatusModal({ modalDialog }) {


  const dispatch = useAppDispatch()
  const { register, handleSubmit } = useForm()
  const { statusUpdate } = useSelector(statussSelector)

  const { handleClose } = modalDialog
  const onSubmit = (data) => {
    
    dispatch(updateStatus({ id: statusUpdate.StatusId, data }))
    handleClose()
  }
  return (
    <>
      <DialogModal
        title="Status"
        modalDialog={modalDialog}
        handleSubmit={handleSubmit(onSubmit)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers className="mx-12">
            <FormInput
              r={register}
              name="StatusName"
             label={'Status Name'}
              value={statusUpdate.StatusName}
              required
            />
            <FormInput 
              r={register}
              name="StatusDescription"
              label={'Description'}
              value={statusUpdate.StatusDescription}
              
            />
          </DialogContent>
          <DialogActions>
            <div className="my-3 mx-5">
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </div>
          </DialogActions>
        </form>
      </DialogModal>
    </>
  )
}

export default UpdateStatusModal
