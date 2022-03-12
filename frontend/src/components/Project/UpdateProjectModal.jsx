import React from 'react'
import DialogModal from '../DialogModal'
import FormInput from '../Form/FormInputNew'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useAppDispatch } from "../../store";
import { projectsSelector, updateProject } from '../../slices/projects'
import { DialogActions, DialogContent } from '../DialogModal';
import Button from '@material-ui/core/Button'
import {Textarea} from '@windmill/react-ui'
function UpdateProjectModal({ modalDialog }) {
  const dispatch = useAppDispatch()
  const { register, handleSubmit } = useForm()
  const { projectUpdate } = useSelector(projectsSelector)
  const { handleClose } = modalDialog
  const onSubmit = (formData) => {
    const data = Object.assign({}, projectUpdate, formData)
    
   
    dispatch(updateProject({key: projectUpdate.ProjectKey, data}))
    handleClose()
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
            {/* <FormInput
              r={register}
              name="Project_Full_Name"
              label={'Name'}
              value={projectUpdate.Project_Full_Name}
              required
            />
            <FormInput r={register} name="Projectname" label={'Projectname'} value={projectUpdate.Projectname} required />
            <FormInput r={register} name="Project_Email" label={'Email'} value={projectUpdate.Project_Email} required />
            <FormInput
              r={register}
              name="Project_Password"
              label={'Password (Để trống nếu không thay đổi)'}
            />
            <FormInput r={register} name="Is_Admin" label={'Is Admin'} value={projectUpdate.Is_Admin} required /> */}
            
            <FormInput r={register} name="ProjectName" label={'Name'} value={projectUpdate.ProjectName} required/>
            <FormInput r={register} name="ProjectUrl" label={'URL'} value={projectUpdate.ProjectUrl}/>
            {/* <FormSelect label={'Project Type'}>
              <option>Software</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </FormSelect> */}
            <div className="mb-5 w-full relative z-0">
              <Textarea className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 
              border-b-2 h-36 resize-none appearance-none focus:outline-none focus:ring-0 focus:border-green-800 border-gray-200" 
              name="name" placeholder=" " defaultValue={projectUpdate.ProjectDescription} />
              <label htmlFor="name" className="absolute duration-300 
              top-3 origin-0 text-gray-500 -z-1">Description</label>
            </div>
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

export default UpdateProjectModal
