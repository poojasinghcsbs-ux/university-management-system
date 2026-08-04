package com.rgpv.universityportal.service;

import com.rgpv.universityportal.dto.DepartmentRequest;
import com.rgpv.universityportal.model.Department;
import com.rgpv.universityportal.repository.DepartmentRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<Department> findAll() {
        return departmentRepository.findAllByOrderByNameAsc();
    }

    public Department create(DepartmentRequest request) {
        Department department = new Department();
        applyRequest(department, request);
        department.setCreatedAt(LocalDateTime.now());
        return departmentRepository.save(department);
    }

    public Department update(Long id, DepartmentRequest request) {
        Department department = findById(id);
        applyRequest(department, request);
        return departmentRepository.save(department);
    }

    public void delete(Long id) {
        departmentRepository.delete(findById(id));
    }

    private Department findById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Department not found"));
    }

    private void applyRequest(Department department, DepartmentRequest request) {
        department.setName(request.name().trim());
        department.setDepartmentCode(request.departmentCode().trim().toUpperCase());
        department.setHodName(request.hodName().trim());
        department.setDescription(request.description().trim());
    }
}
