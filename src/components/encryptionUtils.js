const textToArrayBuffer = (text) => new TextEncoder().encode(text);

const bufferToHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

const generateIV = () => window.crypto.getRandomValues(new Uint8Array(16));

export const encryptPassword = async (password) => {
  try {
    const SECRET_KEY = process.env.REACT_APP_SECRETKEY;
    const iv = generateIV();
    const key = await crypto.subtle.importKey(
      "raw",
      textToArrayBuffer(SECRET_KEY),
      { name: "AES-CBC" },
      false,
      ["encrypt"]
    );

    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: "AES-CBC", iv },
      key,
      textToArrayBuffer(password)
    );

    return {
      encryptedData: bufferToHex(encryptedBuffer),
      iv: bufferToHex(iv),
    };
  } catch (err) {
    console.error("Encryption failed:", err);
    throw err;
  }
};
