package com.trainitup.backend.controller;

import com.trainitup.backend.model.Order;
import com.trainitup.backend.dto.OrderRequest;
import com.trainitup.backend.repository.OrderRepository;
import com.trainitup.backend.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "Order and purchase history management")
public class OrderController {
    
    @Autowired
    private OrderRepository orderRepository;
    
    // 1. CREATE NEW ORDER
    @PostMapping("/create")
    @Operation(summary = "Create a new order", description = "Create a new order when student purchases a course")
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderRequest request) {
        try {
            Order order = new Order();
            order.setOrderId("TRN-" + System.currentTimeMillis());
            order.setUserId(request.getUserId());
            order.setCourseId(request.getCourseId());
            order.setCourseTitle(request.getCourseTitle());
            order.setCourseName(request.getCourseTitle());
            order.setAmount(request.getAmount());
            order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "unknown");
            order.setStatus(request.getStatus() != null ? request.getStatus().toLowerCase() : "completed");
            order.setPurchasedAt(LocalDateTime.now());
            order.setOrderDate(LocalDateTime.now());
            
            orderRepository.save(order);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Order created successfully!");
            response.put("orderId", order.getOrderId());
            response.put("id", order.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create order: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // 2. GET ALL ORDERS FOR A STUDENT
    @GetMapping("/student/{userId}")
    @Operation(summary = "Get student order history", description = "Get all orders placed by a student")
    public ResponseEntity<?> getStudentOrders(@PathVariable Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        
        // Convert to frontend-friendly format
        List<Map<String, Object>> response = orders.stream().map(order -> {
            Map<String, Object> map = new HashMap<>();
            map.put("orderId", order.getOrderId());
            map.put("id", order.getId());
            map.put("userId", order.getUserId());
            map.put("courseId", order.getCourseId());
            map.put("courseTitle", order.getCourseTitle());
            map.put("courseName", order.getCourseName());
            map.put("amount", order.getAmount());
            map.put("status", order.getStatus());
            map.put("paymentMethod", order.getPaymentMethod());
            map.put("purchasedAt", order.getPurchasedAt());
            map.put("orderDate", order.getOrderDate());
            return map;
        }).toList();
        
        return ResponseEntity.ok(response);
    }
    
    // 3. GET SINGLE ORDER BY ORDER ID
    @GetMapping("/{orderId}")
    @Operation(summary = "Get order details", description = "Get detailed information about a specific order")
    public ResponseEntity<?> getOrder(@PathVariable String orderId) {
        Order order = orderRepository.findByOrderId(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order", "orderId", orderId));
        
        Map<String, Object> response = new HashMap<>();
        response.put("orderId", order.getOrderId());
        response.put("id", order.getId());
        response.put("userId", order.getUserId());
        response.put("courseId", order.getCourseId());
        response.put("courseTitle", order.getCourseTitle());
        response.put("amount", order.getAmount());
        response.put("status", order.getStatus());
        response.put("paymentMethod", order.getPaymentMethod());
        response.put("purchasedAt", order.getPurchasedAt());
        return ResponseEntity.ok(response);
    }
    
    // 4. GET ORDERS BY STATUS
    @GetMapping("/student/{userId}/status/{status}")
    @Operation(summary = "Get orders by status", description = "Get student orders filtered by status (completed, pending, etc.)")
    public ResponseEntity<?> getOrdersByStatus(@PathVariable Long userId, @PathVariable String status) {
        List<Order> orders = orderRepository.findByUserIdAndStatus(userId, status.toLowerCase());
        
        List<Map<String, Object>> response = orders.stream().map(order -> {
            Map<String, Object> map = new HashMap<>();
            map.put("orderId", order.getOrderId());
            map.put("id", order.getId());
            map.put("courseTitle", order.getCourseTitle());
            map.put("amount", order.getAmount());
            map.put("status", order.getStatus());
            map.put("purchasedAt", order.getPurchasedAt());
            return map;
        }).toList();
        
        return ResponseEntity.ok(response);
    }
    
    // 5. UPDATE ORDER STATUS
    @PutMapping("/{orderId}/status")
    @Operation(summary = "Update order status", description = "Update the status of an order (admin/teacher only)")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String orderId, @RequestParam String status) {
        Order order = orderRepository.findByOrderId(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order", "orderId", orderId));
        
        order.setStatus(status.toLowerCase());
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Order status updated to: " + status);
        return ResponseEntity.ok(response);
    }
    
    // 6. DELETE ORDER
    @DeleteMapping("/{orderId}")
    @Operation(summary = "Delete an order", description = "Delete an order record (admin only)")
    public ResponseEntity<?> deleteOrder(@PathVariable String orderId) {
        Order order = orderRepository.findByOrderId(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order", "orderId", orderId));
        
        orderRepository.delete(order);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Order deleted successfully!");
        return ResponseEntity.ok(response);
    }
    
    // 7. GET COURSE ORDERS (for teacher dashboard)
    @GetMapping("/course/{courseId}")
    @Operation(summary = "Get course orders", description = "Get all orders for a specific course")
    public ResponseEntity<?> getCourseOrders(@PathVariable Long courseId) {
        List<Order> orders = orderRepository.findByCourseId(courseId);
        
        List<Map<String, Object>> response = orders.stream().map(order -> {
            Map<String, Object> map = new HashMap<>();
            map.put("orderId", order.getOrderId());
            map.put("userId", order.getUserId());
            map.put("courseTitle", order.getCourseTitle());
            map.put("amount", order.getAmount());
            map.put("status", order.getStatus());
            map.put("purchasedAt", order.getPurchasedAt());
            return map;
        }).toList();
        
        return ResponseEntity.ok(response);
    }
    
    // 8. GET ORDER STATISTICS
    @GetMapping("/stats/dashboard")
    @Operation(summary = "Get order statistics", description = "Get order statistics for dashboard")
    public ResponseEntity<?> getOrderStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrders", orderRepository.count());
        stats.put("completedOrders", orderRepository.countByStatus("completed"));
        stats.put("pendingOrders", orderRepository.countByStatus("pending"));
        stats.put("cancelledOrders", orderRepository.countByStatus("cancelled"));
        return ResponseEntity.ok(stats);
    }
}
