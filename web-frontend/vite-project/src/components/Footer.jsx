// src/components/Footer.jsx
export default function Footer({ darkMode }) {
  return (
    <footer className={`mt-5 py-3 ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'} border-top`}>
      <p className="text-center mb-0">
        &copy; 2025 Titanic Survival Prediction App | Made with 💙 and COMMIT CONFLICTS by 7 Up
      </p>
    </footer>
  );
}
