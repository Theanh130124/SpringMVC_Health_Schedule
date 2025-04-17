/* global document, console, Intl, Math */

document.addEventListener('DOMContentLoaded', function() {

    // Hàm trợ giúp vẽ thông báo lên canvas
    function drawNoDataMessage(canvasElement, message) {
        const ctx = canvasElement.getContext('2d');
        // Xóa nội dung cũ trên canvas (quan trọng khi lọc lại)
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

       
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '16px Arial';
        ctx.fillStyle = '#888'; 

        
        ctx.fillText(message, canvasElement.width / 2, canvasElement.height / 2);
    }

    // --- Biểu đồ cho Admin ---
    const adminCanvas = document.getElementById('adminStatsChart');
  
    if (adminCanvas) {
        
        if (typeof adminStatsData !== 'undefined' && adminStatsData.length > 0) {
            
            const adminLabels = adminStatsData.map(item => {
                let label = '';
                if (item[4]) { label += `T${item[4]}`; }
                if (item[3]) { label += (label ? `/Q${item[3]}` : `Q${item[3]}`); }
                if (item[2]) { label += (label ? `/${item[2]}` : `${item[2]}`); }
                return label || 'Không xác định';
            });
            const appointmentData = adminStatsData.map(item => item[0]);
            const revenueData = adminStatsData.map(item => item[1]);

            new Chart(adminCanvas, {
                type: 'bar',
                data: {
                    labels: adminLabels,
                    datasets: [
                        {
                            label: 'Số lượt khám bệnh',
                            data: appointmentData,
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                            yAxisID: 'yAppointments'
                        },
                        {
                            label: 'Tổng tiền (VNĐ)',
                            data: revenueData,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            yAxisID: 'yRevenue'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: { display: true, text: 'Thống kê Lượt khám và Doanh thu' },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) { label += ': '; }
                                    if (context.parsed.y !== null) {
                                        if (context.dataset.yAxisID === 'yRevenue') {
                                            label += new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(context.parsed.y);
                                        } else {
                                            label += context.parsed.y;
                                        }
                                    }
                                    return label;
                                }
                            }
                        }
                    },
                    scales: {
                        x: { title: { display: true, text: 'Kỳ thống kê (Tháng/Quý/Năm)' } },
                        yAppointments: {
                            type: 'linear', display: true, position: 'left', beginAtZero: true,
                            title: { display: true, text: 'Số lượt khám' }
                        },
                        yRevenue: {
                            type: 'linear', display: true, position: 'right', beginAtZero: true,
                            title: { display: true, text: 'Tổng tiền (VNĐ)' },
                            grid: { drawOnChartArea: false },
                            ticks: {
                                callback: function(value, index, values) {
                                    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
                                }
                            }
                        }
                    }
                }
            });
        } else {
            
            drawNoDataMessage(adminCanvas, 'Không có dữ liệu thống kê doanh thu.');
            console.log("Không có dữ liệu admin để vẽ biểu đồ.");
        }
    } // Kết thúc kiểm tra adminCanvas tồn tại

    // --- Biểu đồ cho Doctor ---
    const doctorCanvas = document.getElementById('doctorStatsChart');
     // Kiểm tra xem canvas có tồn tại không (do sec:authorize)
    if (doctorCanvas) {
        // Kiểm tra dữ liệu có tồn tại và không rỗng
        if (typeof doctorStatsData !== 'undefined' && doctorStatsData.length > 0) {
             // Dữ liệu hợp lệ -> Vẽ biểu đồ
            const diseaseLabels = doctorStatsData.map(item => item[1]);
            const diseaseData = diseaseLabels.map(() => 1); // Giả định tỷ lệ bằng nhau
            const backgroundColors = diseaseLabels.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`);

            new Chart(doctorCanvas, {
                type: 'pie',
                data: {
                    labels: diseaseLabels,
                    datasets: [{
                        label: 'Loại bệnh phổ biến',
                        data: diseaseData,
                        backgroundColor: backgroundColors,
                        borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
                        borderWidth: 1
                    }]
                },
                options: {
                     responsive: true,
                     maintainAspectRatio: false,
                     plugins: {
                        title: { display: false }, // Đã có H4
                        legend: { position: 'top' },
                        tooltip: { callbacks: { label: function(context) { return context.label || ''; } } }
                     }
                }
            });
        } else {
            // Không có dữ liệu -> Vẽ thông báo lên canvas
            drawNoDataMessage(doctorCanvas, 'Không có dữ liệu thống kê bác sĩ.');
            console.log("Không có dữ liệu doctor để vẽ biểu đồ.");
        }
    } // Kết thúc kiểm tra doctorCanvas tồn tại

});