import "../styles/about.css";

const radioTeam = [
  { name: "Alex Kiiffner", role: "Writer, Audio Producer, Voice Acting (Charlie Sands, Clovis)" },
  { name: "Kelly Bouchard", role: "Writer, Audio Producer, Voice Acting (John Sands)" },
];

const webTeam = [
  { name: "Camilo Martinez", role: "Lead Developer, Web Hosting, DevOps" },
  { name: "Dana Le", role: "UI/UX Designer, Communications, Web Dev" },
  { name: "Jiya John", role: "Web Developer, App Testing" },
];

function About() {
  return (
    <div className="about-container">
      <div className="about-content">

        <h1 className="about-title">ABOUT US</h1>
        <p className="about-subtitle">
          This is a project made by joined effort from Web Development students
          and Radio Students at Humber Polytechnic. Forest Rules is created within a 7-week course.
        </p>

        <div className="about-divider" />


        <div className="teams-container">

          <div className="team-group">
            <h2 className="team-heading">Radio Team</h2>
            <div className="members-grid">
              {radioTeam.map((member, i) => (
                <div className="member-card" key={i}>
                  <div className="member-name">{member.name}</div>
                  <div className="member-role">{member.role}</div>
                </div>
              ))}
            </div>
          </div>

   
          <div className="team-group">
            <h2 className="team-heading">Web Team</h2>
            <div className="members-grid">
              {webTeam.map((member, i) => (
                <div className="member-card" key={i}>
                  <div className="member-name">{member.name}</div>
                  <div className="member-role">{member.role}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      
        <p className="special-thanks">
          Special thanks to our instructor: Sean Doyle for guiding us through the project.
        </p>



        

      </div>
    </div>
  );
}

export default About;
