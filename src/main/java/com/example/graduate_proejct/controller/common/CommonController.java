package com.example.graduate_proejct.controller.common;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CommonController {

    @GetMapping("/signin")
    public String login() {
        return "views/login";
    }

    @GetMapping("/register")
    public String register() {
        return "views/register";
    }
}
