import Index from './pages/homePage.jsx';
import ChatPage from './pages/chatPage/chatPage.jsx';


import SingleProductPage from './pages/singleProductPage.jsx';
import CompareProductPage from './pages/compareProductPage.jsx';
import LinkMainPage from './pages/linkMain.jsx';

import PrivateRoute from './secure/privateRoute.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route
            path="/link"
            element={
                <LinkMainPage />
            }
          />
          <Route
            path="/single/product/:productId"
            element={
                <SingleProductPage/>
            }
          />
          <Route 
            path="/compare" 
            element={<CompareProductPage />} 
          />

          {/* User Routes */}
          <Route
           path="/chat/:productId"
            element={
                <ChatPage />
            }
          />





          
          
        </Routes>
      </div>
    </Router>
  );
};

export default App;
