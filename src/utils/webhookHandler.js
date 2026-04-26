/**
 * Sends student data to the webhook endpoint
 * @param {Array} students - Array of student objects with name, urn, and subjects
 * @returns {Promise} Response data from the webhook
 */
export const sendToWebhook = async (students) => {
  try {
    // Send POST request to webhook
    const response = await fetch("http://localhost:5678/webhook/get-data-2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ students }),
    });

    // Check if response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse response as JSON
    const data = await response.json();

    // Log the full response
    console.log("Full response:", data);

    // Log days and schedule separately if they exist
    if (data.days) {
      console.log("Days:", data.days);
    }
    if (data.schedule) {
      console.log("Schedule:", data.schedule);
    }

    return data;
  } catch (error) {
    console.error("Error sending data to webhook:", error.message);
    throw error;
  }
};
