import React, { useEffect, useState } from 'react'
import DialogModal from '../DialogModal'
import { DialogActions, DialogContent } from '../DialogModal'
import FormInput from '../Form/FormInput'

import { Button } from '@windmill/react-ui'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from '../../store'
import { AddProjectToWorkflow } from '../../slices/wor-pro'
import { fetchProjects, projectsSelector } from '../../slices/projects'
import { useSelector } from 'react-redux'
import projectApi from '../../api/projectApi'
import axios from 'axios'

export default function UpdateProjectWorkflow({ modalDialog }) {
  const { handleClose, data_workflow } = modalDialog
  const [fullData, setResult] = useState([])
  useEffect(() => {
    if (modalDialog) {
      // transitionApi.getTransitionStatus(transition.TransitionId).then((data) => {
      //   console.log(data.Data)
      //   setResult(data.Data)
      console.log(modalDialog)
      axios({
        method: 'get',
        url: 'http://localhost:5001/api/projects/projectkey',
        responseType: 'stream'
      })
        .then(function (response) {
          console.log(response)
          setResult(response.data.Data)
        });
      
    }
  }, [])
  const dispatch = useAppDispatch()

  const { register, handleSubmit } = useForm()
  const { projects, loading, hasErrors } = useSelector(projectsSelector)
  useEffect(() => {
    dispatch(fetchProjects())
  }, [dispatch])

  const onSubmit = (data) => {
    let project_name
    projects.map((temp) => {
      if (temp.ProjectKey == data.idproject) {
        project_name = temp.ProjectName
      }
    })
    //data gửi qua slice
    const postdata = {
      idworkflow: data_workflow.WorkflowId.toString(), //props
      idproject: data.idproject,
      ProjectName: project_name,
      ProjectKey: data.idproject,
      WorkflowId: data_workflow.WorkflowId.toString(),
    }
    dispatch(AddProjectToWorkflow(postdata))
    handleClose()
  }
  //filter project which workflow don't aleardy

  let id_project = []
  projects.map((temp) => {
    id_project.push(temp.ProjectKey)
  })
  fullData?.map((temp) => {
    id_project.push(temp.ProjectKey)
  })
  //console.log(projects)
  //console.log("kkkk")
  //console.log(fullData)
  const temp = projects.filter(
    (item1) => !fullData?.some((item2) => item1.ProjectKey === item2.ProjectKey)
  )

  var options = temp ? temp.map((option) => {
    return (
      <option key={option.ProjectKey} value={option.ProjectKey}>
        {option.ProjectName}
      </option>
    )
  }) : ''

  return (
    <>
      <DialogModal
        title="Grant Workflow"
        modalDialog={modalDialog}
        // handleSubmit={handleSubmit(onSubmit)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers className="mx-12">
            <div className="grid grid-cols-1 my-4">
              <label className="uppercase md:text-sm text-xs text-gray-500 text-light">
                Project
              </label>
              <select
                className="py-2 px-3 rounded-md border border-green-500 mt-2 focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-transparent"
                {...register('idproject')}
              >
                {options}
              </select>
            </div>
          </DialogContent>
          <DialogActions>
            <div className="hidden sm:block m-2">
              <Button layout="outline" onClick={handleClose} color="secondary">
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
