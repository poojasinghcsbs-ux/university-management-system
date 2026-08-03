package com.rgpv.universityportal.repository;

import com.rgpv.universityportal.model.NewsletterSubscriber;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsletterSubscriberRepository extends JpaRepository<NewsletterSubscriber, Long> {
    Optional<NewsletterSubscriber> findByEmailIgnoreCase(String email);
    List<NewsletterSubscriber> findAllByOrderBySubscribedAtDesc();
}
