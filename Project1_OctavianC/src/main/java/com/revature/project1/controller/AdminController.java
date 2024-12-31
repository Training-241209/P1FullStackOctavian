package com.revature.project1.controller;

import java.util.ArrayList;
import java.util.List;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.revature.project1.entity.Reimbursement;
import com.revature.project1.entity.User;
import com.revature.project1.service.AuthenticationService;
import com.revature.project1.service.ReimbursementService;
import com.revature.project1.service.UserService;
import com.revature.project1.utility.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final ReimbursementService reimbursementService;
    private final AuthenticationService authenticationService;
    private final JwtUtil jwtUtil;

    @Autowired
    public AdminController(UserService userService, ReimbursementService reimbursementService,
            AuthenticationService authenticationService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.reimbursementService = reimbursementService;
        this.authenticationService = authenticationService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/allusers")
    private ResponseEntity<List<User>> getAllUsers(HttpSession session /*,
    @RequestBody String theUsername*/) {
        //String authUsername = (String) session.getAttribute("username");
        List<User> allUsers = userService.getAllUsers();
        if (allUsers.size() > 0 /*&& authUsername.equals(theUsername*/) {
            return ResponseEntity.ok().body(allUsers);
        } else /*if (authUsername.equals(theUsername))*/{
            return ResponseEntity.ok().body(new ArrayList<>());
        } /*else{
            return ResponseEntity.status(401).body(new ArrayList<>());
        }*/
    }

    @GetMapping("/allpending")
    private ResponseEntity<List<Reimbursement>> allPendingTickets(HttpSession session,
            @Requestbody String theUsername) {
        String authUsername = (String) session.getAttribute("username");
        if (authUsername.equals(theUsername)) {
            return ResponseEntity.ok().body(reimbursementService.findPendingTickets("PENDING"));
        } else {
            return ResponseEntity.status(401).body(new ArrayList<>());
        }
    }

    @PutMapping("/denyticket/{id}")
    private ResponseEntity<Reimbursement> denyTicket(@PathVariable int id, HttpSession session,
    @RequestBody String theUsername) {
        String authUsername = (String) session.getAttribute("username");
        if(authUsername.equals(theUsername)){
        return ResponseEntity.ok().body(reimbursementService.updateStatusDenied((long) id));
    } else {
       return  ResponseEntity.status(401).body(new Reimbursement());
    }

    }

    @PutMapping("/acceptticket/{id}")
    private ResponseEntity<Reimbursement> approveTicket(@PathVariable int id, HttpSession session,
    @RequestBody String theUsername) {
        String authUsername = (String) session.getAttribute("username");
        if(authUsername.equals(theUsername)){
        return ResponseEntity.ok().body(reimbursementService.updateStatusApproved((long) id));
        } else {
            return  ResponseEntity.status(401).body(new Reimbursement());
        }

    }

    @PostMapping("/login")
    private ResponseEntity<User> loginIntoAccount(@RequestBody User user) {
        int statusCode = 404;
        String theToken = "";
        List<User> users = userService.getAllUsers();
        User targetUser = new User();
        if (authenticationService.isLoggedIn(user)) {
            statusCode = 200;
            for (User someUser : users) {
                if (user.getUsername().equals(someUser.getUsername())) {
                    targetUser = someUser;
                    if (someUser.getRoleId() == 1) {
                        theToken = jwtUtil.generateToken(targetUser.getUsername());
                        break;
                    }
                }

            }
        } else if (users.contains(user)) {
            statusCode = 403;
        }
        HttpHeaders headers = new HttpHeaders();
        headers.add("token", theToken);
        return new ResponseEntity<>(targetUser, headers, statusCode);
    }

    @DeleteMapping("/deleteuser/{id}")
    private ResponseEntity<User> deleteUser(@PathVariable Integer id) {
        try {
            User user = new User();
            user = userService.findById(id);
            userService.deleteUser(user);
            return ResponseEntity.ok().body(user);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(new User());
        }

    }

}
