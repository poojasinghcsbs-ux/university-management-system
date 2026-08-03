package com.rgpv.universityportal.controller;

import com.rgpv.universityportal.dto.EnquiryRequest;
import com.rgpv.universityportal.dto.MessageResponse;
import com.rgpv.universityportal.dto.NewsletterRequest;
import com.rgpv.universityportal.model.Enquiry;
import com.rgpv.universityportal.model.NewsletterSubscriber;
import com.rgpv.universityportal.service.EnquiryService;
import com.rgpv.universityportal.service.NewsletterService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PublicController {

    private final EnquiryService enquiryService;
    private final NewsletterService newsletterService;

    public PublicController(EnquiryService enquiryService, NewsletterService newsletterService) {
        this.enquiryService = enquiryService;
        this.newsletterService = newsletterService;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "University Portal API");
    }

    @PostMapping("/enquiries")
    @ResponseStatus(HttpStatus.CREATED)
    public Enquiry createEnquiry(@Valid @RequestBody EnquiryRequest request) {
        return enquiryService.create(request);
    }

    @PostMapping("/newsletter")
    @ResponseStatus(HttpStatus.CREATED)
    public NewsletterSubscriber subscribe(@Valid @RequestBody NewsletterRequest request) {
        return newsletterService.subscribe(request);
    }
}
