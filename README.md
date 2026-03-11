# Real-Time Commodity Price Dashboard

A small but production-like frontend demo showcasing real-time data updates via WebSocket, modern UI practices, and clean architecture.

## Overview

**Live Demo:** [https://turb-c14abb.web.app/](https://turb-c14abb.web.app/)

This project is a React application built with TypeScript and Webpack 5. It uses Tailwind CSS for styling and Recharts for data visualization. A simulated WebSocket server runs entirely on the client side to demonstrate real-time data flow without requiring a complex backend setup.

## Architecture & Engineering Practices

To keep the project simple yet robust according to the requirements, we've structured it as follows:

- **Simplified Services (`src/services/websocket.ts`)**: 
  Instead of multiple layers of models, mock servers, and services, we combined the necessary types, the mock 2-second interval updater, and the React Subscription Hook (`useCommodityData`) into a single cohesive service file.
- **Component Separation**: 
  We separated the highly reusable `CommodityCard` to demonstrate component isolation and allow for specific, targeted unit testing.
- **Unified App Component (`src/App.tsx`)**: 
  The main dashboard logic, table rendering, and Recharts integration are kept together in `App.tsx` for simplicity and fewer file hops during evaluation, heavily commented to explain the layout and data bindings.
- **Modern UI**: 
  Using Tailwind CSS variables (modeled after Shadcn UI roots) provides a clean, responsive, and easily themeable interface with minimal CSS footprint.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Install the dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```
   The application will automatically open in your browser at `http://localhost:3000`.

### Running Tests

Execute the Jest test suite:
```bash
npm test
```

### Production Build

Create a production-ready bundle:
```bash
npm run build
```
The output will be placed in the `dist/` directory.

### Docker Support

You can build and run this application using Docker:

```bash
# Build the image
docker build -t commodity-dashboard .

# Run the container
docker run -p 8080:80 commodity-dashboard
```
Then visit `http://localhost:8080`.
