# 📁 Presentation Layer — `README.md`

This folder contains the front-end source code for the project, responsible for interacting with users and displaying data. It communicates with the application layer via RESTful API calls.

## Technologies Used

- HTML5, CSS3, JavaScript
- Bootstrap 5 / Tailwind CSS (choose based on your stack)
- React.js / Next.js (if applicable)
- Axios or Fetch API for HTTP requests

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

```bash
cd presentation
npm install
```

### Running the App

```bash
npm run dev
```

Visit `http://localhost:3000` to view the UI.

## Features

- User-friendly interface
- Responsive design (mobile/tablet/desktop)
- Input validation
- API integration with Application Layer

## Project Structure

``` bash
/presentation
  /public
  /src
    /components
    /pages
    /assets
  README.md
```

## Environment Variables

Create a `.env.local` file with:

``` bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Deployment

Can be deployed using Vercel, Netlify, or S3 for static hosting.
