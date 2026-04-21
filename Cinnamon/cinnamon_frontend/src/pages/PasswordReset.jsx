import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/PasswordReset.css'; 

const PasswordReset = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState(localStorage.getItem('resetEmail') || '');
    const [step, setStep] = useState(Number(localStorage.getItem('resetStep')) || 1);
    const [otp, setOtp] = useState(localStorage.getItem('tempOTP') || '');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedEmail = localStorage.getItem('resetEmail');
        
        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            window.alert("No email found. Please start the password reset process from the login page.");
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        localStorage.setItem('resetStep', step);
        localStorage.setItem('tempOTP', otp);
    }, [step, otp]);

    const handleSendOTP = async () => {
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || "OTP sent failed. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!newPassword || !otp) {
            setError("Please enter the OTP code and your new password.");
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
                email,
                otp,
                newPassword
            });

            if (response.data.success) {
                localStorage.removeItem('resetStep');
                localStorage.removeItem('tempOTP');
                localStorage.removeItem('resetEmail'); 
                
                alert("Password updated successfully! Please log in again.");
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || "Password update failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-page-wrapper">
            <div className="reset-card glass">
                <div className="reset-header">
                    <h2>Change Password</h2>
                    <p>Security verification for <span className="highlight-email">{email}</span></p>
                </div>

                {error && <div className="error-alert">⚠️ {error}</div>}

                <div className="reset-body">
                    {step === 1 ? (
                        <div className="step-content animate-fade">
                            <p className="instruction-text">
                                To change your password, an OTP code will be sent to your email.
                            </p>
                            <button onClick={handleSendOTP} disabled={loading} className="main-btn">
                                {loading ? <span className="loader"></span> : "Send OTP to Email"}
                            </button>
                        </div>
                    ) : (
                        <div className="step-content animate-fade">
                            <div className="input-field">
                                <label>OTP Code</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter 6-digit code" 
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                            
                            <div className="input-field">
                                <label>New Password</label>
                                <input 
                                    type="password" 
                                    placeholder="Enter new password" 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>

                            <button onClick={handleUpdatePassword} disabled={loading} className="main-btn success">
                                {loading ? <span className="loader"></span> : "Update Password"}
                            </button>
                            
                            <button onClick={() => setStep(1)} className="back-link">
                                Reset process and resend OTP
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PasswordReset;