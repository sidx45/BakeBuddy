package com.bakebuddy.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bakebuddy.domain.OrderStatus;
import com.bakebuddy.exception.OrderException;
import com.bakebuddy.exception.SellerException;
import com.bakebuddy.model.Order;
import com.bakebuddy.model.Seller;
import com.bakebuddy.response.ApiResponse;
import com.bakebuddy.service.OrderService;
import com.bakebuddy.service.SellerService;

import java.util.List;

@RestController
@RequestMapping("/seller/orders")
public class SellerOrderController {

    private final OrderService orderService;

    private final SellerService sellerService;

    @Autowired
    public SellerOrderController(OrderService orderService,

                                 SellerService sellerService) {
        this.orderService=orderService;


        this.sellerService = sellerService;
    }

    @GetMapping()
    public ResponseEntity<List<Order>> getAllOrdersHandler(
            @RequestHeader("Authorization") String jwt
    ) throws SellerException {
        Seller seller=sellerService.getSellerProfile(jwt);
        List<Order> orders=orderService.getShopsOrders(seller.getId());

        return new ResponseEntity<>(orders, HttpStatus.ACCEPTED);
    }

    @PatchMapping("/{orderId}/status/{orderStatus}")
    public ResponseEntity<Order> updateOrderHandler(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long orderId,
            @PathVariable OrderStatus orderStatus
    ) throws OrderException {

        Order orders=orderService.updateOrderStatus(orderId,orderStatus);

        return new ResponseEntity<>(orders,HttpStatus.ACCEPTED);
    }


    @DeleteMapping("/{orderId}/delete")
    public ResponseEntity<ApiResponse> deleteOrderHandler(@PathVariable Long orderId,
                                                          @RequestHeader("Authorization") String jwt) throws OrderException{
        orderService.deleteOrder(orderId);
        ApiResponse res=new ApiResponse("Order Deleted Successfully",true);
        System.out.println("delete method working....");
        return new ResponseEntity<>(res,HttpStatus.ACCEPTED);
    }

}
