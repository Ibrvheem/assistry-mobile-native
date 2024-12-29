export async function fetchAvatar() {
  return fetch("https://www.tapback.co/api/avatar").then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch avatar");
    }
    console.log(response.url);
    return response;
  });
}
