import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ParkingList from "./pages/ParkingList";
import ParkingDetail from "./pages/ParkingDetail";
import TestingPage from "./pages/TestingPage";

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<ParkingList />} />
                    <Route path="/parking/:id" element={<ParkingDetail />} />
                    <Route path="/test" element={<TestingPage />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;