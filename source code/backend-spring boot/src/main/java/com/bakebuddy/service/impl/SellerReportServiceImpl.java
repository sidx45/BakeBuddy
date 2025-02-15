package com.bakebuddy.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.bakebuddy.model.Seller;
import com.bakebuddy.model.SellerReport;
import com.bakebuddy.repository.SellerReportRepository;
import com.bakebuddy.service.SellerReportService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SellerReportServiceImpl implements SellerReportService {

    private final SellerReportRepository sellerReportRepository;


    @Override
    public SellerReport getSellerReport(Seller seller) {
        SellerReport report = sellerReportRepository.findBySellerId(seller.getId());
        if(report == null){
            SellerReport newReport = new SellerReport();
            newReport.setSeller(seller);
            return sellerReportRepository.save(newReport);
        }
        return report;
    }


    @Override
    public SellerReport updateSellerReport(SellerReport sellerReport) {

        return sellerReportRepository.save(sellerReport);
    }

}
