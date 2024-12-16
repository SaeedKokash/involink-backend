// This service uploads a file to an external service using a POST request with a form-data body
require("dotenv").config(); // Ensure environment variables are loaded

exports.uploadFileToExternal = async (fileBuffer, filename, mimeType) => {
  const formData = new FormData();
  formData.append('storage_account_name', process.env.STORAGE_ACCOUNT_NAME);
  formData.append('storage_account_key', process.env.STORAGE_ACCOUNT_KEY);
  // Note: FormData supports appending a Buffer as a Blob-like object.
  // We'll convert the buffer to a Blob using `new Blob()`.
  const blob = new Blob([fileBuffer], { type: mimeType });
  formData.append('file', blob, filename);

  const response = await fetch(process.env.UPLOAD_ENDPOINT, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Upload failed with status ${response.status}: ${text}`);
  }

  // Assuming the response is JSON containing { url: "...", filename: "..." }
  const result = await response.json();
  console.log(result);
  return result;
};
