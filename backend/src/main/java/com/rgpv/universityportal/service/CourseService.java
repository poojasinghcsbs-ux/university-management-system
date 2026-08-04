package com.rgpv.universityportal.service;

import com.rgpv.universityportal.dto.CourseRequest;
import com.rgpv.universityportal.model.Course;
import com.rgpv.universityportal.repository.CourseRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<Course> findAll() {
        return courseRepository.findAllByOrderByNameAsc();
    }

    public Course create(CourseRequest request) {
        Course course = new Course();
        applyRequest(course, request);
        course.setCreatedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    public Course update(Long id, CourseRequest request) {
        Course course = findById(id);
        applyRequest(course, request);
        return courseRepository.save(course);
    }

    public void delete(Long id) {
        courseRepository.delete(findById(id));
    }

    private Course findById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
    }

    private void applyRequest(Course course, CourseRequest request) {
        course.setName(request.name().trim());
        course.setDepartment(request.department().trim());
        course.setDuration(request.duration().trim());
        course.setCourseType(request.courseType().trim().toUpperCase());
        course.setDescription(request.description().trim());
    }
}
