// import React, { useEffect } from 'react'
// import DialogModal from '../DialogModal'
// import { DialogActions, DialogContent } from '../DialogModal'
// import FormInput from '../Form/FormInput'
// import Button from '@material-ui/core/Button'
// import { useForm } from 'react-hook-form'
// import { useAppDispatch } from '../../store'
// import { AddStatusToTransition } from '../../slices/tra-sta'
// import { fetchStatuss, statussSelector } from '../../slices/statuss'
// import { useSelector } from 'react-redux'

// export default function UpdateStatusTransition({ modalDialog }) {
//   const { handleClose, fulldata, data_transition } = modalDialog
//   const dispatch = useAppDispatch()

//   const { register, handleSubmit } = useForm()
//   const { statuss, loading, hasErrors } = useSelector(statussSelector)
//   useEffect(() => {
//     dispatch(fetchStatuss())
//   }, [dispatch])

//   const onSubmit = (data) => {
//     let status_name
//     statuss.map((temp) => {
//       if (temp.StatusId == data.idstatus) {
//         status_name = temp.StatusName
//       }
//     })
//     //data gửi qua slice
//     const postdata = {
//       idtransition: data_transition.TransitionId.toString(), //props
//       idstatus: data.idstatus,
//       StatusName: status_name,
//       StatusId: data.idstatus,
//       TransitionId: data_transition.TransitionId.toString(),
//     }
//     dispatch(AddStatusToTransition(postdata))
//     handleClose()
//   }
//   //filter status which transition don't aleardy

//   let id_status = []
//   statuss.map((temp) => {
//     id_status.push(temp.StatusId)
//   })
//   fulldata.map((temp) => {
//     id_status.push(temp.StatusId)
//   })

//   var options = statuss.map((option) => {
//     return (
//       <option key={option.StatusId} value={option.StatusId}>
//         {option.StatusName}
//       </option>
//     )
//   })

//   return (
//     <>
//       <DialogModal
//         title="Add Status to Transition"
//         modalDialog={modalDialog}
//         // handleSubmit={handleSubmit(onSubmit)}
//       >
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <DialogContent dividers className="mx-12">
//             <div className="grid grid-cols-1 my-4">
//               <label className="uppercase md:text-sm text-xs text-gray-500 text-light">
//                 Status
//               </label>
//               <select
//                 className="py-2 px-3 rounded-md border border-green-500 mt-2 focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-transparent"
//                 {...register('idstatus')}
//               >
//                 {options}
//               </select>
//             </div>
//           </DialogContent>
//           <DialogActions>
//             <div className="my-3 mx-5">
//               <Button onClick={handleClose} color="secondary">
//                 Cancel
//               </Button>
//               <Button type="submit" color="primary">
//                 Submit
//               </Button>
//             </div>
//           </DialogActions>
//         </form>
//       </DialogModal>
//     </>
//   )
// }
