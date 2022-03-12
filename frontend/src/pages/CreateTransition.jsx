// import React, { useEffect } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import { transitionsSelector } from '../slices/transition'
// import {
//   fetchTransitionStatuss,
//   transitionStatussSelector,
// } from '../slices/tra-sta'
// import { Link } from 'react-router-dom'
// import { useAppDispatch } from '../store'
// import TransitionStatusItem from '../components/Transition/TransitionStatusItem'
// import UpdateStatusTransition from '../components/Transition/UpdateTransitionModal'

// export default function DetailTransition() {
//   const { transitionUpdate } = useSelector(transitionsSelector)
//   //lưu vào localStorage
//   if (transitionUpdate.TransitionId) {
//     localStorage.setItem('Transition', JSON.stringify(transitionUpdate))
//   }
//   let temp = JSON.parse(localStorage.getItem('Transition') || '[]')
//   const dispatch = useAppDispatch()
//   const { transitionstatuss, loading, hasErrors } = useSelector(
//     transitionStatussSelector
//   )
//   useEffect(() => {
//     console.log(temp.TransitionId)
//     // dispatch(fetchTransitionStatuss(temp.TransitionId))
//   }, [dispatch])
 
  
//   const renderTransitionStatus = () => {
//     console.log(transitionstatuss)
//     return transitionstatuss.map((temp_status) => (
//       <TransitionStatusItem
//         key={temp_status.StatusId}
//         transition_status={temp_status}
//       ></TransitionStatusItem>
//     ))
//   }
  
//   const [openUpdate, setOpenUpdate] = React.useState(false)
//   const handleOpenUpdate = (e) => {
//     e.preventDefault()
//     // dispatch(setUserUpdate(user))
//     setOpenUpdate(true)
//   }
//   const handleCloseUpdate = () => {
//     setOpenUpdate(false)
//   }
//   const modalUpdate = {
//     open: openUpdate,
//     handleOpen: handleOpenUpdate,
//     handleClose: handleCloseUpdate,
//     data_transition: temp,
//     fulldata:transitionstatuss
//   }
  
//   return (
//     <>
//       <UpdateStatusTransition modalDialog={modalUpdate}></UpdateStatusTransition>
//       <div className="container mx-auto px-4 mb-16 sm:px-8">
//         <div className="py-8">
//           <div>
//             <h2 className="text-2xl font-semibold leading-tight">
//               {temp.TransitionName}
//             </h2>
//             <p className=" font-semibold leading-tight">
//               {temp.TransitionDescription}
//             </p>
//           </div>
//           <div className="my-2 flex justify-between sm:flex-row flex-col">
//             <div className="flex">
//               <a onClick={(e) => handleOpenUpdate(e)} >
//                 <button className="bg-white border shadow-sm px-3 py-1.5 rounded-md hover:text-green-500 text-gray-700">
//                   Add status
//                 </button>
//               </a>
//               {/* <Link to="/invite-user">
//               <button className="bg-white border shadow-sm px-3 py-1.5 rounded-md hover:text-green-500 text-gray-700 ml-1">
//                 Invite Users
//               </button>
//             </Link> */}
//             </div>
//           </div>
//           <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
//             <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
//               <table className="min-w-full leading-normal">
//                 <thead>
//                   <tr>
//                     <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Status Name
//                     </th>
//                     {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Description
//                   </th> */}
//                     {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Email
//                   </th> */}
//                     {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Group name
//                   </th> */}
//                     <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>{renderTransitionStatus()}</tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }
