import { Alert, Button, CircularProgress, Snackbar, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import OTPInput from '../../components/OtpFild/OTPInput';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { sendLoginSignupOtp, signin } from '../../../Redux Toolkit/Customer/AuthSlice';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [timer, setTimer] = useState(30);
    const [isTimerActive, setIsTimerActive] = useState(false);

    const dispatch = useAppDispatch();
    const auth = useAppSelector(store => store.auth);

    const formik = useFormik({
        initialValues: {
            email: '',
            otp: ''
        },
        onSubmit: (values) => {
            dispatch(signin({ email: values.email, otp, navigate }));
            console.log('Form data:', values);
        }
    });

    const handleOtpChange = (otp) => {
        setOtp(otp);
    };

    const handleResendOTP = () => {
        dispatch(sendLoginSignupOtp({ email: "signing_" + formik.values.email }));
        console.log('Resend OTP');
        setTimer(30);
        setIsTimerActive(true);
    };

    const handleSentOtp = () => {
        setIsOtpSent(true);
        handleResendOTP();
    };

    const handleLogin = () => {
        formik.handleSubmit();
    };

    useEffect(() => {
        let interval;

        if (isTimerActive) {
            interval = setInterval(() => {
                setTimer(prev => {
                    if (prev === 1) {
                        clearInterval(interval);
                        setIsTimerActive(false);
                        return 30;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTimerActive]);

    return (
        <div>
            <h1 className='text-center font-bold text-xl text-primary-color pb-8'>Login</h1>
            <form className="space-y-5">
                <TextField
                    fullWidth
                    name="email"
                    label="Enter Your Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email ? formik.errors.email : undefined}
                />

                {auth.otpSent && (
                    <div className="space-y-2">
                        <p className="font-medium text-sm">
                            * Enter OTP sent to your Email
                        </p>
                        <OTPInput
                            length={6}
                            onChange={handleOtpChange}
                            error={false}
                        />
                        <p className="text-xs space-x-2">
                            {isTimerActive ? (
                                <span>Resend OTP in {timer} seconds</span>
                            ) : (
                                <>
                                    Didn’t receive OTP?{" "}
                                    <span
                                        onClick={handleResendOTP}
                                        className="text-teal-600 cursor-pointer hover:text-teal-800 font-semibold"
                                    >
                                        Resend OTP
                                    </span>
                                </>
                            )}
                        </p>
                        {formik.touched.otp && formik.errors.otp && <p>{formik.errors.otp}</p>}
                    </div>
                )}

                {auth.otpSent && (
                    <div>
                        <Button 
                            disabled={auth.loading} 
                            onClick={handleLogin}
                            fullWidth 
                            variant='contained' 
                            sx={{ py: "11px" }}
                        >
                            {auth.loading ? <CircularProgress size={24} /> : "Login"}
                        </Button>
                    </div>
                )}

                {!auth.otpSent && (
                    <Button
                        disabled={auth.loading}
                        fullWidth
                        variant='contained'
                        onClick={handleSentOtp}
                        sx={{ py: "11px" }}
                    >
                        {auth.loading ? <CircularProgress size={24} /> : "Send OTP"}
                    </Button>
                )}
            </form>
        </div>
    );
};

export default LoginForm;
