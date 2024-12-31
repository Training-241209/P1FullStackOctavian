package com.revature.project1.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.revature.project1.entity.User;
import com.revature.project1.repository.UserRepository;


@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User user) {
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        List<User> users = new ArrayList<>();
        if (userRepository.findAll() != null) {
            users = userRepository.findAll();
        }

        return users;
    }

    public String encodePassword(String str){
        return passwordEncoder.encode(str);
    }

    public User findUSerByUsername(String str){
        return userRepository.findUserByUsername(str).get();
    }

    public User findById(Integer id){
        return userRepository.findById((long) id).get();
    }

    public void deleteUser(User user){
         userRepository.delete(user);
    }
}
