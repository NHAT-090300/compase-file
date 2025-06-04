import Cookies from "js-cookie";

export function useAuth() {
  function login(username: string, password: string): boolean {
    if (username === "admin" && password === "admin") {
      Cookies.set("auth", "true", { expires: 7 / 24 }); // 7h
      return true;
    }
    return false;
  }

  function isLoggedIn(): boolean {
    return Cookies.get("auth") === "true";
  }

  function logout() {
    Cookies.remove("auth");
  }

  return {
    isLoggedIn: isLoggedIn(),
    logout,
    login,
  };
}
