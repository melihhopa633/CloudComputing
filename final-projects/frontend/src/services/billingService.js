import axiosInstance from "../utils/axiosInstance";

class BillingService {
  async getAllUsers() {
    try {
      const response = await axiosInstance.get("/api/billing/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async calculateBilling(userEmail, startDate, endDate) {
    try {
      const response = await axiosInstance.post("/api/billing/calculate", {
        user_email: userEmail,
        start_date: startDate,
        end_date: endDate,
      });
      return response.data;
    } catch (error) {
      console.error("Error calculating billing:", error);
      throw error;
    }
  }

  async generateInvoice(userEmail, startDate, endDate) {
    try {
      const response = await axiosInstance.post(
        "/api/billing/generate-invoice",
        {
          user_email: userEmail,
          start_date: startDate,
          end_date: endDate,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error generating invoice:", error);
      throw error;
    }
  }

  async generateMonthlyInvoice(userEmail, year, month) {
    try {
      const response = await axiosInstance.get(
        `/api/billing/monthly-invoice/${userEmail}?year=${year}&month=${month}`
      );
      return response.data;
    } catch (error) {
      console.error("Error generating monthly invoice:", error);
      throw error;
    }
  }

  async getUsageSummary(userEmail, days = 30) {
    try {
      const response = await axiosInstance.get(
        `/api/billing/usage-summary/${userEmail}?days=${days}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching usage summary:", error);
      throw error;
    }
  }

  async downloadInvoice(filename) {
    try {
      const response = await axiosInstance.get(
        `/api/billing/download/${filename}`,
        {
          responseType: "blob",
        }
      );

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return { success: true };
    } catch (error) {
      console.error("Error downloading invoice:", error);
      throw error;
    }
  }

  async getHealthStatus() {
    try {
      const response = await axiosInstance.get("/api/billing/health");
      return response.data;
    } catch (error) {
      console.error("Error fetching health status:", error);
      throw error;
    }
  }
}

export default new BillingService();
