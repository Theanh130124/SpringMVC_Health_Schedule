DROP DATABASE IF EXISTS healthdb;
CREATE DATABASE healthdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE healthdb;
-- 1. Tách role cho dễ mở rộng
CREATE TABLE Roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE );
-- 2. Bảng user
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE CHECK (email LIKE '%@%'),
    username varchar(100) NOT NULL unique ,
    password VARCHAR(255) NOT NULL ,
    full_name VARCHAR(150) NOT NULL ,
    phone_number VARCHAR(20) NOT NULL UNIQUE ,
    address TEXT not null ,
    date_of_birth DATE ,
    gender ENUM('Male', 'Female') ,
    role_id INT NOT NULL ,
    avatar varchar(255) null default "https://res.cloudinary.com/dxiawzgnz/image/upload/v1744000840/qlrmknm7hfe81aplswy2.png",
    is_active BOOLEAN DEFAULT TRUE ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id)

);
-- 3. Bảng Specialties: Lưu trữ các chuyên khoa y tế
CREATE TABLE Specialties (
    specialty_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT 
);

-- 4. Bảng Clinics: Lưu trữ thông tin về các phòng khám hoặc bệnh viện
CREATE TABLE Clinics (
    clinic_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL ,
    address TEXT NOT NULL ,
    phone_number VARCHAR(20) COMMENT 'Số điện thoại liên hệ của phòng khám',
    website VARCHAR(255) COMMENT 'URL trang web của phòng khám',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

-- 5. Bảng Doctors: Lưu trữ thông tin chi tiết của bác sĩ (đã tách chứng chỉ)
CREATE TABLE Doctors (
    doctor_id INT PRIMARY KEY COMMENT 'Tham chiếu đến Users.user_id, nếu user bị xóa docter xóa theo',
    specialty_id INT NOT NULL,
    clinic_id INT NULL COMMENT 'Bệnh viện xóa thì khóa ngoại về null',
    years_experience INT DEFAULT 0 COMMENT 'Số năm kinh nghiệm chuyên môn',
    bio TEXT,
    consultation_fee DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Phí cho một buổi tư vấn 200000.00',
    average_rating DECIMAL(3, 2) DEFAULT 0.00 COMMENT 'Điểm đánh giá trung bình được tính từ các bài đánh giá 5.00',
    FOREIGN KEY (doctor_id) REFERENCES Users(user_id) ON DELETE CASCADE ,
    FOREIGN KEY (specialty_id) REFERENCES Specialties(specialty_id) ,
    FOREIGN KEY (clinic_id) REFERENCES Clinics(clinic_id) ON DELETE SET NULL
) ;
-- 6. Bảng DoctorLicenses: Lưu trữ chi tiết chứng chỉ hành nghề của bác sĩ
CREATE TABLE DoctorLicenses (
    license_id INT AUTO_INCREMENT PRIMARY KEY ,
    doctor_id INT NOT NULL ,
    license_number VARCHAR(100) NOT NULL UNIQUE ,
    issuing_authority VARCHAR(255) NOT NULL COMMENT 'Cơ quan cấp chứng chỉ',
    issue_date DATE NOT NULL COMMENT 'Ngày cấp chứng chỉ',
    expiry_date DATE NULL COMMENT 'Ngày hết hạn chứng chỉ (có thể NULL)',
    scope_description TEXT NULL COMMENT 'Mô tả phạm vi hành nghề của chứng chỉ',
    is_verified BOOLEAN DEFAULT FALSE COMMENT 'Trạng thái xác thực bởi quản trị viên',
    verification_date DATE NULL COMMENT 'Ngày quản trị viên xác thực chứng chỉ',
    verified_by_admin_id INT NULL COMMENT 'Khóa ngoại tham chiếu đến quản trị viên đã xác thực (User role Admin)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by_admin_id) REFERENCES Users(user_id) ON DELETE SET NULL
);
-- 7. Bảng bệnh nhân
CREATE TABLE Patients (
    patient_id INT PRIMARY KEY ,
    medical_history_summary TEXT COMMENT 'Tóm tắt ngắn gọn về tiền sử bệnh lý của bệnh nhân',
    FOREIGN KEY (patient_id) REFERENCES Users(user_id) ON DELETE CASCADE
) COMMENT='Lưu trữ thông tin chi tiết dành riêng cho bệnh nhân';

-- 8. Bảng HealthRecords: Lưu trữ hồ sơ sức khỏe tổng quát
CREATE TABLE HealthRecords (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL COMMENT 'Khóa ngoại tham chiếu đến bệnh nhân',
    appointment_id INT NULL COMMENT 'Tùy chọn liên kết bản ghi với một cuộc hẹn cụ thể',
    user_id INT NULL COMMENT 'Bác sĩ hoặc bệnh nhân đã thêm/cập nhật bản ghi này (NULL nếu do bệnh nhân thêm)',
    record_date DATE NOT NULL COMMENT 'Ngày mà bản ghi sức khỏe này đề cập đến',
    symptoms TEXT COMMENT 'Triệu chứng do bệnh nhân báo cáo',
    diagnosis TEXT COMMENT 'Chẩn đoán được thực hiện bởi bác sĩ',
    prescription TEXT COMMENT 'Thuốc hoặc phương pháp điều trị được kê đơn',
    notes TEXT COMMENT 'Ghi chú bổ sung từ bác sĩ hoặc bệnh nhân',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL
    -- Khóa ngoại đến Appointments sẽ được thêm sau ở dưới cùng
) ;
-- 9. Bảng TestResults: Lưu trữ chi tiết kết quả xét nghiệm
CREATE TABLE TestResults (
    result_id INT AUTO_INCREMENT PRIMARY KEY ,
    patient_id INT NOT NULL COMMENT 'Khóa ngoại tham chiếu đến bệnh nhân thực hiện xét nghiệm',
    health_record_id INT NULL COMMENT 'Liên kết tùy chọn với một HealthRecord cụ thể',
    appointment_id INT NULL COMMENT 'Liên kết tùy chọn với cuộc hẹn chỉ định xét nghiệm',
    test_name VARCHAR(150) NOT NULL COMMENT 'Tên xét nghiệm (vd: Đường huyết, Công thức máu)',
    result_value VARCHAR(100) ,
    result_date DATETIME NOT NULL COMMENT 'Ngày giờ có kết quả xét nghiệm',
    notes TEXT COMMENT 'Ghi chú về kết quả',
    attachment_url VARCHAR(255) NULL COMMENT 'Đường dẫn đến file đính kèm kết quả (nếu có)',
    doctor_id INT NULL COMMENT 'Người dùng (bác sĩ/bệnh nhân) đã thêm kết quả này',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Dấu thời gian tạo bản ghi kết quả',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Dấu thời gian cập nhật bản ghi kết quả lần cuối',
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (health_record_id) REFERENCES HealthRecords(record_id) ON DELETE SET NULL,
    -- Khóa ngoại đến Appointments và Users sẽ được thêm sau khi các bảng đó được tạo
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE SET NULL
) ;

-- 10. Bảng DoctorAvailability: Lưu trữ các khung giờ làm việc định kỳ của bác sĩ
CREATE TABLE DoctorAvailability (
    availability_id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL ,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    start_time TIME NOT NULL COMMENT 'Thời gian bắt đầu của khung giờ trống',
    end_time TIME NOT NULL COMMENT 'Thời gian kết thúc của khung giờ trống',
    is_available BOOLEAN DEFAULT TRUE COMMENT 'Khung giờ này có sẵn sàng chung không',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_doctor_day_time (doctor_id, day_of_week, start_time, end_time),
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE CASCADE
) ;
-- 11. Bảng Appointments: Lưu trữ thông tin về các lịch hẹn đã được đặt
CREATE TABLE Appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL COMMENT 'Khóa ngoại tham chiếu đến bệnh nhân',
    doctor_id INT NOT NULL COMMENT 'Khóa ngoại tham chiếu đến bác sĩ',
    clinic_id INT NULL COMMENT 'Phòng khám nơi diễn ra cuộc hẹn (có thể null cho trực tuyến)',
    appointment_time DATETIME NOT NULL COMMENT 'Ngày và giờ cụ thể của cuộc hẹn',
    duration_minutes INT DEFAULT 30 COMMENT 'Thời lượng dự kiến của cuộc hẹn (phút)',
    reason TEXT COMMENT 'Lý do khám bệnh do bệnh nhân nêu',
    status ENUM('Scheduled', 'Completed', 'CancelledByPatient', 'CancelledByDoctor', 'NoShow') NOT NULL DEFAULT 'Scheduled',
    consultation_type ENUM('Offline', 'Online') DEFAULT 'Offline' COMMENT 'Cho biết cuộc hẹn là trực tiếp hay từ xa',
    video_call_link VARCHAR(255) NULL COMMENT 'Liên kết cho tư vấn trực tuyến',
    cancellation_reason TEXT NULL COMMENT 'Lý do nếu cuộc hẹn bị hủy',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (clinic_id) REFERENCES Clinics(clinic_id) ON DELETE SET NULL,
    INDEX idx_appointment_time (appointment_time),
    INDEX idx_doctor_time (doctor_id, appointment_time),
    INDEX idx_patient_time (patient_id, appointment_time)
) ;
-- *** THÊM KHÓA NGOẠI SAU KHI BẢNG ĐÍCH ĐÃ TỒN TẠI ***
-- Thêm khóa ngoại từ HealthRecords đến Appointments
ALTER TABLE HealthRecords
ADD CONSTRAINT fk_healthrecord_appointment
FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id) ON DELETE SET NULL;

-- Thêm khóa ngoại từ TestResults đến Appointments
ALTER TABLE TestResults
ADD CONSTRAINT fk_testresult_appointment
FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id) ON DELETE SET NULL;

-- 12. Bảng Invoices: Lưu trữ chi tiết hóa đơn cho các cuộc hẹn
CREATE TABLE Invoices (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL UNIQUE COMMENT 'Mỗi cuộc hẹn chỉ nên có tối đa một hóa đơn',
    amount DECIMAL(10, 2) NOT NULL COMMENT 'Tổng số tiền phải trả cho dịch vụ',
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Khi hóa đơn được tạo ra',
    due_date DATE COMMENT 'Ngày hết hạn thanh toán',
    status ENUM('Pending', 'Paid', 'Cancelled', 'Overdue') NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id) ON DELETE CASCADE
);
-- 13. Bảng Payments: Ghi nhận các giao dịch thanh toán liên kết với hóa đơn
CREATE TABLE Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL COMMENT 'Khóa ngoại tham chiếu đến hóa đơn đang được thanh toán',
    amount_paid DECIMAL(10, 2) NOT NULL COMMENT 'Số tiền đã thanh toán trong giao dịch này',
    payment_method ENUM('VNPay', 'MoMo', 'Stripe', 'Other') NOT NULL ,
    transaction_id VARCHAR(255) NULL UNIQUE COMMENT 'ID duy nhất từ cổng thanh toán, nếu có',
    status ENUM('Pending', 'Completed', 'Failed', 'Refunded') NOT NULL DEFAULT 'Pending' COMMENT 'Trạng thái của giao dịch thanh toán',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Dấu thời gian của giao dịch thanh toán',
    notes TEXT COMMENT 'Ghi chú bổ sung về thanh toán',
    FOREIGN KEY (invoice_id) REFERENCES Invoices(invoice_id) ON DELETE RESTRICT
) ;

-- 14. Bảng Reviews: Lưu trữ đánh giá và xếp hạng của bệnh nhân cho bác sĩ
CREATE TABLE Reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL UNIQUE COMMENT 'Đánh giá được liên kết với một cuộc hẹn cụ thể đã hoàn thành',
    patient_id INT NOT NULL COMMENT 'Khóa ngoại tham chiếu đến bệnh nhân đã viết đánh giá',
    doctor_id INT NOT NULL COMMENT 'Khóa ngoại tham chiếu đến bác sĩ đang được đánh giá',
    rating TINYINT UNSIGNED NOT NULL COMMENT 'Xếp hạng từ 1 đến 5 sao',
    comment TEXT COMMENT 'Phản hồi bằng văn bản của bệnh nhân',
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Khi đánh giá được gửi',
    doctor_response TEXT NULL COMMENT 'Phản hồi tùy chọn từ bác sĩ đối với đánh giá',
    response_date TIMESTAMP NULL COMMENT 'Khi bác sĩ phản hồi',
    is_visible BOOLEAN DEFAULT TRUE COMMENT 'Kiểm soát khả năng hiển thị của đánh giá',
    CHECK (rating >= 1 AND rating <= 5),
    FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES Patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE CASCADE
) ;
INSERT INTO Roles (role_name) VALUES ('Patient'), ('Doctor'), ('Admin');

    