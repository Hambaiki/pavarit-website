# Pavarit Personal Website  

This repository houses the source code for my personal website, [www.pavarit.net](https://www.pavarit.net). It is a modern, CMS-enabled platform designed to manage and showcase posts, projects, and updates dynamically.

To check out the development preview of the website, head to [dev.pavarit.net](https://dev.pavarit.net).

## 🌟 Features  

- **Modern Tech Stack**: Built with **React** and **Next.js** for performance and scalability.  
- **CMS Integration**: Dynamic content management system for creating, updating, and managing posts.  
- **Database Support**: Powered by **Neon PostgreSQL** for data storage and management.  
- **Tailwind CSS**: Responsive and customizable UI components.  
- **Post Tracking**: Track views, likes, and comments for each post.  

## 🚀 Tech Stack  

- **Frontend**:  
  - React  
  - Next.js  
  - Tailwind CSS  

- **Backend**:  
  - API routes with Next.js  

- **Database**:  
  - PostgreSQL (Neon DB)  

## 🔧 Getting Started  

### Prerequisites  

Ensure you have the following installed:  
- Node.js (v16 or later)  
- npm or yarn package manager  
- PostgreSQL  

### Installation  

1. Clone this repository:  
   ```bash
   git clone https://github.com/yourusername/pavarit-website.git
   cd pavarit-website
   ```  

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Set up your environment variables:
Create a .env.local file in the root of your project and add:
   ```bash
   DATABASE_URL=your-neon-db-connection-string
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
   
5. Start the development server:  
   ```bash
   npm run dev
   ```  

6. Open your browser and visit: [http://localhost:3000](http://localhost:3000).  

## 📂 File Structure  

```plaintext
pavarit-website/
├── public/               # Static assets  
├── src/
│   ├── app/              # Next.js pages
│   │   ├── (dashboard)/
│   │   ├── (root)/
│   │   ├── (misc)/
│   │   ├── api/
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   ├── lib/
│   │   ├── api/
│   │   ├── db/2
│   ├── constants/
│   ├── types/
│   ├── utils/               
│   └── middleware.ts
├── .env.local            # Environment variables  
├── next.config.js        # Next.js configuration  
├── tailwind.config.js    # Tailwind configuration  
└── package.json          # Project dependencies  
```  

## 🛠️ Deployment  

1. Build the application:  
   ```bash
   npm run build
   ```  

2. Deploy to your preferred platform:  
   - **Vercel** (Recommended for Next.js apps)  
   - **Self-hosted**  

## 🤝 Contributions  

Feedback and suggestions are always welcome!  

## 📧 Contact  

For inquiries, feel free to reach out through the contact form on [www.pavarit.net](https://www.pavarit.net) or directly via email.  

## 📜 License  

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
