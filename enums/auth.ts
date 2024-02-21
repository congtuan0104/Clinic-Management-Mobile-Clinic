export enum AuthProvider {
    Google = 'Google',
    Facebook = 'Facebook',
    // Github = 'Github',
    // Apple = 'Apple',
  }
  
  export enum AuthModule {
    Admin = 1,
    ClinicOwner = 2,
    Patient = 3,
    Guest = 4,
    ClinicStaff = 5,
  }
  
  export enum PERMISSION {
    /**
     * Tiếp đón bệnh nhân
     */
    RECEPTION = 1,
  
    /**
     * Quyền thực hiện các dịch vụ khám chữa bệnh
     */
    PERFORM_SERVICE = 2,
  
    /**
     * Phân quyền, quản lý nhân viên
     */
    STAFF = 3,
  
    /**
     * Quyền quản lý thông tin phòng khám
     */
    CLINIC_INFO = 4,
  
    /**
     * Quản lý vật tư
     */
    SUPPLIES = 5,
  
    /**
     * Quản lý thanh toán, xuất hóa đơn
     */
    INVOICE = 6,
  
    /**
     * Quản lý danh mục, phân loại
     */
    CATEGORY_TYPE = 7,
  
    /**
     * Quản lý bảng giá, dịch vụ
     */
    SERVICE_PRICE = 8,
  
    /**
     * Xem thống kê, báo cáo
     */
    REPORT = 9,
  
    /**
     * Quyền quản lý lịch hẹn khám
     */
    APPOINTMENT = 10,
  
    /**
     * Quản lý tin tức, quảng cáo
     */
    NEWS_AD = 11,
  
    /**
     * Quyền quản lý thông tin bệnh nhân
     */
    PATIENT_INFO = 12,
  }
  