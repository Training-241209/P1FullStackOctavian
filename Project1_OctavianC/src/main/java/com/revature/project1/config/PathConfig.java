package com.revature.project1.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.revature.project1.utility.JwtInterceptor;

@Configuration
public class PathConfig implements WebMvcConfigurer {

    private JwtInterceptor jwtInterceptor;

    @Autowired
    public PathConfig (JwtInterceptor jwtInterceptor){
        this.jwtInterceptor = jwtInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(jwtInterceptor)
                .addPathPatterns("/admin/**"); 
    }
}

