import React from 'react'
import DialogModal from '../DialogModal'
import FormInput from '../Form/FormInputNew'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from "../../store";
import { createProject, projectsSelector } from '../../slices/projects'
import { DialogActions, DialogContent } from '../DialogModal';
import projectApi from '../../api/projectApi';
// import Button from '@material-ui/core/Button'
import { Button } from '@windmill/react-ui';
import { useToasts } from 'react-toast-notifications'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
function CreateProjectModal({ modalDialog }) {
  const { addToast } = useToasts()
  const dispatch = useAppDispatch()
  const {projects} = useSelector(projectsSelector)
  const { register, handleSubmit } = useForm()
  const history = useHistory()
  const { handleClose } = modalDialog
  let temp = JSON.parse(localStorage.getItem('ProjectAll') || '[]' )
  const onSubmit = (data) => {
    let bool = 0
    let bool1 = 0
    temp.map((temp1) =>{
      if(temp1.ProjectKey == data.ProjectKey){
        bool = -5     
      }
      if(temp1.ProjectName == data.ProjectName){
        bool1 = -5
      }
    })
    if(bool == -5){
      addToast("Key already exists, please choose another Key", {
        appearance: 'error',
        autoDismiss: true,
      })
    }
    else if(bool1 == -5){
      addToast("Name already exists, please choose another Name", {
        appearance: 'error',
        autoDismiss: true,
      })
    }
    else{
      dispatch(createProject(data))
      console.log(data)
      addToast("Create Workflow Success", {
        appearance: 'success',
        autoDismiss: true,
      })
      handleClose()
    }
    
  }
  return (
    <>
      <DialogModal
        title="Details"
        modalDialog={modalDialog}
        handleSubmit={handleSubmit(onSubmit)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers className="mx-12">
          <FormInput r={register} name="ProjectName" label={'Name'} required />
          <FormInput r={register} name="ProjectKey" label={'Key'} required />

          
          {/*<input {...register('DefaultAssignee')} className="hidden" defaultValue="22" />*/}
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

export default CreateProjectModal
