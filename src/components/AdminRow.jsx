import React from "react";

export default function AdminRow({ avatarSrc, nom, role }) {
  return (
    <div className="admin-row admin-row-vertical">
      <img src={avatarSrc} alt={nom} className="admin-row-avatar admin-row-avatar-large" />
      <div className="admin-row-info admin-row-info-vertical">
        <span className="admin-row-nom admin-row-nom-large">{nom}</span>
        <span className="admin-row-role admin-row-role-small">{role}</span>
      </div>
    </div>
  );
}
