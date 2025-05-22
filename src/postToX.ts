import axios, { AxiosError, AxiosRequestConfig } from "axios";
import crypto from "crypto";
import OAuth from "oauth-1.0a";

// Twitter API response types
interface TwitterSuccessResponse {
  data: {
    id: string;
    text: string;
  };
}

interface TwitterErrorResponse {
  errors: Array<{
    code: number;
    message: string;
  }>;
}

interface TwitterPostResult {
  success: boolean;
  tweetId?: string;
  data?: TwitterSuccessResponse;
  error?: TwitterErrorResponse | string;
}

/**
 * Posts content to Twitter/X using OAuth 1.0a authentication
 * @param content - The text content to post as a tweet
 * @returns Object containing success status and relevant response data
 */
export async function postToTwitter(
  content: string
): Promise<TwitterPostResult> {
  console.log("Attempting to post tweet:", content);
  if (!content || content.trim() === "") {
    return {
      success: false,
      error: "Tweet content cannot be empty",
    };
  }

  if (content.length > 280) {
    return {
      success: false,
      error: `Tweet exceeds maximum length (${content.length}/280 characters)`,
    };
  }


  const oauth = new OAuth({
    consumer: {
      key: process.env.CONSUMER_KEY|| "",
      secret: process.env.CONSUMER_SECRET_KEY|| "",
    },
    signature_method: "HMAC-SHA1",
    hash_function(baseString: string, key: string): string {
      return crypto.createHmac("sha1", key).update(baseString).digest("base64");
    },
  });


  if (!process.env.CONSUMER_KEY || !process.env.CONSUMER_SECRET) {
    console.error("Missing Twitter consumer credentials:", {
      CONSUMER_KEY: process.env.CONSUMER_KEY,
      CONSUMER_SECRET: process.env.CONSUMER_SECRET ? "[HIDDEN]" : undefined,
    });
    return {
      success: false,
      error: "Missing Twitter consumer credentials in environment variables",
    };
  }

  if (!process.env.TWITTER_ACCESS_TOKEN || !process.env.TWITTER_ACCESS_SECRET) {
    console.error("Missing Twitter access credentials:", {
      TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN
        ? "[HIDDEN]"
        : undefined,
      TWITTER_ACCESS_SECRET: process.env.TWITTER_ACCESS_SECRET
        ? "[HIDDEN]"
        : undefined,
    });
    return {
      success: false,
      error: "Missing Twitter access credentials in environment variables",
    };
  }

  const url = "https://api.twitter.com/2/tweets";
  const token = {
    key: process.env.TWITTER_ACCESS_TOKEN|| "",
    secret: process.env.TWITTER_ACCESS_SECRET|| "",
  };


  const authHeader = oauth.toHeader(
    oauth.authorize({ url, method: "POST" }, token)
  );


 
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: authHeader.Authorization,
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "mcp-bot",
    },
  };


  try {
  
    const response = await axios.post<TwitterSuccessResponse>(
      url,
      { text: content },
      config
    );
    console.log("Twitter API response:", response.data);
    return {
      success: true,
      tweetId: response.data.data.id,
      data: response.data,
    };
  } catch (error) {

    const axiosError = error as AxiosError<TwitterErrorResponse>;
    console.error("Twitter API error:", {
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data,
      message: axiosError.message,
    });

   
    if (axiosError.response) {
      console.error("Response data:", axiosError.response.data);
      console.error("Response status:", axiosError.response.status);
      console.error("Response headers:", axiosError.response.headers);
    } else if (axiosError.request) {
      console.error("No response received:", axiosError.request);
    } else {
      console.error("Error setting up request:", axiosError.message);
    }

    return {
      success: false,
      error: axiosError.response?.data || axiosError.message,
    };
  }
}
