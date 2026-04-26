import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendToWebhook } from "../utils/webhookHandler";

export default function WebhookButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Sample student data
  const sampleStudents = [
    { name: "John Doe", urn: "URN001", subjects: ["Math", "Physics"] },
    { name: "Jane Smith", urn: "URN002", subjects: ["Chemistry", "Biology"] },
  ];

  const handleSendData = async () => {
    try {
      setLoading(true);
      setError(null);
      const responseData = await sendToWebhook(sampleStudents);

      // Navigate to SchedulePanel with response data
      navigate("/schedule", { state: responseData });
    } catch (err) {
      setError(err.message);
      alert("Error sending data. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={handleSendData}
        disabled={loading}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Sending..." : "Send Data to Webhook"}
      </button>
      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>Error: {error}</p>
      )}
    </div>
  );
}
