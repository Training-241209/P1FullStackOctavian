package com.revature.project1.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.revature.project1.entity.User;
import com.revature.project1.service.AuthenticationService;
import com.revature.project1.service.UserService;
import com.revature.project1.utility.JwtUtil;

import jakarta.servlet.http.HttpSession;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/auth")
public class AuthorizationController {

    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final AuthenticationService authenticationService;

    @Autowired
    public AuthorizationController(JwtUtil jwtUtil, UserService userService,
            AuthenticationService authenticationService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    private ResponseEntity<User> loginIntoAccount(@RequestBody User user, HttpSession session) {
        int statusCode = 404;
        String theToken = "";
        List<User> users = userService.getAllUsers();
        User targetUser = new User();
        if (authenticationService.isLoggedIn(user)) {
            for (User someUser : users) {
                if (user.getUsername().equals(someUser.getUsername())) {
                    targetUser = someUser;
                    if (someUser.getRoleId() == 1) {
                        statusCode = 200;
                        theToken = jwtUtil.generateToken(targetUser.getUsername());
                        break;
                    } else {
                        statusCode = 401;
                    }
                }

            }
        } else if (users.contains(user)) {
            statusCode = 403;
        }
        HttpHeaders headers = new HttpHeaders();
        headers.add("token", theToken);
        session.setAttribute("token", theToken);
        session.setAttribute("username", targetUser.getUsername());
        return new ResponseEntity<>(targetUser, headers, statusCode);
    }
}
