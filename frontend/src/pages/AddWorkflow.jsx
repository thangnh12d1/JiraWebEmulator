import FormInput from "../components/Form/FormInputNew";
import { useForm } from "react-hook-form";
import WorkflowApi from "../api/workflowApi";
import { useHistory } from 'react-router-dom'
import React from 'react'
import { useToasts } from 'react-toast-notifications'
import {Button} from '@windmill/react-ui'
// import { useAppDispatch } from '../store'
// import { createWorkflow } from "../slices/Workflows";

export default function CreateWorkflow() {
    const {addToast} = useToasts()
    const{register,handleSubmit} = useForm();
    const history = useHistory()
    const onSubmit = data => {
        console.log(data)
        WorkflowApi.createWorkflow(data).then(()=>{
            //alert('Create Workflow Success')
            addToast("Create Workflow Success", {
                        appearance: 'success',
                        autoDismiss: true,
                      })
            
            history.goBack()
        }).catch(err => 
         //alert(err)
         addToast("The name workflow is exsited!", {
          appearance: 'error',
          autoDismiss: true,
        })
         )
    }
    // const history = useHistory()
    //  const dispatch = useAppDispatch()
    //  const{register,handleSubmit} = useForm();
    //  const onSubmit = data => {
    //     console.log(data)
    //     dispatch(createWorkflow(data))
    //     history.push('/Workflows-manager')
    // }


    return (
       <div className="w-full h-full pt-16">
      <div className="max-w-xl px-8 py-8 border-0 shadow-lg rounded-xl h-auto bg-white mx-auto">
        <h1 className="text-2xl font-bold pb-8">Create Workflow</h1>
        <hr className="mb-5"/>
        <div className="px-6">
          <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput r={register} name="WorkflowName" label='Workflow Name' required />
          <FormInput r={register} name="WorkflowDescription" label='Description'  /> 
          <div className="w-full mt-10 mb-5 px-10">
            
             <Button layout="outline" size="large" type= "submit" className="rounded-md py-2 
            text-white text-xl w-full ">
            Create Workflow
          </Button>
          </div>
          </form>
        </div>
      </div>
    </div>
    )
}
