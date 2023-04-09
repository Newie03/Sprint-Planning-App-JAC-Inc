import React, { useState } from "react";
import "../App.css";

const TeamMembers = ({ teamMembers, onAdd, onRemove }) => {
  const [newMember, setNewMember] = useState("");

  const handleAddMember = () => {
    if (newMember.trim()) {
      onAdd(newMember.trim());
      setNewMember("");
    }
  };

  return (
    <div className="team-members">
      <h2>Team Members</h2>
      <ul>
        {teamMembers.map((member) => (
          <li key={member}>
            {member}
            <button onClick={() => onRemove(member)}>Remove</button>
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
          placeholder="New team member"
        />
        <button onClick={handleAddMember}>Add Team Member</button>
      </div>
    </div>
  );
};

export default TeamMembers;
