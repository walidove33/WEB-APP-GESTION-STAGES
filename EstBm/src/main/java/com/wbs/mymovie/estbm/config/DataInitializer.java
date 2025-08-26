//package com.wbs.mymovie.estbm.config;
//
//import com.wbs.mymovie.estbm.dto.RegisterRequest;
//import com.wbs.mymovie.estbm.service.AdminService;
//import com.wbs.mymovie.estbm.service.UtilisateurService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//@Component
//@RequiredArgsConstructor
//public class DataInitializer implements CommandLineRunner {
//
//    private final AdminService adminService;
//    private final UtilisateurService utilisateurService;
//
//    @Override
//    public void run(String... args) throws Exception {
//        // Create 2 admin accounts
////        for (int i = 1; i <= 2; i++) {
////            RegisterRequest adminReq = new RegisterRequest();
////            adminReq.setEmail("admin" + i + "@example.com");
////            adminReq.setPassword("AdminPass" + i + "!");
////            adminReq.setNom("AdminNom" + i);
////            adminReq.setPrenom("AdminPrenom" + i);
////            adminReq.setTelephone("06000000" + i);
////            adminService.creerCompteAdmin(adminReq);
////        }
//
//        // Create 10 encadrant accounts
//        for (int i = 1; i <= 10; i++) {
//            RegisterRequest encReq = new RegisterRequest();
//            encReq.setEmail("encadrant" + i + "@example.com");
//            encReq.setPassword("EncPass" + i + "#");
//            encReq.setNom("EncNom" + i);
//            encReq.setPrenom("EncPrenom" + i);
//            encReq.setTelephone("06100000" + i);
//            encReq.setSpecialite("Specialite" + ((i % 5) + 1));
//            adminService.creerCompteEncadrant(encReq);
//        }
//
//        System.out.println("Initialized default admin and encadrant accounts.");
//    }
//}
