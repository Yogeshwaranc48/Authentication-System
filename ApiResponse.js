export class ApiResponse {
  static success(res, message, data = null, statusCode = 200) {
    const response = {
      success: true,
      message,
    };

    if (data !== null && data !== undefined) {
      response.data = data;
    }

    return res.status(statusCode).json(response);
  }

  static error(res, message, statusCode = 400) {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
}
