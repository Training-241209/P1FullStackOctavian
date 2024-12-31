package com.revature.project1.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.revature.project1.entity.Reimbursement;
import com.revature.project1.exception.ResourceNotFoundException;
import com.revature.project1.repository.ReimbursementRepository;

@Service
public class ReimbursementService {
    private final ReimbursementRepository reimbursementRepository;

    @Autowired
    public ReimbursementService(ReimbursementRepository reimbursementRepository) {
        this.reimbursementRepository = reimbursementRepository;
    }

    public Reimbursement saveReimbursement(Reimbursement reimbursement) {
        return reimbursementRepository.save(reimbursement);
    }

    public List<Reimbursement> findPendingTickets(String str) {
        List<Reimbursement> allPendingTickets = new ArrayList<>();
        if (reimbursementRepository.findByStatus(str).size() > 0) {
            allPendingTickets = reimbursementRepository.findByStatus(str);
        }
        return allPendingTickets;
    }

    public Reimbursement updateStatusApproved(Long id) {
        Reimbursement reimbursement = new Reimbursement();
        try {
            reimbursement = reimbursementRepository.findById(id).get();
            reimbursement.setStatus("APPROVED");
            return reimbursementRepository.save(reimbursement);
        } catch (Exception e) {
            return new Reimbursement();
        }
    }

    public Reimbursement updateStatusDenied(Long id) {
        Reimbursement reimbursement = new Reimbursement();
        try {
            reimbursement = reimbursementRepository.findById(id).get();
            reimbursement.setStatus("DENIED");
            return reimbursementRepository.save(reimbursement);
        } catch (Exception e) {
            return new Reimbursement();
        }
    }

    public List<Reimbursement> getAllMyTickets(Integer userId) {
        return reimbursementRepository.findByUserId(userId);
    }

    // public List<Reimbursement> findByUserIdAndStatus(Integer userId){
    // return reimbursementRepository.findByUserIdAndStatus(userId);
    // }
}
