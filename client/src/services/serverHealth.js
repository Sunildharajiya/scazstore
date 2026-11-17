export const checkServerHealth = async () => {
  try {
    const response = await fetch("http://localhost:5000/h", {
      method: "GET",
    });

    const data = await response.text();

    return {
      success: response.ok,
      status: response.status,
      message: data,
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
      message: error.message,
    };
  }
};