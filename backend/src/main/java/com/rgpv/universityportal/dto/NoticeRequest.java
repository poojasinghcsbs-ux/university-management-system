package com.rgpv.universityportal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record NoticeRequest(
        @NotBlank(message = "Notice title is required")
        @Size(max = 180, message = "Notice title must be at most 180 characters")
        String title,
        @NotBlank(message = "Notice category is required")
        @Size(max = 60, message = "Notice category must be at most 60 characters")
        String category,
        @NotBlank(message = "Notice description is required")
        @Size(max = 2000, message = "Notice description must be at most 2000 characters")
        String description,
        @NotNull(message = "Notice date is required")
        LocalDate noticeDate) {
}
