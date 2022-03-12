import React from 'react'
import { useSelector } from 'react-redux'
import {  inforUserSelector } from '../slices/infouser'
import { useAppDispatch } from '../store'
import {
  Box,
  Container,
  Grid,
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  TextField,
  CardHeader,
} from '@material-ui/core'
import FormInput from '../components/Form/FormInput'
import { useForm } from 'react-hook-form'
import { usersSelector, updateUser } from '../slices/users'

export default function Profile() {
      const dispatch = useAppDispatch()
      const { inforUser, success } = useSelector(inforUserSelector)
     
        const { register, handleSubmit } = useForm()
     const onSubmit = (data) => {
        dispatch(updateUser({ id: inforUser.User_Id, data }))
     }
    return (
      <div>
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            py: 3,
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              <Grid item lg={12} md={12} xs={12}>
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Avatar
                        sx={{
                          height: 100,
                          width: 100,
                        }}
                      >
                        A
                      </Avatar>
                      <Typography color="textPrimary" gutterBottom variant="h3">
                        {inforUser.User_Full_Name}
                      </Typography>
                      <Typography color="textSecondary" variant="body1">
                        Việt Nam
                      </Typography>
                    </Box>
                  </CardContent>
                  <Divider />
                  {/* <CardActions>
                    <Button color="primary" fullWidth variant="text">
                      Upload picture
                    </Button>
                  </CardActions> */}
                </Card>
              </Grid>
              <Grid item lg={12} md={12} xs={12}>
                <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                  <Card>
                    <CardHeader
                      subheader="The information can be edited"
                      title="Profile"
                    />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item md={12} xs={12}>
                          <FormInput
                            r={register}
                            fullWidth
                            label="Full name"
                            name="User_Full_Name"
                            required
                            value={inforUser.User_Full_Name}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <FormInput
                            r={register}
                            fullWidth
                            label="User name"
                            name="lastName"
                            // onChange={handleChange}
                            // required
                            value={inforUser.User_Name}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <FormInput
                            r={register}
                            fullWidth
                            label="Email Address"
                            name="email"
                            // onChange={handleChange}
                            // required
                            value={inforUser.User_Email}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <FormInput
                            r={register}
                            fullWidth
                            label="Phone Number"
                            name="phone"
                            // onChange={handleChange}
                            // type="number"
                            value={'0852578535'}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <FormInput
                            r={register}
                            fullWidth
                            label="Country"
                            name="country"
                            // onChange={handleChange}
                            // required
                            value={'Viet Nam'}
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                    <Divider />
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        p: 2,
                      }}
                    >
                      <div className=" mt-10 mb-5 px-10">
                        <input
                          type="submit"
                          value="Update User"
                          className="bg-green-600 rounded-md py-2 
            text-white text-xl "
                        />
                      </div>
                    </Box>
                  </Card>
                </form>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </div>
    )
}
