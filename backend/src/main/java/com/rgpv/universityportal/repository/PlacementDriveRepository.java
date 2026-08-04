package com.rgpv.universityportal.repository;

import com.rgpv.universityportal.model.PlacementDrive;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlacementDriveRepository extends JpaRepository<PlacementDrive, Long> {
    List<PlacementDrive> findAllByOrderByDriveDateAscCreatedAtDesc();
}
