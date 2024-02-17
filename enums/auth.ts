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
     * Quyền quản lý lịch hẹn khám
     */
    APPOINTMENT = 10,
  
    /**
     * Quyền quản lý nhân viên
     */
    STAFF = 11,
  
    /**
     * Quyền quản lý, chỉnh sửa quyền các vai trò (trừ role Admin)
     */
    ROLE = 9,
  
    /**
     * Quyền quản lý thông tin phòng khám
     */
    CLINIC_INFO = 12,
  
    /**
     * Quyền quản lý gói phòng khám
     */
    CLINIC_PACKAGE = 13,
  
    /**
     * Quyền quản lý thông tin bệnh nhân
     */
    PATIENT_INFO = 14,
  
    /**
     * Quyền thực hiện các dịch vụ khám chữa bệnh
     */
    PERFORM_SERVICE = 15,
  
    /**
     * Quản lý danh mục, phân loại
     */
    CATEGORY_TYPE = 16,
  
    /**
     * Quản lý bảng giá, dịch vụ
     */
    SERVICE_PRICE = 17,
  
    /**
     * Quản lý tin tức, quảng cáo
     */
    NEWS = 18,
  
    /**
     * Quản lý thanh toán, xuất hóa đơn
     */
    INVOICE = 19,
  
    /**
     * Quản lý vật tư
     */
    SUPPLIES = 20,
  
    /**
     * Xem thống kê, báo cáo
     */
    REPORT = 21,
  }
  