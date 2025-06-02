import React from 'react';
import './AboutSection.css';
import selim from '../images/selim.jpg';
import melki from '../images/melki.jpg';
import yossr from '../images/yossr.jpg';
import meriem from '../images/meriem.jpg';

const AboutSection = () => {
  
  const developers = [
    { name: 'Selim Soussi', photo: selim },
    { name: 'Melki Meriem', photo: melki },
    { name: 'Yossr Attia', photo: yossr },
    { name: 'Meriem Belghouthi', photo: meriem }
  ];

  // Fallback image if main image fails to load
  const fallbackImage = '/images/default-avatar.png';

  const DeveloperCard = ({ developer }) => {
    return (
      <div className="developer-card">
        <div className="developer-avatar">
          <img 
            src={developer.photo}
            alt={developer.name}
            className="profile-photo"
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
          />
        </div>
        <h3>{developer.name}</h3>
      </div>
    );
  };

  return (
    <section className="about-section">
      <div className="about-container">
        <h2>Developers</h2>
        <div className="developers-grid">
          {developers.map((developer, index) => (
            <DeveloperCard key={index} developer={developer} />
          ))}
        </div>
        <p className="project-info">
          National Institute of Applied Science and Technology (INSAT)<br />
          Personal Professional Project (PPP)
        </p>
      </div>
    </section>
  );

  return (
    <section className="about-section">
      <div className="about-container">
        <h2>Developers</h2>
        <div className="developers-grid">
          {developers.map((developer, index) => (
            <div key={index} className="developer-card">
              <div className="developer-avatar">
                <img src={developer.photo} alt={developer.name} className="profile-photo" />
              </div>
              <h3>{developer.name}</h3>
            </div>
          ))}
        </div>
        <p className="project-info">
          National Institute of Applied Science and Technology (INSAT)<br />
          Personal Professional Project (PPP)
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
