package com.revature.project1.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.revature.project1.entity.Reimbursement;
import com.revature.project1.entity.User;
import com.revature.project1.service.ReimbursementService;
import com.revature.project1.service.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/reimbursement")
public class ReimbursementController {

    private final UserService userService;
    private final ReimbursementService reimbursementService;

    @Autowired
    private ReimbursementController(UserService userService, ReimbursementService reimbursementService) {
        this.userService = userService;
        this.reimbursementService = reimbursementService;
    }

    @PostMapping("/addticket")
    private ResponseEntity<Reimbursement> postRequest(@RequestBody Reimbursement reimbursement) {
        List<User> users = new ArrayList<>();
        users = userService.getAllUsers();
        List<Integer> idList = new ArrayList<>();
        for (User oneUser : users) {
            idList.add(oneUser.getUserId());
        }
        if (!reimbursement.getDescription().isBlank() &&
                reimbursement.getDescription().length() <= 255 &&
                idList.contains(reimbursement.getUserId())) {
                    if(reimbursement.getStatus() == null){
                        reimbursement.setStatus("PENDING");
                    }
                    return ResponseEntity.ok().body(reimbursementService.saveReimbursement(reimbursement));
        } else {
            return ResponseEntity.status(400).build();
        }
    }
}
