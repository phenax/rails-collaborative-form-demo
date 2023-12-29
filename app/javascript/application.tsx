import { createRoot } from 'react-dom/client'
import React from 'react'
import { App } from './App'

import * as Y from 'yjs'
(window as any).Y = Y; // For debugging

createRoot(document.getElementById('root')!).render(<App />);
