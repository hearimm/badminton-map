# Badminton Map

A web application to locate and review badminton courts.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Features

- Locate badminton courts on a map
- Search courts by name or location
- View court details and reviews
- Add and rate courts
- User authentication with Supabase

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/hearimm/badminton-map.git
   cd badminton-map
   ```

2. Install dependencies:

   ```sh
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Supabase credentials and other environment variables:

   ```sh
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Usage

1. Run the development server:

   ```sh
   npm run dev
   # or
   yarn dev
   ```

2. Open your browser and navigate to `http://localhost:3000`.

## License

Proprietary License

Copyright (c) 2024 헤아림

All rights reserved. This software and associated documentation files (the "Software") are the proprietary property of 헤아림. Unauthorized copying, modification, distribution, or use of the Software, in whole or in part, is strictly prohibited.

The Software may not be used, copied, modified, or distributed without express permission from 헤아림.

For permission requests, please contact: `doksul23@gmail.com`
