import React from 'react'

function FormSelect({ label }) {
  return (
    <div className="grid grid-cols-1 my-4">
      <label className="uppercase md:text-sm text-xs text-gray-500 text-light">
        {label}
      </label>
      <select className="py-2 px-3 rounded-md border border-green-500 mt-2 focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-transparent"
      value ="globalrole"
      >
        <option>5</option>
        <option>10</option>
        <option>20</option>
      </select>
    </div>
  )
}

export default FormSelect
