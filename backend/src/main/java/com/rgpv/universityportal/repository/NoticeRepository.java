package com.rgpv.universityportal.repository;

import com.rgpv.universityportal.model.Notice;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findAllByOrderByNoticeDateDescCreatedAtDesc();
}
