CREATE TABLE ai_analysis_log (
  id SERIAL PRIMARY KEY,
  image_path VARCHAR(255),
  success BOOLEAN NOT NULL,
  message VARCHAR(255),
  class INT,
  confidence DECIMAL(5,4),
  request_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  response_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
