package com.rgpv.universityportal.service;

import com.rgpv.universityportal.dto.NewsletterRequest;
import com.rgpv.universityportal.model.NewsletterSubscriber;
import com.rgpv.universityportal.repository.NewsletterSubscriberRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class NewsletterService {

    private final NewsletterSubscriberRepository subscriberRepository;

    public NewsletterService(NewsletterSubscriberRepository subscriberRepository) {
        this.subscriberRepository = subscriberRepository;
    }

    public NewsletterSubscriber subscribe(NewsletterRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        if (subscriberRepository.findByEmailIgnoreCase(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This email is already subscribed");
        }
        NewsletterSubscriber subscriber = new NewsletterSubscriber();
        subscriber.setEmail(email);
        subscriber.setSubscribedAt(LocalDateTime.now());
        return subscriberRepository.save(subscriber);
    }

    public List<NewsletterSubscriber> findAll() {
        return subscriberRepository.findAllByOrderBySubscribedAtDesc();
    }

    public void delete(Long id) {
        if (!subscriberRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Subscriber not found");
        }
        subscriberRepository.deleteById(id);
    }
}
