import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { Content } from './Content'

export function App() {
    return (
        <div>
            <Router>
                <Content></Content>
            </Router>
        </div>
    );
}