-- Xóa cơ sở dữ liệu (nếu tồn tại)
DROP DATABASE IF EXISTS healthdb;

-- Tạo cơ sở dữ liệu mới
CREATE DATABASE healthdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Sử dụng cơ sở dữ liệu vừa tạo
USE healthdb;

-- Bảng User: Lưu trữ thông tin chung của tất cả người dùng
CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE CHECK (email LIKE '%@%'),
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL COMMENT 'Mật khẩu đã được hash (vd: bcrypt)',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    date_of_birth DATE NULL COMMENT 'Ngày sinh, có thể NULL',
    gender ENUM('Male', 'Female', 'Other') NULL COMMENT 'Giới tính (Nam, Nữ, Khác), có thể NULL',
    role ENUM('Patient', 'Doctor', 'Admin') NOT NULL COMMENT 'Vai trò của người dùng',
    avatar VARCHAR(255) NULL DEFAULT 'https://res.cloudinary.com/dxiawzgnz/image/upload/v1744000840/qlrmknm7hfe81aplswy2.png',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Tài khoản có đang hoạt động không',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Specialty: Lưu trữ các chuyên khoa y tế (Đổi tên từ Specialties)
CREATE TABLE Specialty (
    specialty_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- Bảng Clinic: Lưu trữ thông tin về các phòng khám/bệnh viện (Đổi tên từ Clinics)
CREATE TABLE Clinic (
    clinic_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    phone_number VARCHAR(20) COMMENT 'Số điện thoại liên hệ của phòng khám',
    website VARCHAR(255) COMMENT 'URL trang web của phòng khám',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Doctor: Lưu trữ thông tin chi tiết của bác sĩ (Đổi tên từ Doctors)
CREATE TABLE Doctor (
    doctor_id INT PRIMARY KEY COMMENT 'Tham chiếu đến User.user_id, nếu user bị xóa doctor xóa theo',
    years_experience INT DEFAULT 0 COMMENT 'Số năm kinh nghiệm chuyên môn',
    bio TEXT COMMENT 'Tiểu sử hoặc mô tả ngắn về bác sĩ',
    consultation_fee DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Phí cho một buổi tư vấn (vd: 200000.00)',
    average_rating DECIMAL(3, 2) DEFAULT 0.00 COMMENT 'Điểm đánh giá trung bình từ 0.00 đến 5.00',
    FOREIGN KEY (doctor_id) REFERENCES User(user_id) ON DELETE CASCADE
) COMMENT='Lưu trữ thông tin mở rộng về bác sĩ';

-- Bảng Doctor_Specialty (Bảng trung gian N-N giữa Doctor và Specialty) (Đổi tên từ Doctor_Specialties)
CREATE TABLE Doctor_Specialty (
    doctor_id INT NOT NULL,
    specialty_id INT NOT NULL,
    PRIMARY KEY (doctor_id, specialty_id),
    FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (specialty_id) REFERENCES Specialty(specialty_id) ON DELETE CASCADE
) COMMENT='Liên kết bác sĩ với các chuyên khoa của họ';

-- Bảng Doctor_Clinic (Bảng trung gian N-N giữa Doctor và Clinic) (Đổi tên từ Doctor_Clinics)
CREATE TABLE Doctor_Clinic (
    doctor_id INT NOT NULL,
    clinic_id INT NOT NULL,
    PRIMARY KEY (doctor_id, clinic_id),
    FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (clinic_id) REFERENCES Clinic(clinic_id) ON DELETE CASCADE
) COMMENT='Liên kết bác sĩ với các phòng khám/bệnh viện họ làm việc';

-- Bảng DoctorLicense: Lưu trữ chứng chỉ hành nghề (Đổi tên từ DoctorLicenses)
CREATE TABLE DoctorLicense (
    license_id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    license_number VARCHAR(100) NOT NULL UNIQUE COMMENT 'Số chứng chỉ hành nghề',
    issuing_authority VARCHAR(255) NOT NULL COMMENT 'Cơ quan cấp chứng chỉ',
    issue_date DATE NOT NULL COMMENT 'Ngày cấp chứng chỉ',
    expiry_date DATE NULL COMMENT 'Ngày hết hạn chứng chỉ (có thể NULL)',
    scope_description TEXT NULL COMMENT 'Mô tả phạm vi hành nghề',
    is_verified BOOLEAN DEFAULT FALSE COMMENT 'Trạng thái xác thực bởi Admin',
    verification_date DATE NULL COMMENT 'Ngày Admin xác thực',
    verified_by_admin_id INT NULL COMMENT 'ID của Admin đã xác thực (tham chiếu User.user_id, cần kiểm tra role=\'Admin\')',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by_admin_id) REFERENCES User(user_id) ON DELETE SET NULL
);

-- Bảng Patient: Lưu trữ thông tin bệnh nhân (Đổi tên từ Patients)
CREATE TABLE Patient (
    patient_id INT PRIMARY KEY COMMENT 'Tham chiếu đến User.user_id, nếu user bị xóa patient xóa theo',
    medical_history_summary TEXT COMMENT 'Tóm tắt tiền sử bệnh lý',
    FOREIGN KEY (patient_id) REFERENCES User(user_id) ON DELETE CASCADE
) COMMENT='Lưu trữ thông tin mở rộng dành riêng cho bệnh nhân';

-- Bảng Appointment: Lưu trữ lịch hẹn (Đổi tên từ Appointments)
CREATE TABLE Appointment (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL COMMENT 'FK -> Patient.patient_id',
    doctor_id INT NOT NULL COMMENT 'FK -> Doctor.doctor_id',
    clinic_id INT NULL COMMENT 'FK -> Clinic.clinic_id (NULL nếu online)',
    appointment_time DATETIME NOT NULL COMMENT 'Ngày giờ hẹn',
    duration_minutes INT DEFAULT 30 COMMENT 'Thời lượng dự kiến (phút)',
    reason TEXT COMMENT 'Lý do khám',
    status ENUM('Scheduled', 'Completed', 'CancelledByPatient', 'CancelledByDoctor', 'NoShow') NOT NULL DEFAULT 'Scheduled',
    consultation_type ENUM('Offline', 'Online') DEFAULT 'Offline',
    video_call_link VARCHAR(255) NULL COMMENT 'Link video call (nếu Online)',
    cancellation_reason TEXT NULL COMMENT 'Lý do hủy hẹn',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (clinic_id) REFERENCES Clinic(clinic_id) ON DELETE SET NULL,
    INDEX idx_appointment_time (appointment_time),
    INDEX idx_doctor_time (doctor_id, appointment_time),
    INDEX idx_patient_time (patient_id, appointment_time)
);

-- Bảng HealthRecord: Lưu trữ hồ sơ sức khỏe (Đổi tên từ HealthRecords)
CREATE TABLE HealthRecord (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL COMMENT 'FK -> Patient.patient_id',
    appointment_id INT NULL COMMENT 'FK -> Appointment.appointment_id (tùy chọn)',
    user_id INT NULL COMMENT 'FK -> User.user_id (người tạo/cập nhật, NULL nếu BN tự ghi)',
    record_date DATE NOT NULL COMMENT 'Ngày ghi nhận',
    symptoms TEXT COMMENT 'Triệu chứng',
    diagnosis TEXT COMMENT 'Chẩn đoán',
    prescription TEXT COMMENT 'Toa thuốc/Điều trị',
    notes TEXT COMMENT 'Ghi chú thêm',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE SET NULL,
    FOREIGN KEY (appointment_id) REFERENCES Appointment(appointment_id) ON DELETE SET NULL
);

-- Bảng TestResult: Lưu trữ kết quả xét nghiệm (Đổi tên từ TestResults)
CREATE TABLE TestResult (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL COMMENT 'FK -> Patient.patient_id',
    health_record_id INT NULL COMMENT 'FK -> HealthRecord.record_id (tùy chọn)',
    appointment_id INT NULL COMMENT 'FK -> Appointment.appointment_id (tùy chọn)',
    test_name VARCHAR(150) NOT NULL COMMENT 'Tên xét nghiệm',
    result_value VARCHAR(100) COMMENT 'Giá trị kết quả',
    result_unit VARCHAR(50) NULL COMMENT 'Đơn vị đo',
    result_date DATETIME NOT NULL COMMENT 'Ngày giờ có kết quả',
    notes TEXT COMMENT 'Ghi chú về kết quả/chỉ số tham chiếu',
    attachment_url VARCHAR(255) NULL COMMENT 'URL file đính kèm (nếu có)',
    doctor_id INT NULL COMMENT 'FK -> Doctor.doctor_id (BS chỉ định/xem)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (health_record_id) REFERENCES HealthRecord(record_id) ON DELETE SET NULL,
    FOREIGN KEY (appointment_id) REFERENCES Appointment(appointment_id) ON DELETE SET NULL,
    FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id) ON DELETE SET NULL
);
CREATE TABLE AvailableSlot (
    slot_id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_slot (doctor_id, slot_date, start_time, end_time),
    FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id) ON DELETE CASCADE
);
-- Bảng DoctorAvailability: Lưu trữ giờ làm việc của bác sĩ (Giữ nguyên tên)
CREATE TABLE DoctorAvailability (
    availability_id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE COMMENT 'Có sẵn sàng trong khung giờ này không',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_doctor_day_time (doctor_id, day_of_week, start_time, end_time),
    FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id) ON DELETE CASCADE
);

-- Bảng Invoice: Lưu trữ hóa đơn (Đổi tên từ Invoices)
CREATE TABLE Invoice (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL UNIQUE COMMENT 'FK -> Appointment.appointment_id',
    amount DECIMAL(10, 2) NOT NULL COMMENT 'Tổng tiền',
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày xuất hóa đơn',
    due_date DATE COMMENT 'Hạn thanh toán',
    status ENUM('Pending', 'Paid', 'Cancelled', 'Overdue') NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES Appointment(appointment_id) ON DELETE CASCADE
);

-- Bảng Payment: Lưu trữ thanh toán (Đổi tên từ Payments)
CREATE TABLE Payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL COMMENT 'FK -> Invoice.invoice_id',
    amount_paid DECIMAL(10, 2) NOT NULL COMMENT 'Số tiền đã trả',
    payment_method ENUM('VNPay', 'MoMo', 'Stripe', 'Cash', 'BankTransfer', 'Other') NOT NULL,
    transaction_id VARCHAR(255) NULL UNIQUE COMMENT 'Mã giao dịch (nếu có)',
    status ENUM('Pending', 'Completed', 'Failed', 'Refunded') NOT NULL DEFAULT 'Pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày giờ thanh toán',
    notes TEXT COMMENT 'Ghi chú thêm',
    FOREIGN KEY (invoice_id) REFERENCES Invoice(invoice_id) ON DELETE RESTRICT -- Ngăn xóa hóa đơn nếu có thanh toán
);

-- Bảng Review: Lưu trữ đánh giá (Đổi tên từ Reviews)
CREATE TABLE Review (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL UNIQUE COMMENT 'FK -> Appointment.appointment_id (chỉ cho hẹn Completed)',
    patient_id INT NOT NULL COMMENT 'FK -> Patient.patient_id',
    doctor_id INT NOT NULL COMMENT 'FK -> Doctor.doctor_id',
    rating TINYINT UNSIGNED NOT NULL COMMENT 'Sao (1-5)',
    comment TEXT COMMENT 'Bình luận',
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày giờ đánh giá',
    doctor_response TEXT NULL COMMENT 'Bác sĩ phản hồi',
    response_date TIMESTAMP NULL COMMENT 'Ngày giờ BS phản hồi',
    is_visible BOOLEAN DEFAULT TRUE COMMENT 'Hiển thị công khai?',
    CHECK (rating >= 1 AND rating <= 5),
    FOREIGN KEY (appointment_id) REFERENCES Appointment(appointment_id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id) ON DELETE CASCADE
);

-- === INSERT DỮ LIỆU MẪU (Đã cập nhật tên bảng) ===

-- Specialty
INSERT INTO Specialty (name, description) VALUES
('Tim mạch', 'Chuyên khoa điều trị các bệnh về tim và mạch máu.'),
('Da liễu', 'Chuyên khoa điều trị các bệnh về da, tóc, móng.'),
('Nhi khoa', 'Chuyên khoa chăm sóc sức khỏe cho trẻ em.'),
('Nội tổng quát', 'Chuyên khoa khám và điều trị các bệnh nội khoa thông thường.'),
('Tai Mũi Họng', 'Chuyên khoa điều trị các bệnh về tai, mũi và họng.');

-- Clinic
INSERT INTO Clinic (name, address, phone_number, website) VALUES
('Phòng khám Đa khoa Việt An', '123 Đường Cách Mạng Tháng Tám, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh', '02838112233', 'http://phongkhamvietan.vn'),
('Bệnh viện Đa khoa Hoàn Mỹ Sài Gòn', '60-60A Phan Xích Long, Phường 1, Quận Phú Nhuận, TP. Hồ Chí Minh', '02839959860', 'http://hoanmysaigon.com');

-- User (**LƯU Ý QUAN TRỌNG:** Thay thế hash mật khẩu)
SET @bcrypt_hash_123456 = '$2a$10$EXAMPLEHASHtobeREPLACEDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; -- **THAY THẾ BẰNG HASH THỰC TẾ**

INSERT INTO User (email, username, password, first_name, last_name, phone_number, address, date_of_birth, gender, role) VALUES
('the.anh@admin.com', 'theanh', @bcrypt_hash_123456, 'Trần', 'Thế Anh', '0901112233', '10 Đường Số 1, P. Bình Trị Đông B, Q. Bình Tân, TP. HCM', '1990-01-01', 'Male', 'Admin'), -- user_id = 1
('tuyet.nguyen@doctor.com', 'doc_tuyet', @bcrypt_hash_123456, 'Nguyễn', 'Thị Minh Tuyết', '0912345001', '25 Đường Hoa Lan, P. 2, Q. Phú Nhuận, TP. HCM', '1985-05-15', 'Female', 'Doctor'), -- user_id = 2
('thu.bui@doctor.com', 'anhthu', @bcrypt_hash_123456, 'Bùi', 'Anh Thư', '0987654002', '50/3A Đường Thích Quảng Đức, P. 5, Q. Phú Nhuận, TP. HCM', '1990-08-20', 'Female', 'Doctor'), -- user_id = 3
('huy.gia@doctor.com', 'giahuy', @bcrypt_hash_123456, 'Gia', 'Huy', '0977889903', '112 Đường Trần Hưng Đạo, P. Phạm Ngũ Lão, Q. 1, TP. HCM', '1988-12-10', 'Male', 'Doctor'), -- user_id = 4
('bach.dao@patient.com', 'daobach', @bcrypt_hash_123456, 'Đào', 'Trường Bách', '0911111111', '30 Đường Nguyễn Thị Minh Khai, P. Đa Kao, Q. 1, TP. HCM', '1995-03-10', 'Male', 'Patient'), -- user_id = 5
('duy.khang@patient.com', 'duykhang', @bcrypt_hash_123456, 'Võ', 'Duy Khang', '0922222222', '40 Đường Điện Biên Phủ, P. 15, Q. Bình Thạnh, TP. HCM', '2000-11-25', 'Male', 'Patient'), -- user_id = 6
('hoa.le@patient.com', 'hoale', @bcrypt_hash_123456, 'Lê', 'Thị Hoa', '0933333333', '75 Đường Pasteur, P. Bến Nghé, Q. 1, TP. HCM', '1998-07-12', NULL, 'Patient'); -- user_id = 7

-- Doctor (Tham chiếu user_id)
INSERT INTO Doctor (doctor_id, years_experience, bio, consultation_fee, average_rating) VALUES
(2, 12, 'Bác sĩ chuyên khoa Tim mạch, kinh nghiệm 12 năm.', 350000.00, 0.00),
(3, 7, 'Bác sĩ Da liễu và Nhi khoa.', 300000.00, 0.00),
(4, 8, 'Bác sĩ Tai Mũi Họng, chuyên nội soi.', 320000.00, 0.00);

-- Doctor_Specialty
INSERT INTO Doctor_Specialty (doctor_id, specialty_id) VALUES
(2, 1), (3, 2), (3, 3), (4, 5);

-- Doctor_Clinic
INSERT INTO Doctor_Clinic (doctor_id, clinic_id) VALUES
(2, 1), (3, 1), (3, 2), (4, 2);

-- DoctorLicense (Admin Trần Thế Anh có user_id = 1)
INSERT INTO DoctorLicense (doctor_id, license_number, issuing_authority, issue_date, expiry_date, scope_description, is_verified, verification_date, verified_by_admin_id) VALUES
(2, 'CCHN-NTMT-54321', 'Bộ Y Tế', '2014-07-01', '2029-07-01', 'Khám Tim mạch', TRUE, CURDATE(), 1), -- Verified by Admin ID 1
(3, 'CCHN-BAT-09876', 'Sở Y Tế TP.HCM', '2019-02-15', '2029-02-15', 'Khám Da liễu, Nhi khoa', FALSE, NULL, NULL),
(4, 'CCHN-GH-11223', 'Sở Y Tế TP.HCM', '2018-10-20', '2028-10-20', 'Khám Tai Mũi Họng', FALSE, NULL, NULL);

-- Patient (Tham chiếu user_id)
INSERT INTO Patient (patient_id, medical_history_summary) VALUES
(5, 'Khỏe mạnh, không dị ứng.'),
(6, 'Viêm mũi dị ứng.'),
(7, NULL); -- Chưa có tiền sử

-- DoctorAvailability (Tính ngày động)
SET @today = CURDATE();
SET @next_tuesday = DATE_ADD(@today, INTERVAL (9 - DAYOFWEEK(@today)) % 7 DAY);
SET @next_thursday = DATE_ADD(@today, INTERVAL (11 - DAYOFWEEK(@today)) % 7 DAY);
SET @next_monday = DATE_ADD(@today, INTERVAL (8 - DAYOFWEEK(@today)) % 7 DAY);
SET @next_wednesday = DATE_ADD(@today, INTERVAL (10 - DAYOFWEEK(@today)) % 7 DAY);
SET @next_friday = DATE_ADD(@today, INTERVAL (12 - DAYOFWEEK(@today)) % 7 DAY);

INSERT INTO DoctorAvailability (doctor_id, day_of_week, start_time, end_time) VALUES
(2, 'Tuesday', '08:00:00', '12:00:00'), (2, 'Thursday', '13:30:00', '17:00:00'),
(3, 'Monday', '09:00:00', '11:30:00'), (3, 'Wednesday', '14:00:00', '16:30:00'), (3, 'Friday', '08:30:00', '11:00:00'),
(4, 'Monday', '13:00:00', '17:00:00'), (4, 'Thursday', '08:00:00', '11:30:00');

-- Appointment
INSERT INTO Appointment (patient_id, doctor_id, clinic_id, appointment_time, reason, status, consultation_type) VALUES
(5, 2, 1, CONCAT(@next_tuesday, ' 09:00:00'), 'Kiểm tra tim', 'Scheduled', 'Offline'); -- Appt ID: 1
INSERT INTO Appointment (patient_id, doctor_id, clinic_id, appointment_time, reason, status, consultation_type, video_call_link) VALUES
(6, 3, NULL, DATE_SUB(CONCAT(@next_wednesday, ' 14:30:00'), INTERVAL 7 DAY), 'Tư vấn dị ứng', 'Completed', 'Online', 'https://meet.example.com/khang-thu-123'); -- Appt ID: 2
INSERT INTO Appointment (patient_id, doctor_id, clinic_id, appointment_time, reason, status, consultation_type) VALUES
(5, 4, 2, CONCAT(@next_thursday, ' 10:00:00'), 'Khám TMH', 'Scheduled', 'Offline'); -- Appt ID: 3
INSERT INTO Appointment (patient_id, doctor_id, clinic_id, appointment_time, reason, status, cancellation_reason, consultation_type) VALUES
(6, 3, 1, DATE_SUB(CONCAT(@next_friday, ' 09:30:00'), INTERVAL 7 DAY), 'Tái khám da', 'CancelledByPatient', 'Bận đột xuất', 'Offline'); -- Appt ID: 4
INSERT INTO Appointment (patient_id, doctor_id, clinic_id, appointment_time, reason, status, consultation_type, video_call_link) VALUES
(7, 3, NULL, CONCAT(@next_monday, ' 10:00:00'), 'Tư vấn da', 'Scheduled', 'Online', 'https://meet.example.com/hoa-thu-456'); -- Appt ID: 5

-- HealthRecord
INSERT INTO HealthRecord (patient_id, appointment_id, user_id, record_date, symptoms, diagnosis, prescription, notes) VALUES
(6, 2, 3, DATE(DATE_SUB(CONCAT(@next_wednesday, ' 14:30:00'), INTERVAL 7 DAY)), 'Nghẹt mũi', 'Viêm mũi dị ứng', 'Loratadin 10mg, Xịt Fluticasone', 'Tránh dị nguyên.'); -- record_id = 1
INSERT INTO HealthRecord (patient_id, appointment_id, user_id, record_date, symptoms, notes) VALUES
(5, NULL, 5, DATE_SUB(@today, INTERVAL 3 DAY), 'Đau đầu', 'BN tự ghi, nghi do stress.'); -- record_id = 2

-- TestResult
INSERT INTO TestResult (patient_id, health_record_id, appointment_id, test_name, result_value, result_unit, result_date, notes, doctor_id) VALUES
(6, 1, 2, 'Công thức máu', 'Bình thường', NULL, DATE_ADD(DATE(DATE_SUB(CONCAT(@next_wednesday, ' 14:30:00'), INTERVAL 7 DAY)), INTERVAL 1 DAY), 'Các chỉ số bình thường.', 3); -- result_id = 1

-- Invoice
INSERT INTO Invoice (appointment_id, amount, due_date, status) VALUES
(1, 350000.00, DATE_ADD(@next_tuesday, INTERVAL 7 DAY), 'Pending'); -- invoice_id = 1
INSERT INTO Invoice (appointment_id, amount, issue_date, status) VALUES
(2, 300000.00, DATE_SUB(CONCAT(@next_wednesday, ' 14:30:00'), INTERVAL 7 DAY), 'Paid'); -- invoice_id = 2
INSERT INTO Invoice (appointment_id, amount, due_date, status) VALUES
(3, 320000.00, DATE_ADD(@next_thursday, INTERVAL 7 DAY), 'Pending'); -- invoice_id = 3
INSERT INTO Invoice (appointment_id, amount, due_date, status) VALUES
(5, 300000.00, DATE_ADD(@next_monday, INTERVAL 7 DAY), 'Pending'); -- invoice_id = 4

-- Payment
INSERT INTO Payment (invoice_id, amount_paid, payment_method, transaction_id, status, payment_date, notes) VALUES
(2, 300000.00, 'VNPay', 'VNPAY_1650012345', 'Completed', DATE_SUB(CONCAT(@next_wednesday, ' 14:30:00'), INTERVAL 7 DAY), 'Thanh toán online.'); -- payment_id = 1

-- Review
INSERT INTO Review (appointment_id, patient_id, doctor_id, rating, comment, review_date, doctor_response, response_date, is_visible) VALUES
(2, 6, 3, 5, 'BS Thư tư vấn online nhiệt tình.', DATE_ADD(DATE(DATE_SUB(CONCAT(@next_wednesday, ' 14:30:00'), INTERVAL 7 DAY)), INTERVAL 1 DAY), 'Cảm ơn bạn!', DATE_ADD(DATE(DATE_SUB(CONCAT(@next_wednesday, ' 14:30:00'), INTERVAL 7 DAY)), INTERVAL 2 DAY), TRUE); -- review_id = 1

-- Cập nhật lại average_rating cho BS Thư (doctor_id=3) trên bảng Doctor
UPDATE Doctor SET average_rating = 5.00 WHERE doctor_id = 3;




-- bo sung du lieu 

SET @today = CURDATE();
SET @next_monday = DATE_ADD(@today, INTERVAL (8 - DAYOFWEEK(@today)) % 7 DAY);

INSERT INTO Appointment (patient_id, doctor_id, clinic_id, appointment_time, reason, status, consultation_type) VALUES
(5, 2, 1, DATE_SUB(@next_monday, INTERVAL 3 DAY), 'Tái khám tim mạch', 'Completed', 'Offline');

-- Thêm một hồ sơ sức khỏe tương ứng với lịch hẹn đã hoàn thành ở trên
INSERT INTO HealthRecord (patient_id, appointment_id, user_id, record_date, symptoms, diagnosis, prescription, notes) VALUES
(5, 6, 2, DATE(DATE_SUB(@next_monday, INTERVAL 3 DAY)), 'Khó thở nhẹ khi gắng sức, hồi hộp', 'Tăng huyết áp giai đoạn 1', 'Amlodipine 5mg 1 viên/ngày, theo dõi huyết áp tại nhà', 'Đo huyết áp 2 lần/ngày, sáng và tối.'); -- record_id = 3

-- Thêm một kết quả xét nghiệm liên quan đến hồ sơ sức khỏe này (tùy chọn)
INSERT INTO TestResult (patient_id, health_record_id, appointment_id, test_name, result_value, result_unit, result_date, notes, doctor_id) VALUES
(5, 3, 6, 'Điện tâm đồ (ECG)', 'Nhịp xoang đều, không có dấu hiệu thiếu máu cơ tim', NULL, DATE_SUB(@next_monday, INTERVAL 2 DAY), 'Kết quả ECG bình thường.', 2); -- result_id = 2



-- chay tesst
SELECT
    COUNT(a.appointment_id) AS so_luong_kham, -- Đếm số lượt khám
    hr.diagnosis AS chan_doan,              -- Lấy thông tin chẩn đoán
    YEAR(a.appointment_time) AS nam,        -- Lấy năm từ thời gian hẹn
    QUARTER(a.appointment_time) AS quy,     -- Lấy quý từ thời gian hẹn
    MONTH(a.appointment_time) AS thang      -- Lấy tháng từ thời gian hẹn
FROM
    Appointment a                           -- Từ bảng Appointment (lịch hẹn)
INNER JOIN
    HealthRecord hr ON a.appointment_id = hr.appointment_id -- Kết nối với HealthRecord qua appointment_id để lấy chẩn đoán
WHERE
    a.status = 'Completed'                  -- Chỉ lấy các lịch hẹn đã hoàn thành
    -- AND YEAR(a.appointment_time) = [Your_Year_Param] -- Thêm điều kiện lọc theo năm (nếu có)
    -- AND QUARTER(a.appointment_time) = [Your_Quarter_Param] -- Thêm điều kiện lọc theo quý (nếu có năm và quý)
    -- AND MONTH(a.appointment_time) = [Your_Month_Param] -- Thêm điều kiện lọc theo tháng (nếu có năm và tháng, không có quý)
    AND hr.diagnosis IS NOT NULL AND hr.diagnosis != '' -- Chỉ lấy các bản ghi có chẩn đoán
GROUP BY
    YEAR(a.appointment_time),               -- Nhóm theo năm
    QUARTER(a.appointment_time),            -- Nhóm theo quý
    MONTH(a.appointment_time),              -- Nhóm theo tháng
    hr.diagnosis                            -- Nhóm theo chẩn đoán
ORDER BY
    nam ASC,                                -- Sắp xếp theo năm tăng dần
    thang ASC;                              -- Sắp xếp theo tháng tăng dần



SELECT
    COUNT(DISTINCT a.patient_id) AS tong_so_benh_nhan, -- Đếm số lượng bệnh nhân duy nhất
    YEAR(a.appointment_time) AS nam,
    QUARTER(a.appointment_time) AS quy,
    MONTH(a.appointment_time) AS thang
FROM
    Appointment a
WHERE
    a.status = 'Completed'
    -- Thêm điều kiện lọc theo bác sĩ (nếu cần)
    -- AND a.doctor_id = [Your_Doctor_ID]
    -- Thêm điều kiện lọc theo thời gian (nếu cần)
    -- AND YEAR(a.appointment_time) = [Your_Year_Param]
    -- AND QUARTER(a.appointment_time) = [Your_Quarter_Param]
    -- AND MONTH(a.appointment_time) = [Your_Month_Param]
GROUP BY
    YEAR(a.appointment_time),
    QUARTER(a.appointment_time),
    MONTH(a.appointment_time)
ORDER BY
    nam ASC,
    thang ASC;
    
    
    
    
    -- Tạo tự động slot trống 1 tuần
    DELIMITER $$

CREATE PROCEDURE GenerateAvailableSlots()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE doc_id INT;
    DECLARE day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
    DECLARE s_time TIME;
    DECLARE e_time TIME;

    DECLARE cur CURSOR FOR
        SELECT doctor_id, day_of_week, start_time, end_time
        FROM DoctorAvailability
        WHERE is_available = TRUE;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    SET @today = CURDATE();
    SET @i = 0;

    WHILE @i < 7 DO
        SET @target_date = DATE_ADD(@today, INTERVAL @i DAY);
        SET @target_dow = DAYNAME(@target_date); -- 'Monday', 'Tuesday',...

        OPEN cur;

        read_loop: LOOP
            FETCH cur INTO doc_id, day, s_time, e_time;
            IF done THEN
                LEAVE read_loop;
            END IF;

            IF day = @target_dow THEN
                SET @current_time = s_time;
                WHILE ADDTIME(@current_time, '00:30:00') <= e_time DO
                    SET @slot_start = @current_time;
                    SET @slot_end = ADDTIME(@current_time, '00:30:00');

                    -- Chèn nếu chưa tồn tại
                    INSERT IGNORE INTO AvailableSlot (doctor_id, slot_date, start_time, end_time)
                    VALUES (doc_id, @target_date, @slot_start, @slot_end);

                    SET @current_time = @slot_end;
                END WHILE;
            END IF;
        END LOOP;

        CLOSE cur;

        SET @i = @i + 1;
        SET done = FALSE;
    END WHILE;
END $$

DELIMITER ;GenerateAvailableSlots



-- set event 

SET GLOBAL event_scheduler = ON;

-- chayj event 12h moi nay
CREATE EVENT IF NOT EXISTS ev_generate_slots
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP + INTERVAL 1 DAY
DO
    CALL GenerateAvailableSlots();
    
    
    -- show event
    SHOW EVENTS;

-- xoa event neu muon 


-- DROP EVENT IF EXISTS ev_generate_slots;



-- muon chay ngay cung dc


CALL GenerateAvailableSlots();

