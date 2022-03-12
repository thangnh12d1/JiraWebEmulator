import React from 'react'
import DialogModal from '../DialogModal'
import FormInput from '../Form/FormInputNew'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { usersSelector, updateUser } from '../../slices/users'
import { DialogActions, DialogContent } from '../DialogModal'
import { useToasts } from 'react-toast-notifications'
import {
  Button,
} from '@windmill/react-ui'


function UpdateUserModal({ modalDialog }) {
  const dispatch = useAppDispatch()
  const { addToast } = useToasts()
  const { register, handleSubmit } = useForm()
  const { userUpdate, updateMess, updateSuccess } = useSelector(usersSelector)
  const { handleClose } = modalDialog
  const onSubmit = (data) => {
    dispatch(updateUser({ id: userUpdate.User_Id, data }))
    if (updateSuccess) {
      addToast(updateMess, {
        appearance: 'success',
        autoDismiss: true,
      })
    }
    handleClose()
  }
  return (
    <>
      <DialogModal
        title="Details"
        modalDialog={modalDialog}
        // handleSubmit={handleSubmit(onSubmit)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers className="mx-12">
            <FormInput
              type="text"
              r={register}
              name="User_Full_Name"
              label={'Name'}
              value={userUpdate.User_Full_Name}
              required
            />
            <FormInput
              r={register}
              name="User_Password"
              label={'Password (Để trống nếu không thay đổi)'}
            />
            <div className="grid grid-cols-1 my-4">
              <label className="uppercase md:text-sm text-xs text-gray-500 text-light">
                Global Role
              </label>
              <select
                className="py-2 px-3 rounded-md border border-purple-500 mt-2 focus:outline-none focus:ring-1 focus:ring-purple-700 focus:border-transparent"
                {...register('globalrole')}
              >
                <option value="0">Admin</option>
                <option value="1">Trusted</option>
                <option value="2">Member</option>
              </select>
            </div>
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

export default UpdateUserModal
