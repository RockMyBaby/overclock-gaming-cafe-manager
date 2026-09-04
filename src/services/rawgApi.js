const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;

export async function fetchGameImage(gameTitle) {
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(
        gameTitle,
      )}&page_size=1`,
    );

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0].background_image || "";
    }

    return "";
  } catch (error) {
    console.error("Could not fetch game image:", error);
    return "";
  }
}

export async function searchGameImages(gameTitle) {
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(
        gameTitle,
      )}&page_size=8`,
    );

    const data = await response.json();

    if (!data.results) return [];

    return data.results
      .filter((game) => game.background_image)
      .map((game) => ({
        id: game.id,
        title: game.name,
        image: game.background_image,
      }));
  } catch (error) {
    console.error("Could not search game images:", error);
    return [];
  }
}