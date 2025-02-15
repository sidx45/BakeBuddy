package com.bakebuddy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bakebuddy.exception.ProductException;
import com.bakebuddy.exception.ReviewNotFoundException;
import com.bakebuddy.exception.UserException;
import com.bakebuddy.model.Product;
import com.bakebuddy.model.Review;
import com.bakebuddy.model.User;
import com.bakebuddy.request.CreateReviewRequest;
import com.bakebuddy.response.ApiResponse;
import com.bakebuddy.service.ProductService;
import com.bakebuddy.service.ReviewService;
import com.bakebuddy.service.UserService;

import javax.naming.AuthenticationException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService;
    private final ProductService productService;

    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<List<Review>> getReviewsByProductId(
            @PathVariable Long productId) {

        List<Review> reviews = reviewService.getReviewsByProductId(productId);
        return ResponseEntity.ok(reviews);

    }

    @PostMapping("/products/{productId}/reviews")
    public ResponseEntity<Review> writeReview(
            @RequestBody CreateReviewRequest req,
            @PathVariable Long productId,
            @RequestHeader("Authorization") String jwt) throws UserException, ProductException {

        User user = userService.findUserProfileByJwt(jwt);
        Product product = productService.findProductById(productId);

        Review review = reviewService.createReview(
                req, user, product
        );
        return ResponseEntity.ok(review);

    }

    @PatchMapping("/reviews/{reviewId}")
    public ResponseEntity<Review> updateReview(
            @RequestBody CreateReviewRequest req,
            @PathVariable Long reviewId,
            @RequestHeader("Authorization") String jwt)
            throws UserException,
            ReviewNotFoundException, AuthenticationException {

        User user = userService.findUserProfileByJwt(jwt);

        Review review = reviewService.updateReview(
                reviewId,
                req.getReviewText(),
                req.getReviewRating(),
                user.getId()
        );
        return ResponseEntity.ok(review);

    }

    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<ApiResponse> deleteReview(
            @PathVariable Long reviewId,
            @RequestHeader("Authorization") String jwt) throws UserException,
            ReviewNotFoundException, AuthenticationException {

        User user = userService.findUserProfileByJwt(jwt);

        reviewService.deleteReview(reviewId, user.getId());
        ApiResponse res = new ApiResponse();
        res.setMessage("Review deleted successfully");
        res.setStatus(true);

        return ResponseEntity.ok(res);

    }
}
