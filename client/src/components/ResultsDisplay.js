import React from 'react';
import { Card, Badge, ListGroup/*, ProgressBar*/ } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaTwitter, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';

const ResultsDisplay = ({ results }) => {
  const { platform, score, indicators, isFake, confidence, analysisData } = results;
  
  // Determine confidence level class
  const getConfidenceClass = () => {
    if (confidence >= 70) return 'high-confidence';
    if (confidence >= 40) return 'medium-confidence';
    return 'low-confidence';
  };
  
  // Get platform icon
  const getPlatformIcon = () => {
    switch (platform) {
      case 'facebook':
        return <FaFacebook className="facebook-icon" />;
      case 'instagram':
        return <FaInstagram className="instagram-icon" />;
      case 'twitter':
        return <FaTwitter className="twitter-icon" />;
      default:
        return null;
    }
  };
  
  // Get indicator icon based on impact
  const getIndicatorIcon = (impact) => {
    switch (impact) {
      case 'high':
        return <FaTimesCircle className="indicator-high me-2" />;
      case 'medium':
        return <FaExclamationTriangle className="indicator-medium me-2" />;
      case 'low':
        return <FaExclamationTriangle className="indicator-low me-2" />;
      case 'positive':
        return <FaCheckCircle className="indicator-positive me-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="results-display mt-4">
      <h3 className="text-center mb-4">Analysis Results</h3>
      
      <Card className={`result-card mb-4 ${isFake ? 'fake-account' : 'real-account'}`}>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            {getPlatformIcon()}
            <span className="ms-2 text-capitalize">{platform} Profile</span>
          </div>
          <Badge bg={isFake ? 'danger' : 'success'} className="ms-2">
            {isFake ? (
              <>
                <FaTimesCircle className="me-1" /> Likely Fake
              </>
            ) : (
              <>
                <FaCheckCircle className="me-1" /> Likely Real
              </>
            )}
          </Badge>
        </Card.Header>
        
        <Card.Body>
          <Card.Title>Authenticity Score: {score}/100</Card.Title>
          
          <div className="mb-3">
            <small className="text-muted">Confidence: {confidence}%</small>
            <div className="confidence-meter">
              <div 
                className={`confidence-value ${getConfidenceClass()}`} 
                style={{ width: `${confidence}%` }}
              ></div>
            </div>
          </div>
          
          {indicators.length > 0 && (
            <>
              <Card.Subtitle className="mb-2 mt-4">{indicators.some(ind => ind.impact === 'positive') ? 'Analysis Indicators' : 'Suspicious Indicators'}</Card.Subtitle>
              <ListGroup variant="flush">
                {indicators.map((indicator, index) => (
                  <ListGroup.Item key={index} className="d-flex align-items-center">
                    {getIndicatorIcon(indicator.impact)}
                    <div>
                      <strong>{indicator.factor}:</strong> {indicator.issue}
                      <Badge 
                        bg={indicator.impact === 'high' ? 'danger' : 
                           indicator.impact === 'medium' ? 'warning' : 
                           indicator.impact === 'positive' ? 'success' : 'info'}
                        className="ms-2"
                      >
                        {indicator.impact === 'positive' ? 'positive' : `${indicator.impact} impact`}
                      </Badge>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
          
          {/* Profile Details */}
          <Card.Subtitle className="mb-2 mt-4">Profile Details</Card.Subtitle>
          <ListGroup variant="flush">
            {analysisData.username && (
              <ListGroup.Item>
                <strong>Username:</strong> {analysisData.username}
              </ListGroup.Item>
            )}
            
            <ListGroup.Item>
              <strong>Profile Picture:</strong> {analysisData.hasProfilePicture ? 'Present' : 'Missing/Default'}
            </ListGroup.Item>
            
            <ListGroup.Item>
              <strong>Bio/About:</strong> {analysisData.hasBio ? 'Present' : 'Missing'}
            </ListGroup.Item>
            
            {analysisData.postCount !== undefined && (
              <ListGroup.Item>
                <strong>Post Count:</strong> {analysisData.postCount}
              </ListGroup.Item>
            )}
            
            {analysisData.followers !== undefined && (
              <ListGroup.Item>
                <strong>Followers:</strong> {analysisData.followers}
              </ListGroup.Item>
            )}
            
            {analysisData.following !== undefined && (
              <ListGroup.Item>
                <strong>Following:</strong> {analysisData.following}
              </ListGroup.Item>
            )}
            
            {analysisData.joinDate && (
              <ListGroup.Item>
                <strong>Join Date:</strong> {analysisData.joinDate}
              </ListGroup.Item>
            )}
          </ListGroup>
        </Card.Body>
      </Card>
      
      <div className="text-center mt-4">
        <p className="text-muted">
          <small>
            Note: This analysis is based on publicly available information and may not be 100% accurate.
            Always use your own judgment when interacting with social media profiles.
          </small>
        </p>
      </div>
    </div>
  );
};

export default ResultsDisplay;
