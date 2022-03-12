import FormInput from '../components/Form/FormInputNew'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import userApi from '../api/userApi'
import ImageLight from '../assets/img/login-office.jpeg'
import ImageDark from '../assets/img/login-office-dark.jpeg'
import { useAppDispatch } from '../store'
import { useToasts } from 'react-toast-notifications'
import { useHistory } from 'react-router-dom'
import { Label, Input, HelperText } from '@windmill/react-ui'
import { EyeIcon } from '../icons'

function Login(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const { addToast } = useToasts()
  const dispatch = useAppDispatch()
  const history = useHistory()
  //check xem đã đăng xuất, đăng nhập hay chưa này
  const [isLogged, setIsLogged] = useState(false)
  useEffect(() => {
    setIsLogged(!!localStorage.getItem('accessToken'))
  })
  useEffect(() => {
    if (isLogged) {
      history.push('/app')
    }
  }, [isLogged])

  //show password
  const [passwordShown, setPasswordShown] = useState(false)
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true)
  }
  //click login
  const onSubmit = (data) => {
    userApi
      .login(data)
      .then((response) => {
        if (response.Msg == 'Login Success') {
          localStorage.setItem('accessToken', response.Data.access_token)
          localStorage.setItem('refreshToken', response.Data.refresh_token)
          history.push('/app')
          // window.location.reload()
        } else {
          addToast(response.Msg, {
            appearance: 'error',
            autoDismiss: true,
          })
        }
      })
      .catch((err) => alert(err))
  }

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Login
              </h1>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Label className="mb-5 w-full relative z-0">
                  <label>User Name or Email</label>
                  <Input
                    {...register('username', {
                      required: true,
                      minLength: 5,
                    })}
                    name="username"
                    label="Username"
                    placeholder="User Name or Email"
                  />
                </Label>
                <Label className="mb-5 w-full relative z-0 pass-wrapper">
                  <label>Password</label>
                  <div
                    className="rounded-md border focus:ring-purple-700 focus:border-transparent"
                    style={{ position: 'relative', display: 'flex' }}
                  >
                    <Input
                      className="focus:none"
                      style={{ border: 'none' }}
                      {...register('password', {
                        required: true,
                        minLength: 6,
                      })}
                      name="password"
                      label="Password"
                      placeholder="*******"
                      type={passwordShown ? 'text' : 'password'}
                    ></Input>
                    <EyeIcon
                      className="w-6 h-10 mr-2 ml-2"
                      aria-hidden="true"
                      onClick={togglePasswordVisiblity}
                    ></EyeIcon>
                  </div>
                  {errors.password && (
                    <HelperText style={{ color: 'red' }}>
                      Password should have more than 6 characters
                    </HelperText>
                  )}
                </Label>

                <div className="w-full mt-10 mb-5 px-10">
                  <input
                    type="submit"
                    value="Login"
                    className="bg-purple-600 rounded-md py-2 cursor-pointer
            text-white text-xl w-full"
                  />
                </div>
              </form>
              <hr className="my-8" />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Login
