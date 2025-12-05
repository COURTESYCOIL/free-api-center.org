// This function handles the branding automatically
export const sendResponse = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    timestamp: new Date().toISOString(),
    meta: {
      author: "Painsel",
      project: "Free APIs Center",
      github: "https://github.com/COURTESYCOIL/Free-API-Center"
    },
    data: data
  });
};
