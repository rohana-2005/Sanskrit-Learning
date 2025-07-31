import React from "react";
import { Home, BookOpen, Settings, Users, FileText, MessageCircle } from 'lucide-react';

const games = [
  { id: 'shabdaFusion', label: 'शब्दFusion', icon: <Home /> },
  { id: 'vakyaCraft', label: 'वाक्यCraft', icon: <BookOpen /> },
  { id: 'sankhyaTrivia', label: 'संख्याTrivia', icon: <Settings /> },
  { id: 'dhatuQuest', label: 'धातुQuest', icon: <Users /> },
  { id: 'kaalMaster', label: 'कालMaster', icon: <FileText /> },
  { id: 'chat', label: 'Chat', icon: <MessageCircle /> },
];

const SidebarNav = ({ activeGame, onSelectGame }) => (
  <>
    <style>{`
      .sidebar-nav {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 90px;
        background: rgba(255, 255, 255, 0.13);
        backdrop-filter: blur(18px);
        border-right: 1.5px solid rgba(255, 255, 255, 0.18);
        box-shadow: 4px 0 24px rgba(160, 82, 45, 0.08);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px 0 0 0;
        z-index: 2000;
      }
      .sidebar-nav .nav-btn {
        width: 60px;
        height: 60px;
        margin-bottom: 18px;
        border-radius: 18px;
        background: rgba(218, 165, 32, 0.13);
        border: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #fff8dc;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(160, 82, 45, 0.08);
        transition: all 0.2s;
        outline: none;
        border: 2px solid transparent;
      }
      .sidebar-nav .nav-btn.active {
        background: linear-gradient(135deg, #A0522D 0%, #DAA520 100%);
        color: #fff;
        border: 2px solid #fff8dc;
        box-shadow: 0 4px 18px rgba(218, 165, 32, 0.18);
        transform: scale(1.08);
      }
      .sidebar-nav .nav-btn:hover {
        background: linear-gradient(135deg, #DAA520 0%, #A0522D 100%);
        color: #fff;
        transform: scale(1.05);
      }
      .sidebar-nav .nav-label {
        font-size: 0.85rem;
        margin-top: 4px;
        color: #fff8dc;
        font-weight: 600;
        text-shadow: 0 1px 4px rgba(160, 82, 45, 0.18);
      }
      @media (max-width: 600px) {
        .sidebar-nav {
          width: 60px;
        }
        .sidebar-nav .nav-btn {
          width: 40px;
          height: 40px;
          font-size: 0.9rem;
        }
        .sidebar-nav .nav-label {
          font-size: 0.7rem;
        }
      }
    `}</style>
    <nav className="sidebar-nav">
      {games.map(game => (
        <button
          key={game.id}
          className={`nav-btn${activeGame === game.id ? ' active' : ''}`}
          onClick={() => onSelectGame(game.id)}
        >
          {game.icon}
          <span className="nav-label">{game.label}</span>
        </button>
      ))}
    </nav>
  </>
);

export default SidebarNav; 