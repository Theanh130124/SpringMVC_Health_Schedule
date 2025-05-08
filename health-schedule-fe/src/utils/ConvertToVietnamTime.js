export const ConvertToVietnamTime = (date) => {
    if (!date) return "";
  
    const vietnamDate = new Date(date);
    // Đảm bảo hiển thị đúng ngày ở múi giờ Việt Nam
    return vietnamDate.toLocaleDateString("sv-SE", {
      timeZone: "Asia/Ho_Chi_Minh"  // Sử dụng đúng múi giờ VN
    }); // Format sv-SE: YYYY-MM-DD
  };