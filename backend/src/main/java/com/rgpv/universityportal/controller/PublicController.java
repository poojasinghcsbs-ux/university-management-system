package com.rgpv.universityportal.controller;

import com.rgpv.universityportal.dto.EnquiryRequest;
import com.rgpv.universityportal.model.Department;
import com.rgpv.universityportal.dto.NewsletterRequest;
import com.rgpv.universityportal.model.Course;
import com.rgpv.universityportal.model.Enquiry;
import com.rgpv.universityportal.model.NewsletterSubscriber;
import com.rgpv.universityportal.model.Notice;
import com.rgpv.universityportal.model.PlacementDrive;
import com.rgpv.universityportal.service.EnquiryService;
import com.rgpv.universityportal.service.DepartmentService;
import com.rgpv.universityportal.service.CourseService;
import com.rgpv.universityportal.service.NewsletterService;
import com.rgpv.universityportal.service.NoticeService;
import com.rgpv.universityportal.service.PlacementDriveService;
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
    private final DepartmentService departmentService;
    private final CourseService courseService;
    private final NewsletterService newsletterService;
    private final NoticeService noticeService;
    private final PlacementDriveService placementDriveService;

    public PublicController(
            EnquiryService enquiryService,
            DepartmentService departmentService,
            CourseService courseService,
            NewsletterService newsletterService,
            NoticeService noticeService,
            PlacementDriveService placementDriveService) {
        this.enquiryService = enquiryService;
        this.departmentService = departmentService;
        this.courseService = courseService;
        this.newsletterService = newsletterService;
        this.noticeService = noticeService;
        this.placementDriveService = placementDriveService;
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

    @GetMapping("/departments")
    public List<Department> departments() {
        return departmentService.findAll();
    }

    @GetMapping("/placements")
    public List<PlacementDrive> placements() {
        return placementDriveService.findAll();
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
