import FormInput from "../components/Form/FormInputNew";
import { useForm } from "react-hook-form";
import TransitionApi from "../api/transitionApi";
import { useHistory } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { fetchStatuss, statussSelector,setState  } from '../slices/statuss'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../store'
import Select1 from 'react-select'
import { useToasts } from 'react-toast-notifications'
import { Button, Select } from "@windmill/react-ui";
// import { useAppDispatch } from '../store'
// import { createTransition } from "../slices/Transitions";

export default function CreateTransition(modalDialog) {
    const { addToast } = useToasts()
    const dispatch = useAppDispatch()
    const { updateMess, updateSuccess,statuss, loading, hasErrors } = useSelector(statussSelector)
  useEffect(() => {
    dispatch(fetchStatuss())
  }, [dispatch])
  console.log(statuss)
    const {fulldata} = modalDialog
    let temp = JSON.parse(localStorage.getItem('Status') || '[]' )
    let temp1 = JSON.parse(localStorage.getItem('Workflow') || '[]' )
    let temp2 = JSON.parse(localStorage.getItem('TransitionAll') || '[]' )
    console.log(temp)
    const{register,handleSubmit} = useForm();
    const history = useHistory()
    const onSubmit = data => {
        console.log(data)
        if(data.Status1Id == data.Status2Id){
          // alert("Not Success")
          // alert("STATUS1 must be different from STATUS2")
          addToast("STATUS1 must be different from STATUS2", {
                      appearance: 'error',
                      autoDismiss: true,
                    })
        }
        else{
        let bool = 0
        
        temp2.map((temp) =>{
            if(temp.Status1Id == data.Status1Id && temp.Status2Id == data.Status2Id){
                bool =-5
            }
        })
        if(bool != -5)
        {
          let statusname1
          let statusname2
          statuss.map((temp) => {
              console.log(temp)
            if (temp.StatusId == data.Status1Id) {
              statusname1 = temp.StatusName
            }
          })
          statuss.map((temp) => {
            console.log(temp)
          if (temp.StatusId == data.Status2Id) {
            statusname2 = temp.StatusName
          }
        })
          console.log(statusname1)
          console.log('kkkkk')
          const postData = {
              Status1Id: data.Status1Id,
              Status2Id: data.Status2Id,
              Status1Name: statusname1,
              Status2Name: statusname2,
              TransitionName: data.TransitionName,
              WorkflowId: data.WorkflowId,
          }
          console.log(postData)
          TransitionApi.createTransition(postData).then(()=>{
              //alert('Create Transition Success')
              addToast("Create Transition Success", {
                appearance: 'success',
                autoDismiss: true,
              })
              history.goBack()
          }).catch(err => alert(err))
        }
        else{
          addToast("Transition is existed", {
            appearance: 'error',
            autoDismiss: true,
          })
        }
      }
    }

    var option1s = statuss.map((option) => {
        return (
          <option key={option.Status1Id} value={option.StatusId}>
            {option.StatusName}
          </option>
        )
      })
      console.log(option1s)
      const fil = statuss.filter(
        (item1) => !statuss.some((item2) => item1.Status1Id === item2.StatusId)
      )
      console.log(fil)
      var option2s = fil.map((option) => {
        return (
          <option key={option.Status2Id} value={option.StatusId}>
            {option.StatusName}
          </option>
        )
      })
    
       
    
  
    // const history = useHistory()
    //  const dispatch = useAppDispatch()
    //  const{register,handleSubmit} = useForm();
    //  const onSubmit = data => {
    //     console.log(data)
    //     dispatch(createTransition(data))
    //     history.push('/Transitions-manager')
    // }


    return (
       <div className="w-full h-full pt-16">
      <div className="max-w-xl px-8 py-8 border-0 shadow-lg rounded-xl h-auto bg-white mx-auto">
        <h1 className="text-2xl font-bold pb-8">Create Transition</h1>
        <hr className="mb-5"/>
        <div className="px-6">
          <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput r={register} name="WorkflowId" label='Workflow ID'  required  value= {temp1.WorkflowId} />
          <FormInput r={register} name="TransitionName" label='Transition Name' required />
          {/* <FormInput r={register} name="Status1Id" label='Status'  />  */}
          {/* <Select option= {temp}/>  */}
          Status 1           :
          <Select
                className="py-2 px-3 rounded-md border border-white-500 mt-2 focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-transparent"
                {...register('Status1Id')}
              >
                {option1s}
              </Select>

              Status 2            :
              <Select
                className="py-2 px-3 rounded-md border border-white-500 mt-2 focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-transparent"
                {...register('Status2Id')}
              >
                {option2s}
              </Select>
          <div className="w-full mt-10 mb-5 px-10">
          <Button layout="outline" size="large" type= "submit" className="rounded-md py-2 
            text-white text-xl w-full ">
            Create Transition
          </Button>
          </div>
          </form>
        </div>
      </div>
    </div>
    )
}
