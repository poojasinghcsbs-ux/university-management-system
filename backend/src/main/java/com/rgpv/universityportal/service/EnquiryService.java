package com.rgpv.universityportal.service;

import com.rgpv.universityportal.dto.DashboardResponse;
import com.rgpv.universityportal.dto.EnquiryRequest;
import com.rgpv.universityportal.model.Enquiry;
import com.rgpv.universityportal.model.EnquiryStatus;
import com.rgpv.universityportal.repository.EnquiryRepository;
import com.rgpv.universityportal.repository.NewsletterSubscriberRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EnquiryService {

    private final EnquiryRepository enquiryRepository;
    private final NewsletterSubscriberRepository subscriberRepository;

    public EnquiryService(
            EnquiryRepository enquiryRepository,
            NewsletterSubscriberRepository subscriberRepository) {
        this.enquiryRepository = enquiryRepository;
        this.subscriberRepository = subscriberRepository;
    }

    public Enquiry create(EnquiryRequest request) {
        Enquiry enquiry = new Enquiry();
        enquiry.setFullName(request.fullName().trim());
        enquiry.setEmail(request.email().trim().toLowerCase(Locale.ROOT));
        enquiry.setMobile(request.mobile().trim());
        enquiry.setEnquiryType(request.enquiryType().trim());
        enquiry.setMessage(request.message().trim());
        enquiry.setStatus(EnquiryStatus.NEW);
        enquiry.setCreatedAt(LocalDateTime.now());
        return enquiryRepository.save(enquiry);
    }

    public List<Enquiry> findAll(String search) {
        if (search == null || search.isBlank()) {
            return enquiryRepository.findAllByOrderByCreatedAtDesc();
        }
        String value = search.trim();
        return enquiryRepository
                .findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrMobileContainingIgnoreCaseOrderByCreatedAtDesc(
                        value, value, value);
    }

    public Enquiry updateStatus(Long id, EnquiryStatus status) {
        Enquiry enquiry = findById(id);
        enquiry.setStatus(status);
        return enquiryRepository.save(enquiry);
    }

    public void delete(Long id) {
        enquiryRepository.delete(findById(id));
    }

    public DashboardResponse dashboard() {
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        return new DashboardResponse(
                enquiryRepository.count(),
                subscriberRepository.count(),
                enquiryRepository.countByCreatedAtAfter(startOfToday));
    }

    private Enquiry findById(Long id) {
        return enquiryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enquiry not found"));
    }
}
