package com.rgpv.universityportal.service;

import com.rgpv.universityportal.dto.PlacementDriveRequest;
import com.rgpv.universityportal.model.PlacementDrive;
import com.rgpv.universityportal.repository.PlacementDriveRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PlacementDriveService {

    private final PlacementDriveRepository placementDriveRepository;

    public PlacementDriveService(PlacementDriveRepository placementDriveRepository) {
        this.placementDriveRepository = placementDriveRepository;
    }

    public List<PlacementDrive> findAll() {
        return placementDriveRepository.findAllByOrderByDriveDateAscCreatedAtDesc();
    }

    public PlacementDrive create(PlacementDriveRequest request) {
        PlacementDrive drive = new PlacementDrive();
        applyRequest(drive, request);
        drive.setCreatedAt(LocalDateTime.now());
        return placementDriveRepository.save(drive);
    }

    public PlacementDrive update(Long id, PlacementDriveRequest request) {
        PlacementDrive drive = findById(id);
        applyRequest(drive, request);
        return placementDriveRepository.save(drive);
    }

    public void delete(Long id) {
        placementDriveRepository.delete(findById(id));
    }

    private PlacementDrive findById(Long id) {
        return placementDriveRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Placement drive not found"));
    }

    private void applyRequest(PlacementDrive drive, PlacementDriveRequest request) {
        drive.setCompanyName(request.companyName().trim());
        drive.setJobRole(request.jobRole().trim());
        drive.setPackageOffered(request.packageOffered().trim());
        drive.setEligibility(request.eligibility().trim());
        drive.setDescription(request.description().trim());
        drive.setDriveDate(request.driveDate());
    }
}
