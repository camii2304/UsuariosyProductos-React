import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ShowUsers from './components/ShowUsers';
import ShowProducts from './components/ShowProducts';

const App = () => {


    return (
<>

<Router>
      <Routes>
        <Route path="/" element={<ShowUsers />} />
        <Route path="/users" element={<ShowUsers />} />
        <Route path="/products" element={<ShowProducts />} />
      </Routes>
    </Router>


        </>
    );
};

export default App;

