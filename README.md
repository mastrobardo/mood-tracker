# Mood Tracker

A modern web application for tracking and visualizing emotional well-being over time.
Proudly brought to you by the best candidate around, Davide Domenico Arcinotti! :D

## 🚀 Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + Ant Design (antd)
- **State Management:** React Query (TanStack Query)
- **Data Visualization:** Ant Design Charts
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

```bash
# Run in dev mode
yarn dev

# Run in pseudo prod build
yarn preview

# For production build
yarn build
npx serve /dist #or python simplehttpserver, or whatever other tool you prefer
```

## 🧪 Testing

The project uses Vitest and React Testing Library for testing.

```bash
# Run tests in watch mode
yarn test

# Generate coverage report
yarn test:coverage
```

A single test for useMoodAnalysis hook is present. I would have liked to add a test with MSW, but given some mock I had to implement at API level, this proved
to be a bit hard (meaning, not having much time, I didn't want to spend much time on it).

## 🌍 Internationalization

The application supports multiple languages using i18next. Language files are located in the `src/i18n` directory.

## 📊 Data Visualization

The application uses Ant Design Charts for data visualization. I initially started with D3, but ant-d has already a lot of wonderful tools for data visualization.
It was worth playing with it a bit. (Also, despite liking the syntax of D3, as I was born as a programmer with Flash, it is not the easiest tool to use. In certain parts it is definitely too granular, although I love the scaleTimeUTC so much)

## 🔄 API Integration

API calls are handled using Axios with React Query for efficient data fetching and caching. Mock Service Worker (MSW) was intended to be used for testing, but having to use MockAdapter for axios, to test suspense and such, proved testing a bit more complicated than what I would have liked. Mock adapter because there is no real server, I didn't have enough time to implement also that.

## 🎨 Styling

- Tailwind CSS for utility-first styling
- Ant Design components for UI elements

Ant Design is my new toy of reference. It is lightweight, complete, and I love the various hooks (like useBreakpoints). I tend to not use device detection when I can, as it is a bit cranky especially with new devices. I'm all in for full responsiveness and screen sizes.
I use tailwind extensively cause i use it everyday in the project im working on ( and its easier to remember ). A part a little global fix for ant-d lists, i didnt implemented any custom css module. I usually work with sass for those ... i apologise here.

Also please note that I'm used to working on a MOBILE FIRST BASIS. It helps a lot prioritizing the progressive development of any feature/app. This app was developed mainly for mobile.

## 📱 Responsive Design

The application is fully responsive and works on desktop, tablet, and mobile devices. Some features might be visible or not, different layout on different screens etc.

## About Data Generation

Although the requirements were asking just for some data generation, I did create an infra API layer which is more like a real-world scenario. I used Mock adapter (never used before, seems cool), but I found out later that it was interfering with MSW. It was too late though, so I beg your pardon if APIs are not properly tested. I also use useSuspenseQuery and react-query extensively. I don't like to use its cache system as state manager though... but prefetch and Suspense/ErrorBoundary integration are super.

## Mood Analysis

Here I probably passed a bit what was requested. I apologize, but I'm currently working on a big generative AI project and there were some concepts I wanted to study a bit more on the practical side. I chose to use linear regression to identify mood trends, with rSquared curve fitting (this is what I wanted to learn a bit more) to verify prediction fitting on a certain slope.
The algorithm still defaults to averages in case of out of chart curves.
Take a look at .env file. There, you can select some reference outcomes for trends (remember to either reload or restart server when you change, depending if you are on dev or prod build). These are randomly generated! So do not expect always a definite trend, as extremes might overlap. (On our current project, we usually send the same request from 10 to 20 times, and we calculate fitting of vectors in a stochastic fashion... and we still have, sometimes, weird answers from AI)

## About Contexts

The requirements asked to use contexts for state management. And I did stick to that (btw, probably it was the second time in my life I used useReducer! seemed to work as redux some years ago).
However, unless for a strong business case, I would definitely avoid. In a small project like this I'd go for Zustand, for bigger projects with more complicated states I'd definitely go for RTK (memoization and reselect are too good to have out of the box).

Hope you will like it, and hope to see you soon!
