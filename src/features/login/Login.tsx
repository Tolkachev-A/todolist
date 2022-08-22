import React from 'react'
import {Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField} from '@material-ui/core'
import {useFormik} from 'formik';
import {loginTC} from './auth-reducer';
import {useAppDispatch, useAppSelector} from '../../common/hooks/useDispatchAndSelector';
import {Navigate} from 'react-router-dom';


export const Login = () => {
    const dispatch = useAppDispatch()
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        }, validate: (values) => {
            const errors: FormikErrorType = {}
            if (!values.email) {
                errors.email = 'Required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }
            if (!values.password) {
                errors.password = 'Required'
            } else if (values.password.length < 3) {
                errors.password = 'password min 3 liter'
            }
            return errors
        },

        onSubmit: values => {
            dispatch(loginTC(values))
            formik.resetForm()
        },
    })

    if (isLoggedIn) {
        return <Navigate to={'/'}/>
    }

    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}> here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField label="Email"
                                   margin="normal"
                                   id="email"
                                   {...formik.getFieldProps('email')}
                        />
                        {formik.touched.email && formik.errors.email &&
                            <div style={{color: 'red'}}>{formik.errors.email}</div>}
                        <TextField type="password"
                                   label="Password"
                                   margin="normal"
                                   id="password"
                                   {...formik.getFieldProps('password')}
                        />
                        {formik.touched.password && formik.errors.password &&
                            <div style={{color: 'red'}}>{formik.errors.password}</div>}
                        <FormControlLabel label={'Remember me'}
                                          control={<Checkbox/>}
                                          id="rememberMe"
                                          {...formik.getFieldProps('rememberMe')}
                        />
                        <Button type={'submit'}
                                variant={'contained'}
                                color={'primary'}
                        >
                            Login
                        </Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}

//type
type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}