import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import { DashboardApp } from './App';

createRoot(document.getElementById('root')!).render(<DashboardApp />);
