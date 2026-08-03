package com.rgpv.universityportal.repository;

import com.rgpv.universityportal.model.Enquiry;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {
    List<Enquiry> findAllByOrderByCreatedAtDesc();
    List<Enquiry> findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrMobileContainingIgnoreCaseOrderByCreatedAtDesc(
            String fullName, String email, String mobile);
    long countByCreatedAtAfter(LocalDateTime startOfDay);
}
