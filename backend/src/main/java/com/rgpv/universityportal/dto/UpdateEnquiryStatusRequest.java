package com.rgpv.universityportal.dto;

import com.rgpv.universityportal.model.EnquiryStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateEnquiryStatusRequest(@NotNull(message = "Status is required") EnquiryStatus status) {
}
