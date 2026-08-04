package com.rgpv.universityportal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DepartmentRequest(
        @NotBlank(message = "Department name is required")
        @Size(max = 140, message = "Department name must be at most 140 characters")
        String name,
        @NotBlank(message = "Department code is required")
        @Size(max = 30, message = "Department code must be at most 30 characters")
        String departmentCode,
        @NotBlank(message = "Head of department name is required")
        @Size(max = 120, message = "Head of department name must be at most 120 characters")
        String hodName,
        @NotBlank(message = "Department description is required")
        @Size(max = 2000, message = "Department description must be at most 2000 characters")
        String description) {
}
