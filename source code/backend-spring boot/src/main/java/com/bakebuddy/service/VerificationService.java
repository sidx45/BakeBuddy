package com.bakebuddy.service;

import com.bakebuddy.model.VerificationCode;

public interface VerificationService {

    VerificationCode createVerificationCode(String otp, String email);
}
