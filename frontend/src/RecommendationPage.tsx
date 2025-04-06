import React, { JSX, useState } from "react";

// Used for Azure recommendations
interface Recommendation {
  recommendedItemId?: string;
  [key: string]: any;
}

// Used for content-based recommendations
interface ArticleRecommendation {
  id: number;
  original_contentId: number;
  recommended_contentId: number;
  similarity: number;
}

export default function RecommendationPage(): JSX.Element {
  const [itemId, setItemId] = useState<string>("");
  //const [collabRecs, setCollabRecs] = useState<string[]>([]);
  const [contentRecs, setContentRecs] = useState<ArticleRecommendation[]>([]);
  const [azureRecs, setAzureRecs] = useState<Recommendation[]>([]);

  //const staticUserId = "12345"; // Replace with any valid user ID from your dataset

  const fetchRecommendations = async (): Promise<void> => {
    /* const collab = await fetch(`/api/collaborative/${itemId}`).then((res) => res.json());
    setCollabRecs(collab); */

    try {
      const res = await fetch(
        `https://localhost:7230/api/Article/Article/${itemId}`
      );

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const content: ArticleRecommendation[] = await res.json();
      setContentRecs(content);
    } catch (err) {
      console.error("Failed to fetch content recommendations:", err);
      setContentRecs([]); // Clear on error
    }

    /* const azure = await fetch("https://your-azure-endpoint.com/score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_API_KEY",
      },
      body: JSON.stringify({
        Inputs: {
          WebServiceInput0: [
            {
              userID: staticUserId,
              itemID: itemId,
            },
          ],
        },
      }),
    }).then((res) => res.json()); */

    //setAzureRecs(azure.Results?.WebServiceOutput0?.slice(0, 5) || []);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Recommendation Demo</h1>
      <div>
        <input
          type="text"
          placeholder="Enter Item ID"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
        />
        <button onClick={fetchRecommendations}>Get Recommendations</button>
      </div>

      <div>
        {/*
        <div>
          <h2>Collaborative Filtering</h2>
          <ul>
            {collabRecs.map((id, i) => (
              <li key={`collab-${i}`}>{id}</li>
            ))}
          </ul>
        </div>
        */}

        <div>
          <h2>Content Filtering</h2>
          {contentRecs.length > 0 && (
            <h3>Content ID: {contentRecs[0].original_contentId}</h3>
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
                <tr key={i}>
                  <td style={{ padding: "8px" }}>
                    {rec.recommended_contentId}
                  </td>
                  <td style={{ padding: "8px" }}>{rec.similarity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/*
        <div>
          <h2>Azure ML Endpoint</h2>
          <ul>
            {azureRecs.map((rec, i) => (
              <li key={`azure-${i}`}>{rec.recommendedItemId || JSON.stringify(rec)}</li>
            ))}
          </ul>
        </div>
        */}
      </div>
    </div>
  );
}
