const baseUrl = "http://localhost:3100/api";

let isRefreshing = false;
let refreshQueue = [];

const fetchApi = async (url, method = "GET", body = null, options = {}) => {
  try {
    const isFormData = body instanceof FormData;

    let headers = {
      ...(options.headers || {}),
    };

    //شرط برای فایل
    if (!isFormData && body && ["POST", "PUT", "PATCH"].includes(method)) {
      headers["Content-Type"] = "application/json";
    }

    let res = await fetch(`${baseUrl}${url}`, {
      ...options,
      method,
      credentials: "include",
      headers,
      body:
        body && ["POST", "PUT", "PATCH"].includes(method)
          ? isFormData
            ? body
            : JSON.stringify(body)
          : null,
    });

    if (res.status === 403) {
      return await tokenRefreshing(url, method, body, options);
    }

    const json = await res.json().catch(() => null); //اگه خالی بود
    return {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      data: json,
    };
  } catch (err) {
    return {
      ok: false,
      status: 500,
      statusText: "Network Error",
      data: null,
      error: err,
    };
  }
};

const tokenRefreshing = async (url, method, body, options) => {

  if (isRefreshing) {
    refreshQueue.push(() =>
      fetchApi(url, method, body, options)
    );
    return;
  }
  isRefreshing = true;
  try {
    const refreshRes = await fetch(`${baseUrl}/auth/refresh`,
      { method: "POST", credentials: "include" });
    if (!refreshRes.ok) {
      refreshQueue = [];
      if (!options.unRedirect) {
        window.location.href = "/login";
      }
      return { ok: false, status: 403, message: "خطا در ارتباط", data: null };
    }
    // خالی کردن صف
    refreshQueue.forEach((cb) => cb());
    refreshQueue = [];
  } catch (err) {

  } finally {
    isRefreshing = false;
  }
  // اجرای درخواست اولمون
  return await fetchApi(url, method, body, options);
};

export default fetchApi;
