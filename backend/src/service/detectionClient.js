class DetectionClient {

  async analyzeMedia(mediaId, mediaType) {
    const delay = 3000 + Math.random() * 2000;
    // delay for 3 to 5 seconds
    await this._sleep(delay);
    const results = this._generateMockResults(mediaType);

    return {
      media_id: mediaId,
      ...results,
      status: 'completed'
    };
  }

  _generateMockResults(mediaType) {
    const fakeScore = Math.random();
    const confidence = this._getConfidenceLevel(fakeScore);
    const verdict = this._getVerdict(fakeScore);
    const signals = this._generateSignals(mediaType, fakeScore);
    const explanation = this._generateExplanation(verdict, signals, mediaType);

    return {
      fake_score: Math.round(fakeScore * 100) / 100,
      confidence,
      verdict,
      signals,
      explanation
    };
  }
  _getConfidenceLevel(score) {
    if (score < 0.3 || score > 0.7) {
      return 'high';
    } else if (score < 0.4 || score > 0.6) {
      return 'medium';
    }
    return 'low';
  }
  _getVerdict(score) {
    if (score < 0.3) {
      return 'likely_real';
    } else if (score < 0.6) {
      return 'uncertain';
    } else if (score < 0.8) {
      return 'suspicious';
    }
    return 'likely_fake';
  }
  
  _generateSignals(mediaType, score) {
    const signals = {};

    if (mediaType === 'video') {
      signals.lip_sync = this._getSignalValue(score, 0.6);
      signals.facial_consistency = this._getSignalValue(score, 0.5);
      signals.temporal_artifacts = this._getSignalValue(score, 0.7);
      signals.background_consistency = this._getSignalValue(score, 0.4);
    }
    signals.audio_consistency = this._getSignalValue(score, 0.5);
    signals.background_noise = this._getSignalValue(score, 0.6);
    signals.spectral_analysis = this._getSignalValue(score, 0.55);

    return signals;
  }

  _getSignalValue(score, threshold) {
    if (score < threshold - 0.2) {
      return 'natural';
    } else if (score < threshold) {
      return 'acceptable';
    } else if (score < threshold + 0.2) {
      return 'inconsistent';
    }
    return 'highly_suspicious';
  }

  _generateExplanation(verdict, signals, mediaType) {
    const issues = [];
    
    Object.entries(signals).forEach(([key, value]) => {
      if (value === 'inconsistent' || value === 'highly_suspicious') {
        issues.push(key.replace(/_/g, ' '));
      }
    });

    if (verdict === 'likely_real') {
      return `This ${mediaType} appears to be authentic. All detection signals are within normal ranges.`;
    } else if (verdict === 'uncertain') {
      return `Analysis is inconclusive. Some signals show minor inconsistencies, but not enough to determine authenticity definitively.`;
    } else if (verdict === 'suspicious') {
      const issuesList = issues.length > 0 ? issues.join(', ') : 'multiple signals';
      return `This ${mediaType} shows signs of potential manipulation. Detected issues in: ${issuesList}.`;
    } else {
      const issuesList = issues.length > 0 ? issues.join(', ') : 'multiple signals';
      return `This ${mediaType} is highly likely to be manipulated or synthetic. Significant anomalies detected in: ${issuesList}.`;
    }
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async healthCheck() {
    return {
      status: 'healthy',
      service: 'mock_detection_engine',
      version: '1.0.0'
    };
  }
}

const detectionClient = new DetectionClient();

export default detectionClient;