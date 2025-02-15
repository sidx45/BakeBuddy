package com.bakebuddy.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bakebuddy.domain.PayoutsStatus;
import com.bakebuddy.model.Payouts;

import java.util.List;

public interface PayoutsRepository extends JpaRepository<Payouts,Long> {

    List<Payouts> findPayoutsBySellerId(Long sellerId);
    List<Payouts> findAllByStatus(PayoutsStatus status);
}
