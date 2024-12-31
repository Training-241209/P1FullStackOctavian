package com.revature.project1.repository;

import java.util.List;

import org.hibernate.annotations.Parameter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.revature.project1.entity.Reimbursement;

@Repository
public interface ReimbursementRepository extends JpaRepository<Reimbursement, Long> {
    List<Reimbursement> findByStatus(String status);

    List<Reimbursement> findByUserId(Integer id);

    //@Query("SELECT r FROM reimbursement r WHERE r.userId=:userId AND r.Status='PENDING")
    //List<Reimbursement> findByUserIdAndStatus(@Param("userId") int UserId);

}
