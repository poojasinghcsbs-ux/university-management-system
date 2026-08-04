package com.rgpv.universityportal.repository;

import com.rgpv.universityportal.model.Course;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findAllByOrderByNameAsc();
}
