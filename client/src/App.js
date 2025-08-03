import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './App.css';
import Header from './components/Header';
import ProfileAnalyzer from './components/ProfileAnalyzer';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorAlert from './components/ErrorAlert';

function App() {
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="App">
      <Header />
      <Container className="mt-4 mb-5">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="shadow-sm">
              <Card.Body>
                <ProfileAnalyzer 
                  setAnalysisResults={setAnalysisResults}
                  setLoading={setLoading}
                  setError={setError}
                />
                
                {loading && <LoadingSpinner />}
                
                {error && <ErrorAlert message={error} />}
                
                {analysisResults && !loading && !error && (
                  <ResultsDisplay results={analysisResults} />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <footer className="footer mt-auto py-3 bg-light">
        <Container>
          <p className="text-center text-muted mb-0">
            Fake Account Detector &copy; {new Date().getFullYear()}
          </p>
        </Container>
      </footer>
    </div>
  );
}

export default App;