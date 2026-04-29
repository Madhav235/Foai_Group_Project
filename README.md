# FOAI Timetable Generator

A modern, AI-powered React web application designed to automatically generate academic timetables using intelligent scheduling algorithms and n8n webhook automation.

## 🌟 Key Features

- **Automated Scheduling**: Generate optimal, clash-free academic schedules instantly using an external AI scheduling engine powered by n8n.
- **Smart Workspaces**: Seamlessly switch between different environments (e.g., semesters, departments) saving configurations such as student rosters, room allocations, and available days.
- **CSV Data Ingestion**: Bulk-upload courses, students, rooms, and time slot constraints via simple CSV formats.
- **Interactive Schedule Panel**: View, analyze, and manage generated schedules in an intuitive and responsive layout.
- **PDF Export**: Generate ready-to-print or easily shareable PDF reports directly from the generated timetables (powered by jsPDF).
- **Responsive Design**: Clean and professional user interface crafted with Tailwind CSS for an optimal experience across different screen sizes.

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: React Router DOM v7
- **Icons**: [Lucide React](https://lucide.dev/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) & [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)
- **Backend/Automation**: [n8n](https://n8n.io/) Webhooks for logic and timetable processing

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **yarn**
- An active **n8n** instance (local or hosted) serving the timetable generation webhook endpoint.

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd Foai_Group_Project_Final
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will usually be available at `http://localhost:5173`.

### Build for Production

To create a production-ready build:
```bash
npm run build
```

To preview the built application locally:
```bash
npm run preview
```

## 🔄 n8n Integration

The application relies on an external n8n workflow to calculate the actual timetable. By default, it hits the following endpoint:

```
http://localhost:5678/webhook/get-data-2
```
*(Can be updated inside `src/pages/GenerateTimetable.jsx` or managed via environment variables)*

### Required Payload Structure
When generating a timetable, the frontend sends a `POST` request with the following JSON structure parsed from your uploaded CSVs:

```json
{
  "students": [ ... ],
  "rooms": [ ... ],
  "days": [ ... ]
}
```

The server/n8n is expected to return the optimized schedule mapped against these parameters.

## 📂 Project Structure

```text
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Main route views (Dashboard, Generate, Schedule)
│   ├── utils/              # Helper functions (CSV Parsing, Storage)
│   ├── App.jsx             # Application root & Router configuration
│   ├── index.css           # Global Tailwind & Custom styles
│   └── main.jsx            # React entry point
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind customization
└── vite.config.js          # Vite configuration
```

## 📝 Usage Workflow

1. **Dashboard Overview**: Launch the app to view your dashboard.
2. **Setup a Workspace**: Navigate to Workspaces to create isolated environments for different datasets.
3. **Upload Data**: Go to "Generate Timetable", choose your workspace, and upload the required CSVs (`Students`, `Rooms`, and `Days/Slots`).
4. **Trigger Generation**: Click "Generate Timetable". The app communicates with your n8n backend.
5. **Review & Export**: Once generated, you will be redirected to the Schedule Panel. Review the timetable and export it as a PDF if necessary.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📄 License

This project is private and developed for academic purposes.
