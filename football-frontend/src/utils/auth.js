// Simple JWT utilities using atob to decode the payload

export function getDecodedToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    const parts = token.split('.');
    if (parts.length !== 3) return null;
  
    try {
      const payload = parts[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return decoded;
    } catch {
      return null;
    }
  }
  
  export function hasAdminRole() {
    const decoded = getDecodedToken();
    if (!decoded) return false;
  
    // Common ASP.NET Core role claim type
    const roleClaim =
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      decoded.role ??
      decoded.roles;
  
    if (!roleClaim) return false;
  
    if (Array.isArray(roleClaim)) {
      return roleClaim.includes('Admin');
    }
  
    return String(roleClaim)
      .split(',')
      .map((r) => r.trim())
      .includes('Admin');
  }
  
  export function isAuthenticated() {
    return !!localStorage.getItem('token');
  }