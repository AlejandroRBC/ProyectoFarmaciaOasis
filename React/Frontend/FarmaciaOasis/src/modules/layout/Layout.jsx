import Navbar from '../navbar/Navbar';
import './layout.css';

function Layout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;