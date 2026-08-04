package com.rgpv.universityportal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record PlacementDriveRequest(
        @NotBlank(message = "Company name is required")
        @Size(max = 120, message = "Company name must be at most 120 characters")
        String companyName,
        @NotBlank(message = "Job role is required")
        @Size(max = 120, message = "Job role must be at most 120 characters")
        String jobRole,
        @NotBlank(message = "Package information is required")
        @Size(max = 80, message = "Package information must be at most 80 characters")
        String packageOffered,
        @NotBlank(message = "Eligibility is required")
        @Size(max = 400, message = "Eligibility must be at most 400 characters")
        String eligibility,
        @NotBlank(message = "Drive description is required")
        @Size(max = 2000, message = "Drive description must be at most 2000 characters")
        String description,
        @NotNull(message = "Drive date is required")
        LocalDate driveDate) {
}
