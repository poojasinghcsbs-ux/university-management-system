package com.rgpv.universityportal.service;

import com.rgpv.universityportal.dto.NoticeRequest;
import com.rgpv.universityportal.model.Notice;
import com.rgpv.universityportal.repository.NoticeRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    public List<Notice> findAll() {
        return noticeRepository.findAllByOrderByNoticeDateDescCreatedAtDesc();
    }

    public Notice create(NoticeRequest request) {
        Notice notice = new Notice();
        applyRequest(notice, request);
        notice.setCreatedAt(LocalDateTime.now());
        return noticeRepository.save(notice);
    }

    public Notice update(Long id, NoticeRequest request) {
        Notice notice = findById(id);
        applyRequest(notice, request);
        return noticeRepository.save(notice);
    }

    public void delete(Long id) {
        noticeRepository.delete(findById(id));
    }

    private Notice findById(Long id) {
        return noticeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notice not found"));
    }

    private void applyRequest(Notice notice, NoticeRequest request) {
        notice.setTitle(request.title().trim());
        notice.setCategory(request.category().trim().toUpperCase());
        notice.setDescription(request.description().trim());
        notice.setNoticeDate(request.noticeDate());
    }
}
