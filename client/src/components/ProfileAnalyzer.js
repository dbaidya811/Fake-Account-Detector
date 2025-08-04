import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaTwitter, FaSearch } from 'react-icons/fa';
import axios from '../axiosConfig';

const ProfileAnalyzer = ({ setAnalysisResults, setLoading, setError }) => {
  const [profileUrl, setProfileUrl] = useState('');
  const [urlType, setUrlType] = useState('');

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setProfileUrl(url);
    
    // Automatically detect the social media platform
    if (url.includes('facebook.com') || url.includes('fb.com')) {
      setUrlType('facebook');
    } else if (url.includes('instagram.com')) {
      setUrlType('instagram');
    } else if (url.includes('twitter.com') || url.includes('x.com')) {
      setUrlType('twitter');
    } else {
      setUrlType('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!profileUrl) {
      setError('Please enter a social media profile URL');
      return;
    }
    
    if (!urlType) {
      setError('Please enter a valid Facebook, Instagram, or Twitter URL');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setAnalysisResults(null);
      
      const response = await axios.post('/api/analyze', { url: profileUrl });
      
      setAnalysisResults(response.data);
    } catch (error) {
      console.error('Error analyzing profile:', error);
      setError(
        error.response?.data?.error ||
        'Failed to analyze profile. Please check the URL and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-analyzer mb-4">
      <h2 className="text-center mb-4">Analyze Social Media Profile</h2>
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Enter Profile URL</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              {urlType === 'facebook' && <FaFacebook className="facebook-icon" />}
              {urlType === 'instagram' && <FaInstagram className="instagram-icon" />}
              {urlType === 'twitter' && <FaTwitter className="twitter-icon" />}
              {!urlType && <FaSearch />}
            </InputGroup.Text>
            <Form.Control
              type="url"
              placeholder="https://www.instagram.com/username"
              value={profileUrl}
              onChange={handleUrlChange}
              required
            />
          </InputGroup>
          <Form.Text className="text-muted">
            Enter a Facebook, Instagram, or Twitter profile URL
          </Form.Text>
        </Form.Group>
        
        <div className="d-grid gap-2">
          <Button variant="primary" type="submit" size="lg">
            Analyze Profile
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProfileAnalyzer;