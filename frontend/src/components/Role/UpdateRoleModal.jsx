import React from 'react'
import DialogModal from '../DialogModal'
import FormInput from '../Form/FormInputNew'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { rolesSelector,updateRole } from '../../slices/roles'
import { DialogActions, DialogContent } from '../DialogModal'
import { Button } from '@windmill/react-ui'

function UpdateRoleModal({ modalDialog }) {


  const dispatch = useAppDispatch()
  const { register, handleSubmit } = useForm()
  const { roleUpdate } = useSelector(rolesSelector)

  const { handleClose } = modalDialog
  const onSubmit = (data) => {
    dispatch(updateRole({ id: roleUpdate.Role_Id, data }))
    handleClose()
  }
  return (
    <>
      <DialogModal
        title="Role"
        modalDialog={modalDialog}
        handleSubmit={handleSubmit(onSubmit)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers className="mx-12">
            <FormInput
              r={register}
              name="rolenamesub"
              label={'Role Name'}
              value={roleUpdate.Role_Name}
              required
            />
            <FormInput
              r={register}
              name="roledescription"
              label={'Description'}
              value={roleUpdate.Role_Description}
              placeholder="Type ..."
            />
          </DialogContent>
          <DialogActions>
            <div className="hidden sm:block m-2">
              <Button layout="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>
            <div className="hidden sm:block m-2">
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

export default UpdateRoleModal
