package com.example.SecureNoteBook.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping(value = {
            "/",
            "/login",
            "/signup",
            "/dashboard",
            "/notes/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
