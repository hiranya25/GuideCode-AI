# GuideCode AI – Frontend

GuideCode AI is an educational AI web application that helps students
**learn how to think through coding problems instead of copying solutions**.

This repository contains the **React.js frontend only**.

---

## ✨ Features

- React functional components with hooks
- Clean, modular folder structure
- Responsive and minimal UI
- Coding problem input interface
- Step-by-step AI guidance display
- Optional code review (no corrected code)
- Backend-connected (AI logic not in frontend)

---

## 🧠 Core Principle

GuideCode AI **never provides full code solutions**.  
It only guides problem-solving thinking using:
- Conceptual explanations
- Strategies
- Hints
- Edge cases
- Time & space complexity discussion

---

## 🧱 Tech Stack

- React 18
- React Router DOM
- JavaScript (ES6+)

---

## 📁 Project Structure

```text
guidecode-ai-frontend/
├── public/
│   └── index.html
│
├── src/
│   ├── components/
│   │   ├── ai/
│   │   │   ├── AIResponse.jsx
│   │   │   └── CodeReview.jsx
│   │   ├── common/
│   │   │   └── LoadingSpinner.jsx
│   │   └── layout/
│   │       ├── Navbar.jsx
│   │       ├── Footer.jsx
│   │       └── Layout.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── TryNow.jsx
│   │   └── WhyGuideCode.jsx
│   │
│   ├── services/
│   │   └── aiService.js
│   │
│   ├── App.jsx
│   ├── index.js
│   └── index.css
│
├── package.json
├── .gitignore
└── README.md

```

---

**Expected Response**
```json
{
  "understanding": "Conceptual explanation of the problem",
  "strategy": "High-level approach without code",
  "hints": ["Hint 1", "Hint 2"],
  "edgeCases": "Potential edge cases to consider",
  "complexity": "Time and space complexity discussion"
}

```
---

**GuideCode AI — Learn how to think, not what to copy.**
