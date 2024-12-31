package com.revature.project1.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.revature.project1.entity.Reimbursement;
import com.revature.project1.entity.User;
import com.revature.project1.service.AuthenticationService;
import com.revature.project1.service.ReimbursementService;
import com.revature.project1.service.UserService;
import com.revature.project1.utility.JwtUtil;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final ReimbursementService reimbursementService;
    private final AuthenticationService authenticationService;

    @Autowired
    public UserController(UserService userService, ReimbursementService reimbursementService,
            AuthenticationService authenticationService) {
        this.userService = userService;
        this.reimbursementService = reimbursementService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register")
    private ResponseEntity<User> resgisterUser(@RequestBody User user) {
        if (!user.getUsername().isBlank() && (user.getPassword().length() >= 6) &&
                !isDuplicateAttempt(userService.getAllUsers(), user)) {
            return ResponseEntity.status(200).body(userService.registerUser(user));
        } else {
            return ResponseEntity.status(409).body(new User());
        }
    }

    public boolean isDuplicateAttempt(List<User> users, User user) {
        boolean isDuplicate = false;
        for (User theUser : users) {
            if (user.getUsername().equals(theUser.getUsername())) {
                isDuplicate = true;
                break;
            }
        }
        return isDuplicate;
    }

    @PostMapping("/login")
    private ResponseEntity<User> loginIntoAccount(@RequestBody User user) {
        int statusCode = 404;
        List<User> users = userService.getAllUsers();
        User targetUser = new User();
        if (authenticationService.isLoggedIn(user)) {
            statusCode = 200;
            for (User someUser : users) {
                if (user.getUsername().equals(someUser.getUsername())) {
                    targetUser = someUser;
                    break;
                }

            }
        } else if (users.contains(user)) {
            statusCode = 403;
        }
        return ResponseEntity.status(statusCode).body(targetUser);
    }

    @GetMapping("/allmytickets/{userId}")
    private ResponseEntity<List<Reimbursement>> getAllMyTickets(@PathVariable int userId) {
        List<User> users = userService.getAllUsers();
        List<Integer> allIds = new ArrayList<>();
        for (User eachUser : users) {
            allIds.add(eachUser.getUserId());
        }
        if (allIds.contains(userId)) {
            return ResponseEntity.ok().body(reimbursementService.getAllMyTickets(userId));
        } else {
            return ResponseEntity.status(404).body(new ArrayList<>());
        }
    }

    /*
     * @GetMapping("/allmypendingtickets")
     * private ResponseEntity<List<Reimbursement>>
     * getAllMyPendingTickets(@RequestParam int userId) {
     * List<User> users = userService.getAllUsers();
     * List<Integer> allIds = new ArrayList<>();
     * for (User eachUser : users) {
     * allIds.add(eachUser.getUserId());
     * }
     * if (allIds.contains(userId)) {
     * return
     * ResponseEntity.ok().body(reimbursementService.findByUserIdAndStatus(userId));
     * } else {
     * return ResponseEntity.status(404).body(new ArrayList<>());
     * }
     * }
     */

}
