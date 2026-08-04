package com.rgpv.universityportal.controller;

import com.rgpv.universityportal.dto.EnquiryRequest;
import com.rgpv.universityportal.dto.NewsletterRequest;
import com.rgpv.universityportal.model.Course;
import com.rgpv.universityportal.model.Enquiry;
import com.rgpv.universityportal.model.NewsletterSubscriber;
import com.rgpv.universityportal.model.Notice;
import com.rgpv.universityportal.service.EnquiryService;
import com.rgpv.universityportal.service.CourseService;
import com.rgpv.universityportal.service.NewsletterService;
import com.rgpv.universityportal.service.NoticeService;
import jakarta.validation.Valid;
import java.util.List;
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
    private final CourseService courseService;
    private final NewsletterService newsletterService;
    private final NoticeService noticeService;

    public PublicController(
            EnquiryService enquiryService,
            CourseService courseService,
            NewsletterService newsletterService,
            NoticeService noticeService) {
        this.enquiryService = enquiryService;
        this.courseService = courseService;
        this.newsletterService = newsletterService;
        this.noticeService = noticeService;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "University Portal API");
    }

    @GetMapping("/notices")
    public List<Notice> notices() {
        return noticeService.findAll();
    }

    @GetMapping("/courses")
    public List<Course> courses() {
        return courseService.findAll();
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
