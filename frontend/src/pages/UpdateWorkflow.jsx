import React from 'react'
import DialogModal from '../components/DialogModal'
import FormInput from '../components/Form/FormInputNew'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../store'
import { workflowsSelector,updateWorkflow } from '../slices/workflows'
import { DialogActions, DialogContent } from '../components/DialogModal'

import {Textarea,Button} from '@windmill/react-ui'

function UpdateWorkflowModal({ modalDialog }) {


  const dispatch = useAppDispatch()
  const { register, handleSubmit } = useForm()
  const { workflowUpdate } = useSelector(workflowsSelector)

  const { handleClose } = modalDialog
  const onSubmit = (data) => {
    
    dispatch(updateWorkflow({ id: workflowUpdate.WorkflowId, data }))
    handleClose()
  }
  return (
    <>
      <DialogModal
        title="Workflow"
        modalDialog={modalDialog}
        handleSubmit={handleSubmit(onSubmit)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers className="mx-12">
            <FormInput
              r={register}
              name="WorkflowName"
             label={'Workflow Name'}
              value={workflowUpdate.WorkflowName}
              required
            />
            <FormInput 
            
              r={register}
              name="WorkflowDescription"
              label={'Description'}
              value={workflowUpdate.WorkflowDescription}
              placeholder={"Description...."}
            />
            
          </DialogContent>
          <DialogActions>
            <div className="my-3 mx-5">
              <Button layout="outline" onClick={handleClose} color="secondary">
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

export default UpdateWorkflowModal
