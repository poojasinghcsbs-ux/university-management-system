package com.rgpv.universityportal.controller;

import com.rgpv.universityportal.dto.DashboardResponse;
import com.rgpv.universityportal.dto.CourseRequest;
import com.rgpv.universityportal.dto.DepartmentRequest;
import com.rgpv.universityportal.dto.NoticeRequest;
import com.rgpv.universityportal.dto.PlacementDriveRequest;
import com.rgpv.universityportal.dto.UpdateEnquiryStatusRequest;
import com.rgpv.universityportal.model.Course;
import com.rgpv.universityportal.model.Department;
import com.rgpv.universityportal.model.Enquiry;
import com.rgpv.universityportal.model.NewsletterSubscriber;
import com.rgpv.universityportal.model.Notice;
import com.rgpv.universityportal.model.PlacementDrive;
import com.rgpv.universityportal.service.EnquiryService;
import com.rgpv.universityportal.service.CourseService;
import com.rgpv.universityportal.service.DepartmentService;
import com.rgpv.universityportal.service.NewsletterService;
import com.rgpv.universityportal.service.NoticeService;
import com.rgpv.universityportal.service.PlacementDriveService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final EnquiryService enquiryService;
    private final CourseService courseService;
    private final DepartmentService departmentService;
    private final NewsletterService newsletterService;
    private final NoticeService noticeService;
    private final PlacementDriveService placementDriveService;

    public AdminController(
            EnquiryService enquiryService,
            CourseService courseService,
            DepartmentService departmentService,
            NewsletterService newsletterService,
            NoticeService noticeService,
            PlacementDriveService placementDriveService) {
        this.enquiryService = enquiryService;
        this.courseService = courseService;
        this.departmentService = departmentService;
        this.newsletterService = newsletterService;
        this.noticeService = noticeService;
        this.placementDriveService = placementDriveService;
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

    @GetMapping("/notices")
    public List<Notice> notices() {
        return noticeService.findAll();
    }

    @PostMapping("/notices")
    @ResponseStatus(HttpStatus.CREATED)
    public Notice createNotice(@Valid @RequestBody NoticeRequest request) {
        return noticeService.create(request);
    }

    @PutMapping("/notices/{id}")
    public Notice updateNotice(@PathVariable Long id, @Valid @RequestBody NoticeRequest request) {
        return noticeService.update(id, request);
    }

    @DeleteMapping("/notices/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteNotice(@PathVariable Long id) {
        noticeService.delete(id);
    }

    @GetMapping("/courses")
    public List<Course> courses() {
        return courseService.findAll();
    }

    @PostMapping("/courses")
    @ResponseStatus(HttpStatus.CREATED)
    public Course createCourse(@Valid @RequestBody CourseRequest request) {
        return courseService.create(request);
    }

    @PutMapping("/courses/{id}")
    public Course updateCourse(@PathVariable Long id, @Valid @RequestBody CourseRequest request) {
        return courseService.update(id, request);
    }

    @DeleteMapping("/courses/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCourse(@PathVariable Long id) {
        courseService.delete(id);
    }

    @GetMapping("/departments")
    public List<Department> departments() {
        return departmentService.findAll();
    }

    @PostMapping("/departments")
    @ResponseStatus(HttpStatus.CREATED)
    public Department createDepartment(@Valid @RequestBody DepartmentRequest request) {
        return departmentService.create(request);
    }

    @PutMapping("/departments/{id}")
    public Department updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentRequest request) {
        return departmentService.update(id, request);
    }

    @DeleteMapping("/departments/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDepartment(@PathVariable Long id) {
        departmentService.delete(id);
    }

    @GetMapping("/placements")
    public List<PlacementDrive> placements() {
        return placementDriveService.findAll();
    }

    @PostMapping("/placements")
    @ResponseStatus(HttpStatus.CREATED)
    public PlacementDrive createPlacement(@Valid @RequestBody PlacementDriveRequest request) {
        return placementDriveService.create(request);
    }

    @PutMapping("/placements/{id}")
    public PlacementDrive updatePlacement(
            @PathVariable Long id,
            @Valid @RequestBody PlacementDriveRequest request) {
        return placementDriveService.update(id, request);
    }

    @DeleteMapping("/placements/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePlacement(@PathVariable Long id) {
        placementDriveService.delete(id);
    }
}
