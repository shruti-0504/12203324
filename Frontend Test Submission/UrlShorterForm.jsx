import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { createShortUrl } from "../utils/api";
import { isValidUrl, isValidShortCode } from "../utils/validation";
import logger from "../middleware/logger";

const UrlShortenerForm = ({ onSuccess }) => {
  const [longUrl, setLongUrl] = useState("");
  const [validity, setValidity] = useState("30");
  const [shortcode, setShortcode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!isValidUrl(longUrl)) return setError("Invalid URL");
    if (shortcode && !isValidShortCode(shortcode)) return setError("Invalid shortcode");

    const valid = parseInt(validity, 10);
    if (isNaN(valid) || valid <= 0) return setError("Invalid validity");

    try {
      const shortUrl = createShortUrl(longUrl, valid, shortcode);
      logger("CREATE_SHORT_URL", shortUrl);
      onSuccess(shortUrl);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Box>
      <TextField label="Long URL" fullWidth value={longUrl} onChange={(e) => setLongUrl(e.target.value)} />
      <TextField label="Validity (mins)" type="number" value={validity} onChange={(e) => setValidity(e.target.value)} />
      <TextField label="Custom Shortcode (optional)" value={shortcode} onChange={(e) => setShortcode(e.target.value)} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Button variant="contained" onClick={handleSubmit}>Shorten</Button>
    </Box>
  );
};

export default UrlShortenerForm;
