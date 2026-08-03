package com.rgpv.universityportal.controller;

import com.rgpv.universityportal.dto.DashboardResponse;
import com.rgpv.universityportal.dto.EnquiryRequest;
import com.rgpv.universityportal.dto.MessageResponse;
import com.rgpv.universityportal.dto.UpdateEnquiryStatusRequest;
import com.rgpv.universityportal.model.Enquiry;
import com.rgpv.universityportal.model.NewsletterSubscriber;
import com.rgpv.universityportal.service.EnquiryService;
import com.rgpv.universityportal.service.NewsletterService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final EnquiryService enquiryService;
    private final NewsletterService newsletterService;

    public AdminController(EnquiryService enquiryService, NewsletterService newsletterService) {
        this.enquiryService = enquiryService;
        this.newsletterService = newsletterService;
    }

    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {
        return enquiryService.dashboard();
    }

    @GetMapping("/enquiries")
    public List<Enquiry> enquiries(@RequestParam(required = false) String search) {
        return enquiryService.findAll(search);
    }

    @PatchMapping("/enquiries/{id}/status")
    public Enquiry updateEnquiryStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEnquiryStatusRequest request) {
        return enquiryService.updateStatus(id, request.status());
    }

    @DeleteMapping("/enquiries/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEnquiry(@PathVariable Long id) {
        enquiryService.delete(id);
    }

    @GetMapping("/subscribers")
    public List<NewsletterSubscriber> subscribers() {
        return newsletterService.findAll();
    }

    @DeleteMapping("/subscribers/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSubscriber(@PathVariable Long id) {
        newsletterService.delete(id);
    }
}
