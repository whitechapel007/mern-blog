import { jwtDecode } from "jwt-decode";

export const checkTokenExpiration = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (e) {
    console.error("Failed to decode token:", e);
    return true;
  }
};
