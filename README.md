# Mood Tracker

A modern web application for tracking and visualizing emotional well-being over time.

## 🚀 Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + Ant Design (antd)
- **State Management:** React Query (TanStack Query)
- **Data Visualization:** D3.js, Ant Design Charts
- **Routing:** React Router v6
- **Internationalization:** i18next
- **Testing:** Vitest, React Testing Library, MSW (Mock Service Worker)
- **HTTP Client:** Axios
- **Code Quality:** ESLint, TypeScript

## 📦 Prerequisites

- Node.js (LTS version recommended)
- Yarn package manager

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/mastrobardo/mood-tracker.git

# Navigate to the project directory
cd mood-tracker

# Install dependencies
yarn install
```

## 🚦 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint
- `yarn test` - Run tests in watch mode
- `yarn test:coverage` - Generate test coverage report

## 🌐 Environment Setup

Create a `.env` file in the root directory:

```env

```

## 🧪 Testing

The project uses Vitest and React Testing Library for testing. Tests are located next to the files they test with the `.test.tsx` extension.

```bash
# Run tests in watch mode
yarn test

# Generate coverage report
yarn test:coverage
```

## 🌍 Internationalization

The application supports multiple languages using i18next. Language files are located in the `src/i18n` directory.

## 📊 Data Visualization

The application uses both D3.js and Ant Design Charts for data visualization:

- D3.js for custom, interactive visualizations
- Ant Design Charts for pre-built chart components

## 🔄 API Integration

API calls are handled using Axios with React Query for efficient data fetching and caching. Mock Service Worker (MSW) is used for API mocking in development and testing environments.

## 🎨 Styling

- Tailwind CSS for utility-first styling
- Ant Design components for UI elements
- Custom themes and styles can be configured in `tailwind.config.js`

## 📱 Responsive Design

The application is fully responsive and works on desktop, tablet, and mobile devices.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).
