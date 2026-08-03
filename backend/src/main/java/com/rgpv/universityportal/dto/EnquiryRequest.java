package com.rgpv.universityportal.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EnquiryRequest(
        @NotBlank(message = "Full name is required")
        @Size(max = 100, message = "Full name must be at most 100 characters")
        String fullName,
        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email address")
        @Size(max = 120)
        String email,
        @NotBlank(message = "Mobile number is required")
        @Pattern(regexp = "^[0-9+() -]{7,20}$", message = "Enter a valid mobile number")
        String mobile,
        @NotBlank(message = "Enquiry type is required")
        @Size(max = 80)
        String enquiryType,
        @NotBlank(message = "Message is required")
        @Size(max = 2000)
        String message) {
}
