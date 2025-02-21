import React, { useEffect } from 'react';

function Navbar() {
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <h2>KrishiSetu</h2>
        </div>
        <div className="nav-items">
          <div className="language-selector">
            <select onChange={(e) => console.log(e.target.value)}>
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
              <option value="gu">ગુજરાતી</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 