package com.revature.project1.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.revature.project1.entity.User;
import com.revature.project1.repository.UserRepository;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserService userService;

    @Autowired
    public AuthenticationService(UserRepository userRepository, 
    BCryptPasswordEncoder passwordEncoder, UserService userService){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }
    public boolean isLoggedIn(User user) {
        boolean isLoggedIn = false;
        List<User> users = userService.getAllUsers();
        for(User myUser : users){
            if(user.getUsername().equals(myUser.getUsername())){
                if(passwordEncoder.matches(user.getPassword(), myUser.getPassword())){
                    isLoggedIn = true;
                }
            }
        }
        return isLoggedIn;
    }

}
