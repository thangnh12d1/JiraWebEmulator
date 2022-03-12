// import React from 'react'
// import { Link } from 'react-router-dom'
// import { useAppDispatch } from '../../store'
// import { deleteStatusInTransition } from '../../slices/tra-sta'
// export default function TransitionStatusItem({ transition_status }) {

//   const dispatch = useAppDispatch()

//   function deleteConfirm(e, TransitionId, StatusId) {
//     e.preventDefault()
//     if (confirm('Delete?')) {
//       dispatch(deleteStatusInTransition(TransitionId,StatusId))
//     }
//   }


  
//   return (
//     <>
//       {/* <StatusModal modalDialog={modalUpdate} /> */}
//       <tr>
//         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
//           <div className="flex items-center">
//             <div className="ml-3">
//               <p className="text-gray-900 whitespace-no-wrap">
//                 <Link to="#">
//                   <a className="text-blue-400 whitespace-no-wrap">
//                     {transition_status.StatusName}
                    
//                   </a>
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </td>
//         {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
//             <Link to="#">
//               <a className="text-blue-400 whitespace-no-wrap">
//                 {transition.Transition_Description}
//               </a>
//             </Link>
//           </td> */}
//         {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
//             <Link to="#">
//               <ul className="text-blue-400 whitespace-no-wrap">
//                 {renderTransitionStatus()}
//               </ul>
//             </Link>
//           </td> */}

//         <td className="px-5 py-5 text-center border-b border-gray-200 bg-white text-sm">
//           {/* <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
//               <span
//                 aria-hidden
//                 className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
//               />
//                <a 
//                 // onClick={(e) => handleOpenUpdate(e,transition)}
//                 className="relative cursor-pointer"
//               >
//                 Edit
//               </a>
//             </span> */}
//           <span className="relative inline-block px-3 ml-1.5 py-1 font-semibold text-green-900 leading-tight">
//             <span
//               aria-hidden
//               className="absolute inset-0 bg-red-400 opacity-50 rounded-full"
//             />
//             <a
//               onClick={(e) => deleteConfirm(e, transition_status.TransitionId,transition_status.StatusId)}
//               className="relative cursor-pointer text-red-900"
//             >
//               Delete
//             </a>
//           </span>
//         </td>
//       </tr>
//     </>
//   )
// }
