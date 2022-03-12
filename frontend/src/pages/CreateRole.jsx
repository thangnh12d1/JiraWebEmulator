import FormInput from "../components/Form/FormInputNew";
import { useForm } from "react-hook-form";
import roleApi from "../api/roleApi";
import { useHistory } from 'react-router-dom'
import React from 'react'
// import { useAppDispatch } from '../store'
// import { createRole } from "../slices/roles";

export default function CreateRole() {
    const{register,handleSubmit} = useForm();
    const history = useHistory()
    const onSubmit = data => {
        console.log(data)
        roleApi.createRole(data).then(()=>{
            alert('Create Role Success')
            history.goBack()
        }).catch(err => alert(err))
    }
  


    return (
      <div className="w-full h-full pt-16">
        <div className="max-w-xl px-8 py-8 border-0 shadow-lg rounded-xl h-auto bg-white mx-auto">
          <h1 className="text-2xl font-bold pb-8">Create Project Role</h1>
          <hr className="mb-5" />
          <div className="px-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormInput
                r={register}
                name="rolename"
                label="Role Name"
                required
                placeholder="Admin"
              />
              <FormInput
                r={register}
                name="roledescription"
                label="Description"
                placeholder="Type ..."
              />
              <div className="w-full mt-10 mb-5 px-10">
                <input
                  type="submit"
                  value="Create Role"
                  className="bg-purple-600 rounded-md py-2 
            text-white text-xl w-full"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    )
}
