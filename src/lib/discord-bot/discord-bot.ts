
export async function sendMessageToDiscord({ webhookUrl, content }: { webhookUrl: string, content: string }) {
  if (!webhookUrl) {
    console.error("No webhook URL provided");
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: content }),
    });
    if (!response.ok) {
      console.error("Failed to send message to Discord:", response.statusText);
    } else {
      console.log("Message sent to Discord!");
    }
  } catch (error) {
    console.error("Failed to send message to Discord:", error);
    throw new Error("Failed to send message to Discord")
  }
}