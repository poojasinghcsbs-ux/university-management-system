package com.rgpv.universityportal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CourseRequest(
        @NotBlank(message = "Course name is required")
        @Size(max = 120, message = "Course name must be at most 120 characters")
        String name,
        @NotBlank(message = "Department is required")
        @Size(max = 120, message = "Department must be at most 120 characters")
        String department,
        @NotBlank(message = "Duration is required")
        @Size(max = 50, message = "Duration must be at most 50 characters")
        String duration,
        @NotBlank(message = "Course type is required")
        @Size(max = 60, message = "Course type must be at most 60 characters")
        String courseType,
        @NotBlank(message = "Course description is required")
        @Size(max = 2000, message = "Course description must be at most 2000 characters")
        String description) {
}
