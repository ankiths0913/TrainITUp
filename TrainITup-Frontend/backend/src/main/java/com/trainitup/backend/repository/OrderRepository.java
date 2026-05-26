package com.trainitup.backend.repository;

import com.trainitup.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Find all orders by user ID (student)
    List<Order> findByUserId(Long userId);
    
    // Find all orders by course ID
    List<Order> findByCourseId(Long courseId);
    
    // Find orders by user ID and status
    List<Order> findByUserIdAndStatus(Long userId, String status);
    
    // Find order by order ID
    Optional<Order> findByOrderId(String orderId);
    
    // Find orders by user ID and course ID
    List<Order> findByUserIdAndCourseId(Long userId, Long courseId);
    
    // Count orders by status
    Long countByStatus(String status);
    
    // Count orders by user ID
    Long countByUserId(Long userId);
}
