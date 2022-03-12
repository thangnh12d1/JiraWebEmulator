/* eslint-disable no-unused-vars */
import React from 'react'
import { Label, Input, Button, HelperText } from '@windmill/react-ui'

// class FormInput extends Component {
// constructor(props) {
//   super(props);
//   //Chá»‰ Ä‘á»‹nh má»™t state
//   // this.state = { data: "" }
// }

// onChangeVal = (event) => {
//   // this.setState({data:event.target.value}, () => console.log(this.state.data))
//   this.setState({data:event.target.value})
//   // console.log(this.state.data)
// }

//   render() {
//     return (
//       <div className="mb-5 w-full relative z-0">
//         <input className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0
//       border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
//           type={this.props.type} onChange={this.props.onChangeVal} placeholder=" " required />
//         <label htmlFor="name" className="absolute duration-300
//       top-3 origin-0 text-gray-500 -z-1">{this.props.text}</label>
//       </div>
//     )
//   }
// }

const FormInput = ({ r, name, label, required, type, value, placeholder }) => (
  <Label className="mb-5 w-full relative z-0">
    <label>{label}</label>
    <Input
      type={type}
      defaultValue={value}
      placeholder={placeholder}
      {...r(name, { required })}
    />
    {/* <HelperText>Password should have more than 6 characters</HelperText> */}
    {/* <label
      htmlFor="name"
      className="absolute duration-300 
    top-3 origin-0 text-gray-500 -z-1"
    >
      {label}
    </label> */}
  </Label>
)

FormInput.displayName = 'FormInput'

export default FormInput
