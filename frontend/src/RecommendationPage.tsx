import React, { JSX, useState } from "react";

// Used for Azure recommendations (optional)
interface Recommendation {
  recommendedItemId?: string;
  [key: string]: any;
}

// Used for both collaborative & content-based
interface ArticleRecommendation {
  id?: number;
  original_contentId: number;
  recommended_contentId: number;
  similarity: number;
}

export default function RecommendationPage(): JSX.Element {
  const [itemId, setItemId] = useState<string>("");
  const [contentRecs, setContentRecs] = useState<ArticleRecommendation[]>([]);
  const [collabItemRecs, setCollabItemRecs] = useState<ArticleRecommendation[]>(
    []
  );
  const [azureRecs, setAzureRecs] = useState<Recommendation[]>([]);

  const fetchRecommendations = async (): Promise<void> => {
    if (!itemId) return;

    // Fetch content-based recs
    try {
      const res = await fetch(
        `https://localhost:7230/api/Article/Article/${itemId}`
      );
      if (!res.ok) throw new Error(`Content API error (${res.status})`);
      const data = await res.json();
      setContentRecs(data);
    } catch (err) {
      console.error("Failed to fetch content-based recommendations:", err);
      setContentRecs([]);
    }

    // Fetch collaborative item-to-item recs
    try {
      const res = await fetch(
        `https://localhost:7230/api/Article/CollaborativeItem/${itemId}`
      );
      if (!res.ok)
        throw new Error(`Collaborative item API error (${res.status})`);
      const data = await res.json();
      setCollabItemRecs(data);
    } catch (err) {
      console.error(
        "Failed to fetch collaborative item-to-item recommendations:",
        err
      );
      setCollabItemRecs([]);
    }

    // Optional: Azure ML call
    /*
    try {
      const azure = await fetch("https://your-azure-endpoint.com/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer YOUR_API_KEY",
        },
        body: JSON.stringify({
          Inputs: {
            WebServiceInput0: [
              {
                userID: "6259736937759908767",
                itemID: itemId,
              },
            ],
          },
        }),
      }).then((res) => res.json());

      setAzureRecs(azure.Results?.WebServiceOutput0?.slice(0, 5) || []);
    } catch (err) {
      console.error("Failed to fetch Azure recommendations:", err);
      setAzureRecs([]);
    }
    */
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Recommendation Demo</h1>

      <div>
        <input
          type="text"
          placeholder="Enter Content ID"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
        />
        <button onClick={fetchRecommendations}>Get Recommendations</button>
      </div>

      {/* Collaborative Item-Item */}
      <div>
        <h2>Collaborative Filtering (Item-to-Item)</h2>
        {collabItemRecs.length > 0 && (
          <h3>For Content ID: {collabItemRecs[0].original_contentId}</h3>
        )}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ccc",
                  padding: "8px",
                }}
              >
                Recommended Content ID
              </th>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ccc",
                  padding: "8px",
                }}
              >
                Similarity
              </th>
            </tr>
          </thead>
          <tbody>
            {collabItemRecs.map((rec, i) => (
              <tr key={`collab-${i}`}>
                <td style={{ padding: "8px" }}>{rec.recommended_contentId}</td>
                <td style={{ padding: "8px" }}>{rec.similarity.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Content-Based Filtering */}
      <div>
        <h2>Content-Based Filtering</h2>
        {contentRecs.length > 0 && (
          <h3>For Content ID: {contentRecs[0].original_contentId}</h3>
        )}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ccc",
                  padding: "8px",
                }}
              >
                Recommended Content ID
              </th>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ccc",
                  padding: "8px",
                }}
              >
                Similarity
              </th>
            </tr>
          </thead>
          <tbody>
            {contentRecs.map((rec, i) => (
              <tr key={`content-${i}`}>
                <td style={{ padding: "8px" }}>{rec.recommended_contentId}</td>
                <td style={{ padding: "8px" }}>{rec.similarity.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Azure Section (Optional) */}
      {/* 
      <div>
        <h2>Azure ML Endpoint</h2>
        <ul>
          {azureRecs.map((rec, i) => (
            <li key={`azure-${i}`}>
              {rec.recommendedItemId || JSON.stringify(rec)}
            </li>
          ))}
        </ul>
      </div>
      */}
    </div>
  );
}
